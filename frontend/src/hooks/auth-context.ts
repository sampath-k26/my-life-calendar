import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
