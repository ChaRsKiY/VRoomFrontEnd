"use client"

import React from 'react'
import {useUser} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {FcGoogle} from "react-icons/fc";
import {FaApple, FaFacebookF} from "react-icons/fa";
import {ConnectNewAccount} from "@/components/pages/account/connect-new-account";
import {ExternalAccountResource} from "@clerk/types";

const iconMap: { [key: string]: JSX.Element } = {
    google: <FcGoogle size={24} />,
    facebook: <FaFacebookF size={24} />,
    apple: <FaApple size={24} />,
};

const AccountsManagement: React.FC = () => {
    const { user } = useUser()

    if (!user) return null

    const removeAccount = async (account: ExternalAccountResource) => {
        try {
            const res = user.externalAccounts.find(acc => acc.id === account.id);
            if (res) {
                await account.destroy();
                await user.reload();
            } else {
                console.error("External account not found.");
            }
        } catch (error) {
            console.error("Error removing external account:", error);
        }
    }

    const verifiedAccounts = user?.externalAccounts.filter(el => el.verification?.status === "verified")

    return (
        <div className="mt-5">
            {verifiedAccounts?.length === 0 && (
                <div className="text-[0.9rem] text-neutral-500">No connected accounts</div>
            )}
            {verifiedAccounts?.map((account, index) => (
                <div key={index} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center space-x-3">
                        {iconMap[account.provider.toLowerCase()] || <span>Unknown Platform</span>}
                        <div>{account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}</div>
                    </div>
                    <div>
                        <Button variant="ghost" onClick={() => removeAccount(account)} className="text-red-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-300 dark:hover:text-white">
                            Remove
                        </Button>
                    </div>
                </div>
            ))}

            <ConnectNewAccount />
        </div>
    )
}

export default AccountsManagement