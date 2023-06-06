import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';
import airtableClient from 'services/airtableClient';
import { Offer } from 'types/types';

const APIResponse = t.type({
  offers: t.array(Offer)
});

async function getRecent(maxRecords: number): Promise<Offer[]> {
  const offers = await airtableClient('offers')
    .select({
      sort: [{ field: 'id', direction: 'desc' }],
      filterByFormula: 'status="active"',
      maxRecords
    })
    .firstPage();

  const data = { offers: offers.map((offer) => offer.fields) };

  const validationResult = APIResponse.decode(data);

  if (isLeft(validationResult)) {
    throw new Error('The data from the API is inconsistent with the expected model.');
  }

  return validationResult.right.offers;
}
export default getRecent;
