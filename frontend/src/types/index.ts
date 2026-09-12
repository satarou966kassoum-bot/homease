export type UserRole = "client" | "owner" | "admin";
export type KycStatus = "non_soumis" | "en_attente" | "verifie" | "rejete";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  kycStatus?: KycStatus;
  createdAt: string;
}

export type ListingCategory =
  | "chambre"
  | "maison"
  | "appartement"
  | "villa"
  | "parcelle"
  | "bureau"
  | "meuble";

export type TransactionType = "location" | "vente" | "reservation";

export type ListingStatus =
  | "brouillon"
  | "en_attente"
  | "approuvee"
  | "rejetee"
  | "suspendue"
  | "vendue_louee";

export interface Listing {
  _id: string;
  owner: { _id: string; name: string; avatarUrl?: string; phone?: string; kycStatus?: KycStatus } | string;
  title: string;
  description: string;
  category: ListingCategory;
  transactionType: TransactionType;
  price: number;
  city: string;
  neighborhood: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  surfaceM2?: number;
  furnished: boolean;
  amenities: string[];
  photos: string[];
  videos: string[];
  mapsUrl?: string;
  boostRequested?: boolean;
  status: ListingStatus;
  isDemo: boolean;
  isFeatured: boolean;
  viewsCount: number;
  createdAt: string;
}
