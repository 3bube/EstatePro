import mongoose from "mongoose";
import { IProperty } from "../types/property.types";

const PropertySchema = new mongoose.Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  propertyType: {
    type: String,
    enum: ["house", "apartment", "condo", "townhouse", "land", "commercial"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "pending", "sold", "rented"],
    required: true,
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  amenities: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  availableFrom: { type: Date },
  yearBuilt: { type: Number },
});

const PropertyModel = mongoose.model<IProperty>("Property", PropertySchema);

export default PropertyModel;
