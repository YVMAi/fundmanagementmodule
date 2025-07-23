import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { EmailModal } from "@/components/EmailModal";
import { OfflineBanner } from "@/components/OfflineBanner";
import { OfflineRecoveryModal } from "@/components/OfflineRecoveryModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Lock, Unlock, Download, FileText, Save, AlertTriangle, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDashboardLock } from "@/hooks/useDashboardLock";
import { useOfflineMode } from "@/hooks/useOfflineMode";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [showOfflineRecovery, setShowOfflineRecovery] = useState(false);
  const [fundSummaryData, setFundSummaryData] = useState([
    { id: 1, description: "HCARE-3: Total Fund Size (I)", amount: "100" },
    { id: 2, description: "Recallable Distributions as on date (II)", amount: "100" },
    { id: 3, description: "HCARE-3: Total Fund Size including recallable (III = I+II)", amount: "200" },
    { id: 4, description: "HCARE-3: Available Fund Size as on date (IV)", amount: "200" },
    { id: 5, description: "HCARE-3: Available Fund Size including recallable (V = II+IV)", amount: "300" },
    { id: 6, description: "HCARE-4 (VI)", amount: "200" },
    { id: 7, description: "Less: Fees & Expenses buffer for Scheme 1", amount: "100" },
    { id: 8, description: "Less: Money required in Scheme 1 to co-invest with upsize", amount: "100" },
    { id: 9, description: "Less: Cover for Subline (for Scheme 1)", amount: "100" },
    { id: 10, description: "HCARE-5 (VII)", amount: "5,000" },
    { id: 11, description: "Total Fund Size (HCARE-3, 4 & 5) (A = III+VI+VII)", amount: "5,300" },
    { id: 12, description: "Less: Cover for Subline (for Scheme 2 Upsize)", amount: "300" },
    { id: 13, description: "Total Available Fund Size (HCARE-3, 4 & 5) (B = V+VI+VII)", amount: "5,000" },
  ]);
  
  const currentUser = "john.doe@hdfccapital.com";
  const currentUserName = "John Doe";
  const { toast } = useToast();
  
  const { 
    isLocked, 
    lockedBy, 
    isEditing, 
    canEdit, 
    acquireLock, 
    releaseLock, 
    updateActivity, 
    remainingTime,
    showExpiryDialog,
    continueEditing,
    discardChanges
  } = useDashboardLock(currentUser);

  const {
    isOnline,
    isOfflineMode,
    hasOfflineData,
    offlineTimeRemaining,
    saveOfflineData,
    getOfflineData,
    clearOfflineData,
    restoreOfflineData,
    formatOfflineTime,
  } = useOfflineMode(currentUser);

  // Check for offline data on mount
  useEffect(() => {
    if (hasOfflineData && !isEditing) {
      setShowOfflineRecovery(true);
    }
  }, [hasOfflineData, isEditing]);

  // Auto-save offline data when editing offline
  useEffect(() => {
    if (isOfflineMode && isEditing) {
      const interval = setInterval(() => {
        saveOfflineData({ fundSummaryData });
        console.log('Auto-saved offline data');
      }, 5000); // Auto-save every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isOfflineMode, isEditing, fundSummaryData, saveOfflineData]);

  // Update activity on any interaction
  useEffect(() => {
    const handleActivity = () => updateActivity();
    
    if (isEditing) {
      document.addEventListener('click', handleActivity);
      document.addEventListener('keypress', handleActivity);
      document.addEventListener('scroll', handleActivity);
      document.addEventListener('mousemove', handleActivity);
      
      return () => {
        document.removeEventListener('click', handleActivity);
        document.removeEventListener('keypress', handleActivity);
        document.removeEventListener('scroll', handleActivity);
        document.removeEventListener('mousemove', handleActivity);
      };
    }
  }, [isEditing, updateActivity]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    console.log('Saving dashboard data...', { fundSummaryData });
    
    if (isOfflineMode) {
      // Save to local storage when offline
      saveOfflineData({ fundSummaryData });
      toast({
        title: "Saved Offline",
        description: "Changes saved locally. They will sync when you reconnect.",
      });
    } else {
      // Normal save to backend
      releaseLock();
      clearOfflineData(); // Clear any offline data after successful save
      toast({
        title: "Changes Saved",
        description: "Dashboard has been saved successfully.",
      });
    }
  };

  const handleExitEdit = () => {
    if (isOfflineMode) {
      // In offline mode, just exit editing but keep offline data
      releaseLock();
      toast({
        title: "Exited Edit Mode",
        description: "Your offline changes are still saved locally.",
      });
    } else {
      releaseLock();
    }
  };

  const handleRestoreOfflineData = () => {
    const offlineData = restoreOfflineData();
    if (offlineData && offlineData.fundSummaryData) {
      setFundSummaryData(offlineData.fundSummaryData);
      acquireLock(); // Enter edit mode
      setShowOfflineRecovery(false);
      toast({
        title: "Offline Changes Restored",
        description: "Your previous offline changes have been restored. You can now continue editing.",
      });
    }
  };

  const handleDiscardOfflineData = () => {
    clearOfflineData();
    setShowOfflineRecovery(false);
    toast({
      title: "Offline Changes Discarded",
      description: "Previous offline changes have been discarded.",
    });
  };

  const handleFieldChange = (id: number, value: string) => {
    setFundSummaryData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, amount: value } : item
      )
    );
    
    // Auto-save when offline
    if (isOfflineMode) {
      saveOfflineData({ 
        fundSummaryData: fundSummaryData.map(item => 
          item.id === id ? { ...item, amount: value } : item
        )
      });
    }
    
    updateActivity();
  };

  const pipelineData = [
    {
      srNo: "1",
      particulars: "Deal Manager",
      developer: "Investment Team",
      region: "HCARE-3",
      investmentDate: "Various",
      relationship: "Investment Team",
      committed: "HCARE-3 only",
      invested: "HCARE-4 & 5 only",
    },
  ];

  const canEditDashboard = (canEdit && isOnline) || (isOfflineMode && isEditing);

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Banner */}
      <OfflineBanner 
        isOnline={isOnline}
        isOfflineMode={isOfflineMode}
        timeRemaining={offlineTimeRemaining}
        formatTime={formatOfflineTime}
      />

      {/* Offline Recovery Modal */}
      <OfflineRecoveryModal
        isOpen={showOfflineRecovery}
        onRestore={handleRestoreOfflineData}
        onDiscard={handleDiscardOfflineData}
        offlineTimestamp={getOfflineData()?.timestamp}
      />

      <AppSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isEditMode={isEditing}
      />
      
      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        senderName={currentUserName}
      />
      
      {/* Session Expiry Dialog */}
      <Dialog open={showExpiryDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Expiring Soon</DialogTitle>
            <DialogDescription>
              Your editing session will expire in 60 seconds. Do you want to continue editing or discard changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={discardChanges}
              className="flex-1"
            >
              Discard Changes
            </Button>
            <Button 
              onClick={continueEditing}
              className="flex-1"
            >
              Continue Editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className={`lg:ml-64 min-h-screen ${(!isOnline || isOfflineMode) ? 'pt-16' : ''}`}>
        <header className="bg-white border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-hdfc-primary mb-1">HCARE 3, 4 & 5 Funds Tracking</h1>
              {isOfflineMode && (
                <p className="text-sm text-amber-600 font-medium">
                  Offline Mode - Changes saved locally
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isLocked && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
                  <Lock className="h-4 w-4" />
                  <span>
                    {lockedBy === currentUser 
                      ? `Editing (${formatTime(remainingTime)} left)` 
                      : `Locked by ${lockedBy}`
                    }
                  </span>
                </div>
              )}
              
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={!isOnline && !isOfflineMode}
                      >
                        <Save className="h-4 w-4" />
                        {isOfflineMode ? 'Save Offline' : 'Save & Release Lock'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {isOfflineMode ? 'Save Offline' : 'Save & Release Lock'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {isOfflineMode 
                            ? 'Changes will be saved locally and synced when you reconnect.' 
                            : 'Changes will be saved and it will become the current version.'
                          } Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave}>
                          {isOfflineMode ? 'Save Offline' : 'Save & Release Lock'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Unlock className="h-4 w-4" />
                        Exit Edit Mode
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Exit Edit Mode</AlertDialogTitle>
                        <AlertDialogDescription>
                          {isOfflineMode 
                            ? 'Your offline changes will remain saved locally.' 
                            : 'Changes will be discarded.'
                          } Are you sure you want to exit edit mode?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleExitEdit}
                          className={isOfflineMode ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
                        >
                          {isOfflineMode ? 'Exit Edit Mode' : 'Discard Changes'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <Button 
                  onClick={acquireLock}
                  disabled={!canEditDashboard}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Dashboard
                </Button>
              )}
              
              <Button 
                onClick={() => setEmailModalOpen(true)}
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={!isOnline}
              >
                <Mail className="h-4 w-4" />
                Send as Email
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={!isOnline}
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={!isOnline}
              >
                <FileText className="h-4 w-4" />
                Export Pdf
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Lock Status Alert */}
          {isLocked && lockedBy !== currentUser && (
            <Alert className="mb-6" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sheet Currently Locked</AlertTitle>
              <AlertDescription>
                This sheet is currently being edited by {lockedBy}. You may view it in read-only mode.
              </AlertDescription>
            </Alert>
          )}

          {/* Offline Mode Alert */}
          {isOfflineMode && isEditing && (
            <Alert className="mb-6" variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Offline Editing Mode</AlertTitle>
              <AlertDescription>
                You're editing offline. Changes are being saved locally and will sync when you reconnect.
                Offline editing expires in: {formatOfflineTime(offlineTimeRemaining)}
              </AlertDescription>
            </Alert>
          )}

          {/* Fund Management Dashboard */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-hdfc-primary mb-6">Fund Management Dashboard</h2>
            
            {/* Fund Summary Table */}
            <Card className="shadow-card mb-8">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold text-hdfc-primary border-r">Fund Summary</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fundSummaryData.map((item, index) => (
                      <TableRow key={item.id} className={index % 2 === 0 ? "bg-muted/30" : "bg-white"}>
                        <TableCell className="font-medium border-r py-3 px-4">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <Input 
                            value={item.amount}
                            readOnly={!isEditing}
                            className={`text-center ${isEditing ? 'border focus:bg-white focus:border-ring' : 'border-0 bg-transparent cursor-default'}`}
                            onChange={(e) => {
                              if (isEditing) {
                                handleFieldChange(item.id, e.target.value);
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pipeline Details */}
            <h3 className="text-lg font-bold text-hdfc-primary mb-4">Pipeline Details</h3>
            <Card className="shadow-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Sr. No.</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Particulars</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Developer</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Region</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Investment Date</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Relationship</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center border-r">Committed</TableHead>
                      <TableHead className="font-bold text-hdfc-primary text-center">Invested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pipelineData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center border-r py-3">{item.srNo}</TableCell>
                        <TableCell className="text-center border-r py-3">{item.particulars}</TableCell>
                        <TableCell className="text-center border-r py-3">{item.developer}</TableCell>
                        <TableCell className="text-center border-r py-3">{item.region}</TableCell>
                        <TableCell className="text-center border-r py-3">{item.investmentDate}</TableCell>
                        <TableCell className="text-center border-r py-3">{item.relationship}</TableCell>
                        <TableCell className="text-center border-r py-3">{item.committed}</TableCell>
                        <TableCell className="text-center py-3">{item.invested}</TableCell>
                      </TableRow>
                    ))}
                    {/* Empty rows for input */}
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`empty-${index}`}>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center border-r py-3"></TableCell>
                        <TableCell className="text-center py-3"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
