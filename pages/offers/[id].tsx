import BaseLayout from 'components/BaseLayout';
import getRecentOffers from 'services/offer/getRecent';
import getSingleOffer from 'services/offer/getSingleOffer';
import isAuthorized from 'services/offer/isAuthorized';
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { jsonFetcher } from 'utils';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { OfferType } from 'types/types';
import { debounce } from 'lodash';
import { categoryTranslate } from 'helpers/categoryTranslator';
import Loader from 'animations/Loader/Loader';
import { dictData } from 'dicData';

export const getStaticPaths: GetStaticPaths = async () => {
  const offers: OfferType[] = await getRecentOffers(6);

  return {
    paths: offers.map((offer: OfferType) => ({ params: { id: String(offer.id) } })),
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({
  params
}: GetStaticPropsContext<ParsedUrlQuery>) => {
  const offerId = params && typeof params.id === 'string' ? parseInt(params.id, 10) : undefined;
  const offer: OfferType = offerId !== undefined ? await getSingleOffer(offerId) : undefined;

  if (!offer) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      offer,
      metaTitle: offer.title,
      metaDescription: offer.description
    }
  };
};

export default function OfferPage({ offer }: { offer: OfferType }) {
  const router: NextRouter = useRouter();
  const [session] = useSession();
  const [favouriteUsers, setFavouriteUsers] = useState<string[]>(offer?.favourite_users || []);

  if (router.isFallback) {
    return (
      <BaseLayout>
        <section className="text-gray-600 body-font overflow-hidden container mx-auto">
          <div className="container mx-auto">
            <div
              className="flex items-center justify-center flex-col"
              style={{
                height: '100vh'
              }}>
              <p className="text-4xl text-center mt-10">{dictData.loading}</p>
              <Loader />
            </div>
          </div>
        </section>
      </BaseLayout>
    );
  }

  const { data }: SWRResponse<OfferType, any> = useSWR('/api' + router.asPath, jsonFetcher, {
    initialData: offer
  });

  const handleFavourite = debounce(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (data) {
      const newFavourites = isFavourite
        ? favouriteUsers.filter((userId) => userId !== sessionUserId)
        : [...favouriteUsers, sessionUserId];
      setFavouriteUsers(newFavourites);

      const response = await fetch(`/api/offers/favourite/${data.id}`, { method: 'POST' });
    }
  }, 500);

  const sessionUserId = session?.user.id ?? '';

  const isFavourite = favouriteUsers.includes(sessionUserId);

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              {data && (
                <>
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {categoryTranslate(data.category)}
                  </h2>
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                    {data.title}
                  </h1>
                  <div className="flex mb-4">
                    <p className="flex-grow text-indigo-500 border-b-2 border-indigo-900 py-2 text-lg px-1">
                      Opis
                    </p>
                  </div>
                  <p className="leading-relaxed mb-4">{data.description}</p>
                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500">Lokalizacja</span>
                    <span className="ml-auto text-gray-900">{data.location}</span>
                  </div>
                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500">Kwota / h</span>
                    <span className="ml-auto text-gray-900">
                      {data.price?.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="title-font font-medium text-2xl text-gray-900">
                      {data.mobile}
                    </span>
                    {session ? (
                      <button
                        onClick={handleFavourite}
                        type="button"
                        aria-label="Przycisk dodania ogłoszenia do ulubionych"
                        className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                        <svg
                          fill={isFavourite ? 'red' : 'currentColor'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-5 h-5"
                          viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                        </svg>
                      </button>
                    ) : (
                      <Link href="/user/signin">
                        <button
                          type="button"
                          aria-label="Przycisk dodania ogłoszenia do ulubionych"
                          className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                          <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-5 h-5"
                            viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                          </svg>
                        </button>
                      </Link>
                    )}
                  </div>
                </>
              )}
              {/* {!data && <div>Loading...</div>} */}
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={offer.imageUrl ?? '/noimg.png'}
            />
            {isAuthorized(offer, session) && (
              <p>
                <Link href={`/offers/${offer.id}/edit`}>Edytuj ofertę</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
