import Header from "@/components/pages/admin/header";
import React from "react";
import {currentUser} from "@clerk/nextjs/server";

const VideoManagementPage = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'Video Management', description: 'Manage videos, categories, and tags'}} />
        </div>
    );
}

export default VideoManagementPage;