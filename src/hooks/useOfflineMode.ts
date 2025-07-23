
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  dashboard_id: string;
  user_id: string;
  timestamp: string;
  grid_data: any;
}

const OFFLINE_STORAGE_KEY = 'dashboard_offline_data';
const OFFLINE_LOCK_DURATION = 10 * 60 * 1000; // 10 minutes

export const useOfflineMode = (currentUser: string, dashboardId: string = 'pipeline_2025_q3') => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [offlineStartTime, setOfflineStartTime] = useState<number | null>(null);
  const [offlineTimeRemaining, setOfflineTimeRemaining] = useState(0);

  // Check for existing offline data on mount
  useEffect(() => {
    const storedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData: OfflineData = JSON.parse(storedData);
        if (parsedData.user_id === currentUser && parsedData.dashboard_id === dashboardId) {
          setHasOfflineData(true);
        }
      } catch (error) {
        console.error('Error parsing offline data:', error);
        localStorage.removeItem(OFFLINE_STORAGE_KEY);
      }
    }
  }, [currentUser, dashboardId]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Connection restored');
      setIsOnline(true);
      setIsOfflineMode(false);
      setOfflineStartTime(null);
      setOfflineTimeRemaining(0);
      
      toast({
        title: "Connection Restored",
        description: "You're back online. Changes can now be synced.",
      });
    };

    const handleOffline = () => {
      console.log('Connection lost');
      setIsOnline(false);
      setIsOfflineMode(true);
      setOfflineStartTime(Date.now());
      
      toast({
        title: "Connection Lost",
        description: "You're offline. Changes will be saved locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Timer for offline mode duration
  useEffect(() => {
    if (isOfflineMode && offlineStartTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - offlineStartTime;
        const remaining = Math.max(0, OFFLINE_LOCK_DURATION - elapsed);
        setOfflineTimeRemaining(remaining);
        
        if (remaining === 0) {
          setIsOfflineMode(false);
          toast({
            title: "Offline Session Expired",
            description: "Your offline editing session has expired. Please reconnect to continue editing.",
            variant: "destructive",
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOfflineMode, offlineStartTime, toast]);

  const saveOfflineData = useCallback((gridData: any) => {
    if (!isOfflineMode) return;
    
    const offlineData: OfflineData = {
      dashboard_id: dashboardId,
      user_id: currentUser,
      timestamp: new Date().toISOString(),
      grid_data: gridData,
    };

    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineData));
      console.log('Offline data saved to local storage');
    } catch (error) {
      console.error('Error saving offline data:', error);
      toast({
        title: "Storage Error",
        description: "Unable to save changes locally. Please check your browser storage.",
        variant: "destructive",
      });
    }
  }, [isOfflineMode, dashboardId, currentUser, toast]);

  const getOfflineData = useCallback((): OfflineData | null => {
    const storedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!storedData) return null;

    try {
      const parsedData: OfflineData = JSON.parse(storedData);
      if (parsedData.user_id === currentUser && parsedData.dashboard_id === dashboardId) {
        return parsedData;
      }
    } catch (error) {
      console.error('Error parsing offline data:', error);
    }
    return null;
  }, [currentUser, dashboardId]);

  const clearOfflineData = useCallback(() => {
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
    setHasOfflineData(false);
    console.log('Offline data cleared');
  }, []);

  const restoreOfflineData = useCallback(() => {
    const offlineData = getOfflineData();
    if (offlineData) {
      console.log('Restoring offline data from:', offlineData.timestamp);
      return offlineData.grid_data;
    }
    return null;
  }, [getOfflineData]);

  const formatOfflineTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    isOnline,
    isOfflineMode,
    hasOfflineData,
    offlineTimeRemaining,
    saveOfflineData,
    getOfflineData,
    clearOfflineData,
    restoreOfflineData,
    formatOfflineTime,
  };
};
