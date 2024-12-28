import React from 'react'
import Header from "@/components/pages/admin/header";
import {currentUser} from "@clerk/nextjs/server";
import AdsTable from "@/components/pages/admin/ads-table";
import {Button} from "@/components/ui/button";
import initTranslations from "@/app/i18n";

interface Props {
    params: {
        locale: string;
    }
}

const AdManagementPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const user = await currentUser()

    const { t } = await initTranslations(locale, ['admin-main']);

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: t("ad-management"), description: t("manage-ads")}}/>

            <main className="mt-5">
                <AdsTable />
            </main>
        </div>
    )
}

export default AdManagementPage