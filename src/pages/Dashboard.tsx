import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Lock, Unlock, Download, FileText, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboardLock } from "@/hooks/useDashboardLock";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = "john.doe@hdfccapital.com"; // In real app, get from auth
  
  const { isLocked, lockedBy, isEditing, canEdit, acquireLock, releaseLock, updateActivity, remainingTime } = useDashboardLock(currentUser);

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
    // In a real implementation, this would save the data
    console.log('Saving dashboard data...');
    releaseLock(); // Release lock on save as per BRD
  };

  const handleExitEdit = () => {
    releaseLock(); // Release lock on exit as per BRD
  };

  const fundSummaryData = [
    { description: "HCARE-3: Total Fund Size (I)", amount: "100" },
    { description: "Recallable Distributions as on date (II)", amount: "100" },
    { description: "HCARE-3: Total Fund Size including recallable (III = I+II)", amount: "200" },
    { description: "HCARE-3: Available Fund Size as on date (IV)", amount: "200" },
    { description: "HCARE-3: Available Fund Size including recallable (V = II+IV)", amount: "300" },
    { description: "HCARE-4 (VI)", amount: "200" },
    { description: "Less: Fees & Expenses buffer for Scheme 1", amount: "100" },
    { description: "Less: Money required in Scheme 1 to co-invest with upsize", amount: "100" },
    { description: "Less: Cover for Subline (for Scheme 1)", amount: "100" },
    { description: "HCARE-5 (VII)", amount: "5,000" },
    { description: "Total Fund Size (HCARE-3, 4 & 5) (A = III+VI+VII)", amount: "5,300" },
    { description: "Less: Cover for Subline (for Scheme 2 Upsize)", amount: "300" },
    { description: "Total Available Fund Size (HCARE-3, 4 & 5) (B = V+VI+VII)", amount: "5,000" },
  ];

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
    // Add more pipeline data as needed
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-hdfc-primary mb-1">HCARE 3, 4 & 5 Funds Tracking</h1>
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
                  <Button 
                    onClick={handleSave}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save & Release Lock
                  </Button>
                  <Button 
                    onClick={handleExitEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Unlock className="h-4 w-4" />
                    Exit Edit Mode
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={acquireLock}
                  disabled={!canEdit}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Dashboard
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                      <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-white"}>
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
                                updateActivity();
                                // Handle value change here
                                console.log('Field updated:', item.description, e.target.value);
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
