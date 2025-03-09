import { NotificationItem } from "./NotificationItem";

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

type NotificationListProps = {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <p className="text-center text-gray-500 my-4">
        No notifications to display.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
