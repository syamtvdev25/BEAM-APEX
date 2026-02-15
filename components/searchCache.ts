
export interface SearchItem {
  id: string;
  image: string;
  brand: string;
  itemCode: string;
  status: 'Active' | 'Inactive';
  replacedBy: string;
  description: string;
  price: number;
  stock: 'Available' | 'Out of Stock';
  currency: string;
}

export interface CartItem extends SearchItem {
  cartQty: number;
}

export interface SearchStateCache {
  searchText: string;
  results: SearchItem[];
  quantities: { [key: string]: number };
  cart: CartItem[];
  hasSearched: boolean;
  error: string;
}

let cache: SearchStateCache | null = null;

/**
 * Retrieves the currently cached search state.
 * Returns null if no state has been cached yet.
 */
export const getSearchCache = (): SearchStateCache | null => cache;

/**
 * Updates the in-memory cache with the provided search state.
 */
export const setSearchCache = (state: SearchStateCache): void => {
  cache = state;
};

/**
 * Clears the cache, effectively resetting the search state on next mount.
 */
export const clearSearchCache = (): void => {
  cache = null;
};
