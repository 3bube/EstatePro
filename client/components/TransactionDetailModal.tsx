"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Transaction = {
  id: string;
  buyerName: string;
  sellerName: string;
  propertyAddress: string;
  amount: number;
  status: "pending" | "completed" | "disputed" | "cancelled";
  date: string;
};

type TransactionDetailModalProps = {
  transaction: Transaction;
  onClose: () => void;
  onUpdate: (transaction: Transaction) => void;
};

export function TransactionDetailModal({
  transaction,
  onClose,
  onUpdate,
}: TransactionDetailModalProps) {
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [disputeReason, setDisputeReason] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTransaction({
      ...editedTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (value: string) => {
    setEditedTransaction({
      ...editedTransaction,
      status: value as "pending" | "completed" | "disputed" | "cancelled",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedTransaction);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...editedTransaction, status: "disputed" });
    // In a real application, you would also send the dispute reason to the backend
    console.log("Dispute submitted:", disputeReason);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="dispute">Dispute Resolution</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">
                    Transaction ID
                  </Label>
                  <Input
                    id="id"
                    name="id"
                    value={editedTransaction.id}
                    onChange={handleInputChange}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buyerName" className="text-right">
                    Buyer
                  </Label>
                  <Input
                    id="buyerName"
                    name="buyerName"
                    value={editedTransaction.buyerName}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sellerName" className="text-right">
                    Seller
                  </Label>
                  <Input
                    id="sellerName"
                    name="sellerName"
                    value={editedTransaction.sellerName}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="propertyAddress" className="text-right">
                    Property
                  </Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    value={editedTransaction.propertyAddress}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={editedTransaction.amount}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editedTransaction.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={new Date(editedTransaction.date)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="dispute">
            <form onSubmit={handleDisputeSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="disputeReason" className="text-right">
                    Reason for Dispute
                  </Label>
                  <Textarea
                    id="disputeReason"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="col-span-3"
                    placeholder="Describe the reason for the dispute"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="destructive">
                  Submit Dispute
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
