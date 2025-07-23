
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
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <span className="flex items-center gap-2">
            <strong>You're offline.</strong>
            Changes will be saved locally. Reconnect to sync.
          </span>
          {isOfflineMode && timeRemaining > 0 && (
            <span className="flex items-center gap-2 text-sm">
              <Clock className="h-3 w-3" />
              Offline editing expires in: {formatTime(timeRemaining)}
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
