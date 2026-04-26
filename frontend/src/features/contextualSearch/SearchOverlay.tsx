import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { formatMemoryDate } from "@/lib/date";
import { getMoodDisplay } from "@/lib/mood";
import type { ContextualSearchResult } from "./contextualSearchApi";

interface SearchOverlayProps {
  className?: string;
  isLoading: boolean;
  isVisible: boolean;
  query: string;
  results?: ContextualSearchResult[];
  onSelectResult: (date: string) => void;
}

const SearchOverlay = ({
  className,
  isLoading,
  isVisible,
  query,
  results,
  onSelectResult,
}: SearchOverlayProps) => {
  if (!isVisible || query.trim().length < 2) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border/70 bg-popover shadow-lg",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching
        </div>
      ) : results?.length ? (
        <div className="max-h-80 overflow-auto py-1">
          {results.map((result) => {
            const mood = getMoodDisplay(result.mood);

            return (
              <button
                key={result.memoryId}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelectResult(result.date)}
                className="block w-full px-3 py-2 text-left transition-colors hover:bg-secondary"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{mood.emoji}</span>
                  <span className="text-sm font-medium">{formatMemoryDate(result.date, "MMM d, yyyy")}</span>
                </div>
                {result.textEntry && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{result.textEntry}</p>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-4 text-sm text-muted-foreground">No matching memories</div>
      )}
    </div>
  );
};

export default SearchOverlay;
