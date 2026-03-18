import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest } from "@/lib/api";
import { useAuth } from "./useAuth";

export interface MediaItem {
  id: string;
  fileUrl: string;
  fileType: string;
  originalName: string;
  createdAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  date: string;
  textEntry: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
  media: MediaItem[];
}

export const useMemoriesForMonth = (year: number, month: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["memories", "month", year, month],
    queryFn: () =>
      apiRequest<Array<Pick<Memory, "id" | "date" | "mood">>>(`/api/memories/month?year=${year}&month=${month}`),
    enabled: !!user,
  });
};

export const useMemoryForDate = (date: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["memory", date],
    queryFn: () => apiRequest<Memory | null>(`/api/memories/${date}`),
    enabled: !!user && !!date,
  });
};

export const useSaveMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, textEntry, mood }: { date: string; textEntry?: string; mood?: string }) =>
      apiRequest<Memory>(`/api/memories/${date}`, {
        method: "PUT",
        body: JSON.stringify({ textEntry, mood }),
      }),
    onSuccess: (memory) => {
      queryClient.invalidateQueries({ queryKey: ["memory", memory.date] });
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memoryId, file, fileType }: { memoryId: string; file: File; fileType: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      return apiRequest<MediaItem>(`/api/memories/${memoryId}/media`, {
        method: "POST",
        body: formData,
        isFormData: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memory"] });
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memoryId, mediaId }: { memoryId: string; mediaId: string }) =>
      apiRequest<{ success: boolean }>(`/api/memories/${memoryId}/media/${mediaId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memory"] });
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
};

export const useAllMemories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["memories", "all"],
    queryFn: () => apiRequest<Memory[]>("/api/memories"),
    enabled: !!user,
  });
};

export const useOnThisDay = () => {
  const { user } = useAuth();
  const today = format(new Date(), "MM-dd");

  return useQuery({
    queryKey: ["memories", "onThisDay", today],
    queryFn: () => apiRequest<Memory[]>("/api/memories/on-this-day"),
    enabled: !!user,
  });
};
