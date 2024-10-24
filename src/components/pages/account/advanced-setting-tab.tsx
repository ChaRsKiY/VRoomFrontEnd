import React from 'react'
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import CopyButton from "@/components/pages/account/copy-button";
import Link from "next/link";

const AdvancedSettingsTab: React.FC = async () => {
    const { userId } = auth()

    if (!userId) {
        redirect("/")
    }

    return (
        <div>
            <div className="font-[600]">Advanced Settings</div>

            <div className="text-2xl mt-4">Set up VRoom exactly how you want it</div>

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="flex items-center space-x-4 flex-1 mb-4">
                <h4 className="w-[15%]">User ID</h4>
                <div className="border rounded-[0.5rem] p-4 flex space-x-3">
                    <input className="w-full bg-transparent" disabled value={userId}/>
                    <CopyButton text={userId} hint="User Id is copied."/>
                </div>
            </div>

            <div className="flex items-center space-x-4 flex-1 mb-4">
                <h4 className="w-[15%]">Channel ID</h4>
                <div className="border rounded-[0.5rem] p-4 flex space-x-3">
                    <input className="w-full bg-transparent" disabled value={userId}/>
                    <CopyButton text={userId} hint="User Id is copied."/>
                </div>
            </div>

            <div className="flex items-center space-x-4 flex-1 mb-4">
                <h4 className="w-[15%]">Move Channel</h4>
                <div className="p-4">
                    <Link className="text-blue" href="/channel/move">Move channel</Link>
                    <div>You can move your channel to a brand account</div>
                </div>
            </div>

            <div className="flex items-center space-x-4 flex-1 mb-4">
                <h4 className="w-[15%]">Delete Channel</h4>
                <div className="p-4">
                    <Link className="text-blue" href="/channel/delete">Delete channel</Link>
                    <div>Deleting your VRoom channel won't close your Account</div>
                </div>
            </div>
        </div>
    )
}

export default AdvancedSettingsTab