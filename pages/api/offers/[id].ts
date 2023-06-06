import { getSession } from 'next-auth/client';
import getOfferById from 'services/offer/getOfferById';
import isAuthorized from 'services/offer/isAuthorized';
import deleteOffer from 'services/offer/deleteOffer';
import updateOffer from 'services/offer/updateOffer';
import getSingleOffer from 'services/offer/getSingleOffer';
import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedOfferType } from 'types/types';
import { Session } from 'next-auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session: Session | null = await getSession({ req });

  let offer: ExtendedOfferType | null = await getOfferById(req.query.id as string);
  if (!offer) {
    return res.status(404).json({ error: 'offer_not_found' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        offer = await getSingleOffer(Number(req.query.id));
        res.status(200).json(offer);
      } catch (error) {
        res.status(422).json({ status: 'not_updated', error });
      }
      break;
    }

    case 'DELETE': {
      try {
        if (!isAuthorized(offer, session)) {
          return res.status(401).json({ error: 'not_authorized' });
        }

        offer = await deleteOffer(offer.airtableId);
        res.status(200).json({ status: 'deleted', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_updated', error });
      }
      break;
    }

    case 'PUT': {
      try {
        if (!isAuthorized(offer, session)) {
          return res.status(401).json({ error: 'not_authorized' });
        }

        const payload = req.body;

        if (typeof req.query.id === 'string') {
          offer = await updateOffer(offer.airtableId, payload);
          res.status(200).json({ status: 'updated', offer });
        } else {
          res.status(400).json({ error: 'invalid_id' });
        }
      } catch (error) {
        res.status(422).json({ status: 'not_updated', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
