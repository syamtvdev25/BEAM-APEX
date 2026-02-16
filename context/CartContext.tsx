
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { CartItem, CartContextType, CurrencyTotal } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>(() => {
    const saved = localStorage.getItem('apex_cart');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('apex_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((item: any, qty: number) => {
    // Unique key normalization: trim + remove internal spaces
    const normalizedArtNr = (item.ArtNr || '').trim().replace(/\s+/g, '');
    const brand = (item.Brand || '').trim();
    const suffix = (item.GArtNr || 'REF').trim();
    const id = `${normalizedArtNr}|${brand}|${suffix}`.toUpperCase();
    
    const price = typeof item.Price === 'string' ? parseFloat(item.Price) : (item.Price || 0);
    const isPriced = price > 0;
    
    setCartItems(prev => {
      const existing = prev[id];
      return {
        ...prev,
        [id]: {
          id,
          ArtNr: item.ArtNr,
          Brand: item.Brand,
          GArtNr: item.GArtNr || 'REF',
          Bez: item.Bez,
          Price: price,
          Curr: item.Curr || 'AED',
          ImageName: item.ImageName,
          qty: (existing?.qty || 0) + qty,
          isPriced
        }
      };
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCartItems(prev => {
      if (!prev[id]) return prev;
      const newQty = Math.max(1, prev[id].qty + delta);
      return {
        ...prev,
        [id]: { ...prev[id], qty: newQty }
      };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems({});
  }, []);

  const computedData = useMemo(() => {
    const items = Object.values(cartItems) as CartItem[];
    const priced: CartItem[] = [];
    const offers: CartItem[] = [];
    const currencyTotals: Record<string, number> = {};

    items.forEach(item => {
      if (item.isPriced) {
        priced.push(item);
        const amt = item.Price * item.qty;
        currencyTotals[item.Curr] = (currencyTotals[item.Curr] || 0) + amt;
      } else {
        offers.push(item);
      }
    });

    const totalsByCurrency: CurrencyTotal[] = Object.keys(currencyTotals).map(curr => ({
      currency: curr,
      amount: currencyTotals[curr].toFixed(2)
    }));

    return {
      uniqueCount: items.length,
      pricedItems: priced,
      offerItems: offers,
      totalsByCurrency
    };
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQty, 
      removeFromCart, 
      clearCart,
      ...computedData
    }}>
      {children}
    </CartContext.Provider>
  );
};
