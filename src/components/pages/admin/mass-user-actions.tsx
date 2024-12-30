import React, {useState} from 'react'
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {banUnbanUsers, deleteUsers} from "@/actions/admin";
import {toast} from "@/hooks/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {useUser} from "@clerk/nextjs";

interface Props {
    selection: Record<string, boolean>,
    fetchUsers: () => Promise<void>,
    setSelection: (selection: Record<string, boolean>) => void
    currentUserAdminLevel: number
}

const MassUserActions: React.FC<Props> = ({ selection, fetchUsers, setSelection, currentUserAdminLevel }: Props) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const { user } = useUser()

    if (!user) {
        return null
    }

    const deleteManyUsersExcept = async () => {
        setIsPending(true)
        const selectedUsers = Object.keys(selection).filter((key) => selection[key] && key !== user.id)

        try {
            const res = await deleteUsers(selectedUsers)

            if (res === "success") {
                await fetchUsers()
                setIsPending(false)
            } else {
                setIsPending(false)
                const message = JSON.parse(res).message
                const longMessage = JSON.parse(res).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });
            }
        } catch (e: any) {
            setIsPending(false)
            console.error(e)
        }
    }

    const deleteManyUsers = async () => {
        setIsPending(true)
        const selectedUsers = Object.keys(selection).filter((key) => selection[key])

        if (selectedUsers.includes(user.id)) {
            toast({
                title: "You can't delete yourself",
                description: "This action cant be performed on your own account. Press the button to delete all users except yourself.",
                className: "text-red-600 bg-red-100",
                action: (
                    <ToastAction onClick={deleteManyUsersExcept} className="hover:bg-red-400 hover:text-red-100 border border-red-400" altText="Delete all users">Delete</ToastAction>
                ),
                duration: 6500
            });

            setIsPending(false)
            return;
        }

        try {
            const res = await deleteUsers(selectedUsers)

            if (res === "success") {
                await fetchUsers()
                setIsPending(false)
            } else {
                setIsPending(false)
                const message = JSON.parse(res).message
                const longMessage = JSON.parse(res).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });
            }
        } catch (e: any) {
            setIsPending(false)
            console.error(e)
        }
    }

    const banUsersExcept = async () => {
        setIsPending(true)
        const selectedUsers = Object.keys(selection).filter((key) => selection[key] && key !== user.id)

        try {
            const res = await banUnbanUsers(selectedUsers, true)

            if (res === "success") {
                await fetchUsers()
                setIsPending(false)
            } else {
                setIsPending(false)
                const message = JSON.parse(res).message
                const longMessage = JSON.parse(res).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });
            }
        } catch (e: any) {
            setIsPending(false)
            console.error(e)
        }
    }

    const banUnbanManyUsers = async (ban: boolean) => {
        setIsPending(true)
        const selectedUsers = Object.keys(selection).filter((key) => selection[key])

        if (ban && selectedUsers.includes(user.id)) {
            toast({
                title: "You can't ban yourself",
                description: "This action cant be performed on your own account. Press the button to ban all users except yourself.",
                className: "text-yellow-600 bg-yellow-100",
                action: (
                    <ToastAction onClick={banUsersExcept} className="hover:bg-yellow-400 border border-yellow-400" altText="Ban all users">Ban</ToastAction>
                ),
                duration: 6500
            });

            setIsPending(false)
            return;
        }

        try {
            const res = await banUnbanUsers(selectedUsers, ban)

            if (res === "success") {
                await fetchUsers()
                setIsPending(false)
            } else {
                setIsPending(false)
                const message = JSON.parse(res).message
                const longMessage = JSON.parse(res).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });
            }
        } catch (e: any) {
            setIsPending(false)
            console.error(e)
        }
    }

    return (
        <div className="rounded-[0.5rem] border border-neutral-200 p-4">
                <Label>Mass Actions</Label>
                <div className="space-x-5 mt-1 flex items-center">
                    <div>
                        <Button onClick={() => setSelection({})} variant="outline">Unselect all</Button>
                    </div>
                    {currentUserAdminLevel == 3 ? (
                        <div className="space-x-1.5">
                            <Button disabled={isPending} onClick={() => banUnbanManyUsers(true)}>Ban All</Button>
                            <Button disabled={isPending} onClick={() => banUnbanManyUsers(false)}>Unban All</Button>
                            <Button disabled={isPending} onClick={deleteManyUsers}>Delete All</Button>
                        </div>
                    ) : (
                        <span>No mass actions available</span>
                    )}
                </div>
        </div>
    )
}

export default MassUserActions