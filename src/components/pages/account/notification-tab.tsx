import React from 'react'
import MyPreferences from "@/components/pages/account/my-preferences";
import {currentUser} from "@clerk/nextjs/server";
import PermissionEmailPreference from "@/components/pages/account/perminssion-email-preference";
import MyEmailPreferences from "@/components/pages/account/my-email-preferences";

const NotificationsTab: React.FC = async () => {
    const user = await currentUser()

    return (
        <div className="mb-32">
            <div className="font-[600]">Notifications</div>

            <div className="text-2xl mt-4">Choose when and how to be notified</div>
            <div className="mt-1.5 text-[0.9rem]">Select push and email notifications you'd like to receive</div>

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">General</div>
            <div className="mt-1.5 text-[0.9rem]">Manage your mobile and desktop notifications</div>

            <div className="flex space-x-3 mt-7 flex-1">
                <div className="w-[15%]">Your preferences</div>
                <MyPreferences/>
            </div>

            <div className="h-[1px] bg-neutral-300 my-8"/>

            <div className="text-2xl mt-4">Email notifications</div>
            <div className="mt-1.5 text-[0.9rem]">Your emails are sent to {user?.primaryEmailAddress?.emailAddress}. To
                unsubscribe from an email, click the "Unsubscribe" link at the bottom of it.
            </div>

            <div className="flex space-x-3 mt-7 flex-1 mb-6">
                <div className="w-[25%]">Permission</div>
                <PermissionEmailPreference/>
            </div>

            <div className="flex space-x-3 mt-7 flex-1">
                <div className="w-[25%]">Your preferences</div>
                <MyEmailPreferences/>
            </div>
        </div>
    )
}

export default NotificationsTab