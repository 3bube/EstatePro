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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { getAdminTransactions } from "@/api/admin.api";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addDays, format } from "date-fns";
import type { DateRange as DayPickerDateRange } from "react-day-picker";

interface Transaction {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    images: string[];
  };
  buyerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sellerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  status: string;
  transactionType: string;
  date: string;
  details: {
    paymentMethod: string;
    notes: string;
  };
}

export default function TransactionManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<DayPickerDateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      // Format date range for API
      const dateRangeParam =
        dateRange.from && dateRange.to
          ? `${format(dateRange.from, "yyyy-MM-dd")},${format(
              dateRange.to,
              "yyyy-MM-dd"
            )}`
          : undefined;

      const response = await getAdminTransactions(page, limit, {
        status: statusFilter !== "all" ? statusFilter : "",
        dateRange: dateRangeParam,
      });

      setTransactions(response.data.transactions);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, dateRange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
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
    // Apply search filter
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
    setPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "disputed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = () => {
    const csv = [
      [
        "Transaction ID",
        "Property",
        "Buyer",
        "Seller",
        "Amount",
        "Status",
        "Type",
        "Date",
      ],
      ...transactions.map((t) => [
        t._id,
        t.propertyId.title,
        `${t.buyerId.firstName} ${t.buyerId.lastName}`,
        `${t.sellerId.firstName} ${t.sellerId.lastName}`,
        t.amount.toString(),
        t.status,
        t.transactionType,
        new Date(t.date).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
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
              placeholder="Search transactions..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange
            date={dateRange}
            setDate={(date) =>
              setDateRange(date || { from: undefined, to: undefined })
            }
          />

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
              <TableHead>Transaction ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
                      <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[120px]" />
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
                      <Skeleton className="h-6 w-[50px]" />
                    </TableCell>
                  </TableRow>
                ))
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    {transaction._id?.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-[150px]">
                      {transaction.propertyId.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.buyerId.firstName}{" "}
                    {transaction.buyerId.lastName}
                  </TableCell>
                  <TableCell>
                    {transaction.sellerId.firstName}{" "}
                    {transaction.sellerId.lastName}
                  </TableCell>
                  <TableCell>{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(transaction.status)}
                      <Badge
                        className={getStatusBadgeColor(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
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
                          onClick={() =>
                            handleViewTransactionDetails(transaction)
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Disputed</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Cancelled</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {transactions.length} of {total} transactions
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

      <Dialog
        open={showTransactionDetails}
        onOpenChange={setShowTransactionDetails}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected transaction.
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">
                    Transaction #{selectedTransaction._id?.substring(0, 8)}
                  </h3>
                  <p className="text-gray-500">
                    {new Date(selectedTransaction.date).toLocaleString()}
                  </p>
                </div>
                <Badge
                  className={getStatusBadgeColor(selectedTransaction.status)}
                >
                  {selectedTransaction.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Property</h4>
                    <p>{selectedTransaction.propertyId.title}</p>
                    <p className="text-sm text-gray-500">
                      {selectedTransaction.propertyId.address.street},{" "}
                      {selectedTransaction.propertyId.address.city},{" "}
                      {selectedTransaction.propertyId.address.state}{" "}
                      {selectedTransaction.propertyId.address.zipCode}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Amount</h4>
                    <p className="text-2xl font-bold">
                      {formatAmount(selectedTransaction.amount)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Transaction Type</h4>
                    <p className="capitalize">
                      {selectedTransaction.transactionType}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Buyer</h4>
                    <p>
                      {selectedTransaction.buyerId.firstName}{" "}
                      {selectedTransaction.buyerId.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedTransaction.buyerId.email}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Seller</h4>
                    <p>
                      {selectedTransaction.sellerId.firstName}{" "}
                      {selectedTransaction.sellerId.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedTransaction.sellerId.email}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Payment Method</h4>
                    <p>
                      {selectedTransaction.details.paymentMethod ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedTransaction.details.notes && (
                <div>
                  <h4 className="font-semibold">Notes</h4>
                  <p className="text-gray-700">
                    {selectedTransaction.details.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline">Print Receipt</Button>
                <Button>Update Status</Button>
              </div>
            </div>
          ) : (
            <p>No transaction selected</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
