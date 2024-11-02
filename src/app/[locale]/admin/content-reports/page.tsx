import Header from "@/components/pages/admin/header";
import React from "react";
import {currentUser} from "@clerk/nextjs/server";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FaFilter} from "react-icons/fa";
import ContentReportsTable from "@/components/pages/admin/reports-table";

const ContentReportsPage = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'Content Reports', description: 'Manage content reports'}}/>
            <main className="mt-5">
                <div className="flex space-x-3 mb-3.5">
                    <Input placeholder="Report ID, User ID, Content type" className="max-w-64"/>
                    <Button variant="outline">
                        <FaFilter className="mr-1.5"/>
                        Filter
                    </Button>
                </div>
                <ContentReportsTable />
            </main>
        </div>
    );
}

export default ContentReportsPage;