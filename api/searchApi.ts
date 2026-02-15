
import { fetchJson } from './http';

const API_KEY = 'TEST123';
const BASE_URL = 'https://ecom.apexgulf.ae/apex/API/APISearchLite.ashx';

export interface SearchResult {
  Success: boolean;
  Message: string;
  Data: SearchItemRaw[];
}

export interface SearchItemRaw {
  ID: string;
  Image: string;
  Brand: string;
  ItemCode: string;
  Status: string;
  ReplacedBy: string;
  Description: string;
  Price: number;
  Stock: string;
  Currency: string;
}

/**
 * Searches for items using the enterprise SearchLite API.
 * @param searchKey PartNo, OEM, or Reference Number
 * @param spType Usually 'CUSTOMER' for e-commerce search
 */
export async function searchLiteApi(searchKey: string, spType: string = 'CUSTOMER'): Promise<SearchResult> {
  const url = `${BASE_URL}?ApiKey=${API_KEY}&SPType=${spType}&SearchKey=${encodeURIComponent(searchKey)}`;
  
  return fetchJson<SearchResult>(url, { method: 'GET' });
}
