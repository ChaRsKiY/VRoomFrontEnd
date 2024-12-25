import {Inbox, ChartNoAxesCombined, Settings, Users, RectangleEllipsis} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

// Menu items.
const items = [
    {
        title: "Users",
        url: "/",
        icon: Users,
    },
    {
        title: "Content Reports",
        url: "/content-reports",
        icon: Inbox,
        subContent: null
    },
    {
        title: "Ad",
        url: "/ad-management",
        icon: RectangleEllipsis,
        subContent: null
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: ChartNoAxesCombined,
        subContent: null
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
        subContent: null
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h1 className="p-2 text-center font-bold text-xl">VRoom Admin</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={"/admin" + item.url} className="pl-5">
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                    </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
