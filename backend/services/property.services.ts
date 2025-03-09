import PropertyModel from "../models/property.models";
import { IProperty } from "../types/property.types";
import { AppError } from "../utils/AppError";

export const createProperty = async (
  propertyData: Partial<IProperty>
): Promise<IProperty> => {
  try {
    const property = await PropertyModel.create(propertyData);
    return property;
  } catch (error) {
    throw new AppError("Failed to create property", 500);
  }
};

export const getPropertyById = async (
  id: string
): Promise<IProperty | null> => {
  try {
    const property = await PropertyModel.findById(id).populate({
      path: "owner",
      select: "firstName lastName email phoneNumber role",
      model: "User",
    });
    if (!property) {
      throw new AppError("Property not found", 404);
    }
    return property;
  } catch (error) {
    throw new AppError("Failed to get property", 500);
  }
};

export const getProperties = async (): Promise<IProperty[]> => {
  try {
    const properties = await PropertyModel.find().populate({
      path: "owner",
      select: "firstName lastName email phoneNumber role",
      model: "User",
    });

    return properties;
  } catch (error) {
    throw new AppError("Failed to get properties", 500);
  }
};

export const getPropertyByUserId = async (
  userId: string
): Promise<IProperty[]> => {
  try {
    const properties = await PropertyModel.find({ owner: userId });
    return properties;
  } catch (error) {
    throw new AppError("Failed to get properties", 500);
  }
};

export const updateProperty = async (
  id: string,
  propertyData: Partial<IProperty>
): Promise<IProperty | null> => {
  try {
    const property = await PropertyModel.findByIdAndUpdate(id, propertyData, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      throw new AppError("Property not found", 404);
    }
    return property;
  } catch (error) {
    throw new AppError("Failed to update property", 500);
  }
};

export const deleteProperty = async (id: string): Promise<IProperty | null> => {
  try {
    const property = await PropertyModel.findByIdAndDelete(id);
    if (!property) {
      throw new AppError("Property not found", 404);
    }
    return property;
  } catch (error) {
    throw new AppError("Failed to delete property", 500);
  }
};
