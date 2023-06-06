import airtableClient from 'services/airtableClient';

const getSingleOffer = async (id: number) => {
  const offers = await airtableClient('offers')
    .select({ filterByFormula: `id=${id}` })
    .firstPage();

  if (offers && offers[0]) {
    return offers[0].fields;
  }
};

export default getSingleOffer;
