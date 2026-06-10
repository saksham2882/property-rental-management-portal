export interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  furnishing: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
  available: boolean;
  availableFrom: string;
  area: number;
  description: string;
  amenities: string[];
  images: string[];
  ownerId: number;
  postedAt: string;
}

export interface PropertyFilter {
  city?: string;
  type?: string;
  bedrooms?: number;
  furnishing?: string;
  minRent?: number;
  maxRent?: number;
  available?: boolean;
}
