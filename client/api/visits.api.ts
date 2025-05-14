import api from "./api";
import { getScheduledVisits } from "./property.api";

// Define types for enhanced visit data with property details
type EnhancedVisit = {
  _id?: string;
  propertyId: string;
  propertyTitle?: string;
  propertyAddress?: string;
  scheduledDate: string | Date;
  status: "pending" | "accepted" | "declined";
  notes?: string;
  createdAt?: string | Date;
  user?: string;
};

// Define property data type
interface PropertyData {
  _id: string;
  title?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
  images?: string[];
};

// Define type for backend visit data
interface BackendVisit {
  _id: string;
  user: string;
  scheduledDate: string;
  status: "pending" | "accepted" | "declined";
  notes?: string;
  createdAt: string;
  property: PropertyData;
};

// Get visits for the currently logged in user (for seekers)
export const getUserVisits = async (): Promise<{ visits: EnhancedVisit[] }> => {
  try {
    // Get visits from the backend
    const response = await getScheduledVisits();
    console.log('Raw visits data:', response);
    
    // The backend returns an array of visit objects with property details
    const visits: EnhancedVisit[] = (response || []).map((visit: BackendVisit) => {
      // Extract property data from the response
      const propertyData = visit.property || {};
      
      // Format the address string
      let addressString = 'Address not available';
      if (propertyData.address) {
        const address = propertyData.address;
        const addressParts = [
          address.street,
          address.city,
          address.state,
          address.zipCode
        ].filter(Boolean);
        
        if (addressParts.length > 0) {
          addressString = addressParts.join(', ');
        }
      }
      
      // Return the enhanced visit object
      return {
        _id: visit._id,
        user: visit.user,
        scheduledDate: visit.scheduledDate,
        status: visit.status,
        notes: visit.notes || '',
        createdAt: visit.createdAt,
        // Add property details to the visit object
        propertyId: propertyData._id,
        propertyTitle: propertyData.title || 'Property Visit',
        propertyAddress: addressString,
        // Additional property details for display
        propertyType: propertyData.propertyType || '',
        propertyBedrooms: propertyData.bedrooms || 0,
        propertyBathrooms: propertyData.bathrooms || 0,
        propertyPrice: propertyData.price || 0,
        propertyImage: propertyData.images && propertyData.images.length > 0 ? 
          propertyData.images[0] : ''
      };
    });

    console.log('Transformed visits:', visits);
    return { visits };
  } catch (error) {
    console.error("Error fetching user visits:", error);
    return { visits: [] };
  }
};

// Get all visits for a specific property
export const getPropertyVisits = async (propertyId: string) => {
  try {
    const response = await api.get(`/property/${propertyId}`);
    return { 
      visits: response.data?.data?.scheduledVisits || [] 
    };
  } catch (error) {
    console.error(`Error fetching visits for property ${propertyId}:`, error);
    return { visits: [] };
  }
};
