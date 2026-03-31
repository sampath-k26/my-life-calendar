import { getAssetUrl } from "@/lib/api";

interface MediaItem {
  id: string;
  fileType: string;
  fileUrl: string;
}

interface MemoryMediaStripProps {
  items: MediaItem[];
  compact?: boolean;
}

const MemoryMediaStrip = ({ items, compact = false }: MemoryMediaStripProps) => {
  const visibleItems = compact ? items.slice(0, 4) : items;
  const tileClassName = compact ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {visibleItems.map((item) => (
        <div
          key={item.id}
          className={`${tileClassName} flex-shrink-0 overflow-hidden rounded-md bg-muted`}
        >
          {item.fileType === "photo" && (
            <img src={getAssetUrl(item.fileUrl)} alt="" className="h-full w-full object-cover" />
          )}
          {item.fileType === "video" && (
            <video src={getAssetUrl(item.fileUrl)} className="h-full w-full object-cover" />
          )}
          {item.fileType === "audio" && (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">🎵</div>
          )}
        </div>
      ))}

      {compact && items.length > visibleItems.length && (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
          +{items.length - visibleItems.length}
        </div>
      )}
    </div>
  );
};

export default MemoryMediaStrip;
