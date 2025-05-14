"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Manual date formatting below; date-fns not used.
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UploadImage from "./UploadImage";

type PropertyFormData = {
  title: string;
  description: string;
  price: string | number;
  propertyType: string;
  status: string;
  bedrooms: string | number;
  bathrooms: string | number;
  area: string | number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      latitude: string | number;
      longitude: string | number;
    };
  };
  features: string[];
  amenities: string[];
  images: string[];
  isFeatured: boolean;
  availableFrom?: Date | null;
  yearBuilt?: string | number;
};

interface AddListingFormProps {
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isLoading?: boolean;
}

function formatDate(date: Date) {
  if (!date) return "";
  // Example: May 14, 2025
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function AddListingForm({
  onSubmit,
  isLoading = false,
}: AddListingFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
    },
    propertyType: "",
    status: "active",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [] as string[],
    features: [] as string[],
    amenities: [] as string[],
    availableFrom: null as Date | null,
    yearBuilt: "",
    isFeatured: false,
  });

  const [newFeature, setNewFeature] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  const propertyTypes = [
    "house",
    "apartment",
    "condo",
    "townhouse",
    "land",
    "commercial",
  ];

  const statusOptions = ["active", "pending", "sold", "rented"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: {
          ...prev.address.coordinates,
          [name]: value,
        },
      },
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, propertyType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input
              id="area"
              name="area"
              type="number"
              value={formData.area}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.address.country}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.address.coordinates.latitude}
                onChange={handleCoordinatesChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.address.coordinates.longitude}
                onChange={handleCoordinatesChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
              />
              <Button type="button" onClick={handleAddFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="flex space-x-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add an amenity"
              />
              <Button type="button" onClick={handleAddAmenity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Available From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.availableFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.availableFrom ? (
                    formatDate(formData.availableFrom)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.availableFrom || undefined}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, availableFrom: date }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              value={formData.yearBuilt}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isFeatured}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFeatured: checked }))
            }
          />
          <Label>Featured Property</Label>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Property Images</Label>
          <UploadImage onUpload={handleImageUpload} />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Adding Property..." : "Add Property"}
      </Button>
    </form>
  );
}
