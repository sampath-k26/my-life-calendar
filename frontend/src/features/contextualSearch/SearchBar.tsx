import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useContextualSearch } from "./useContextualSearch";
import SearchOverlay from "./SearchOverlay";

interface SearchBarProps {
  autoFocus?: boolean;
  className?: string;
  mode?: "desktop" | "mobile";
  onSelectResult: (date: string) => void;
}

const SearchBar = ({
  autoFocus = false,
  className,
  mode = "desktop",
  onSelectResult,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { data: results, isFetching } = useContextualSearch(query);

  const handleSelectResult = (date: string) => {
    onSelectResult(date);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div
      className={cn(
        "relative",
        mode === "desktop" ? "block w-full" : "block w-full",
        className
      )}
    >
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search memories"
        className="h-9 bg-secondary/50 pl-8 text-sm"
      />
      <SearchOverlay
        className={cn(
          mode === "mobile" && "left-0 right-auto mt-3 max-h-[calc(100vh-8rem)] w-full"
        )}
        isLoading={isFetching}
        isVisible={isFocused}
        query={query}
        results={results}
        onSelectResult={handleSelectResult}
      />
    </div>
  );
};

export default SearchBar;
