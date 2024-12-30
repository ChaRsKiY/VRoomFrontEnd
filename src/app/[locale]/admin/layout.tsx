import React, { PropsWithChildren } from 'react'
import AsideBar from "@/components/pages/admin/aside-bar";
import {currentUser} from "@clerk/nextjs/server";
import NotFound from "@/app/[locale]/not-found";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/pages/admin/sidebar";
import initTranslations from "@/app/i18n";

interface Props {
    params: {
        locale: string;
    }
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = async ({ children, params: { locale }  }: Props) => {
    const user = await currentUser();

    const { t } = await initTranslations(locale, ['admin-main']);

    if (!user?.privateMetadata?.isAdmin) {
        return <NotFound />
    }

    return (
        <SidebarProvider className="py-4">
            <AppSidebar t={t} />
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
