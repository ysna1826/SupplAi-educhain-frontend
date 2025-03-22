export enum UserRole {
  MANAGER = "manager",
  FARMER = "farmer",
  INVESTOR = "investor",
}

export interface User {
  address: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
