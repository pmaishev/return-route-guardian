
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  LayoutDashboard, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Settings,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-gray-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-[80px]" : "w-[250px]"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="font-bold text-lg text-custom-blue">SellerCabinet</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={collapsed} />
        <NavItem to="/returns" icon={<Package size={20} />} label="Returns" collapsed={collapsed} />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
      </div>

      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-4">
            <UserCircle className="text-gray-500" />
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn("flex items-center w-full justify-start", 
            collapsed && "justify-center p-2")}
        >
          <LogOut size={20} className="mr-2" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center p-2 rounded-md transition-colors",
      isActive 
        ? "bg-custom-blue text-white" 
        : "text-gray-600 hover:bg-gray-100",
      collapsed ? "justify-center" : "space-x-3"
    )}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </NavLink>
);
