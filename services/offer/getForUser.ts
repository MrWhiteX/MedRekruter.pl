import airtableClient from 'services/airtableClient';
import { Offer } from 'types/types';

const getForUser = async (email: string): Promise<Offer[]> => {
  const offers = await airtableClient('offers')
    .select({
      sort: [{ field: 'id', direction: 'desc' }],
      filterByFormula: `email="${email}"`
    })
    .firstPage();

  return offers.map((offer) => offer.fields);
};

export default getForUser;
