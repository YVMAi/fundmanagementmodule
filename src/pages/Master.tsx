
import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Trash2 } from "lucide-react";

interface Relationship {
  id: string;
  name: string;
  type: string;
  createdBy: string;
  createdAt: string;
}

export default function Master() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotificationsEnabled: true,
    autoUserApproval: false,
    sessionTimeout: "30",
    maxLoginAttempts: "3",
    passwordExpiry: "90"
  });
  
  const [relationships, setRelationships] = useState<Relationship[]>([
    { id: "1", name: "Ankit Mistry", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "2", name: "Jasmeet Gulati", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "3", name: "Salil Khanolkar", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "4", name: "Lohit Nagpal", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "5", name: "Satyam Jain", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "6", name: "Joel Soans", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "7", name: "Abhishek Roy", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "8", name: "Aniruddha Menon", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "9", name: "Tarun Chaudhary", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
    { id: "10", name: "Sourabh Agrawal", type: "AMTeam", createdBy: "yash.mehrotra@truboardpartners.com", createdAt: "10-Jul-2025" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Master settings have been updated successfully",
    });
  };

  const handleAddRelation = () => {
    toast({
      title: "Add Relations",
      description: "Add relations functionality would be implemented here",
    });
  };

  const handleDeleteRelation = (id: string) => {
    setRelationships(relationships.filter(rel => rel.id !== id));
    toast({
      title: "Relationship Deleted",
      description: "The relationship has been removed successfully",
    });
  };

  // Filter relationships
  const filteredRelationships = relationships.filter(rel =>
    rel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRelationships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRelationships = filteredRelationships.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white border-b border-border p-6">
          <h1 className="text-2xl font-bold text-hdfc-primary">Master Settings</h1>
        </header>

        <main className="p-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="relationship">Relationship</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-hdfc-primary">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-approval" className="text-base font-medium">
                        Auto User Approval
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve new user registrations
                      </p>
                    </div>
                    <Switch
                      id="auto-approval"
                      checked={settings.autoUserApproval}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, autoUserApproval: checked})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => 
                        setSettings({...settings, sessionTimeout: e.target.value})
                      }
                      className="w-40"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-hdfc-primary">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Max Login Attempts</Label>
                    <Input
                      id="max-attempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => 
                        setSettings({...settings, maxLoginAttempts: e.target.value})
                      }
                      className="w-40"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => 
                        setSettings({...settings, passwordExpiry: e.target.value})
                      }
                      className="w-40"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-hdfc-primary">Email Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base font-medium">
                        Global Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable all email notifications system-wide
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotificationsEnabled}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, emailNotificationsEnabled: checked})
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relationship" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-hdfc-primary">Relationship</CardTitle>
                    <Button 
                      onClick={handleAddRelation}
                      className="bg-hdfc-primary hover:bg-hdfc-primary/90 text-white flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Relations
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                      <Label className="text-base font-medium">Search Deal Manager</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">&lt;</Button>
                        <Button variant="default" size="sm" className="bg-hdfc-primary">1</Button>
                        <Button variant="outline" size="sm">2</Button>
                        <Button variant="outline" size="sm">3</Button>
                        <Button variant="outline" size="sm">&gt;</Button>
                      </div>
                      
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <span className="text-sm text-muted-foreground">
                        Total Records: {filteredRelationships.length}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Created By</TableHead>
                          <TableHead className="font-semibold">Created At</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRelationships.map((relationship) => (
                          <TableRow key={relationship.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-hdfc-accent">{relationship.name}</TableCell>
                            <TableCell className="text-hdfc-accent">{relationship.type}</TableCell>
                            <TableCell className="text-muted-foreground">{relationship.createdBy}</TableCell>
                            <TableCell className="text-muted-foreground">{relationship.createdAt}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRelation(relationship.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSaveSettings}
              className="bg-hdfc-primary hover:bg-hdfc-primary/90 text-white"
            >
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
