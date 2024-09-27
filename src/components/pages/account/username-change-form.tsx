"use client"

import React, {useState} from 'react'
import {Input} from "@/components/ui/input";
import {useUser} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";

const UsernameChangeForm: React.FC = () => {
    const { user } = useUser()
    const [updateMode, setUpdateMode] = useState<boolean>(false)
    const [username, setUsername] = useState<string>(user?.username || "");

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleUpdate = async () => {
        if (user) {
            if (username.length < 4) {
                toast({
                    title: "Username should be at least 4 characters long",
                    className: "text-red-500 bg-red-100",
                });

                return;
            }

            try {
                await user.update({
                    username
                });
            } catch (e: any) {
                if (e.status === 422) {
                    toast({
                        title: "Username is already taken",
                        className: "text-red-500 bg-red-100",
                    });
                }
                return;
            }

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
                            <Input name="lastName" onChange={handleUsernameChange} value={username} className="mt-1.5"/>
                        </div>
                    </div>

                    <Button className="mt-7 mr-2.5" variant="destructive"
                            onClick={() => setUpdateMode(false)}>Cancel</Button>
                    <Button className="mt-7" onClick={handleUpdate}>Update</Button>
                </>
            ) : (
                <>
                    <div className="mt-1.5 text-xl font-[500]">{user?.username}</div>

                    <Button className="mt-5" variant="outline" onClick={() => setUpdateMode(true)}>Change</Button>
                </>
            )}

        </div>
    )
}

export default UsernameChangeForm