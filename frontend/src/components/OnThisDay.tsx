import { format } from "date-fns";
import { useOnThisDay } from "@/hooks/useMemories";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import LoadingState from "@/components/LoadingState";
import MemoryMediaStrip from "@/components/MemoryMediaStrip";
import { formatMemoryDate } from "@/lib/date";
import { getMoodDisplay } from "@/lib/mood";

const OnThisDay = () => {
  const { data: memories, isLoading } = useOnThisDay();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-display">On This Day</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Memories from {format(new Date(), "MMMM d")} in previous years
      </p>

      {!memories?.length ? (
        <div className="text-center py-12 text-muted-foreground glass rounded-xl">
          <p className="text-sm">No memories from this date in previous years</p>
        </div>
      ) : (
        memories.map((memory, i) => {
          const mood = getMoodDisplay(memory.mood);

          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{mood.emoji}</span>
                <p className="font-medium text-sm">
                  {formatMemoryDate(memory.date, "yyyy")}
                </p>
              </div>
              {memory.textEntry && (
                <p className="text-sm text-muted-foreground">{memory.textEntry}</p>
              )}
              {memory.media && memory.media.length > 0 && (
                <MemoryMediaStrip items={memory.media.filter((item) => item.fileType === "photo")} />
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default OnThisDay;
