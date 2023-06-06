import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jsonFetcher } from 'utils';
import paginateOffers from '../../services/offer/paginate';
import { useRouter } from 'next/router';
import OfferItem from 'components/OfferItem';
import BaseLayout from 'components/BaseLayout';

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

export const getStaticProps = async () => {
  const offers: ApiResponse = await paginateOffers();

  return {
    props: {
      offset: offers.offset,
      offers: offers.records.map((offer) => offer.fields)
    }
  };
};

export default function Home({ offers, offset }: { offers: Offer[]; offset: number | null }) {
  const { query } = useRouter();
  const [currentOffers, setOffers] = useState(offers);
  const [currentOffset, setOffset] = useState(offset);

  const loadMore = async () => {
    const response = await jsonFetcher(`/api/offers/paginate?offset=${currentOffset}`);
    setOffset(response.offset);
    setOffers([...currentOffers, ...response.offers]);
  };

  const handleFilters = async (): Promise<void> => {
    let filters = '';
    if (query.category) {
      filters += `?category=${query.category}`;
    }
    const response = await jsonFetcher(`/api/offers/paginate${filters}`);
    setOffset(response.offset);
    setOffers([...response.offers]);
  };

  useEffect(() => {
    handleFilters();
  }, [query]);

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-around w-full mb-4">
            <Link href="/offers">
              <button className={query.category ? 'btn-secondary' : 'btn-primary'}>All</button>
            </Link>
            <Link href="?category=doctor">
              <button className={query.category === 'doctor' ? 'btn-primary' : 'btn-secondary'}>
                Lekarz
              </button>
            </Link>
            <Link href="?category=nurse">
              <button className={query.category === 'nurse' ? 'btn-primary' : 'btn-secondary'}>
                Pielęgniarka
              </button>
            </Link>
            <Link href="?category=other">
              <button className={query.category === 'other' ? 'btn-primary' : 'btn-secondary'}>
                Inne
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap -m-4">
            {currentOffers.map((offer) => (
              <OfferItem key={offer.id} offer={offer} />
            ))}
            {currentOffset && (
              <button
                className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                onClick={loadMore}>
                Załaduj kolejne
              </button>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
