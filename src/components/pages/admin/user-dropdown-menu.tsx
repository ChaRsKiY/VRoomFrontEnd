import React, {useState, useCallback} from 'react';
import {Sheet, SheetContent} from "@/components/ui/sheet";
import { ITableUser } from "@/components/pages/admin/users-datatable";
import UserDataSheet from "@/components/pages/admin/userdata-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import DeleteUserModal from "@/components/pages/admin/delete-user-modal";
import {useUser} from "@clerk/nextjs";
import {toggleBanUser} from "@/lib/admin-user";
import {useTranslation} from "next-i18next";

interface Props {
    user: ITableUser,
    fetchUsers: () => Promise<void>,
    currentUserAdminLevel: number
}

const UserDataSheetMemo = React.memo(UserDataSheet);

const UserDropdownMenu: React.FC<Props> = ({ user, fetchUsers, currentUserAdminLevel }: Props) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState<boolean>(false)
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState<boolean>(false)
    const [isPending, setIsPending] = useState<boolean>(false)

    const { user: currentUser } = useUser();

    const { t } = useTranslation()

    const onOpenSheetChange = useCallback((open: boolean) => {
        setIsUserMenuOpen(open)
    }, []);

    const onOpenDropDownMenuChanged = useCallback((open: boolean) => {
        setIsDropDownMenuOpen(open)
    }, []);

    const openSheet = useCallback(() => {
        setIsUserMenuOpen(true)
        setIsDropDownMenuOpen(false)
    }, []);

    const openDeleteUser = useCallback(() => {
        setIsDeleteUserOpen(true)
        setIsDropDownMenuOpen(false)
    }, []);

    if (!currentUser) {
        return null;
    }

    const isCurrentUser = user.id === currentUser.id;
    const canEdit = currentUserAdminLevel === 3 || isCurrentUser;
    const canBan = currentUserAdminLevel === 3 && !isCurrentUser;
    const canDelete = currentUserAdminLevel === 3 && !isCurrentUser;

    return (
        <>
            <DropdownMenu open={isDropDownMenuOpen} onOpenChange={onOpenDropDownMenuChanged}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t("admin-main:open-menu")}</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("admin-main:actions")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                        {t("admin-main:copy-id")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={openSheet}>
                        {t("admin-main:view-profile")}
                    </DropdownMenuItem>
                    {canBan && <DropdownMenuItem onClick={() => toggleBanUser(user.id, user.banned ? "unban" : "ban", setIsPending, fetchUsers)}>{user.banned ? t("admin-main:unban") : t("admin-main:ban")}</DropdownMenuItem>}
                    {canDelete && <DropdownMenuItem onClick={openDeleteUser}>{t("admin-main:delete-user")}</DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>

            {isUserMenuOpen && <Sheet open={isUserMenuOpen} onOpenChange={onOpenSheetChange}>
                <SheetContent className="w-[500px] min-w-[500px] max-w-[500px] overflow-scroll no-scrollbar">
                    <UserDataSheetMemo currentUserAdminLevel={currentUserAdminLevel} userId={user.id} fetchTableUsers={fetchUsers} onOpenSheetChange={onOpenSheetChange} />
                </SheetContent>
            </Sheet>}

            {canDelete && isDeleteUserOpen && (
                <DeleteUserModal userId={user.id} username={user.username} openD={isDeleteUserOpen} setOpenD={setIsDeleteUserOpen} fetchTableUsers={fetchUsers} />
            )}
        </>
    );
}

export default UserDropdownMenu;