"use client";

import React, {useState} from 'react'
import {useUser} from "@clerk/nextjs";
import {toast} from "@/hooks/use-toast";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

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
            if (data.newPassword !== data.newPasswordRepeat) {
                toast({
                    title: "New passwords do not match",
                    className: "text-red-500 bg-red-100",
                });
                return;
            }

            try {
                await user.updatePassword({
                    newPassword: data.newPassword
                })

                await user.reload();
                setUpdateMode(false)
            } catch (e: any) {
                toast({
                    title: e.errors[0].message,
                    description: e.errors[0].longMessage,
                    className: "text-red-500 bg-red-100",
                });
            }
        }
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