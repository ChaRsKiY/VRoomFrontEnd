import {Button} from "@/components/ui/button";
import UsersDataTable from "@/components/pages/admin/users-datatable";
import {getAdminLevel} from "@/actions/admin";
import {currentUser} from "@clerk/nextjs/server";

const UsersTable = async () => {
    const curUser = await currentUser();
    const adminLevel = await getAdminLevel(curUser?.id as string);

    return (
        <div>
            <UsersDataTable currentUserAdminLevel={adminLevel} />

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-6"/>

            <h2 className="mb-2 text-xl">Logs</h2>

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-6"/>

            <h2 className="mb-2 text-xl">Analytics</h2>

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-8"/>

            <div className="space-x-2">
                <Button>Export</Button>
                <Button>Import</Button>
            </div>
        </div>
    )
}

export default UsersTable;
