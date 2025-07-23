
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, HardDrive } from "lucide-react";

interface OfflineRecoveryModalProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  offlineTimestamp?: string;
}

export const OfflineRecoveryModal = ({ 
  isOpen, 
  onRestore, 
  onDiscard, 
  offlineTimestamp 
}: OfflineRecoveryModalProps) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-amber-500" />
            Unsaved Edits Detected
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span>You have offline changes from your last session.</span>
            </div>
            {offlineTimestamp && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last saved: {formatTimestamp(offlineTimestamp)}</span>
              </div>
            )}
            <p className="text-sm">
              Would you like to restore these changes or start fresh?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onDiscard}
            className="flex-1"
          >
            Discard Changes
          </Button>
          <Button 
            onClick={onRestore}
            className="flex-1"
          >
            Restore & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
