
import React, { useState } from 'react';
import { productImageUrl } from '../utils/productImage';

interface ProductThumbSmallProps {
  imageName?: string;
  size?: number;
  alt?: string;
}

/**
 * Premium Small Thumbnail Component.
 * Forces 'cover' fit mode for consistent list aesthetics.
 */
export const ProductThumbSmall: React.FC<ProductThumbSmallProps> = ({ 
  imageName, 
  size = 64, 
  alt = "Product"
}) => {
  const [hasError, setHasError] = useState(false);
  const src = productImageUrl(imageName);

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '12px',
    backgroundColor: '#f4f6f9',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0
  };

  if (!imageName || !src || hasError) {
    return (
      <div style={containerStyle} className="shadow-inner">
        <svg className="w-1/2 h-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="shadow-sm">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full"
        style={{ 
          objectFit: 'cover', 
          objectPosition: 'center', 
          display: 'block' 
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
