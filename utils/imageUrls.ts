
import { buildApiUrl } from '../config/api';

/**
 * Global helper to generate product image URLs.
 * Strict adherence to the enterprise proxy API.
 */
export const getProductImageUrl = (imageName: string | undefined, size: number = 200): string => {
  if (!imageName || imageName.trim() === '') return '';
  
  // Clean the imageName to ensure no double encoding or weird characters
  const cleanName = imageName.trim();
  
  // Single source: APIProductImage.ashx
  return buildApiUrl('APIProductImage.ashx', undefined, {
    img: cleanName,
    w: size,
    h: size,
    mode: 'crop'
  });
};
