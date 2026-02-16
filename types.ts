
export interface User {
  username: string;
  userId: string;
  customerCode: string;
  customerName: string;
  displayName: string;
  country: string;
  userType: string;
  role: string;
  token: string;
}

export enum AuthState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export interface AppContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface CartItem {
  id: string; // The uniqueKey
  ArtNr: string;
  Brand: string;
  GArtNr: string;
  Bez: string;
  Price: number;
  Curr: string;
  ImageName: string;
  qty: number;
  isPriced: boolean;
}

export interface CurrencyTotal {
  currency: string;
  amount: string;
}

export interface CartContextType {
  cartItems: Record<string, CartItem>;
  addToCart: (item: any, qty: number) => void;
  updateQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  uniqueCount: number; // Number of unique lines
  totalsByCurrency: CurrencyTotal[];
  pricedItems: CartItem[];
  offerItems: CartItem[];
}
