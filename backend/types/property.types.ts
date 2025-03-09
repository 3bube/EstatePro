export interface IProperty {
  title: string;
  description: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  propertyType:
    | "house"
    | "apartment"
    | "condo"
    | "townhouse"
    | "land"
    | "commercial";
  status: "active" | "pending" | "sold" | "rented";
  bedrooms: number;
  bathrooms: number;
  area: number; // square footage
  features: string[];
  amenities: string[];
  images: string[]; // URLs to uploaded images
  yearBuilt?: number;
  owner: mongoose.Types.ObjectId; // Reference to User
  agent?: mongoose.Types.ObjectId; // Reference to User (if applicable)
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isFeatured: boolean;
  availableFrom?: Date;
}
