
import React from 'react';
import { productImageUrl } from '../utils/productImage';

interface ProductCardImageProps {
  imageName?: string;
  height?: number;
  radius?: number;
  className?: string;
}

/**
 * Premium Card Image Component.
 * Uses background-image with 'contain' to ensure full product visibility 
 * without cropping or distortion.
 */
export const ProductCardImage: React.FC<ProductCardImageProps> = ({ 
  imageName, 
  height = 120, 
  radius = 16,
  className = ""
}) => {
  const imageUrl = productImageUrl(imageName);
  const hasImage = !!(imageName && imageName.trim() !== '');

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: `${height}px`,
    borderRadius: `${radius}px`,
    backgroundColor: '#f4f6f9',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundImage: `url("${imageUrl}")`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '8px' // Internal padding to keep product away from edges
  };

  return (
    <div style={containerStyle} className={className}>
      {hasImage ? (
        <div style={imageStyle} />
      ) : (
        <svg className="w-1/3 h-1/3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
};
