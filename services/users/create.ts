import airtableClient from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';
import { CreateUserSchema } from 'types/types';

const schema = Joi.object<CreateUserSchema>({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  password: Joi.string().required()
});

const checkEmail = async (email: string) => {
  const existingUser = await airtableClient('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();

  if (existingUser && existingUser[0]) {
    throw new Error('email_taken');
  }
};

const create = async (payload: CreateUserSchema) => {
  const { email, fullName, password }: CreateUserSchema = await schema.validateAsync(payload);
  await checkEmail(email);
  const passwordSalt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto
    .pbkdf2Sync(password, passwordSalt, 1000, 64, `sha512`)
    .toString('hex');
  const user = await airtableClient('users').create([
    {
      fields: {
        email,
        fullName,
        passwordSalt,
        passwordHash,
        role: 'regular'
      }
    }
  ]);
};

export default create;
