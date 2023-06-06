import Airtable from 'airtable';

interface AirtableConfig {
  endpointUrl: string | undefined;
  apiKey: string | undefined;
  apiVersion?: string;
  noRetryIfRateLimited?: boolean;
}

const airtableConfig: AirtableConfig = {
  endpointUrl: process.env.AIRTABLE_URL,
  apiKey: process.env.AIRTABLE_API_KEY
};

const airtableOptions = {
  apiKey: airtableConfig.apiKey,
  endpointUrl: airtableConfig.endpointUrl,
  apiVersion: airtableConfig.apiVersion,
  noRetryIfRateLimited: airtableConfig.noRetryIfRateLimited
};

Airtable.configure(airtableOptions);

export default Airtable.base(process.env.AIRTABLE_BASE as string);
