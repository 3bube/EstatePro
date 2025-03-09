import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  status: "active" | "inactive" | "suspended";
  role: string;
  registrationDate: string;
  lastActiveDate: string;
};

type UserListProps = {
  users: User[];
  onUserClick: (user: User) => void;
};

export function UserList({ users, onUserClick }: UserListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead>Last Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            onClick={() => onUserClick(user)}
            className="cursor-pointer"
          >
            <TableCell className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  user.status === "active"
                    ? "success"
                    : user.status === "inactive"
                    ? "secondary"
                    : "destructive"
                }
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              {new Date(user.registrationDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(user.lastActiveDate).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
