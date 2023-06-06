import { NextApiRequest, NextApiResponse } from 'next';
import { OfferType } from 'types/types';
import paginateOffers from '../../../services/offer/paginate';

interface QueryParams {
  offset: number;
  category: string;
}

interface ApiResponse {
  offers: OfferType[];
  offset: number | null;
}

export default async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  switch (req.method) {
    case 'GET': {
      const { offset, category } = req.query as Partial<QueryParams>;

      const offers = await paginateOffers(offset, category);
      res.status(200).json({
        offers: offers.records.map((offer: any) => offer.fields),
        offset: offers.offset
      });

      break;
    }
    default:
      res.status(400);
  }
};
