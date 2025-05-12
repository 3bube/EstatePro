"use client";

import { useState, useEffect, useCallback } from "react";
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
import { getAdminProperties } from "@/api/admin.api";
import {
  Search,
  Filter,
  Edit,
  MoreVertical,
  Home,
  Eye,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  type: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
  };
  images: string[];
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PropertiesManagementPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminProperties(page, limit, {
        status: statusFilter !== "all" ? statusFilter : "",
        type: typeFilter !== "all" ? typeFilter : "",
        search: searchQuery,
      });

      setProperties(response.data.properties);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleViewPropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
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
    // fetchProperties will be called by the useEffect
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Property Management</h1>
        {/* <Button>
          <Home className="h-4 w-4 mr-2" />
          Add Property
        </Button> */}
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
              placeholder="Search properties..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
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
              <TableHead>Property</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Listed Date</TableHead>
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
                      <Skeleton className="h-6 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[50px]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                        {property.images && property.images.length > 0 ? (
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <Home className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <span className="font-medium truncate max-w-[150px]">
                        {property.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {property.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(property.status)}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {property.address.city}, {property.address.state}
                  </TableCell>
                  <TableCell>
                    {property.owner.firstName} {property.owner.lastName}
                  </TableCell>
                  <TableCell>
                    {new Date(property.createdAt).toLocaleDateString()}
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
                          onClick={() => handleViewPropertyDetails(property)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem>Set Active</DropdownMenuItem>
                        <DropdownMenuItem>Set Pending</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No properties found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {properties.length} of {total} properties
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

      <Dialog open={showPropertyDetails} onOpenChange={setShowPropertyDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected property.
            </DialogDescription>
          </DialogHeader>

          {selectedProperty ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                    {selectedProperty.images &&
                    selectedProperty.images.length > 0 ? (
                      <Image
                        src={selectedProperty.images[0]}
                        alt={selectedProperty.title}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {selectedProperty.images &&
                    selectedProperty.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {selectedProperty.images
                          .slice(1, 5)
                          .map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-200 rounded-md overflow-hidden"
                            >
                              <Image
                                src={image}
                                alt={`${selectedProperty.title} - ${index + 2}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                </div>

                <div className="md:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-gray-500">
                      {selectedProperty.address.street},{" "}
                      {selectedProperty.address.city},{" "}
                      {selectedProperty.address.state}{" "}
                      {selectedProperty.address.zipCode}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        className={getStatusBadgeColor(selectedProperty.status)}
                      >
                        {selectedProperty.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {selectedProperty.type}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Price</h4>
                    <p className="text-2xl font-bold">
                      {formatPrice(selectedProperty.price)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Bedrooms</h4>
                      <p>{selectedProperty.features.bedrooms}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Bathrooms</h4>
                      <p>{selectedProperty.features.bathrooms}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Area</h4>
                      <p>{selectedProperty.features.area} sq ft</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Year Built</h4>
                      <p>{selectedProperty.features.yearBuilt}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Owner</h4>
                    <p>
                      {selectedProperty.owner.firstName}{" "}
                      {selectedProperty.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedProperty.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{selectedProperty.description}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Property
                </Button>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Property
                </Button>
              </div>
            </div>
          ) : (
            <p>No property selected</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
