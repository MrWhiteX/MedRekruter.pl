import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';
import toggleActive from 'services/offer/toggleActive';
import { Session } from 'next-auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const session: Session | null = await getSession({ req });
        if (!session || (session.user && session.user.role !== 'admin')) {
          return res.status(401).json({ error: 'not_authorized' });
        }
        if (typeof req.query.id === 'string') {
          const offer = await toggleActive(req.query.id);
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
