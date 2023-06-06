import airtableClient from 'services/airtableClient';
import Joi from 'joi';

interface JoiSchema {
  title: string;
  category: 'doctor' | 'nurse' | 'other';
  mobile: string;
  description: string;
  location: string;
  company: string;
  price: number;
  imageUrl: string;
}

const schema = Joi.object<JoiSchema>({
  title: Joi.string().required(),
  category: Joi.string().valid('doctor', 'nurse', 'other').required(),
  mobile: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  company: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  imageUrl: Joi.string()
});

const updateOffer = async (airtableId: string, payload: JoiSchema): Promise<any> => {
  const validatedOffer = await schema.validateAsync(payload);
  const updatedRecords = await airtableClient('offers').update([
    {
      id: airtableId,
      fields: { ...validatedOffer }
    }
  ]);

  if (updatedRecords && updatedRecords[0]) {
    return { airtableId: updatedRecords[0].id, ...updatedRecords[0].fields };
  }
  throw new Error('Failed to update offer');
};

export default updateOffer;
