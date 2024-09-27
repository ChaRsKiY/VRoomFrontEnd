import React from 'react'
import HeaderHome from "@/components/pages/home/header/header";
import initTranslations from "@/app/i18n";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import GeneralTab from "@/components/pages/account/general-tab";
import AccountTab from "@/components/pages/account/account-tab";

interface Props {
    params: {
        locale: string;
    }
}

const AccountPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories'])

    return (
        <>
            <HeaderHome t={t} />

                <Tabs defaultValue="general" className="flex mt-20">
                    <TabsList className="flex flex-col h-fit w-80 bg-white px-4 space-y-1">
                        <div className="text-[500] text-xl self-start pl-8 mb-2.5">Settings</div>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100" value="general">General</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100" value="account">Account</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100" value="notitifications">Notifications</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100" value="payments">Payments</TabsTrigger>
                        <TabsTrigger className="w-full py-2.5 hover:bg-neutral-100" value="extended">Extended settings</TabsTrigger>
                    </TabsList>
                    <TabsContent className="flex-1 px-7" value="general">
                        <GeneralTab />
                    </TabsContent>
                    <TabsContent className="flex-1 px-7" value="account">
                        <AccountTab />
                    </TabsContent>
                    <TabsContent className="flex-1" value="notitifications">
                        Notitifications
                    </TabsContent>
                    <TabsContent className="flex-1" value="payments">
                        Payments
                    </TabsContent>
                    <TabsContent className="flex-1" value="extended">
                        Extended
                    </TabsContent>
                </Tabs>
        </>
    )
}

export default AccountPage