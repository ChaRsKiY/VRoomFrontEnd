"use client"

import React, {useRef} from 'react'
import {EditData} from "@/components/pages/admin/admin-user-edit-modal";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {IoIosClose} from "react-icons/io";
import {updateUserBaseData} from "@/actions/admin";

interface Props {
    setData: (prev: EditData) => void,
    data: EditData,
    userHasImage: boolean,
    baseAvatarUrl: string
}

const EditUserDataForm = ({ setData, data, userHasImage, baseAvatarUrl }: Props) => {
    const fileInput = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            userData: {
                ...data.userData,
                [e.target.name]: e.target.value
            }
        })
    }


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setData({
            ...data,
            userData: {
                ...data.userData,
                avatar: e.target.files[0]
            }
        })
    }

    const openFileInput = () => {
        fileInput.current?.click()
    }

    const removeFile = () => {
        setData({
            ...data,
            userData: {
                ...data.userData,
                avatar: null
            }
        })
    }

    return (
        <article className="px-1 space-y-2">
            <div>
                <Label>Avatar</Label>
                <div className="flex items-center space-x-2">
                    <Avatar className="mr-1.5">
                        <AvatarImage src={data.userData.avatar ? URL.createObjectURL(data.userData.avatar) : baseAvatarUrl}/>
                        <AvatarFallback>VR</AvatarFallback>
                    </Avatar>
                    {data.userData.avatar && <Button variant="outline" className="px-1" onClick={removeFile}><IoIosClose size={24} /></Button>}
                    <Button onClick={openFileInput} variant="outline">Upload</Button>
                    {userHasImage && (
                        <Button variant="ghost"
                                className="text-red-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-300 dark:hover:text-white">Remove</Button>
                    )}
                    <Input
                        accept=".jpg, .jpeg, .png"
                        type="file"
                        name="avatar"
                        className="hidden"
                        ref={fileInput}
                        onChange={handleFileChange}/>
                </div>
                <p className="mt-1 text-[0.9rem] italic text-neutral-500">Recommended size
                    1:1, up to 10MB.
                </p>
            </div>
            <div>
                <Label>Username</Label>
                <Input
                    value={data.userData.username}
                    name="username"
                    onChange={handleChange}/>
            </div>
            <div>
                <Label>Firstname</Label>
                <Input
                    value={data.userData.firstName}
                    name="firstName"
                    onChange={handleChange}/>
            </div>
            <div>
                <Label>Lastname</Label>
                <Input
                    value={data.userData.lastName}
                    name="lastName"
                    onChange={handleChange}/>
            </div>
        </article>
    )
}

export default EditUserDataForm