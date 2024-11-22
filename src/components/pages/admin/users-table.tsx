import {Button} from "@/components/ui/button";
import UsersDataTable from "@/components/pages/admin/users-datatable";
import {getAdminLevel} from "@/actions/admin";
import {currentUser} from "@clerk/nextjs/server";
import UsersLogsTable from "@/components/pages/admin/users-logs-table";

const UsersTable = async () => {
    const curUser = await currentUser();
    const adminLevel = await getAdminLevel(curUser?.id as string);

    return (
        <div>
            <UsersDataTable currentUserAdminLevel={adminLevel} />

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-6"/>

            <h2 className="mb-2 text-xl" id="logs">Logs</h2>

            <UsersLogsTable />

            <div className="h-[1px] bg-neutral-300 rounded mt-10 mb-6"/>

            <div className="space-x-2">
                <Button>Export</Button>
            </div>
        </div>
    )
}

export default UsersTable;
