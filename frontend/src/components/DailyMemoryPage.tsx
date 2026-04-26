import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ArrowLeft, Image, Video, Mic, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getAssetUrl } from "@/lib/api";
import { getMoodDisplay } from "@/lib/mood";
import { useDeleteMedia, useMemoryForDate, useSaveMemory, useUploadMedia } from "@/hooks/useMemories";
import LoadingState from "./LoadingState";

interface DailyMemoryPageProps {
  date: Date;
  onBack?: () => void;
}

const getUploadType = (file: File) => {
  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  return "photo";
};

const DailyMemoryPage = ({ date, onBack }: DailyMemoryPageProps) => {
  const dateStr = format(date, "yyyy-MM-dd");
  const { data: memory, isLoading } = useMemoryForDate(dateStr);
  const saveMemory = useSaveMemory();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detectedMood = getMoodDisplay(memory?.mood);

  useEffect(() => {
    if (memory) {
      setText(memory.textEntry || "");
    } else {
      setText("");
    }
  }, [memory]);

  const handleSave = async () => {
    try {
      await saveMemory.mutateAsync({ date: dateStr, textEntry: text });
      toast.success("Memory saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  const openFilePicker = (accept: string) => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.accept = accept;
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    // Ensure memory exists first
    let memoryId = memory?.id;
    if (!memoryId) {
      const saved = await saveMemory.mutateAsync({ date: dateStr, textEntry: text });
      memoryId = saved.id;
    }

    for (const file of Array.from(files)) {
      const fileType = getUploadType(file);

      try {
        await uploadMedia.mutateAsync({ memoryId, file, fileType });
        toast.success(`${fileType} uploaded`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!memory?.id) return;

    try {
      await deleteMedia.mutateAsync({ memoryId: memory.id, mediaId });
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h2 className="text-xl font-display">{format(date, "EEEE")}</h2>
          <p className="text-sm text-muted-foreground">{format(date, "MMMM d, yyyy")}</p>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What happened today? How did you feel?"
        className="min-h-[150px] resize-none bg-secondary/50 border-border/50 focus:bg-card"
      />

      {memory?.mood && (
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
          <span>{detectedMood.emoji}</span>
          <span>Detected mood: {detectedMood.label}</span>
        </div>
      )}

      {memory?.media && memory.media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {memory.media.map((m) => (
            <div key={m.id} className="relative group rounded-lg overflow-hidden bg-muted aspect-square">
              {m.fileType === "photo" && (
                <img src={getAssetUrl(m.fileUrl)} alt="" className="w-full h-full object-cover" />
              )}
              {m.fileType === "video" && (
                <video src={getAssetUrl(m.fileUrl)} controls className="w-full h-full object-cover" />
              )}
              {m.fileType === "audio" && (
                <div className="flex items-center justify-center h-full p-3">
                  <audio src={getAssetUrl(m.fileUrl)} controls className="w-full" />
                </div>
              )}
              <button
                onClick={() => handleDeleteMedia(m.id)}
                className="absolute top-1 right-1 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button variant="secondary" size="sm" onClick={() => openFilePicker("image/*")}>
          <Image className="h-4 w-4 mr-1" /> Photo
        </Button>
        <Button variant="secondary" size="sm" onClick={() => openFilePicker("video/*")}>
          <Video className="h-4 w-4 mr-1" /> Video
        </Button>
        <Button variant="secondary" size="sm" onClick={() => openFilePicker("audio/*")}>
          <Mic className="h-4 w-4 mr-1" /> Audio
        </Button>
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={saveMemory.isPending} size="sm">
          {saveMemory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          Save
        </Button>
      </div>
    </motion.div>
  );
};

export default DailyMemoryPage;
