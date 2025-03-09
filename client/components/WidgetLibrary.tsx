import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface Widget {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
  size?: 'small' | 'medium' | 'large';
}

type WidgetLibraryProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widget: Widget) => void;
};

const widgetTypes = [
  { type: "bar", name: "Bar Chart" },
  { type: "line", name: "Line Chart" },
  { type: "pie", name: "Pie Chart" },
  { type: "doughnut", name: "Doughnut Chart" },
  { type: "radar", name: "Radar Chart" },
  { type: "polarArea", name: "Polar Area Chart" },
];

export function WidgetLibrary({
  isOpen,
  onClose,
  onAddWidget,
}: WidgetLibraryProps) {
  const handleAddWidget = (type: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: '',
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Sample Data",
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    };
    onAddWidget(newWidget);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Widget Library</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {widgetTypes.map((widget) => (
            <Button
              key={widget.type}
              onClick={() => handleAddWidget(widget.type)}
            >
              {widget.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
