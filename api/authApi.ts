
import { buildApiUrl } from '../config/api';

const API_KEY = 'TEST123';

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
 * Authenticates user directly against the remote server using the native browser fetch (CORS mode) and robust error mapping.
 */
export async function loginApi(userId: string, pass: string): Promise<LoginResponse> {
  const url = buildApiUrl('APILogin.ashx', undefined, {
    ApiKey: API_KEY,
    UserId: userId,
    Password: pass
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error('SERVER_UNAVAILABLE');
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.message === 'SERVER_UNAVAILABLE') {
      throw error;
    }
    // Detect standard fetch failure (which indicates a network error or CORS blocker in the browser)
    if (
      error instanceof TypeError ||
      error.name === 'TypeError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('network') ||
      error.message?.includes('CORS')
    ) {
      throw new Error('NETWORK_CORS_ERROR');
    }
    throw error;
  }
}
