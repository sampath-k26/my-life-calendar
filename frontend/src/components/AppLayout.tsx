import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Edit3, Images, LogOut, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import CalendarView from "./CalendarView";
import DailyMemoryPage from "./DailyMemoryPage";
import OnThisDay from "./OnThisDay";
import TimelineView from "./TimelineView";
import SearchBar from "@/features/contextualSearch/SearchBar";
import MediaTabs from "@/features/mediaGallery/components/MediaTabs";
import MobileSearchOverlay from "@/features/contextualSearch/components/SearchOverlay";

type Tab = "today" | "calendar" | "timeline" | "onthisday" | "media";

interface TabConfig {
  id: Tab;
  label: string;
  icon: ReactNode;
}

const DESKTOP_TABS: TabConfig[] = [
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
  { id: "timeline", label: "Timeline", icon: <Clock className="h-5 w-5" /> },
  { id: "onthisday", label: "On This Day", icon: <Sparkles className="h-5 w-5" /> },
  { id: "media", label: "My Media", icon: <Images className="h-5 w-5" /> },
];

const MOBILE_TABS: TabConfig[] = [
  { id: "today", label: "Today", icon: <Edit3 className="h-5 w-5" /> },
  { id: "timeline", label: "Timeline", icon: <Clock className="h-5 w-5" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
  { id: "onthisday", label: "On This Day", icon: <Sparkles className="h-5 w-5" /> },
  { id: "media", label: "Media", icon: <Images className="h-5 w-5" /> },
];

const tabButtonClassName =
  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors";

const mobileTabButtonClassName = "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition-colors";
const mobileCalendarTabClassName = "scale-110 text-primary";
const mobileCalendarIconWrapClassName = "rounded-full bg-primary/10 p-2";

const todayDate = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
};

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [selectedDate, setSelectedDate] = useState<Date>(() => todayDate());
  const [isMobileCalendarPickerOpen, setIsMobileCalendarPickerOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);

    if (isMobile) {
      setActiveTab("calendar");
      setIsMobileCalendarPickerOpen(false);
    }
  };

  const handleSelectSearchResult = (date: string) => {
    setSelectedDate(new Date(`${date}T00:00:00`));
    setActiveTab("calendar");
    setIsMobileCalendarPickerOpen(false);
    setIsSearchOpen(false);
  };

  const handleOpenMemoryDate = (date: string) => {
    setSelectedDate(new Date(`${date}T00:00:00`));
    setActiveTab("calendar");
    setIsMobileCalendarPickerOpen(false);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsSearchOpen(false);

    if (tab === "today") {
      setSelectedDate(todayDate());
      setIsMobileCalendarPickerOpen(false);
    }

    if (tab === "calendar") {
      setIsMobileCalendarPickerOpen(true);
    }
  };

  const mobileContent = activeTab === "today"
    ? (
      <div className="space-y-4">
        <Button
          variant="secondary"
          className="w-full justify-center"
          onClick={() => {
            setActiveTab("calendar");
            setIsMobileCalendarPickerOpen(true);
          }}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Choose Another Date
        </Button>
        <DailyMemoryPage date={selectedDate} />
      </div>
    )
    : activeTab === "calendar"
      ? isMobileCalendarPickerOpen
        ? <CalendarView onSelectDate={handleSelectDate} selectedDate={selectedDate} />
        : <DailyMemoryPage date={selectedDate} onBack={() => setIsMobileCalendarPickerOpen(true)} />
      : activeTab === "timeline"
        ? <TimelineView />
        : activeTab === "onthisday"
          ? <OnThisDay />
          : <MediaTabs onOpenMemory={handleOpenMemoryDate} />;

  const desktopContent = activeTab === "timeline"
    ? <TimelineView />
    : activeTab === "onthisday"
      ? <OnThisDay />
      : activeTab === "media"
        ? <MediaTabs onOpenMemory={handleOpenMemoryDate} />
      : (
        <div className="grid gap-6 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.5fr)]">
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <CalendarView onSelectDate={handleSelectDate} selectedDate={selectedDate} />
          </aside>
          <section className="min-w-0">
            <DailyMemoryPage date={selectedDate} />
          </section>
        </div>
      );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between gap-2 border-b border-border/50 px-4 py-3">
        <h1 className="shrink-0 text-lg font-display text-foreground">LifeCalendar</h1>
        <div className="hidden min-w-0 flex-1 sm:flex sm:max-w-md">
          <SearchBar onSelectResult={handleSelectSearchResult} />
        </div>
        <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
          <span className="hidden max-w-[120px] truncate text-xs text-muted-foreground md:block">
            {user?.email}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex h-8 w-8 rounded-full sm:hidden"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="hidden border-b border-border/50 px-4 md:flex">
        {DESKTOP_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              tabButtonClassName,
              (activeTab === tab.id || (activeTab === "today" && tab.id === "calendar"))
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
        <div className="mx-auto max-w-2xl p-4 md:max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="md:hidden">{mobileContent}</div>
              <div className="hidden md:block">{desktopContent}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-border/50 bg-card/90 px-4 py-2 backdrop-blur-md md:hidden">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              mobileTabButtonClassName,
              tab.id === "calendar" && mobileCalendarTabClassName,
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <span className={cn(tab.id === "calendar" && mobileCalendarIconWrapClassName)}>
              {tab.icon}
            </span>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
