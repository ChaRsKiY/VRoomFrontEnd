import React, {PropsWithChildren} from 'react'
import Image from "next/image";
import {FiUsers} from "react-icons/fi";
import {RiAdvertisementLine, RiFolderVideoLine} from "react-icons/ri";
import {FaRegComment} from "react-icons/fa6";
import {TbReportAnalytics, TbReportSearch} from "react-icons/tb";
import {IoSettingsOutline} from "react-icons/io5";

const AdminLayout: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    return (
        <div className="pl-4 py-4 bg-neutral-100 w-full flex">
            <aside className="bg-white rounded-xl min-h-screen w-fit p-4 flex flex-col items-center">
                <Image src="/logo.svg" alt="logo" width={120} height={120}/>
                <div className="text-center text-neutral-500 text-[0.8rem]">Admin panel</div>

                <div className="mt-5 flex flex-col space-y-1">
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer bg-blue-600 text-white">
                        <FiUsers/>
                        <div>User Management</div>
                    </div>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <RiFolderVideoLine/>
                        <div>Video Management</div>
                    </div>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <FaRegComment/>
                        <div>Comments and Moderation</div>
                    </div>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <TbReportSearch/>
                        <div>Content Reports</div>
                    </div>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <TbReportAnalytics/>
                        <div>Analytics and Statistics</div>
                    </div>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <RiAdvertisementLine/>
                        <div>Ad Management</div>
                    </div>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <IoSettingsOutline/>
                        <div>System Settings</div>
                    </div>
                </div>
            </aside>
            {children}
        </div>
    )
}

export default AdminLayout