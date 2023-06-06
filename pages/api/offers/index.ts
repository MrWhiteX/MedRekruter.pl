import { NextApiRequest, NextApiResponse } from 'next';
import { OfferPayload } from 'types/types';
import getRecent from 'services/offer/getRecent';
import createOffer from 'services/offer/create';
import { getSession } from 'next-auth/client';
import { ISession } from 'types/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      {
        const offers = await getRecent(12);
        res.status(200).json(offers);
      }

      break;
    case 'POST': {
      try {
        const session = await getSession({ req });

        if (!session) {
          res.status(401).json({ error: 'Brak autoryzacji' });
        }
        const userID = (session as ISession).user!.id;

        const payload: OfferPayload = req.body;
        const offer = await createOffer(payload, userID);
        res.status(200).json({ status: 'created', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_created', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
