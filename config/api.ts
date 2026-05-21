const cleanUrl = (url: string | undefined): string => {
  if (!url) return '';
  return url.replace(/\/+$/, '');
};

export const APP_BASE = import.meta.env.VITE_APP_BASE || '/';
export const API_BASE = cleanUrl(import.meta.env.VITE_API_BASE) || 'https://ecom.apexgulf.ae/apex/API';
export const FILE_BASE = cleanUrl(import.meta.env.VITE_FILE_BASE) || 'https://ecom.apexgulf.ae/apex';
export const SIGNALR_BASE = cleanUrl(import.meta.env.VITE_SIGNALR_BASE) || 'https://ecom.apexgulf.ae/apex-signalr';

export function buildApiUrl(
  handler: string,
  action?: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const h = handler.startsWith('/') ? handler : `/${handler}`;
  const baseUrl = `${API_BASE}${h}`;
  
  const searchParams = new URLSearchParams();
  if (action) {
    searchParams.append('action', action);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        searchParams.append(key, String(val));
      }
    });
  }

  const qs = searchParams.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}
