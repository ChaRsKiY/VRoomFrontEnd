import React from 'react'
import {currentUser} from "@clerk/nextjs/server";
import Header from "@/components/pages/admin/header";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FaFilter} from "react-icons/fa";
import UsersTable from "@/components/pages/admin/users-table";

const AdminMainPage: React.FC = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'User Management', description: 'Manage users, roles, and permissions'}} />

            <main className="mt-5">
                <div className="flex space-x-3 mb-3.5">
                    <Input placeholder="Search users..." className="max-w-64" />
                    <Button variant="outline">
                        <FaFilter className="mr-1.5" />
                        Filter
                    </Button>
                </div>
                <UsersTable />
            </main>
        </div>
    )
}

export default AdminMainPage