
import { mediaConfig } from '../config/mediaConfig';

/**
 * Ensures the image name is just the filename, preventing path injection or double segments.
 */
export const normalizeImageName = (imageName?: string): string => {
  if (!imageName) return "";
  const trimmed = imageName.trim();
  // Extract filename if a path was accidentally provided
  return trimmed.split(/[\\/]/).pop() || "";
};

/**
 * Builds a direct URL to the product image hosted on the enterprise server.
 */
export const productImageUrl = (imageName?: string): string => {
  const fileName = normalizeImageName(imageName);
  if (!fileName) return "";
  
  const baseUrl = mediaConfig.productImageBaseUrl.endsWith('/') 
    ? mediaConfig.productImageBaseUrl 
    : `${mediaConfig.productImageBaseUrl}/`;

  return `${baseUrl}${encodeURIComponent(fileName)}`;
};
