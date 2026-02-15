
import { fetchJson } from './http';

const API_KEY = 'TEST123';
const BASE_URL = 'https://aog.fortiddns.com:83/Apex/API/APILogin.ashx';

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
 * authenticates user against the remote Apex server.
 */
export async function loginApi(userId: string, pass: string): Promise<LoginResponse> {
  const url = `${BASE_URL}?ApiKey=${API_KEY}&UserId=${encodeURIComponent(userId)}&Password=${encodeURIComponent(pass)}`;
  
  // Login call shouldn't strictly need a Bearer token, so we use fetchJson normally.
  return fetchJson<LoginResponse>(url, { method: 'GET' });
}
