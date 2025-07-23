
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff, Clock } from "lucide-react";

interface OfflineBannerProps {
  isOnline: boolean;
  isOfflineMode: boolean;
  timeRemaining: number;
  formatTime: (ms: number) => string;
}

export const OfflineBanner = ({ 
  isOnline, 
  isOfflineMode, 
  timeRemaining, 
  formatTime 
}: OfflineBannerProps) => {
  if (isOnline && !isOfflineMode) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-auto">
      <Alert className="bg-destructive text-destructive-foreground border-destructive shadow-lg">
        <WifiOff className="h-4 w-4 flex-shrink-0" />
        <AlertDescription className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            <strong>You're offline.</strong>
            <span className="text-sm">Changes saved locally.</span>
          </span>
          {isOfflineMode && timeRemaining > 0 && (
            <span className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3" />
              <span className="whitespace-nowrap">
                Expires in: {formatTime(timeRemaining)}
              </span>
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
