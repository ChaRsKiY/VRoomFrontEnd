import React from 'react'
import HeaderHome from "@/components/pages/home/header/header";
import initTranslations from "@/app/i18n";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import GeneralTab from "@/components/pages/account/general-tab";
import AccountTab from "@/components/pages/account/account-tab";
import SecurityTab from "@/components/pages/account/security-tab";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import AdvancedSettingsTab from "@/components/pages/account/advanced-setting-tab";
import NotificationsTab from "@/components/pages/account/notification-tab";

interface Props {
    params: {
        locale: string;
    }
}

const AccountPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories'])

    const { userId } = auth()

    if (!userId) {
        redirect("/")
    }

    return (
        <>
            <HeaderHome t={t} />

                <Tabs defaultValue="general" className="flex mt-20 w-full">
                    <TabsList className="flex flex-col h-fit w-80 bg-white dark:bg-neutral-950 px-4 space-y-1">
                        <div className="text-[500] text-xl self-start pl-8 mb-2.5">Settings</div>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800" value="general">General</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800" value="account">Account</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800" value="security">Security</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800" value="notitifications">Notifications</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800" value="payments">Payments</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800" value="extended">Advanced settings</TabsTrigger>
                    </TabsList>
                    <TabsContent className="flex-1 px-7" value="general">
                        <GeneralTab />
                    </TabsContent>
                    <TabsContent className="flex-1 px-7" value="account">
                        <AccountTab />
                    </TabsContent>
                    <TabsContent className="flex-1 px-7" value="security">
                        <SecurityTab />
                    </TabsContent>
                    <TabsContent className="flex-1 px-7" value="notitifications">
                        <NotificationsTab />
                    </TabsContent>
                    <TabsContent className="flex-1 px-7" value="payments">
                        Payments
                    </TabsContent>
                    <TabsContent className="flex-1 px-7" value="extended">
                        <AdvancedSettingsTab />
                    </TabsContent>
                </Tabs>
        </>
    )
}

export default AccountPage