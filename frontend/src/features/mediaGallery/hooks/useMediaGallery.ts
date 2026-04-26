import { useQuery } from "@tanstack/react-query";
import { fetchMediaGallery, type MediaGalleryType } from "../api/mediaGalleryApi";
import { useAuth } from "@/hooks/useAuth";

export const useMediaGallery = (type: MediaGalleryType) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["media-gallery", type],
    queryFn: () => fetchMediaGallery(type),
    enabled: !!user,
  });
};
