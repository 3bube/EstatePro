import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: "low" | "medium" | "high";
  timestamp: string;
  read: boolean;
  actions?: { label: string; action: string }[];
};

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card className={notification.read ? "bg-gray-50" : "bg-white"}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{notification.title}</h3>
            <p className="text-gray-600">{notification.message}</p>
          </div>
          <Badge className={priorityColors[notification.priority]}>
            {notification.priority}
          </Badge>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {formatDistanceToNow(new Date(notification.timestamp), {
            addSuffix: true,
          })}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-2 flex justify-between">
        <div className="space-x-2">
          {notification.actions?.map((action, index) => (
            <Button key={index} variant="outline" size="sm">
              {action.label}
            </Button>
          ))}
        </div>
        <div className="space-x-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as Read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
