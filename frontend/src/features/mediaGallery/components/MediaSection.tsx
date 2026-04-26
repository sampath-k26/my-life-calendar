import { formatMemoryDate } from "@/lib/date";
import type { MediaGalleryItem } from "../api/mediaGalleryApi";
import MediaGrid from "./MediaGrid";

interface DayGroup {
  date: string;
  items: MediaGalleryItem[];
}

interface MonthGroup {
  month: string;
  days: DayGroup[];
}

interface MediaSectionProps {
  group: MonthGroup;
  type: MediaGalleryItem["type"];
  onOpenMemory?: (date: string) => void;
}

const MediaSection = ({ group, type, onOpenMemory }: MediaSectionProps) => (
  <section className="space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {formatMemoryDate(`${group.month}-01`, "MMMM yyyy")}
    </h3>

    {group.days.map((day) => (
      <div key={day.date} className="space-y-2">
        <h4 className="text-sm font-medium">{formatMemoryDate(day.date, "d MMMM")}</h4>
        <MediaGrid items={day.items} type={type} onOpenMemory={onOpenMemory} />
      </div>
    ))}
  </section>
);

export default MediaSection;
