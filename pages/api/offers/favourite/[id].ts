import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Session } from 'next-auth';
import getOfferById from 'services/offer/getOfferById';
import { ExtendedOfferType } from 'types/types';
import { ISession } from 'types/types';
import addFavourite from 'services/offer/addFavourite';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session | null = await getSession({ req });

  const offer: ExtendedOfferType | null = await getOfferById(req.query.id as string);
  if (!offer) {
    return res.status(404).json({ error: 'offer_not_found' });
  }

  if (!session) {
    return res.status(401).json({ error: 'Brak autoryzacji' });
  }
  switch (req.method) {
    case 'POST': {
      try {
        const emailSession = (session as ISession).user!.email;
        const payload = offer.airtableId;

        const favouriteOffer = await addFavourite(payload, emailSession as string);
        res.status(200).json({ status: 'updated' });
      } catch (error) {
        res.status(422).json({ status: 'not_added', error });
      }

      break;
    }
    default:
      res.status(400);
  }
};
