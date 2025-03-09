"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type RealtorResponseProps = {
  existingResponse: string;
  onSubmit: (response: string) => void;
  onCancel: () => void;
};

export function RealtorResponse({
  existingResponse,
  onSubmit,
  onCancel,
}: RealtorResponseProps) {
  const [response, setResponse] = useState(existingResponse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(response);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response here..."
            rows={4}
            required
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          className="bg-[#2C3E50] text-white hover:bg-[#34495E]"
        >
          Submit Response
        </Button>
      </CardFooter>
    </Card>
  );
}
