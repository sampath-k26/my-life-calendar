import { cn } from "@/lib/utils";
import type { MediaGalleryItem } from "../api/mediaGalleryApi";
import MediaItem from "./MediaItem";

interface MediaGridProps {
  items: MediaGalleryItem[];
  type: MediaGalleryItem["type"];
  onOpenMemory?: (date: string) => void;
}

const MediaGrid = ({ items, type, onOpenMemory }: MediaGridProps) => (
  <div
    className={cn(
      "grid gap-2 sm:gap-3",
      type === "audio"
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    )}
  >
    {items.map((item) => (
      <MediaItem key={`${item.memoryId}-${item.url}`} item={item} onOpenMemory={onOpenMemory} />
    ))}
  </div>
);

export default MediaGrid;
