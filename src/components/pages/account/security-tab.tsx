import React from 'react'
import {UserButton} from "@clerk/nextjs";
import ChangePasswordForm from "@/components/pages/account/change-password-form";
import {DeleteAccount} from "@/components/pages/account/delete-account";
import ActiveDevices from "@/components/pages/account/active-devices";

const SecurityTab: React.FC = () => {
    return (
        <div>
            <div className="font-[600]">Security</div>

            <div className="text-2xl mt-4">Password</div>
            <div className="mt-1.5 text-[0.9rem]">Change your password</div>

            <ChangePasswordForm/>

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">Active devices</div>
            <div className="mt-1.5 text-[0.9rem]">Manage your active devices</div>

            <ActiveDevices />

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">Delete account</div>
            <div className="mt-1.5 text-[0.9rem]">Delete your account permanently</div>

            <DeleteAccount/>
        </div>
    )
}

export default SecurityTab