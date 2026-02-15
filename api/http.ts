
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';

/**
 * Enterprise Gateway Configuration
 * Using corsproxy.io for web-based CORS bypass to the port 83 origin.
 */
const PROXY_BASE = 'https://corsproxy.io/?';
const ENTERPRISE_DOMAIN = 'aog.fortiddns.com:83';

/**
 * Global HTTP Utility for Enterprise API communication
 */
export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('apex_token');
  let finalUrl = url;
  
  // Apply proxy only on web platform for internal enterprise IP/DDNS
  if (Capacitor.getPlatform() === 'web' && url.includes(ENTERPRISE_DOMAIN)) {
    finalUrl = `${PROXY_BASE}${encodeURIComponent(url)}`;
  }

  const headers: Record<string, string> = { 
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  };
  
  if (options.headers) {
    const h = options.headers as any;
    Object.keys(h).forEach(k => { headers[k] = h[k]; });
  }

  if (token && token !== 'undefined' && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response: HttpResponse = await CapacitorHttp.request({
      url: finalUrl,
      method: (options.method || 'GET').toUpperCase(),
      headers,
      connectTimeout: 10000,
      readTimeout: 10000,
      data: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined,
    });

    // Success case
    if (response.status >= 200 && response.status < 300) {
      if (typeof response.data === 'string' && response.data.trim().startsWith('{')) {
        return JSON.parse(response.data) as T;
      }
      return response.data as T;
    }

    // Handle unreachable server (e.g., status 0 or Cloudflare 522)
    if (response.status === 0 || response.status === 522) {
      throw new Error('CONNECTION_ERROR');
    }

    // Handle generic server errors with messages
    throw new Error(response.data?.message || `Request failed with status ${response.status}`);

  } catch (error: any) {
    // If it's already our tagged error, pass it through
    if (error.message === 'CONNECTION_ERROR') throw error;
    
    // Catch-all for network timeouts or browser-interrupted requests
    if (error.message.includes('timeout') || error.message.includes('Network Error')) {
      throw new Error('CONNECTION_ERROR');
    }
    throw error;
  }
}
