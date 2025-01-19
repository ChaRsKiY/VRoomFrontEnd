import {Inbox, ChartNoAxesCombined, Video, Users, RectangleEllipsis} from "lucide-react"

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
import {currentUser} from "@clerk/nextjs/server";

export async function AppSidebar({ t }: { t: (s: string) => string }) {
    const adminLevel = (await currentUser())?.privateMetadata?.adminLevel

    if (!adminLevel) {
        return null
    }

    const firstLevel = [
        {
            title: t("users"),
            url: "/",
            icon: Users,
        },
        {
            title: t("content-reports"),
            url: "/content-reports",
            icon: Inbox,
            subContent: null
        },
        {
            title: t("analytics"),
            url: "/analytics",
            icon: ChartNoAxesCombined,
            subContent: null
        },
    ]

    const secondThirdLevel = [
        {
            title: t("users"),
            url: "/",
            icon: Users,
        },
        {
            title: t("video"),
            url: "/video-management",
            icon: Video,
            subContent: null
        },
        {
            title: t("content-reports"),
            url: "/content-reports",
            icon: Inbox,
            subContent: null
        },
        {
            title: t("ad"),
            url: "/ad-management",
            icon: RectangleEllipsis,
            subContent: null
        },
        {
            title: t("analytics"),
            url: "/analytics",
            icon: ChartNoAxesCombined,
            subContent: null
        },
    ]

    const items = adminLevel === 1 ? firstLevel : secondThirdLevel

    return (
        <Sidebar>
            <SidebarHeader>
                <h1 className="p-2 text-center font-bold text-xl">{t("vroom-admin")}</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("application")}</SidebarGroupLabel>
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
