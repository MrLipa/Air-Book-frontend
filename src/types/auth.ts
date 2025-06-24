import { ReactNode } from "react";

export interface AuthContextProps {
  auth: {
    accessToken?: string;
    userId: string;
    role?: string;
  };
  setAuth: (authData: Partial<AuthContextProps['auth']>) => void;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AuthContextType {
  auth: object;
  setAuth: (auth: object) => void;
  persist: boolean;
  setPersist: (persist: boolean) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
