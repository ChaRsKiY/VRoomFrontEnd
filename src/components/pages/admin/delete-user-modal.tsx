"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { deleteUser } from "@/actions/admin"

interface Props {
    userId: string,
    username: string,
    fetchTableUsers: () => void
    onOpenSheetChange?: (open: boolean) => void,
    openD?: boolean,
    setOpenD?: (open: boolean) => void
}

const DeleteUserModal: React.FC<Props> = ({ userId, username, onOpenSheetChange = null, openD, setOpenD, fetchTableUsers }) => {
    const [isPending, setIsPending] = useState(false)
    const [open, setOpen] = useState(openD || false)

    const deleteUserById = async () => {
        setIsPending(true)
        try {
            const response = await deleteUser(userId)
            if (response === "unauthorized") throw new Error("Unauthorized")

            fetchTableUsers()
            setOpen(false)

            if (onOpenSheetChange) {
                onOpenSheetChange(false)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenSheetChange ? setOpen :setOpenD}>
            {onOpenSheetChange && (
                <DialogTrigger asChild>
                    <Button className="mr-2 mb-2" variant="outline">Delete</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete user {username}?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-3">
                    <Button
                        disabled={isPending}
                        onClick={deleteUserById}
                        variant="destructive"
                        className="w-full"
                    >
                        {isPending ? "Deleting..." : "Yes, delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteUserModal
