import Header from "@/components/pages/admin/header";
import React from "react";
import {currentUser} from "@clerk/nextjs/server";
import VideoManagementTable from "@/components/pages/admin/video-management-table";
import initTranslations from "@/app/i18n";

interface Props {
    params: {
        locale: string;
    }
}

const VideoManagementPage = async ({ params: { locale } }: Props) => {
    const user = await currentUser()

    const { t } = await initTranslations(locale, ['admin-main']);

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: t("video-management"), description: t("manage-videos")}} />

            <VideoManagementTable />
        </div>
    );
}

export default VideoManagementPage;