import Header from "@/components/pages/admin/header";
import React from "react";
import {currentUser} from "@clerk/nextjs/server";
import ContentReportsTable from "@/components/pages/admin/reports-table";

const ContentReportsPage = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'Content Reports', description: 'Manage content reports'}}/>
            <main className="mt-5">
                <ContentReportsTable />
            </main>
        </div>
    );
}

export default ContentReportsPage;