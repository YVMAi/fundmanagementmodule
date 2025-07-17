
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DashboardLockState {
  isLocked: boolean;
  lockedBy: string | null;
  lockTime: number | null;
}

const LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_TIME = 9 * 60 * 1000; // 9 minutes (1 minute before expiry)
const STORAGE_KEY = 'dashboard_lock_state';

export const useDashboardLock = (currentUser: string) => {
  const { toast } = useToast();
  const [lockState, setLockState] = useState<DashboardLockState>({
    isLocked: false,
    lockedBy: null,
    lockTime: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [showExpiryDialog, setShowExpiryDialog] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedState: DashboardLockState = JSON.parse(stored);
      const now = Date.now();
      
      // Check if lock has expired
      if (parsedState.lockTime && now - parsedState.lockTime > LOCK_TIMEOUT) {
        // Lock expired, clear it
        const clearedState = { isLocked: false, lockedBy: null, lockTime: null };
        setLockState(clearedState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedState));
      } else {
        setLockState(parsedState);
        if (parsedState.lockedBy === currentUser) {
          setIsEditing(true);
        }
      }
    }
  }, [currentUser]);

  // Monitor for lock expiration and warnings
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState: DashboardLockState = JSON.parse(stored);
        const now = Date.now();
        
        if (parsedState.lockTime && parsedState.lockedBy === currentUser) {
          const timeElapsed = now - parsedState.lockTime;
          
          // Show dialog at 9 minutes (1 minute before expiry)
          if (timeElapsed >= WARNING_TIME && timeElapsed < LOCK_TIMEOUT && !warningShown && !showExpiryDialog) {
            setWarningShown(true);
            setShowExpiryDialog(true);
          }
          
          // Lock expired - auto discard changes
          if (timeElapsed > LOCK_TIMEOUT) {
            const clearedState = { isLocked: false, lockedBy: null, lockTime: null };
            setLockState(clearedState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedState));
            setIsEditing(false);
            setWarningShown(false);
            setShowExpiryDialog(false);
            
            toast({
              title: "Session Expired",
              description: "Your editing session has expired and changes have been discarded.",
              variant: "destructive"
            });
          }
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [currentUser, toast, warningShown, showExpiryDialog]);

  const acquireLock = useCallback(() => {
    if (lockState.isLocked && lockState.lockedBy !== currentUser) {
      toast({
        title: "Sheet Currently Locked",
        description: `This sheet is currently being edited by ${lockState.lockedBy}. You may view it in read-only mode.`,
        variant: "destructive"
      });
      return false;
    }

    const newState = {
      isLocked: true,
      lockedBy: currentUser,
      lockTime: Date.now(),
    };
    
    setLockState(newState);
    setIsEditing(true);
    setWarningShown(false);
    setShowExpiryDialog(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    console.log(`Lock acquired by ${currentUser} at ${new Date().toISOString()}`);
    
    toast({
      title: "Edit Mode Enabled",
      description: "You can now edit the dashboard. Lock will expire after 10 minutes of inactivity.",
    });
    
    return true;
  }, [lockState, currentUser, toast]);

  const releaseLock = useCallback(() => {
    const newState = { isLocked: false, lockedBy: null, lockTime: null };
    setLockState(newState);
    setIsEditing(false);
    setWarningShown(false);
    setShowExpiryDialog(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    console.log(`Lock released by ${currentUser} at ${new Date().toISOString()}`);
    
    toast({
      title: "Edit Mode Disabled",
      description: "Dashboard editing has been disabled and lock has been released.",
    });
  }, [toast, currentUser]);

  const updateActivity = useCallback(() => {
    if (isEditing && lockState.lockedBy === currentUser) {
      const newState = {
        ...lockState,
        lockTime: Date.now(),
      };
      setLockState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setWarningShown(false); // Reset warning when user is active
      setShowExpiryDialog(false); // Close dialog if user is active
      
      console.log(`Activity updated by ${currentUser} at ${new Date().toISOString()}`);
    }
  }, [isEditing, lockState, currentUser]);

  const continueEditing = useCallback(() => {
    // Reset timer to 10 minutes
    const newState = {
      ...lockState,
      lockTime: Date.now(),
    };
    setLockState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setWarningShown(false);
    setShowExpiryDialog(false);
    
    toast({
      title: "Editing Continued",
      description: "Timer has been reset to 10 minutes.",
    });
  }, [lockState, toast]);

  const discardChanges = useCallback(() => {
    releaseLock();
    setShowExpiryDialog(false);
  }, [releaseLock]);

  const remainingTime = lockState.lockTime 
    ? Math.max(0, LOCK_TIMEOUT - (Date.now() - lockState.lockTime))
    : 0;

  return {
    isLocked: lockState.isLocked,
    lockedBy: lockState.lockedBy,
    isEditing,
    canEdit: !lockState.isLocked || lockState.lockedBy === currentUser,
    acquireLock,
    releaseLock,
    updateActivity,
    remainingTime,
    showExpiryDialog,
    continueEditing,
    discardChanges,
  };
};
