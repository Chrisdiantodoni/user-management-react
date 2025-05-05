import { ChevronsUpDown, LogOut, Lock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import createStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import users from "@/services/api/users";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ChangePasswordDialog } from "@/pages/user/components/CHangePasswordDialog";
import { useEffect } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { handle, handleModal, userData } = createStore();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await users.logout();
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code == 200) {
        toast.success("Logout!!!");
        localStorage.removeItem("token");
        // window.location.href = "/auth/login";
        navigate("/auth/login");
        handle("isAuthenticated", false);
      } else {
        toast.error(`Logout Failed\n${res?.response?.data?.data}`);
      }
    },
    onError: (res: any) => {
      console.log(res);
      toast.error(`Logout Failed\n${res?.response?.data?.data || ""}`);
    },
  });

  useEffect(() => {
    if (userData?.password_reset_at != null) {
      handleModal("modalChangePassword", true);
    }
  }, [userData, handleModal]);

  return (
    <SidebarMenu>
      <ChangePasswordDialog />
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="truncate text-xs">{userData.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleModal("modalChangePassword", true)}
            >
              <Lock />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => mutate()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
