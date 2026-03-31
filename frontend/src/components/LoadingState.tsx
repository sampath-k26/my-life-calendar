import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  className?: string;
}

const LoadingState = ({ className = "flex h-64 items-center justify-center" }: LoadingStateProps) => (
  <div className={className}>
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

export default LoadingState;
