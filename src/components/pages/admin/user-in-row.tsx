"use client"

import React, {useState} from 'react'
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {TableCell, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {IoIosMore} from "react-icons/io";
import UserDataSheet from "@/components/pages/admin/userdata-sheet";
import {ISelectedUser, ITableUser} from "@/components/pages/admin/users-table";

interface Props {
    user: ITableUser,
    selectedUsers: ISelectedUser[],
    handleSelectUser: (id: string) => void,
    fetchTableUsers: () => void
}

const UserInRow = ({ user, selectedUsers, handleSelectUser, fetchTableUsers }: Props) => {
    const [open, setOpen] = useState<boolean>(false)

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
    }

    return (
        <Sheet key={user.id} open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild className="cursor-pointer">
                <TableRow>
                    <TableCell className="w-[50px]">
                        <Checkbox
                            checked={selectedUsers.findIndex(el => el.id === user.id) >= 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectUser(user.id);
                            }}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell
                        className="flex justify-end items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IoIosMore size={22} />
                    </TableCell>
                </TableRow>
            </SheetTrigger>
            <SheetContent className="min-w-[500px] max-w-[500px] w-[500px] max-sm:left-0 max-sm:right-0 max-sm:w-full max-sm:max-w-full max-sm:min-w-0 overflow-scroll no-scrollbar">
                <UserDataSheet userId={user.id} setOpen={setOpen} fetchTableUsers={fetchTableUsers} />
            </SheetContent>
        </Sheet>
    )
}

export default UserInRow