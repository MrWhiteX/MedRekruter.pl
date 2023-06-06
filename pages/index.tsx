import { GetStaticProps } from 'next';
import { jsonFetcher } from 'utils';
import { OfferType, OffersProps } from 'types/types';
import useSWR, { SWRResponse } from 'swr';
import BaseLayout from 'components/BaseLayout';
import getRecentOffers from 'services/offer/getRecent';
import OfferItem from 'components/OfferItem';

export const getStaticProps: GetStaticProps = async () => {
  try {
    const offers = await getRecentOffers(12);

    const sanitizedOffers = offers.map((offer) => ({
      ...offer,
      imageUrl: offer.imageUrl ?? null
    }));

    return {
      props: {
        offers: sanitizedOffers
      }
    };
  } catch (error) {
    console.error('Błąd podczas pobierania ofert:', error);
    return {
      props: {
        offers: []
      }
    };
  }
};

export default function Home({ offers }: OffersProps) {
  const { data }: SWRResponse<OfferType[], any> = useSWR('/api/offers', jsonFetcher, {
    initialData: offers
  });

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                Najnowsze ogłoszenia
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
              Witaj na stronie MedRekruter.pl
            </p>
          </div>
          <div className="flex flex-wrap -m-4">
            {data && data.map((offer) => <OfferItem key={offer.id} offer={offer} />)}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
