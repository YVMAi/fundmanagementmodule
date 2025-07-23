
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground">
      <Alert className="rounded-none border-0 bg-destructive text-destructive-foreground">
        <WifiOff className="h-4 w-4 flex-shrink-0" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <span className="flex items-center gap-2">
            <strong>You're offline.</strong>
            <span className="hidden sm:inline">Changes will be saved locally. Reconnect to sync.</span>
            <span className="sm:hidden">Changes saved locally.</span>
          </span>
          {isOfflineMode && timeRemaining > 0 && (
            <span className="flex items-center gap-2 text-sm flex-shrink-0">
              <Clock className="h-3 w-3" />
              <span className="whitespace-nowrap">
                Offline editing expires in: {formatTime(timeRemaining)}
              </span>
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
