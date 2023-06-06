import airtableClient from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';

interface AuthorizeSchema {
  email: string;
  password: string;
}

export interface AuthorizedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

const schema = Joi.object<AuthorizeSchema>({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const authorizeUser = async (payload: AuthorizeSchema): Promise<AuthorizedUser | null> => {
  const { email, password } = await schema.validateAsync(payload);

  const [user] = await airtableClient('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();

  if (!user) {
    return null;
  }

  const passwordHash = crypto
    .pbkdf2Sync(password, user.fields.passwordSalt, 1000, 64, `sha512`)
    .toString('hex');

  if (passwordHash !== user.fields.passwordHash) {
    return null;
  }

  return {
    id: user.id,
    email: user.fields.email,
    fullName: user.fields.fullName,
    role: user.fields.role
  };
};

export default authorizeUser;
