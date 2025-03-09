"use client";

import { useState, useEffect } from "react";
import { ActiveListings } from "@/components/ActiveListings";
import { PendingListings } from "@/components/PendingListings";
import { ExpiredListings } from "@/components/ExpiredListings";
import { AddListingForm } from "@/components/AddListingForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createProperty, getPropertyByUserId } from "@/api/property.api";
import { useAuth } from "@/context/AuthContext";

export default function RealtorListingsPage() {
  const [showAddListingForm, setShowAddListingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getPropertyByUserId();
        setProperties(response?.data ?? []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const handleSubmit = async (formData: any) => {
    if (!user?._id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a listing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createProperty({
        ...formData,
        owner: user._id,
      });

      if (response.success) {
        toast({
          title: "Success!",
          description: "Your listing has been created.",
        });
        setShowAddListingForm(false);
        // Refresh properties
        const newResponse = await getPropertyByUserId();
        setProperties(newResponse?.data ?? []);
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterProperties = (status: string) => {
    return Array.isArray(properties)
      ? properties.filter((p: any) => p.status === status)
      : [];
  };

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]">Property Listings</h1>
        <Button
          onClick={() => setShowAddListingForm(true)}
          className="bg-[#2C3E50] text-white hover:bg-[#34495E]"
        >
          Add New Listing
        </Button>
      </div>

      {showAddListingForm ? (
        <AddListingForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Listings</TabsTrigger>
            <TabsTrigger value="pending">Pending Listings</TabsTrigger>
            <TabsTrigger value="expired">Expired Listings</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <ActiveListings activeListings={filterProperties("active")} />
          </TabsContent>
          <TabsContent value="pending">
            <PendingListings pendingListings={filterProperties("pending")} />
          </TabsContent>
          <TabsContent value="expired">
            <ExpiredListings expiredListings={filterProperties("expired")} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
