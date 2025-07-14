import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Master() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotificationsEnabled: true,
    autoUserApproval: false,
    sessionTimeout: "30",
    maxLoginAttempts: "3",
    passwordExpiry: "90"
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Master settings have been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white border-b border-border p-6">
          <h1 className="text-2xl font-bold text-hdfc-primary">Master Settings</h1>
        </header>

        <main className="p-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
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