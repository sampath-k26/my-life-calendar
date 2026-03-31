import { format } from "date-fns";

export const formatMemoryDate = (date: string, pattern: string) =>
  format(new Date(`${date}T00:00:00`), pattern);
