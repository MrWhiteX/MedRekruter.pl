import airDB from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';

interface ResetPasswordSchema {
  resetToken: string;
  password: string;
}

interface UserData {
  id: number;
  email: string[];
  fullName: string;
  role: string;
}

const schema = Joi.object<ResetPasswordSchema>({
  resetToken: Joi.string().required(),
  password: Joi.string().required()
});

const changePassword = async (payload: string): Promise<UserData> => {
  const { password, resetToken } = await schema.validateAsync(payload);

  let [user] = await airDB('users')
    .select({ filterByFormula: `resetToken="${resetToken}"` })
    .firstPage();

  if (!user) {
    throw new Error('wrong_token');
  }

  const passwordSalt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto
    .pbkdf2Sync(password, passwordSalt, 1000, 64, `sha512`)
    .toString(`hex`);

  [user] = await airDB('users').update([
    {
      id: user.id,
      fields: {
        resetToken: null,
        passwordHash,
        passwordSalt
      }
    }
  ]);

  return {
    id: parseInt(user.id),
    email: user.fields.email,
    fullName: user.fields.fullName,
    role: user.fields.role
  };
};

export default changePassword;
