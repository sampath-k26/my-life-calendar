import { useState } from "react";
import { Maximize2, Music, PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/lib/api";
import type { MediaGalleryItem as MediaGalleryItemType } from "../api/mediaGalleryApi";

interface MediaItemProps {
  item: MediaGalleryItemType;
  onOpenMemory?: (date: string) => void;
}

const MediaItem = ({ item, onOpenMemory }: MediaItemProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const assetUrl = getAssetUrl(item.url);
  const title = item.originalName || item.date;

  if (item.type === "audio") {
    return (
      <div className="rounded-lg border border-border/60 bg-card/80 p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <Music className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            <button
              type="button"
              onClick={() => onOpenMemory?.(item.date)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View memory
            </button>
          </div>
        </div>
        <audio src={assetUrl} controls className="w-full" />
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <div className="group relative overflow-hidden rounded-lg bg-muted">
        <video src={assetUrl} controls className="aspect-square w-full object-cover" />
        <PlayCircle className="pointer-events-none absolute left-2 top-2 h-6 w-6 text-white drop-shadow" />
        <button
          type="button"
          onClick={() => onOpenMemory?.(item.date)}
          className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        >
          View memory
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className="group relative aspect-square overflow-hidden rounded-lg bg-muted text-left"
      >
        <img src={assetUrl} alt={item.originalName || "Memory media"} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
        <Maximize2 className="absolute right-2 top-2 h-4 w-4 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
      </button>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm">
          <div className="relative max-h-full w-full max-w-4xl">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute right-2 top-2 z-10"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </Button>
            <img src={assetUrl} alt={item.originalName || "Memory media"} className="max-h-[80vh] w-full rounded-lg object-contain" />
            <div className="mt-3 flex justify-center">
              <Button type="button" variant="secondary" size="sm" onClick={() => onOpenMemory?.(item.date)}>
                View memory
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaItem;
