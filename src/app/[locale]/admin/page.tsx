import React from 'react'
import {currentUser} from "@clerk/nextjs/server";
import Header from "@/components/pages/admin/header";
import UsersTable from "@/components/pages/admin/users-table";
import initTranslations from "@/app/i18n";

interface Props {
    params: {
        locale: string;
    }
}

const AdminMainPage = async ({ params: { locale } }: Props) => {
    const user = await currentUser()

    const { t } = await initTranslations(locale, ['admin-main']);

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: t('user-management'), description: t("manage-users-roles")}} />

            <main className="mt-2">
                <UsersTable t={t} />
            </main>
        </div>
    )
}

export default AdminMainPage