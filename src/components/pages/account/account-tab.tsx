import React from 'react'
import {UserButton} from "@clerk/nextjs";
import BaseUserDataChangeForm from "@/components/pages/account/base-userdata-change-form";
import {currentUser} from "@clerk/nextjs/server";

const AccountTab: React.FC = async () => {
    //const user = await currentUser()

    return (
        <div>
            <div className="font-[600]">Account</div>

            <div className="text-2xl mt-4">Profile details</div>
            <div className="mt-1.5 text-[0.9rem]">Add information about yourself and set up access to VRoom features</div>

            <BaseUserDataChangeForm />

            <div className="h-[1px] bg-neutral-300 my-8"/>
            <UserButton/>
        </div>
    )
}

export default AccountTab