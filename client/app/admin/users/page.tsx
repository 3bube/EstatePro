"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  getAdminUserDetails,
} from "@/api/admin.api";
import { Search, Filter, Edit, MoreVertical, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface Property {
  id: string;
  title: string;
  status: string;
  type: string;
  price: number;
  createdAt: string;
  address: string;
}

interface Activity {
  action: string;
  timestamp: string;
  details: string;
}

interface UserDetails extends User {
  phoneNumber?: string;
  properties?: Property[];
  activity?: Activity[];
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers(page, limit, {
        status: statusFilter !== "all" ? statusFilter : "",
        role: roleFilter !== "all" ? roleFilter : "",
        search: searchQuery,
      });

      setUsers(response.data.users);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setUserDetailsLoading(true);
      const response = await getAdminUserDetails(userId);
      setSelectedUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details. Please try again later.");
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleViewUserDetails = (userId: string) => {
    fetchUserDetails(userId);
    setShowUserDetails(true);
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      await updateUserStatus(userId, status);
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status. Please try again later.");
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role);
      // Refresh the users list
      fetchUsers();
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again later.");
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setPage(1);
    // fetchUsers will be called by the useEffect
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setRoleFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const getStatusBadgeColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleClearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(limit)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[50px]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </span>
                        )}
                      </div>
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusBadgeColor(user.isVerified)}`}
                    >
                      {user.isVerified ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewUserDetails(user._id)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserStatus(user._id, "active")
                          }
                        >
                          Set Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserStatus(user._id, "inactive")
                          }
                        >
                          Set Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserStatus(user._id, "suspended")
                          }
                        >
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserRole(user._id, "buyer")
                          }
                        >
                          Set as Buyer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserRole(user._id, "seller")
                          }
                        >
                          Set as Seller
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserRole(user._id, "agent")
                          }
                        >
                          Set as Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUserRole(user._id, "admin")
                          }
                        >
                          Set as Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {users.length} of {total} users
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>

          {userDetailsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedUser.profileImage ? (
                    <Image
                      src={selectedUser.profileImage}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      className={`${getStatusBadgeColor(
                        selectedUser.isVerified
                      )}`}
                    >
                      {selectedUser.isVerified ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Information</h4>
                  <p>
                    <span className="text-gray-500">Email:</span>{" "}
                    {selectedUser.email}
                  </p>
                  <p>
                    <span className="text-gray-500">Phone:</span>{" "}
                    {selectedUser.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Account Information</h4>
                  <p>
                    <span className="text-gray-500">Registered:</span>{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-gray-500">Last Active:</span>
                    {selectedUser.lastLogin
                      ? new Date(selectedUser.lastLogin).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Properties</h4>
                {selectedUser.properties &&
                selectedUser.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedUser.properties.map((property, index) => (
                      <div key={index} className="p-2 border rounded">
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-gray-500">
                          {property.address}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No properties found</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Activity</h4>
                {selectedUser.activity && selectedUser.activity.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.activity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border-b"
                      >
                        <span>{activity.action}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent activity</p>
                )}
              </div>
            </div>
          ) : (
            <p>No user selected</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
