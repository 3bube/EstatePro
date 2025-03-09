import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  buyerName: string;
  sellerName: string;
  propertyAddress: string;
  amount: number;
  status: "pending" | "completed" | "disputed" | "cancelled";
  date: string;
};

type TransactionListProps = {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
};

export function TransactionList({
  transactions,
  onTransactionClick,
}: TransactionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Parties</TableHead>
          <TableHead>Property</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow
            key={transaction.id}
            onClick={() => onTransactionClick(transaction)}
            className="cursor-pointer"
          >
            <TableCell>{transaction.id}</TableCell>
            <TableCell>
              <div>{transaction.buyerName}</div>
              <div>{transaction.sellerName}</div>
            </TableCell>
            <TableCell>{transaction.propertyAddress}</TableCell>
            <TableCell>${transaction.amount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge
                variant={
                  transaction.status === "completed"
                    ? "success"
                    : transaction.status === "pending"
                    ? "secondary"
                    : transaction.status === "disputed"
                    ? "destructive"
                    : "outline"
                }
              >
                {transaction.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
