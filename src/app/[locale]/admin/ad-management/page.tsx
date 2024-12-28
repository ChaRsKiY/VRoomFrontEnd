import React from 'react'
import Header from "@/components/pages/admin/header";
import {currentUser} from "@clerk/nextjs/server";
import AdsTable from "@/components/pages/admin/ads-table";
import {Button} from "@/components/ui/button";

const AdManagementPage: React.FC = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'Ad Management', description: 'Manage ads'}}/>

            <main className="mt-5">
                <AdsTable />
            </main>
        </div>
    )
}

export default AdManagementPage