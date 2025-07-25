
import { LayoutDashboard, Users, Settings, Menu, History } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "User Management", url: "/", icon: Users },
  { title: "Versions", url: "/versions", icon: History },
  { title: "Master", url: "/master", icon: Settings },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isEditMode?: boolean;
}

export function AppSidebar({ isOpen, onToggle, isEditMode = false }: AppSidebarProps) {
  const { toast } = useToast();

  const handleNavigationClick = (e: React.MouseEvent, url: string) => {
    if (isEditMode && url !== "/dashboard") {
      e.preventDefault();
      toast({
        title: "Navigation Blocked",
        description: "Please save or exit edit mode before navigating to other pages.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-hdfc-primary transition-transform duration-300 z-50",
        "w-64 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-hdfc-secondary px-2 py-1 rounded text-white font-bold text-sm">
              HDFC
            </div>
            <span className="text-white font-semibold">CAPITAL</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              onClick={(e) => handleNavigationClick(e, item.url)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "text-white/80 hover:text-white hover:bg-white/10",
                isActive && "bg-hdfc-accent text-white",
                isEditMode && item.url !== "/dashboard" && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Edit Mode Warning */}
        {isEditMode && (
          <div className="absolute bottom-4 left-4 right-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-yellow-200 text-xs font-medium">
              Edit Mode Active
            </div>
            <div className="text-yellow-300/80 text-xs mt-1">
              Navigation is restricted while editing
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 lg:hidden z-50 p-2 rounded-lg bg-hdfc-primary text-white"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}
