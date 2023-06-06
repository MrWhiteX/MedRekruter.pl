import BaseLayout from 'components/BaseLayout';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import paginateOffers from 'services/offer/allForAdmin';
import { jsonFetcher } from 'utils';
import classNames from 'classnames';
import { getSession } from 'next-auth/client';

interface Offer {
  id: number;
  company: string;
  location: string;
  users: string[];
  status: string;
  description: string;
  category: string;
  mobile: string;
  title: string;
  price: number;
  createdAt: string;
  updateAt: string;
  email: string[];
}

interface ApiResponse {
  records: {
    id: string;
    createdTime: string;
    fields: Offer;
  }[];
  offset: number | null;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return {
      notFound: true
    };
  }
  const offers: ApiResponse = await paginateOffers();

  return {
    props: {
      offset: offers.offset ?? null,
      offers: offers.records.map((offer) => offer.fields)
    }
  };
};

export default function airtableIdHome({
  offers,
  offset
}: {
  offers: Offer[];
  offset: number | null;
}) {
  const [currentOffers, setOffers] = useState(offers);
  const [currentOffset, setOffset] = useState(offset);

  const loadMore = async (): Promise<void> => {
    const response = await jsonFetcher(`/api/admin/offers/paginate?offset=${currentOffset}`);
    setOffset(response.offset);
    setOffers([...currentOffers, ...response.offers]);
  };

  const deleteOffer = async (id: number) => {
    const response = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
    if (response.ok) {
      const updatedOffers = currentOffers.filter((offer) => offer.id !== id);
      setOffers(updatedOffers);
    }
  };

  const toggleActive = async (id: number): Promise<any> => {
    const response = await fetch(`/api/admin/offers/${id}/toggleActive`, { method: 'PUT' });
    if (response.ok) {
      const { offer: updatedOffer } = await response.json();
      const updatedOffers: Offer[] = currentOffers.map((offer) => {
        if (offer.id === updatedOffer.id) {
          return updatedOffer;
        }
        return offer;
      });
      setOffers(updatedOffers);
    }
  };

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="min-w-screen bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
          <div className="w-full lg:w-5/6">
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Tytuł</th>
                    <th className="py-3 px-6 text-left">Lokalizacja</th>
                    <th className="py-3 px-6 text-center">Kategoria</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Akcja</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {currentOffers.map((offer) => (
                    <tr key={offer.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium">{offer.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <span>{offer.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">{offer.category}</td>
                      <td className="py-3 px-6 text-center">
                        <span
                          onClick={() => toggleActive(offer.id)}
                          className={classNames('cursor-pointer py-1 px-3 rounded-full text-xs', {
                            'bg-red-200 text-red-600': offer.status === 'inactive',
                            'bg-green-200 text-green-600': offer.status === 'active'
                          })}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          <Link href={`/offers/${offer.id}`}>
                            <div className="cursor-pointer w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </div>
                          </Link>
                          <Link href={`/offers/${offer.id}/edit`}>
                            <div className="cursor-pointer w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </div>
                          </Link>
                          <div
                            onClick={() => deleteOffer(offer.id)}
                            className="cursor-pointer w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mx-4 mb-4">
              {currentOffset && (
                <button
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={loadMore}>
                  Załaduj więcej
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
