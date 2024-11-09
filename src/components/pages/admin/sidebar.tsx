import { Calendar, Inbox, Search, Settings, Users } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";
import Link from "next/link";

// Menu items.
const items = [
    {
        title: "Users",
        url: "/",
        icon: Users,
        subContent: [
            { title: "All Users", url: "" },
            { title: "Logs", url: "#logs" },
            { title: "Analytics", url: "#analytics" }
        ]
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        subContent: null
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
        subContent: null
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
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
                                <Collapsible key={item.title} defaultOpen className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <button className="p-5">
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </button>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        {item.subContent?.length && <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.subContent.map((subItem, key) => (
                                                    <SidebarMenuSubItem key={key}>
                                                        <a href={"/admin" + subItem.url} className="p-1.5 px-2 hover:bg-neutral-100 rounded block">{subItem.title}</a>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>}
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
