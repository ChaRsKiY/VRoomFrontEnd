import Header from "@/components/pages/admin/header";
import React from "react";
import {currentUser} from "@clerk/nextjs/server";
import ContentReportsTable from "@/components/pages/admin/reports-table";
import initTranslations from "@/app/i18n";

interface Props {
    params: {
        locale: string;
    }
}

const ContentReportsPage = async ({ params: { locale } }: Props) => {
    const user = await currentUser()

    const { t } = await initTranslations(locale, ['admin-main']);

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: t("content-reports"), description: t('manage-content-reports')}}/>
            <main className="mt-5">
                <ContentReportsTable />
            </main>
        </div>
    );
}

export default ContentReportsPage;