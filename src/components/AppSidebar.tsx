
import { LayoutDashboard, Users, Settings, Menu, History } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "User Management", url: "/", icon: Users },
  { title: "Versions", url: "/versions", icon: History },
  { title: "Master", url: "/master", icon: Settings },
];

interface AppSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="bg-hdfc-primary border-r-0">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-hdfc-secondary px-2 py-1 rounded text-white font-bold text-sm">
            HDFC
          </div>
          {!isCollapsed && <span className="text-white font-semibold">CAPITAL</span>}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 p-4">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
                        "text-white/80 hover:text-white hover:bg-white/10",
                        isActive && "bg-hdfc-accent text-white",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Trigger button */}
      <div className="absolute top-4 -right-3 z-50">
        <SidebarTrigger className="h-6 w-6 bg-hdfc-primary text-white border border-white/20 hover:bg-hdfc-secondary" />
      </div>
    </Sidebar>
  );
}
