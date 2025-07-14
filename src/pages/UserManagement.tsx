import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UserForm } from "@/components/UserForm";
import { UserTable } from "@/components/UserTable";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailNotifications: boolean;
  created: string;
  lastLogin: string;
}

// Sample data matching the reference image
const initialUsers: User[] = [
  {
    id: "1",
    name: "damian Demo",
    email: "damian.demo@yopmail.com",
    role: "Admin",
    emailNotifications: true,
    created: "11-Jul-2025",
    lastLogin: "14-Jul-2025"
  },
  {
    id: "2",
    name: "new user",
    email: "newuser@yopmail.com",
    role: "User",
    emailNotifications: false,
    created: "08-Jul-2025",
    lastLogin: "09-Jul-2025"
  },
  {
    id: "3",
    name: "kiran",
    email: "kiran@yopmail.com",
    role: "Admin",
    emailNotifications: true,
    created: "08-Jul-2025",
    lastLogin: "11-Jul-2025"
  },
  {
    id: "4",
    name: "Demo1",
    email: "demouser1@yopmail.com",
    role: "Admin",
    emailNotifications: true,
    created: "08-Jul-2025",
    lastLogin: "-"
  },
  {
    id: "5",
    name: "Rayan Kumar",
    email: "rayankumar04@yopmail.com",
    role: "Admin",
    emailNotifications: false,
    created: "07-Jul-2025",
    lastLogin: "14-Jul-2025"
  },
  {
    id: "6",
    name: "Nathan",
    email: "nathankj@yopmail.com",
    role: "Admin",
    emailNotifications: true,
    created: "07-Jul-2025",
    lastLogin: "-"
  },
  {
    id: "7",
    name: "desk user 3",
    email: "deskuser3@yopmail.com",
    role: "Admin",
    emailNotifications: false,
    created: "04-Jul-2025",
    lastLogin: "04-Jul-2025"
  },
  {
    id: "8",
    name: "Desk user",
    email: "deskuser2@yopmail.com",
    role: "User",
    emailNotifications: true,
    created: "04-Jul-2025",
    lastLogin: "04-Jul-2025"
  },
  {
    id: "9",
    name: "Desk2706",
    email: "Desk2706@yopmail.com",
    role: "Admin",
    emailNotifications: false,
    created: "04-Jul-2025",
    lastLogin: "04-Jul-2025"
  },
  {
    id: "10",
    name: "Avinash",
    email: "avinash.dmr@yopmail.com",
    role: "User",
    emailNotifications: true,
    created: "02-Jul-2025",
    lastLogin: "-"
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === userData.id ? userData : user
      ));
    } else {
      // Add new user
      setUsers(prev => [...prev, userData]);
    }
    
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been successfully removed",
    });
  };

  const handleToggleNotifications = (userId: string, enabled: boolean) => {
    setUsers(prev => prev.map(user =>
      user.id === userId 
        ? { ...user, emailNotifications: enabled }
        : user
    ));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-border p-6">
          <h1 className="text-2xl font-bold text-hdfc-primary">User Management</h1>
        </header>

        {/* Content */}
        <main className="p-6 space-y-6">
          {/* Add/Edit User Form */}
          {showForm && (
            <UserForm
              user={editingUser || undefined}
              onSave={handleSaveUser}
              onCancel={handleCancel}
            />
          )}

          {/* Add New User Button */}
          {!showForm && (
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-hdfc-primary">
                Manage Users
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-hdfc-primary text-white px-4 py-2 rounded-lg hover:bg-hdfc-primary/90 transition-colors"
              >
                Add New User
              </button>
            </div>
          )}

          {/* User Table */}
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleNotifications={handleToggleNotifications}
          />
        </main>
      </div>
    </div>
  );
}