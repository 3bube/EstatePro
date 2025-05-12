import { Request, Response } from "express";
import { catchAsync, AuthenticatedRequest } from "../utils/handler";
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  updateProperty,
  getProperties,
  getPropertyByUserId,
  scheduleVisit,
  acceptOrDeclineVisit,
} from "../services/property.services";

export const saveProperty = catchAsync(async (req: Request, res: Response) => {
  const propertyData = req.body;

  const property = await createProperty(propertyData);
  res.status(201).json({
    success: true,
    data: property,
  });
});

export const getProperty = catchAsync(async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  const property = await getPropertyById(propertyId);
  res.status(200).json({
    success: true,
    data: property,
  });
});

export const changeProperty = catchAsync(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const propertyData = req.body;
    const property = await updateProperty(propertyId, propertyData);
    res.status(200).json({
      success: true,
      data: property,
    });
  }
);

export const getAllProperties = catchAsync(
  async (req: Request, res: Response) => {
    console.log("getAllProperties");
    const properties = await getProperties();
    res.status(200).json({
      success: true,
      properties: properties,
    });
  }
);

export const getPropertiesForUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const properties = await getPropertyByUserId(req.user.id);
    res.status(200).json({
      success: true,
      data: properties,
    });
  }
);

export const removeProperty = catchAsync(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const property = await deleteProperty(propertyId);
    res.status(200).json({
      success: true,
      data: property,
    });
  }
);

export const schedulePropertyVisit = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const propertyId = req.params.id;
    const userId = req.user.id;
    const scheduledDate = new Date(req.body.scheduledDate);

    const property = await scheduleVisit(propertyId, userId, scheduledDate);

    res.status(200).json({
      success: true,
      data: property,
    });
  }
);

export const updateVisitStatus = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const propertyId = req.params.id;
    const { scheduledDate, status } = req.body;

    if (!scheduledDate || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, scheduledDate, status",
      });
    }

    const property = await acceptOrDeclineVisit(
      propertyId,
      req.user.id,
      new Date(scheduledDate),
      status
    );

    res.status(200).json({
      success: true,
      data: property,
    });
  }
);
