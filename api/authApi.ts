
import { fetchJson } from './http';

const API_KEY = 'TEST123';
const BASE_URL = 'https://ecom.apexgulf.ae/apex/API/APILogin.ashx';

export interface LoginResponse {
  success: boolean;
  userType?: string;
  customerCode?: string;
  country?: string;
  customerName?: string;
  token?: string;
  message?: string;
}

/**
 * Authenticates user against the remote Apex server using the shared fetchJson utility.
 */
export async function loginApi(userId: string, pass: string): Promise<LoginResponse> {
  const url = `${BASE_URL}?ApiKey=${API_KEY}&UserId=${encodeURIComponent(userId)}&Password=${encodeURIComponent(pass)}`;
  
  // Uses existing fetchJson which handles CapacitorHttp and proxy logic
  return fetchJson<LoginResponse>(url, { method: 'GET' });
}
