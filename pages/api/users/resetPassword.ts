import { NextApiRequest, NextApiResponse } from 'next';
import sendResetToken from 'services/users/sendResetToken';
import changePassword from 'services/users/changePassword';
import { isCustomError } from 'helpers/customError';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const payload: string = req.body;

  switch (req.method) {
    case 'POST': {
      try {
        await sendResetToken(payload);

        res.status(200).json({ status: 'ok' });
      } catch (error: unknown) {
        if (isCustomError(error)) {
          res.status(422).json({ status: 'error', error: error.message });
        }
      }
      break;
    }
    case 'PUT': {
      try {
        const user = await changePassword(payload);

        res.status(200).json({ status: 'ok', user });
      } catch (error: unknown) {
        if (isCustomError(error)) {
          res.status(422).json({ status: 'error', error: error.message });
        }
      }
      break;
    }
    default:
      res.status(400);
  }
};
