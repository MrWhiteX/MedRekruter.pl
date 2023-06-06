import airtableClient from 'services/airtableClient';
import { ExtendedOfferType } from 'types/types';

const getOfferById = async (id: string | string[]): Promise<ExtendedOfferType | null> => {
  console.log(id);
  const offers = await airtableClient('offers')
    .select({ filterByFormula: `id="${id}"` })
    .firstPage();

  if (offers && offers[0]) {
    return { airtableId: offers[0].id, ...offers[0].fields };
  }
  return null;
};

export default getOfferById;
