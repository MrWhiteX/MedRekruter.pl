import { useState, useRef, ChangeEvent } from 'react';
import BaseLayout from 'components/BaseLayout';
import { GetServerSideProps } from 'next';
import { useRouter, NextRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import getOfferById from 'services/offer/getOfferById';
import isAuthorized from 'services/offer/isAuthorized';
import { ExtendedOfferType } from 'types/types';
import { uploadImage } from 'utils';

export interface OffersProps {
  offer: ExtendedOfferType;
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  if (typeof query.id !== 'string') {
    return {
      notFound: true
    };
  }
  const session = await getSession({ req });

  const offer = await getOfferById(query.id);

  if (!isAuthorized(offer, session) || !offer) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      offer
    }
  };
};

export default function EditOffer({ offer }: OffersProps) {
  const [formProccesing, setFormProccesing] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(offer.imageUrl);
  const offerForm = useRef<HTMLFormElement>(null);
  const router: NextRouter = useRouter();

  const handleImagePreview = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      const url = window.URL.createObjectURL(e.target.files[0]);
      setImagePreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (offerForm.current) {
      setFormProccesing(true);
      const form = new FormData(offerForm.current);
      const payload = {
        title: form.get('title') as string | null,
        category: form.get('category') as string | null,
        mobile: form.get('phone') as string | null,
        price: form.get('price') as number | null,
        company: form.get('company') as string | null,
        description: form.get('description') as string | null,
        location: form.get('location') as string | null,
        imageUrl: null as string | null
      };

      if (form.get('picture')) {
        const picture = form.get('picture');
        if (picture instanceof File) {
          const file = await uploadImage(picture);
          payload.imageUrl = file.secure_url;
        }
      }

      const response = await fetch(`/api/offers/${offer.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        router.push(`/offers/${offer.id}`);
      } else {
        const payload = await response.json();

        setFormProccesing(false);
        setError(payload.error.message);
      }
    }
  };

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Edycja oferty
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" onSubmit={handleSubmit} ref={offerForm}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="category" className="leading-7 text-sm text-gray-600">
                    Kategoria
                  </label>
                  <select
                    name="category"
                    id="category"
                    defaultValue={offer.category}
                    className="h-10 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                    <option value="doctor">Lekarz</option>
                    <option value="nurse">Pielęgniarka</option>
                    <option value="other">Inne</option>
                  </select>
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="title" className="leading-7 text-sm text-gray-600">
                    Tytuł Ogłoszenia
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={offer.title}
                    maxLength={34}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="location" className="leading-7 text-sm text-gray-600">
                    Lokalizacja
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={offer.location}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="price" className="leading-7 text-sm text-gray-600">
                    Stawka (PLN)
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    defaultValue={offer.price}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
                    Numer telefonu
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={offer.mobile}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
                    Nazwa podmiotu
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    defaultValue={offer.company}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="description" className="leading-7 text-sm text-gray-600">
                    Opis
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={offer.description}
                    required
                    minLength={100}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                </div>
              </div>
              {imagePreviewUrl && (
                <div className="p-2 w-full">
                  <img src={imagePreviewUrl} alt="" className="rounded" />
                </div>
              )}
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="picture" className="leading-7 text-sm text-gray-600">
                    Logo
                  </label>
                  <input
                    onChange={handleImagePreview}
                    type="file"
                    id="picture"
                    name="picture"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  disabled={formProccesing}
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {formProccesing ? 'Proszę czekać...' : 'Edytuj ofertę'}
                </button>

                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white p-2.5">
                      Błąd edycji: {error}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
