
import { fetchJson } from './http';
import { buildApiUrl } from '../config/api';

const API_KEY = 'TEST123';

export interface SearchItemRaw {
  ArtNr: string;
  GArtNr: string;
  Brand: string;
  Bez: string;
  ImageName: string;
  ImageUrl?: string;
  Status: string;
  Replaced: string;
  Price: string | number;
  Stock: string;
  Curr: string;
  HasQtyPrice: string | number;
}

export interface SearchResult {
  success: boolean;
  enriched: boolean;
  count: number;
  data: SearchItemRaw[];
  message?: string;
}

/**
 * Searches for items using the enterprise SearchLite API.
 */
export async function searchLiteApi(
  searchKey: string, 
  customerCode?: string, 
  country?: string,
  spType: string = 'CUSTOMER'
): Promise<SearchResult> {
  const params: Record<string, string | number | undefined> = {
    ApiKey: API_KEY,
    SPType: spType,
    SearchKey: searchKey,
  };
  
  if (customerCode) params.CustomerCode = customerCode;
  if (country) params.Country = country;

  const url = buildApiUrl('APISearchLite.ashx', undefined, params);

  return fetchJson<SearchResult>(url, { method: 'GET' });
}
