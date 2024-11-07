import React, { PropsWithChildren } from 'react'
import AsideBar from "@/components/pages/admin/aside-bar";
import {currentUser} from "@clerk/nextjs/server";
import NotFound from "@/app/[locale]/not-found";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/pages/admin/sidebar";

const AdminLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const user = await currentUser();

    if (!user?.privateMetadata?.isAdmin) {
        return <NotFound />
    }

    return (
        <SidebarProvider className="py-4">
            <AppSidebar />
            <main className="flex-1">
                {children}
            </main>
            {/*
            <div className="pl-4 py-4 bg-neutral-100 dark:bg-neutral-900 w-full flex">
            <AsideBar />
            <main className="flex-1">{children}</main>
            </div>
            */}
        </SidebarProvider>
    )
};

export default AdminLayout;
