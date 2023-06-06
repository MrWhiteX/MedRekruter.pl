import Link from 'next/link';
import Image from 'next/image';
import { categoryTranslate } from 'helpers/categoryTranslator';

const NO_IMAGE = '/noimg.png';

export interface OffersProps {
  offer: {
    id: number;
    category: string;
    company: string;
    createdAt: string;
    description: string;
    email: string[];
    location: string;
    mobile: string;
    price: number;
    status: string;
    title: string;
    updateAt: string;
    users?: string[];
    imageUrl?: string | undefined;
  };
}

const OfferItem = ({ offer }: OffersProps) => {
  const { id, category, title, description, imageUrl } = offer;

  return (
    <div className="xl:w-1/4 md:w-1/2 p-4 cursor-pointer">
      <Link href={`/offers/${id}`}>
        <div className="bg-gray-100 p-6 rounded-lg">
          <Image
            className="h-40 rounded w-full object-cover object-center mb-6"
            src={imageUrl ?? NO_IMAGE}
            width={290}
            height={170}
            alt="content"
          />
          <h2 className="tracking-widest text-indigo-900 text-xs font-medium title-font">
            {categoryTranslate(category)}
          </h2>
          <h3 className="text-lg text-gray-900 font-medium title-font mb-4">{title}</h3>
          <p className="leading-relaxed text-base">
            {description.length > 100 ? description.substring(0, 100) + '...' : description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default OfferItem;
