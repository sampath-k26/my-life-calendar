import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import CalendarView from "./CalendarView";
import DailyMemoryPage from "./DailyMemoryPage";
import OnThisDay from "./OnThisDay";
import TimelineView from "./TimelineView";

type Tab = "calendar" | "timeline" | "onthisday";

interface TabConfig {
  id: Tab;
  label: string;
  icon: ReactNode;
}

const TABS: TabConfig[] = [
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
  { id: "timeline", label: "Timeline", icon: <Clock className="h-5 w-5" /> },
  { id: "onthisday", label: "On This Day", icon: <Sparkles className="h-5 w-5" /> },
];

const tabButtonClassName =
  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors";

const mobileTabButtonClassName = "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition-colors";

const getContentKey = (activeTab: Tab, selectedDate: Date | null) => {
  if (activeTab === "calendar" && selectedDate) {
    return "daily";
  }

  return activeTab;
};

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedDate(null);
  };

  const content = activeTab === "calendar"
    ? selectedDate
      ? <DailyMemoryPage date={selectedDate} onBack={() => setSelectedDate(null)} />
      : <CalendarView onSelectDate={handleSelectDate} selectedDate={selectedDate} />
    : activeTab === "timeline"
      ? <TimelineView />
      : <OnThisDay />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <h1 className="text-lg font-display text-foreground">LifeCalendar</h1>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:block">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="hidden border-b border-border/50 px-4 md:flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              tabButtonClassName,
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-auto pb-20 md:pb-4">
        <div className="mx-auto max-w-2xl p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={getContentKey(activeTab, selectedDate)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-border/50 bg-card/90 px-4 py-2 backdrop-blur-md md:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              mobileTabButtonClassName,
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {tab.icon}
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
