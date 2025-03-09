import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ScheduleReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ScheduleReportModal({
  isOpen,
  onClose,
}: ScheduleReportModalProps) {
  const handleSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement scheduling logic here
    console.log("Scheduling report");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSchedule}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="report-name">Report Name</Label>
              <Input id="report-name" placeholder="Enter report name" />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Input id="recipients" placeholder="Enter email addresses" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
