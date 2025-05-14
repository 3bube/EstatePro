"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPropertyByUserId } from "@/api/property.api";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { VisitRequestsPanel } from "@/components/VisitRequestsPanel";
import { UserVisitsPanel } from "@/components/UserVisitsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "lucide-react";
import Spinner from "@/components/Spinner";

// Define types for property and visit data
type Visit = {
  _id?: string;
  user?: string;
  scheduledDate: string | Date;
  status: "pending" | "accepted" | "declined";
  notes?: string;
  createdAt?: string | Date;
};

type Property = {
  _id: string;
  title: string;
  scheduledVisits: Visit[];
  [key: string]: any; // For any additional properties
};

export default function VisitsPage() {
  const { user } = useAuth();

  // activeTab state is used by Tabs component internally
  const [, setActiveTab] = useState<string>("pending");
  
  // Fetch properties owned by the user to get their visits
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", "user"],
    queryFn: getPropertyByUserId,
    enabled: !!user,
  });

  console.log(properties)
  
  // Process visits by status for different tabs
  const processVisitsByStatus = (status: "pending" | "accepted" | "declined") => {
    if (!properties?.data || properties.data.length === 0) return [];

    console.log(properties.data)
    
    return properties.data.filter((property: Property) => 
      property.scheduledVisits && 
      property.scheduledVisits.some((visit: Visit) => visit.status === status)
    );
  };
  
  const pendingVisitProperties = processVisitsByStatus("pending");
  const acceptedVisitProperties = processVisitsByStatus("accepted");
  const declinedVisitProperties = processVisitsByStatus("declined");
  
  // Count visits
  const pendingVisitCount = pendingVisitProperties.reduce(
    (count: number, property: Property) => count + property.scheduledVisits.filter((v: Visit) => v.status === "pending").length, 
    0
  );
  
  const acceptedVisitCount = acceptedVisitProperties.reduce(
    (count: number, property: Property) => count + property.scheduledVisits.filter((v: Visit) => v.status === "accepted").length, 
    0
  );
  
  const declinedVisitCount = declinedVisitProperties.reduce(
    (count: number, property: Property) => count + property.scheduledVisits.filter((v: Visit) => v.status === "declined").length, 
    0
  );
  
  // Date formatting helpers
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (date: string | Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DashboardSidebar userType="realtor" />
        <main className="flex-1 p-8">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2">Please login to view your visits</h2>
          </div>
        </main>
      </div>
    );
  }
  
  // For seekers (buyers/renters), show their scheduled visits
  if (user.role === "buyer" || user.role === "renter") {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DashboardSidebar userType="seeker" />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Calendar className="mr-2 h-8 w-8 text-[#2C3E50]" />
              My Scheduled Visits
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your scheduled property visits
            </p>
          </div>
          
          <UserVisitsPanel />
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar userType="realtor" />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Calendar className="mr-2 h-8 w-8 text-[#2C3E50]" />
            Property Visit Requests
          </h1>
          <p className="text-gray-600 mt-2">
            Manage property visit requests from potential buyers and renters
          </p>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingVisitCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingVisitCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted
                {acceptedVisitCount > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5">
                    {acceptedVisitCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="declined">
                Declined
                {declinedVisitCount > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-0.5">
                    {declinedVisitCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner />
                  <p className="ml-2">Loading pending visit requests...</p>
                </div>
              ) : (
                <VisitRequestsPanel properties={pendingVisitProperties} />
              )}
            </TabsContent>
            
            <TabsContent value="accepted" className="mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner />
                  <p className="ml-2">Loading accepted visits...</p>
                </div>
              ) : acceptedVisitProperties.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Accepted Visits</h2>
                  
                  {acceptedVisitProperties.map(property => (
                    <Card key={property._id}>
                      <CardHeader>
                        <CardTitle>{property.title}</CardTitle>
                        <CardDescription>
                          Scheduled visits for this property
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {property.scheduledVisits
                            .filter(visit => visit.status === "accepted")
                            .map((visit, index) => (
                              <div 
                                key={`${visit.user._id}-${index}`}
                                className="p-4 border rounded-lg bg-green-50"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      {visit.user.firstName} {visit.user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {formatDate(visit.scheduledDate)} at {formatTime(visit.scheduledDate)}
                                    </p>
                                    <p className="text-sm mt-2">
                                      Contact: {visit.user.email}
                                    </p>
                                    {visit.notes && (
                                      <div className="mt-2 p-3 bg-white rounded">
                                        <p className="text-sm italic">&quot;{visit.notes}&quot;</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">No accepted visits yet</h3>
                  <p className="text-gray-600">When you accept visit requests, they will appear here</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="declined" className="mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner />
                  <p className="ml-2">Loading declined visits...</p>
                </div>
              ) : declinedVisitProperties.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Declined Visits</h2>
                  
                  {declinedVisitProperties.map(property => (
                    <Card key={property._id}>
                      <CardHeader>
                        <CardTitle>{property.title}</CardTitle>
                        <CardDescription>
                          Declined visits for this property
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {property.scheduledVisits
                            .filter(visit => visit.status === "declined")
                            .map((visit, index) => (
                              <div 
                                key={`${visit.user._id}-${index}`}
                                className="p-4 border rounded-lg bg-gray-50"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      {visit.user.firstName} {visit.user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {formatDate(visit.scheduledDate)} at {formatTime(visit.scheduledDate)}
                                    </p>
                                    {visit.notes && (
                                      <div className="mt-2 p-3 bg-white rounded">
                                        <p className="text-sm italic">&quot;{visit.notes}&quot;</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">No declined visits</h3>
                  <p className="text-gray-600">When you decline visit requests, they will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
