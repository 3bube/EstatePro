import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReviewFiltersProps = {
  onFilterChange: (value: string) => void;
};

export function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  return (
    <Select onValueChange={onFilterChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter reviews" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="highest">Highest Rated</SelectItem>
        <SelectItem value="lowest">Lowest Rated</SelectItem>
      </SelectContent>
    </Select>
  );
}
