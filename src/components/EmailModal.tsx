
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Mail, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
}

// Mock users data - in real app, this would come from an API
const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john.doe@hdfccapital.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane.smith@hdfccapital.com", role: "User" },
  { id: "3", name: "Mike Johnson", email: "mike.johnson@hdfccapital.com", role: "User" },
  { id: "4", name: "Sarah Wilson", email: "sarah.wilson@hdfccapital.com", role: "Admin" },
  { id: "5", name: "David Brown", email: "david.brown@hdfccapital.com", role: "User" },
  { id: "6", name: "Lisa Garcia", email: "lisa.garcia@hdfccapital.com", role: "User" },
  { id: "7", name: "Robert Taylor", email: "robert.taylor@hdfccapital.com", role: "Admin" },
  { id: "8", name: "Emily Davis", email: "emily.davis@hdfccapital.com", role: "User" },
];

export const EmailModal = ({ isOpen, onClose, senderName }: EmailModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select at least one user to send the email to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock email sending - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedUserNames = mockUsers
        .filter(user => selectedUsers.includes(user.id))
        .map(user => user.name);

      // Log the action for audit purposes
      console.log('Email sent:', {
        sender: senderName,
        recipients: selectedUserNames,
        timestamp: new Date().toISOString(),
        status: 'Sent'
      });

      toast({
        title: "Email Sent Successfully",
        description: `📊 HCAL Pipeline Dashboard sent to ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} successfully.`,
      });
      
      onClose();
      setSelectedUsers([]);
      setSearchTerm("");
    } catch (error) {
      toast({
        title: "Email Send Failed",
        description: "Failed to send email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedUsers([]);
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-hdfc-primary" />
            Send HCAL Pipeline Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({filteredUsers.length})
              </label>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedUsers.length} selected
            </span>
          </div>

          {/* User List */}
          <ScrollArea className="h-64 w-full rounded-md border">
            <div className="p-4 space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleUserToggle(user.id)}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      {user.role === "Admin" ? (
                        <Shield className="h-3 w-3 text-hdfc-primary" />
                      ) : (
                        <User className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your search.
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Email Preview */}
          {selectedUsers.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <p><strong>From:</strong> no_reply@hdfccapital.com</p>
              <p><strong>Subject:</strong> 📊 HCAL Pipeline Dashboard</p>
              <p><strong>Attachments:</strong> PDF & Excel files</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isLoading || selectedUsers.length === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
