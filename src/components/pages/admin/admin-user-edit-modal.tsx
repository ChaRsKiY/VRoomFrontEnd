"use client"

import React, {useEffect, useState} from 'react'
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
import {DataUser} from "@/types/datauser.interface";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import EditUserDataForm from "@/components/pages/admin/edit-userdata-form";
import {updateUserBaseData} from "@/actions/admin";
import EditUserEmailsForm from "@/components/pages/admin/edit-user-emails-form";


interface Props {
    user: DataUser,
    fetchUser: () => Promise<void>
}

export interface EditData {
    userData: {
        username: string,
        firstName: string,
        lastName: string,
    }
}

const AdminUserEditModal = ({ user, fetchUser }: Props) => {
    const [data, setData] = useState<EditData>({
        userData: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    })
    const [isPending, setIsPending] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [stateChanged, setStateChanged] = useState<boolean>(false)

    const saveChanges = async () => {
        setIsPending(true)
        const formData = new FormData()
        formData.append('firstName', data.userData.firstName as string)
        formData.append('lastName', data.userData.lastName as string)
        formData.append('username', data.userData.username as string)

        const response = await updateUserBaseData(user.id, formData)

        if (response === 'success') {
            setIsPending(false)
            setOpen(false)
            setStateChanged(false)
            fetchUser()
            return
        }

        console.error('Error updating user data:', response)
        setIsPending(false)
    }

    const compareIfChanged = () => {
        JSON.stringify(data) === JSON.stringify({
            userData: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        }) ? setStateChanged(false) : setStateChanged(true)
    }

    useEffect(() => {
        compareIfChanged()
    }, [data]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mr-2 mb-2" variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {user.username}</DialogTitle>
                    <DialogDescription>
                        Edit the profile information of {user.username}
                    </DialogDescription>
                </DialogHeader>
                <Accordion type="multiple">
                    <AccordionItem value="user-data">
                        <AccordionTrigger>User Data</AccordionTrigger>
                        <AccordionContent>
                            <EditUserDataForm setData={setData} data={data} userHasImage={user.hasImage} baseAvatarUrl={user.imageUrl} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="emails">
                        <AccordionTrigger>Emails</AccordionTrigger>
                        <AccordionContent>
                            <EditUserEmailsForm user={user} fetchUser={fetchUser} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <DialogFooter>
                    <Button onClick={saveChanges} disabled={!stateChanged || isPending} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AdminUserEditModal