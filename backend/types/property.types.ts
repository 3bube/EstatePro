import mongoose from "mongoose";

export interface IVisitSchedule {
  user: mongoose.Types.ObjectId | string | undefined;
  scheduledDate: Date;
  status: "accepted" | "declined" | "pending";
  notes?: string;
  createdAt?: Date;
}

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
  area: number;
  features: string[];
  amenities: string[];
  images: string[];
  owner: mongoose.Types.ObjectId;
  agent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  isFeatured: boolean;
  availableFrom?: Date;
  yearBuilt?: number;
  scheduledVisits: IVisitSchedule[];
}
