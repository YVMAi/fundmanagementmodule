import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DashboardLockState {
  isLocked: boolean;
  lockedBy: string | null;
  lockTime: number | null;
}

const LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const STORAGE_KEY = 'dashboard_lock_state';

export const useDashboardLock = (currentUser: string) => {
  const { toast } = useToast();
  const [lockState, setLockState] = useState<DashboardLockState>({
    isLocked: false,
    lockedBy: null,
    lockTime: null,
  });
  const [isEditing, setIsEditing] = useState(false);

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

  // Monitor for lock expiration
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState: DashboardLockState = JSON.parse(stored);
        const now = Date.now();
        
        if (parsedState.lockTime && now - parsedState.lockTime > LOCK_TIMEOUT) {
          const clearedState = { isLocked: false, lockedBy: null, lockTime: null };
          setLockState(clearedState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedState));
          
          if (parsedState.lockedBy === currentUser) {
            setIsEditing(false);
            toast({
              title: "Session Expired",
              description: "Your editing session has expired due to inactivity.",
              variant: "destructive"
            });
          }
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [currentUser, toast]);

  const acquireLock = useCallback(() => {
    if (lockState.isLocked && lockState.lockedBy !== currentUser) {
      toast({
        title: "Dashboard Locked",
        description: `Dashboard is currently being edited by ${lockState.lockedBy}`,
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    toast({
      title: "Edit Mode Enabled",
      description: "You can now edit the dashboard",
    });
    
    return true;
  }, [lockState, currentUser, toast]);

  const releaseLock = useCallback(() => {
    const newState = { isLocked: false, lockedBy: null, lockTime: null };
    setLockState(newState);
    setIsEditing(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    toast({
      title: "Edit Mode Disabled",
      description: "Dashboard editing has been disabled",
    });
  }, [toast]);

  const updateActivity = useCallback(() => {
    if (isEditing && lockState.lockedBy === currentUser) {
      const newState = {
        ...lockState,
        lockTime: Date.now(),
      };
      setLockState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  }, [isEditing, lockState, currentUser]);

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
  };
};