"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RealtorResponse } from "./RealtorResponse";

type ReviewCardProps = {
  review: {
    id: string;
    userName: string;
    userAvatar: string;
    date: string;
    rating: number;
    review: string;
    helpfulCount: number;
    realtorResponse: string;
  };
};

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [userAction, setUserAction] = useState<
    "helpful" | "not-helpful" | null
  >(null);
  const [showRealtorResponse, setShowRealtorResponse] = useState(false);
  const [realtorResponse, setRealtorResponse] = useState(
    review.realtorResponse
  );

  const handleHelpful = () => {
    if (userAction === "helpful") {
      setHelpfulCount(helpfulCount - 1);
      setUserAction(null);
    } else {
      setHelpfulCount(
        userAction === "not-helpful" ? helpfulCount + 2 : helpfulCount + 1
      );
      setUserAction("helpful");
    }
  };

  const handleNotHelpful = () => {
    if (userAction === "not-helpful") {
      setHelpfulCount(helpfulCount);
      setUserAction(null);
    } else {
      setHelpfulCount(
        userAction === "helpful" ? helpfulCount - 2 : helpfulCount - 1
      );
      setUserAction("not-helpful");
    }
  };

  const handleRealtorResponse = (response: string) => {
    setRealtorResponse(response);
    setShowRealtorResponse(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{review.userName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < review.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{review.review}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleHelpful}
            className={userAction === "helpful" ? "bg-green-100" : ""}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Helpful ({helpfulCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNotHelpful}
            className={userAction === "not-helpful" ? "bg-red-100" : ""}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            Not Helpful
          </Button>
        </div>
        <Button
          variant="link"
          onClick={() => setShowRealtorResponse(!showRealtorResponse)}
        >
          Realtor Response
        </Button>
      </CardFooter>
      {showRealtorResponse && (
        <RealtorResponse
          existingResponse={realtorResponse}
          onSubmit={handleRealtorResponse}
          onCancel={() => setShowRealtorResponse(false)}
        />
      )}
      {realtorResponse && !showRealtorResponse && (
        <CardContent>
          <div className="bg-gray-100 p-3 rounded-md">
            <h4 className="font-semibold mb-2">Realtor Response:</h4>
            <p className="text-sm text-gray-700">{realtorResponse}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
