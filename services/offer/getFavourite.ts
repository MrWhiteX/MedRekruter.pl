import airtableClient from 'services/airtableClient';
import { Offer } from 'types/types';

const getFavourite = async (email: string): Promise<Offer[]> => {
  const offers = await airtableClient('offers')
    .select({
      sort: [{ field: 'id', direction: 'desc' }],
      filterByFormula: `FIND("${email}", ARRAYJOIN(favourite_users,',')) > 0`
    })
    .firstPage();
  console.log('clg', offers);

  return offers.map((offer) => offer.fields);
};

export default getFavourite;
