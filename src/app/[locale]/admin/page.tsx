import React from 'react'
import {currentUser} from "@clerk/nextjs/server";
import Header from "@/components/pages/admin/header";
import UsersTable from "@/components/pages/admin/users-table";

const AdminMainPage: React.FC = async () => {
    const user = await currentUser()

    return (
        <div className="px-[3.5%] flex-1">
            <Header user={user} data={{title: 'User Management', description: 'Manage users, roles, and permissions'}} />

            <main className="mt-2">
                <UsersTable />
            </main>
        </div>
    )
}

export default AdminMainPage