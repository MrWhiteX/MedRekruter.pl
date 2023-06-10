import { useState, useRef, useEffect } from 'react';
import BaseLayout from 'components/BaseLayout';
import { useRouter, NextRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { dictData } from 'dicData';

export default function OfferNew() {
  const [formProccesing, setFormProccesing] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const offerForm = useRef<HTMLFormElement>(null);
  const router: NextRouter = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!session && !loading) {
      router.push('/user/signin');
    }
  }, [session, loading]);

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
        price: form.get('price') as string | null,
        company: form.get('company') as string | null,
        description: form.get('description') as string | null,
        location: form.get('location') as string | null
      };

      const response = await fetch('/api/offers', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        router.push('/offers/thanks');
      } else {
        const payload = await response.json();

        setFormProccesing(false);
        setError(payload.error.details[0].message);
      }
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!loading && !session) {
    return <div>{dictData.login}</div>;
  }

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              {dictData.addJobOffer}
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" onSubmit={handleSubmit} ref={offerForm}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="category" className="leading-7 text-sm text-gray-600">
                    {dictData.offerCategory}
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="h-10 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                    <option value="doctor">{dictData.optionDoctor}</option>
                    <option value="nurse">{dictData.optionNurse}</option>
                    <option value="other">{dictData.optionOther}</option>
                  </select>
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="title" className="leading-7 text-sm text-gray-600">
                    {dictData.titleOffer}
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    maxLength={34}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="location" className="leading-7 text-sm text-gray-600">
                    {dictData.location}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="price" className="leading-7 text-sm text-gray-600">
                    {dictData.price}
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
                    {dictData.phoneNumber}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
                    {dictData.titleCompany}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="description" className="leading-7 text-sm text-gray-600">
                    {dictData.description}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    minLength={100}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  disabled={formProccesing}
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {formProccesing ? 'Proszę czekać...' : 'Dodaj ofertę'}
                </button>

                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white p-2.5">
                      {dictData.offerNotAdded} {error}
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
