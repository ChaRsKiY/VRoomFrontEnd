"use client"

import React, {useState} from 'react'
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


interface Props {
    user: DataUser
}

export interface EditData {
    userData: {
        username: string,
        firstName: string,
        lastName: string,
        avatar: File | null,
    }
}

const AdminUserEditModal = ({ user }: Props) => {
    const [data, setData] = useState<EditData>({
        userData: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: null
        }
    })

    const saveChanges = async () => {
        const formData = new FormData()
        formData.append('userData', data.userData as any)
        formData.append('avatar', data.userData.avatar as File)

        const response = await updateUserBaseData(user.id, formData)

        if (response === 'success') {
            console.log('User data updated')
            return
        }

        console.error('Error updating user data:', response)
    }

    const compareIfChanged = () => {
        return JSON.stringify(data) === JSON.stringify({
            userData: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: null,
            }
        })
    }

    return (
        <Dialog>
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

                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="External Accounts">
                        <AccordionTrigger>External Accounts</AccordionTrigger>
                        <AccordionContent>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <DialogFooter>
                    <Button onClick={saveChanges} disabled={compareIfChanged()} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AdminUserEditModal