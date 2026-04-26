import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  getDaysInMonth,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemoriesForMonth } from "@/hooks/useMemories";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMoodCalendarClass } from "@/lib/mood";

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MIN_DATE = new Date(1900, 0, 1);

const CalendarView = ({ onSelectDate, selectedDate }: CalendarViewProps) => {
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [draftYear, setDraftYear] = useState(today.getFullYear());
  const [draftMonth, setDraftMonth] = useState(today.getMonth());
  const [draftDay, setDraftDay] = useState(today.getDate());
  const { data: memories } = useMemoriesForMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let year = today.getFullYear(); year >= 1900; year -= 1) {
      years.push(year);
    }
    return years;
  }, [today]);

  const memoryMap = useMemo(() => {
    const map = new Map<string, string>();
    memories?.forEach((m) => map.set(m.date, m.mood || ""));
    return map;
  }, [memories]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days = useMemo(() => {
    const calendarDays: Date[] = [];
    let day = calStart;

    while (day <= calEnd) {
      calendarDays.push(day);
      day = addDays(day, 1);
    }

    return calendarDays;
  }, [calEnd, calStart]);

  const isAtMinMonth =
    currentMonth.getFullYear() === MIN_DATE.getFullYear() && currentMonth.getMonth() === MIN_DATE.getMonth();
  const isAtMaxMonth = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

  const getMaxDayForMonth = (year: number, month: number) => {
    if (year === today.getFullYear() && month === today.getMonth()) {
      return today.getDate();
    }

    return getDaysInMonth(new Date(year, month, 1));
  };

  const syncDraftState = (year: number, month: number, dayValue: number) => {
    const maxDay = getMaxDayForMonth(year, month);
    const safeDay = Math.max(1, Math.min(dayValue, maxDay));
    const nextDate = new Date(year, month, safeDay);

    setDraftYear(year);
    setDraftMonth(month);
    setDraftDay(safeDay);
    setCurrentMonth(startOfMonth(nextDate));

    return nextDate;
  };

  const handlePickerDraftChange = (year: number, month: number, dayValue: number) => {
    syncDraftState(year, month, dayValue);
  };

  const handleSetPickerDate = () => {
    onSelectDate(new Date(draftYear, draftMonth, draftDay));
  };

  const handleMonthNavigation = (nextMonthDate: Date) => {
    if (isBefore(nextMonthDate, startOfMonth(MIN_DATE)) || isAfter(nextMonthDate, startOfMonth(today))) {
      return;
    }

    syncDraftState(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), draftDay);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleMonthNavigation(subMonths(currentMonth, 1))}
          disabled={isAtMinMonth}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-display text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleMonthNavigation(addMonths(currentMonth, 1))}
          disabled={isAtMaxMonth}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-4">
        <Select
          value={String(draftDay)}
          onValueChange={(value) => handlePickerDraftChange(draftYear, draftMonth, Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: getMaxDayForMonth(draftYear, draftMonth) }, (_, index) => index + 1).map(
              (dayValue) => (
                <SelectItem key={dayValue} value={String(dayValue)}>
                  {dayValue}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        <Select
          value={String(draftMonth)}
          onValueChange={(value) => {
            const nextMonth = Number(value);
            const adjustedMonth =
              draftYear === today.getFullYear() && nextMonth > today.getMonth() ? today.getMonth() : nextMonth;
            handlePickerDraftChange(draftYear, adjustedMonth, draftDay);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((monthLabel, index) => {
              const isDisabled = draftYear === today.getFullYear() && index > today.getMonth();
              return (
                <SelectItem key={monthLabel} value={String(index)} disabled={isDisabled}>
                  {monthLabel}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select
          value={String(draftYear)}
          onValueChange={(value) => {
            const nextYear = Number(value);
            const adjustedMonth =
              nextYear === today.getFullYear() && draftMonth > today.getMonth() ? today.getMonth() : draftMonth;
            handlePickerDraftChange(nextYear, adjustedMonth, draftDay);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="w-full" onClick={handleSetPickerDate}>
          Set Date
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const dateStr = format(d, "yyyy-MM-dd");
          const mood = memoryMap.get(dateStr);
          const moodColorClass = getMoodCalendarClass(mood);
          const hasMemory = memoryMap.has(dateStr);
          const isCurrentMonth = isSameMonth(d, currentMonth);
          const isSelected = selectedDate && isSameDay(d, selectedDate);
          const isToday = isSameDay(d, today);
          const isFutureDate = isAfter(startOfDay(d), today);
          const isBeforeMinimumDate = isBefore(startOfDay(d), MIN_DATE);
          const isDisabled = isFutureDate || isBeforeMinimumDate;

          return (
            <motion.button
              key={dateStr}
              whileTap={isDisabled ? undefined : { scale: 0.95 }}
              onClick={() => {
                if (!isDisabled) {
                  onSelectDate(d);
                }
              }}
              disabled={isDisabled}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all",
                !isCurrentMonth && "opacity-30",
                isCurrentMonth && !isDisabled && "hover:bg-secondary",
                isDisabled && "cursor-not-allowed opacity-25",
                isSelected && "ring-2 ring-primary bg-primary/10",
                isToday && !isSelected && "font-bold text-primary",
                hasMemory && moodColorClass,
                hasMemory && !moodColorClass && "bg-primary/10"
              )}
            >
              <span>{format(d, "d")}</span>
              {hasMemory && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
