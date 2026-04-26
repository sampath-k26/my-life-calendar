import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "../SearchBar";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (date: string) => void;
}

const MobileSearchOverlay = ({ isOpen, onClose, onSelectResult }: MobileSearchOverlayProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] bg-background md:hidden">
      <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
        <SearchBar autoFocus className="flex-1" mode="mobile" onSelectResult={onSelectResult} />
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close search">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MobileSearchOverlay;
