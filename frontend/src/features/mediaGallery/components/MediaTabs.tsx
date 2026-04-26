import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/LoadingState";
import type { MediaGalleryItem, MediaGalleryType } from "../api/mediaGalleryApi";
import { useMediaGallery } from "../hooks/useMediaGallery";
import MediaSection from "./MediaSection";

const MEDIA_TABS: Array<{ value: MediaGalleryType; label: string }> = [
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audios" },
];

const groupMediaItems = (items: MediaGalleryItem[]) => {
  const monthMap = new Map<string, Map<string, MediaGalleryItem[]>>();

  for (const item of items) {
    const monthKey = item.date.slice(0, 7);
    const dayMap = monthMap.get(monthKey) || new Map<string, MediaGalleryItem[]>();
    const dayItems = dayMap.get(item.date) || [];

    dayItems.push(item);
    dayMap.set(item.date, dayItems);
    monthMap.set(monthKey, dayMap);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, dayMap]) => ({
      month,
      days: Array.from(dayMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, dayItems]) => ({ date, items: dayItems })),
    }));
};

interface MediaTabsProps {
  onOpenMemory?: (date: string) => void;
}

const MediaTabs = ({ onOpenMemory }: MediaTabsProps) => {
  const [activeType, setActiveType] = useState<MediaGalleryType>("photo");
  const { data: items = [], isLoading } = useMediaGallery(activeType);
  const groups = useMemo(() => groupMediaItems(items), [items]);
  const activeLabel = MEDIA_TABS.find((tab) => tab.value === activeType)?.label || "media";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display">My Media</h2>
          <p className="text-sm text-muted-foreground">Browse everything you have uploaded.</p>
        </div>
      </div>

      <Tabs value={activeType} onValueChange={(value) => setActiveType(value as MediaGalleryType)}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          {MEDIA_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingState />
      ) : groups.length ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <MediaSection key={group.month} group={group} type={activeType} onOpenMemory={onOpenMemory} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border/60 bg-card/80 py-12 text-center text-sm text-muted-foreground">
          No {activeLabel.toLowerCase()} yet
        </div>
      )}
    </div>
  );
};

export default MediaTabs;
