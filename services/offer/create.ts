import airtableClient from 'services/airtableClient';
import { OfferPayload } from 'types/types';
import Joi from 'joi';

interface JoiSchema {
  title: string;
  category: 'doctor' | 'nurse' | 'other';
  mobile: string;
  description: string;
  location: string;
  company: string;
  price: number;
}

const schema = Joi.object<JoiSchema>({
  title: Joi.string().required(),
  category: Joi.string().valid('doctor', 'nurse', 'other').required(),
  mobile: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  company: Joi.string().required(),
  price: Joi.number().greater(0).required()
});

const create = async (payload: OfferPayload, userID: string) => {
  const validatedOffer = await schema.validateAsync(payload);
  const offer = await airtableClient('offers').create([
    {
      fields: {
        ...validatedOffer,
        users: [userID],
        status: 'inactive'
      }
    }
  ]);
  return offer;
};

export default create;
