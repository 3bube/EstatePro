import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type DataExportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DataExportModal({ isOpen, onClose }: DataExportModalProps) {
  const handleExport = (format: string) => {
    // Implement export logic here
    console.log(`Exporting data in ${format} format`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <RadioGroup defaultValue="csv">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" />
            <Label htmlFor="csv">CSV</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excel" id="excel" />
            <Label htmlFor="excel">Excel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pdf" id="pdf" />
            <Label htmlFor="pdf">PDF</Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button onClick={() => handleExport("csv")}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
