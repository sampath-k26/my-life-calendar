import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { contextualSearchApi } from "./contextualSearchApi";

const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
};

export const useContextualSearch = (query: string) => {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  return useQuery({
    queryKey: ["contextualSearch", debouncedQuery],
    queryFn: () => contextualSearchApi(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
};
