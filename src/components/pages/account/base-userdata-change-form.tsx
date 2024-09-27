"use client"

import React, {useEffect, useRef, useState} from 'react'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useUser} from "@clerk/nextjs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";

const BaseUserDataChangeForm: React.FC = () => {
    const { user } = useUser()
    const [updateMode, setUpdateMode] = useState<boolean>(false)
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [data, setData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || ""
    });

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleUploadAvatarButtonClicked = () => {
        avatarInputRef.current?.click();
    };

    const handleImageDelete = async () => {
        if (user) {
            await user.setProfileImage({ file: null });
            await user.reload();
        }
    }

    const handleUploadAvatar = async () => {
        const file = avatarInputRef.current?.files?.[0];
        if (file && file.size > 10 * 1024 * 1024) {
            toast({
                title: "File size should not exceed 10MB",
                className: "text-red-500 bg-red-100",
            });
            return;
        }

        if (user && file) {
            await user.setProfileImage({ file });
            await user.reload();
        }
    };

    const handleUpdate = async () => {
        if (user) {
            if (data.lastName.length < 2 && data.lastName.length !== 0) {
                toast({
                    title: "Last name should be at least 2 characters long",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            if (data.firstName.length < 2 && data.firstName.length !== 0) {
                toast({
                    title: "First name should be at least 2 characters long",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            if (data.firstName.length > 20) {
                toast({
                    title: "First name should not exceed 20 characters",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            if (data.lastName.length > 20) {
                toast({
                    title: "Last name should not exceed 20 characters",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            await user.update({
                firstName: data.firstName,
                lastName: data.lastName
            });

            await user.reload();
            setUpdateMode(false)
        }
    }

    return (
        <div className="mt-5">
            {updateMode ? (
                <>
                    <div className="space-y-2.5">
                        <div>
                            <Label className="mt-1.5">Avatar</Label>
                            <div className="flex mt-1.5 items-center space-x-5">
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={user?.imageUrl} alt={user?.username || ""}/>
                                    <AvatarFallback>FR</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-center">
                                    <div className="flex space-x-2.5">
                                        <Button variant="outline" onClick={handleUploadAvatarButtonClicked}>Upload</Button>
                                        <Input accept=".jpg, .jpeg, .png" onChange={handleUploadAvatar} ref={avatarInputRef} type="file" className="hidden" />
                                        {user?.hasImage && <Button onClick={handleImageDelete} variant="ghost" className="text-red-500 hover:bg-red-100 hover:text-red-500">Remove</Button>}
                                    </div>
                                    <div className="mt-1 text-[0.9rem] italic text-neutral-500">Recommended size
                                        1:1, up to 10MB.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="mt-1.5">First name</Label>
                            <Input name="firstName" onChange={handleDataChange} value={data.firstName} className="mt-1.5"/>
                        </div>

                        <div>
                            <Label className="mt-1.5">Last name</Label>
                            <Input name="lastName" onChange={handleDataChange} value={data.lastName} className="mt-1.5"/>
                        </div>
                    </div>

                    <Button className="mt-7 mr-2.5" variant="destructive"
                            onClick={() => setUpdateMode(false)}>Cancel</Button>
                    <Button className="mt-7" onClick={handleUpdate}>Update</Button>
                </>
            ) : (
                <>
                    <div className="flex space-x-6">
                        <div>
                            <Label className="mt-1.5">Avatar</Label>
                            <Avatar className="w-14 h-14 mt-2">
                            <AvatarImage src={user?.imageUrl} alt={user?.username || ""}/>
                                <AvatarFallback>FR</AvatarFallback>
                            </Avatar>
                        </div>

                        <div>
                            <Label className="mt-1.5">First name</Label>
                            <div className="mt-1.5 text-xl font-[500]">{user?.firstName || " -"}</div>
                        </div>

                        <div>
                            <Label className="mt-1.5">Last name</Label>
                            <div className="mt-1.5 text-xl font-[500]">{user?.lastName || " -"}</div>
                        </div>
                    </div>

                    <Button className="mt-5" variant="outline" onClick={() => setUpdateMode(true)}>Change</Button>
                </>
            )}

        </div>
    )
}

export default BaseUserDataChangeForm