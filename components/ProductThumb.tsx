
import React, { useState } from 'react';
import { productImageUrl } from '../utils/productImage';

interface ProductThumbProps {
  imageName?: string;
  size?: number;
  alt?: string;
  className?: string;
  fitMode?: "cover" | "contain";
  rounded?: number;
}

/**
 * Reliable enterprise component for displaying product imagery.
 * Default is 64px square with 'cover' fit for lists.
 */
export const ProductThumb: React.FC<ProductThumbProps> = ({ 
  imageName, 
  size = 64, 
  alt = "Product Image", 
  className = "",
  fitMode = "cover",
  rounded = 12
}) => {
  const [hasError, setHasError] = useState(false);
  const src = productImageUrl(imageName);

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${rounded}px`,
    backgroundColor: '#f4f6f9',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flex: '0 0 auto',
    padding: 0,
    margin: 0
  };

  // Placeholder logic for empty names or load errors
  if (!imageName || !src || hasError) {
    return (
      <div 
        style={containerStyle}
        className={`${className} shadow-inner`}
      >
        <svg className="w-1/2 h-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      style={containerStyle}
      className={`${className} shadow-sm relative`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full"
        style={{ 
          objectFit: fitMode, 
          objectPosition: 'center', 
          display: 'block',
          margin: 0,
          padding: 0
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
};
