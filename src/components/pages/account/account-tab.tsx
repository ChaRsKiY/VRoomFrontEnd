import React from 'react'
import BaseUserDataChangeForm from "@/components/pages/account/base-userdata-change-form";
import UsernameChangeForm from "@/components/pages/account/username-change-form";
import EmailsManagementForm from "@/components/pages/account/emails-management-form";
import AccountsManagement from "@/components/pages/account/accounts-management";

const AccountTab: React.FC = async () => {
    return (
        <div>
            <div className="font-[600]">Account</div>

            <div className="text-2xl mt-4">Profile details</div>
            <div className="mt-1.5 text-[0.9rem]">Add information about yourself and set up access to VRoom features
            </div>

            <BaseUserDataChangeForm />

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">Username</div>
            <div className="mt-1.5 text-[0.9rem]">Your username is your unique identifier on VRoom. It is used to log in
                and to identify you in the community.
            </div>

            <UsernameChangeForm />

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">Emails</div>
            <div className="mt-1.5 text-[0.9rem]">Add and manage your email addresses</div>

            <EmailsManagementForm />

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">Connected accounts</div>
            <div className="mt-1.5 text-[0.9rem]">Connect your third-party accounts to VRoom</div>

            <AccountsManagement />

            <div className="mb-24" />
        </div>
    )
}

export default AccountTab