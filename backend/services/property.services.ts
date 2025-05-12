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

// schedule visit
export const scheduleVisit = async (
  propertyId: string,
  userId: string,
  scheduledDate: Date
): Promise<IProperty | null> => {
  try {
    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404);
    }
    property.scheduledVisits.push({
      user: userId,
      scheduledDate,
      status: "pending",
    });
    await property.save();
    return property;
  } catch (error) {
    throw new AppError("Failed to schedule visit", 500);
  }
};

// accept or decline schedule visit
export const acceptOrDeclineVisit = async (
  propertyId: string,
  userId: string,
  scheduledDate: Date,
  status: "accepted" | "declined"
): Promise<IProperty | null> => {
  try {
    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404);
    }
    
    console.log("Received visit update request:", {
      propertyId,
      userId,
      scheduledDate: scheduledDate.toISOString(),
      status
    });
    
    let visitUpdated = false;
    
    property.scheduledVisits = property.scheduledVisits.map((visit) => {
      // Convert both to strings for comparison
      const visitUserId = visit.user.toString();
      const targetUserId = userId.toString();
      
      // Compare dates by converting to ISO strings
      const visitDate = new Date(visit.scheduledDate).toISOString().split('T')[0];
      const targetDate = new Date(scheduledDate).toISOString().split('T')[0];
      
      console.log("Comparing visit:", {
        visitUserId,
        targetUserId,
        visitDate,
        targetDate,
        match: visitUserId === targetUserId && visitDate === targetDate
      });
      
      if (visitUserId === targetUserId && visitDate === targetDate) {
        visitUpdated = true;
        visit.status = status;
        console.log("Updated visit status to:", status);
      }
      
      return visit;
    });
    
    if (!visitUpdated) {
      console.log("No matching visit found to update");
    }
    
    await property.save();
    return property;
  } catch (error) {
    console.error("Error in acceptOrDeclineVisit:", error);
    throw new AppError("Failed to accept or decline visit", 500);
  }
};
