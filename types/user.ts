import { UserRole } from "./auth";
import { Token, Investment } from "./token";

export interface UserProfile {
  address: string;
  role: UserRole;
  createdAt: string;
}

export interface FarmerProfile extends UserProfile {
  farmName?: string;
  location?: string;
  productsGrown?: string[];
  tokensCreated: Token[];
}

export interface InvestorProfile extends UserProfile {
  investments: Investment[];
  totalInvested: number;
  portfolioValue: number;
}
