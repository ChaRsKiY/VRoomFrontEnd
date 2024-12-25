"use client";

import React, {useState} from 'react'
import {useUser} from "@clerk/nextjs";
import {toast} from "@/hooks/use-toast";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {changePassword} from "@/actions/user";
import {Checkbox} from "@/components/ui/checkbox";

const ChangePasswordForm: React.FC = () => {
    const { user } = useUser()
    const [updateMode, setUpdateMode] = useState<boolean>(false)
    const [data, setData] = useState({
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
        signOutOfOtherSessions: false
    });

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleUpdate = async () => {
        if (user) {
            if (data.newPassword.length < 8 || data.newPasswordRepeat.length < 8) {
                toast({
                    title: "Password is too short",
                    description: "Password must be at least 8 characters long",
                    className: "text-red-500 bg-red-100",
                });
            }

            if (data.newPassword === data.oldPassword) {
                toast({
                    title: "New password is the same as the old password",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            if (data.newPassword !== data.newPasswordRepeat) {
                toast({
                    title: "New passwords do not match",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            const res = await changePassword({ currentPassword: data.oldPassword, newPassword: data.newPassword, signOutOfOtherSessions: data.signOutOfOtherSessions });

            if (!res?.success) {
                toast({
                    title: res?.errors[0].message,
                    description: res?.errors[0].longMessage,
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            toast({
                title: "Password updated",
                className: "text-green-500 bg-green-100",
            });
            setData({
                oldPassword: "",
                newPassword: "",
                newPasswordRepeat: "",
                signOutOfOtherSessions: false
            })

            await user.reload();
            setUpdateMode(false)
        }
    }

    const handleSetSignOutOfOtherSessions = () => {
        setData({
            ...data,
            signOutOfOtherSessions: !data.signOutOfOtherSessions
        })
    }

    return (
        <div className="mt-5">
            {updateMode ? (
                <>
                    <div className="space-y-2.5">
                        <div>
                            <Label className="mt-1.5">Old password</Label>
                            <Input name="oldPassword" onChange={handleDataChange} value={data.oldPassword}
                                   className="mt-1.5"/>
                        </div>

                        <div>
                            <Label className="mt-1.5">New password</Label>
                            <Input name="newPassword" onChange={handleDataChange} value={data.newPassword}
                                   className="mt-1.5"/>
                        </div>

                        <div>
                            <Label className="mt-1.5">New password repeat</Label>
                            <Input name="newPasswordRepeat" onChange={handleDataChange} value={data.newPasswordRepeat}
                                   className="mt-1.5"/>
                        </div>

                        <div className="flex pt-2 items-center">
                            <Checkbox onChange={handleSetSignOutOfOtherSessions} />
                            <Label className="pl-2">Sign out of other sessions</Label>
                        </div>
                    </div>

                    <Button className="mt-7 mr-2.5" variant="destructive"
                            onClick={() => setUpdateMode(false)}>Cancel</Button>
                    <Button className="mt-7" onClick={handleUpdate}>Update</Button>
                </>
            ) : (
                <Button variant="outline" onClick={() => setUpdateMode(true)}>Change</Button>
            )}

        </div>
    )
}

export default ChangePasswordForm