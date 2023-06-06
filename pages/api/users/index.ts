import { NextApiRequest, NextApiResponse } from 'next';
import createUser from 'services/users/create';
import { CreateUserSchema } from 'types/types';
import { isCustomError } from 'helpers/customError';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST': {
      try {
        const payload: CreateUserSchema = req.body;
        const user = await createUser(payload);
        res.status(200).json({ status: 'created', user });
      } catch (error: unknown) {
        if (isCustomError(error)) {
          res.status(422).json({ status: 'not_created', error: error.message });
        }
      }
      break;
    }

    default:
      res.status(400);
  }
};
