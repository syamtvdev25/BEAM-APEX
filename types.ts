
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
