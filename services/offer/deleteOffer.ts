import airtableClient from 'services/airtableClient';
import { ExtendedOfferType } from 'types/types';

const deleteOffer = async (airtableId: string): Promise<ExtendedOfferType> => {
  const deletedRecords = await airtableClient('offers').destroy([airtableId]);

  if (deletedRecords && deletedRecords[0]) {
    return { airtableId: deletedRecords[0].id, ...deletedRecords[0].fields };
  }

  throw new Error('Failed to delete offer');
};

export default deleteOffer;
