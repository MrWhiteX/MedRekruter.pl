import airtableClient from 'services/airtableClient';
import Joi from 'joi';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

interface ResetEmailSchema {
  email: string;
}

const schema = Joi.object<ResetEmailSchema>({
  email: Joi.string().email().required()
});

const sendResetToken = async (payload: string) => {
  const { email }: { email: string } = await schema.validateAsync(payload);

  let [user] = await airtableClient('users')
    .select({ filterByFormula: `email="${email}"` })
    .firstPage();

  if (!user) {
    return null;
  }

  const resetToken = crypto.randomBytes(22).toString('hex');

  [user] = await airtableClient('users').update([
    {
      id: user.id,
      fields: { resetToken }
    }
  ]);

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST!,
    port: parseInt(process.env.NODEMAILER_PORT!),
    auth: {
      user: process.env.NODEMAILER_USER!,
      pass: process.env.NODEMAILER_PASS!
    }
  });

  const response = await transporter.sendMail({
    from: 'sender@server.com',
    to: 'receiver@sender.com',
    subject: 'Change your password',
    html: `
      Hey! <br/>Please change your password here:
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user/updatePassword?token=${resetToken}">
        ${process.env.NEXT_PUBLIC_BASE_URL}/user/updatePassword?token=${resetToken}
      </a>
    `
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('E-mail sent, Preview URL: ' + nodemailer.getTestMessageUrl(response));
  }

  return resetToken;
};

export default sendResetToken;
