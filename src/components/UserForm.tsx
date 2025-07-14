import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  emailNotifications: boolean;
  created?: string;
  lastLogin?: string;
}

interface UserFormProps {
  user?: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    emailNotifications: user?.emailNotifications || false,
    ...user
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      ...formData,
      id: user?.id || Date.now().toString(),
      created: user?.created || new Date().toLocaleDateString(),
      lastLogin: user?.lastLogin || "-"
    };

    onSave(userData);
    
    toast({
      title: "Success",
      description: `User ${user ? 'updated' : 'added'} successfully${formData.emailNotifications ? ' with email notifications enabled' : ''}`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-hdfc-primary">
          {user ? 'Edit User' : 'Add New User'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus:ring-hdfc-accent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="focus:ring-hdfc-accent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="focus:ring-hdfc-accent">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for account activities and updates
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-hdfc-primary hover:bg-hdfc-primary/90 text-white"
            >
              Save
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-hdfc-primary text-hdfc-primary hover:bg-hdfc-primary/5"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}