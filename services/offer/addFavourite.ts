import airtableClient from 'services/airtableClient';
import Joi from 'joi';

const schema = Joi.string().required();

const addFavourite = async (offerId: string, emailSession: string) => {
  const validatedOffer = await schema.validateAsync(offerId);

  const [user] = await airtableClient('users')
    .select({
      filterByFormula: `email="${emailSession}"`,
      fields: ['email', 'favourite']
    })
    .firstPage();

  if (!user) {
    return null;
  }

  const userId = user.id;
  const existingFavourite = user.fields.favourite || [];
  const idToAdd = validatedOffer;

  let updatedFavourite;
  if (existingFavourite.includes(idToAdd)) {
    updatedFavourite = existingFavourite.filter((id: string) => id !== idToAdd);
  } else {
    updatedFavourite = [...existingFavourite, idToAdd];
  }

  await airtableClient('users').update([
    {
      id: userId,
      fields: {
        favourite: updatedFavourite
      }
    }
  ]);
};

export default addFavourite;
