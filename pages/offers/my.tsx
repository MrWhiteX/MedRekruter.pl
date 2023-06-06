import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import BaseLayout from 'components/BaseLayout';
import { OffersProps } from 'types/types';
import getForUser from 'services/offer/getForUser';
import OfferItem from 'components/OfferItem';
import Link from 'next/link';
import { dictData } from 'dicData';
import RecruitmentAnimation from 'animations/myOffers/RecruitmentAnimation';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session || !session.user.email) {
    return {
      redirect: {
        destination: '/user/signin',
        permanent: false
      }
    };
  }

  const offers = await getForUser(session.user.email);

  return {
    props: {
      offers: offers
    }
  };
};

export default function MyOffers({ offers }: OffersProps) {
  const offersElements = (
    <div className="flex flex-wrap -m-4">
      {offers.map((offer) => (
        <OfferItem key={offer.id} offer={offer} />
      ))}
    </div>
  );

  const emptyArray = (
    <div className=" text-center -m-4">
      <div className="flex justify-center">
        <div className="max-w-xs">
          <RecruitmentAnimation />
        </div>
      </div>
      <p className="mt-7">{dictData.myOffersEmptyState}</p>
      <Link href="/offers/new">
        <button className="mt-7 disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
          {dictData.myOffersAdd}
        </button>
      </Link>
    </div>
  );

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                {dictData.myOffers}
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          {offers.length > 0 ? offersElements : emptyArray}
        </div>
      </section>
    </BaseLayout>
  );
}
