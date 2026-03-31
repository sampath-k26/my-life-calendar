import { useAllMemories } from "@/hooks/useMemories";
import { motion } from "framer-motion";
import LoadingState from "@/components/LoadingState";
import MemoryMediaStrip from "@/components/MemoryMediaStrip";
import { formatMemoryDate } from "@/lib/date";

const TimelineView = () => {
  const { data: memories, isLoading } = useAllMemories();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!memories?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-display">No memories yet</p>
        <p className="text-sm mt-1">Start by adding a memory to any date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display mb-4">Your Timeline</h2>
      {memories.map((memory, i) => (
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{memory.mood || "📝"}</span>
            <div>
              <p className="font-medium text-sm">{formatMemoryDate(memory.date, "EEEE, MMMM d, yyyy")}</p>
            </div>
          </div>
          {memory.textEntry && (
            <p className="text-sm text-muted-foreground line-clamp-3">{memory.textEntry}</p>
          )}
          {memory.media && memory.media.length > 0 && (
            <MemoryMediaStrip items={memory.media} compact />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TimelineView;
