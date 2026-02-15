
export interface User {
  username: string;
  customerCode: string;
  customerName: string;
  country: string;
  userType: string;
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
