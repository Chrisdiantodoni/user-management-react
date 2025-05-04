import * as React from "react";
import { User2, GalleryVerticalEnd, LayoutDashboardIcon } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavDashboard } from "./nav-dashboard";

// This is sample data.
const data = {
  teams: [
    {
      name: "Personal Inc",
      logo: GalleryVerticalEnd,
      plan: "Development",
    },
  ],
  dashboard: [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
  ],
  user: [
    {
      name: "User",
      url: "/user-list",
      icon: User2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavDashboard user={data.dashboard} />

        <NavProjects user={data.user} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
