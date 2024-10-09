"use client";

import React, {useEffect, useState} from 'react'
import {useClerk, useSession, useUser} from "@clerk/nextjs";
import {SessionWithActivitiesResource} from "@clerk/types";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {IoLaptop} from "react-icons/io5";
import {FaMobile} from "react-icons/fa";
import {deleteSession} from "@/actions/sessions";

const ActiveDevices: React.FC = () => {
    const { user } = useUser();
    const { client } = useClerk()
    const [sessions, setSessions] = useState<SessionWithActivitiesResource[]>([]);
    const { replace } = useRouter();
    const { session } = useSession()

    const fetchActiveDevices = async () => {
        const res = await user?.getSessions();
        setSessions(res || []);
    }

    useEffect(() => {
        fetchActiveDevices();
    }, [user])

    const removeDevice = async (ses: SessionWithActivitiesResource) => {
        try {
            if (session?.id === ses.id) {
                await client.activeSessions.find(el => el.id === ses.id)?.end();
                replace("/")
            } else {
                await deleteSession(ses.id)
                fetchActiveDevices();
            }
        } catch (e: any) {
            replace("/")
        }
    }

    return (
        <div className="mt-5 space-y-5">
            {sessions.map((ses, index) => (
                <div className="flex items-center justify-between space-x-7">
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex space-x-3">
                            <div>
                                {ses.latestActivity.isMobile ? <FaMobile size={32} /> : <IoLaptop size={32} />}
                            </div>
                            <div className="text-neutral-500 dark:text-neutral-400">
                                <div className="text-black font-[500] flex mb-1 dark:text-white">
                                    <div>{ses.latestActivity.deviceType}</div>
                                    {ses.id === session?.id && <div
                                        className="text-primary-500 text-[0.75rem] ml-2 py-0.5 px-1.5 bg-neutral-200 rounded-[0.5rem] dark:text-black">This
                                        device</div>}
                                </div>
                                <div>{ses.latestActivity.browserName} ({ses.latestActivity.browserVersion})</div>
                                <div>{ses.latestActivity.ipAddress} ({ses.latestActivity.city}, {ses.latestActivity.country})</div>
                                <div>{ses.lastActiveAt.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button variant="ghost" onClick={() => removeDevice(ses)}>Remove</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ActiveDevices