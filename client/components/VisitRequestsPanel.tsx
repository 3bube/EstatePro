"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateVisitStatus } from "@/api/property.api";
import { useToast } from "@/hooks/use-toast";
import Spinner from "./Spinner";

interface Visit {
  _id?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  scheduledDate: string | Date;
  status: "accepted" | "declined" | "pending";
  notes?: string;
  createdAt?: string | Date;
  propertyId?: string;
  propertyTitle?: string;
}

interface Property {
  _id: string;
  title: string;
  scheduledVisits: Visit[];
}

interface VisitRequestsPanelProps {
  properties: Property[];
  isLoading?: boolean;
}

export function VisitRequestsPanel({ properties, isLoading = false }: VisitRequestsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  // Process and format visits for display
  const pendingVisits = properties.reduce<(Visit & { propertyId: string; propertyTitle: string })[]>((visits, property) => {
    const propertyVisits = property.scheduledVisits
      .filter(visit => visit.status === "pending")
      .map(visit => ({
        ...visit,
        propertyId: property._id,
        propertyTitle: property.title,
        scheduledDate: new Date(visit.scheduledDate),
      }));
    return [...visits, ...propertyVisits];
  }, []).sort((a, b) => {
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  // Format date for display
  const formatDate = (date: Date | string): string => {
    const visitDate = new Date(date);
    return visitDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (date: Date | string): string => {
    const visitDate = new Date(date);
    return visitDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleNote = (visitId: string) => {
    if (expandedNote === visitId) {
      setExpandedNote(null);
    } else {
      setExpandedNote(visitId);
    }
  };

  // Mutation for updating visit status
  const { mutate: updateVisit, isPending: isUpdating } = useMutation({
    mutationFn: (params: { propertyId: string; visitId: string; scheduledDate: Date; status: "accepted" | "declined" }) => {
      return updateVisitStatus(
        params.propertyId,
        params.visitId,
        params.scheduledDate,
        params.status
      );
    },
    onSuccess: () => {
      toast({
        title: "Visit status updated",
        description: "The visitor will be notified of your response.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update visit status",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle accepting or declining visit
  const handleResponse = (visit: Visit, status: "accepted" | "declined") => {

    console.log("visit", visit)

    if (!visit.propertyId || !visit.user) return;
    
    updateVisit({
      propertyId: visit.propertyId,
      visitId: visit.user,
      scheduledDate: new Date(visit.scheduledDate),
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
        <p className="ml-2">Loading visit requests...</p>
      </div>
    );
  }

  if (pendingVisits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Pending Visit Requests</CardTitle>
          <CardDescription>
            You don&apos;t have any pending property visit requests at the moment.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Visit Requests</h2>
      
      {pendingVisits.map((visit) => (
        <Card key={`${visit.propertyId}-${visit.user._id}-${visit.scheduledDate}`} 
              className={isUpdating ? "opacity-70 pointer-events-none" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{visit.propertyTitle}</CardTitle>
                <CardDescription className="mt-1">
                  Request from {visit.user.firstName} {visit.user.lastName}
                </CardDescription>
              </div>
              <Badge className="bg-yellow-500">Pending</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Date</span>
                  <p className="font-medium">{formatDate(visit.scheduledDate)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Time</span>
                  <p className="font-medium">{formatTime(visit.scheduledDate)}</p>
                </div>
              </div>
              
              {visit.notes && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Visitor&apos;s Note</span>
                  <div className="mt-1 relative">
                    <p className={`text-sm ${expandedNote === visit.user._id ? "" : "line-clamp-2"}`}>
                      {visit.notes}
                    </p>
                    {visit.notes.length > 100 && (
                      <button
                        onClick={() => toggleNote(visit.user._id)}
                        className="text-xs text-blue-600 hover:underline mt-1"
                      >
                        {expandedNote === visit.user._id ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-2">
                <span className="text-sm text-gray-500">Contact</span>
                <p className="text-sm italic">&quot;{visit.user.email}&quot;</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => handleResponse(visit, "declined")}
              disabled={isUpdating}
            >
              Decline
            </Button>
            <Button 
              onClick={() => handleResponse(visit, "accepted")}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
