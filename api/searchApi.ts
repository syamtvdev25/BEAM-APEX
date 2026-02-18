
import { fetchJson } from './http';

const API_KEY = 'TEST123';
const BASE_URL = 'https://ecom.apexgulf.ae/apex/API/APISearchLite.ashx';

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
  let url = `${BASE_URL}?ApiKey=${API_KEY}&SPType=${spType}&SearchKey=${encodeURIComponent(searchKey)}`;
  
  if (customerCode) url += `&CustomerCode=${encodeURIComponent(customerCode)}`;
  if (country) url += `&Country=${encodeURIComponent(country)}`;

  return fetchJson<SearchResult>(url, { method: 'GET' });
}
