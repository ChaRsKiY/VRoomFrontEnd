"use client"

import React from 'react'
import {usePathname} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {FiUsers} from "react-icons/fi";
import {RiAdvertisementLine, RiFolderVideoLine} from "react-icons/ri";
import {FaRegComment} from "react-icons/fa6";
import {TbReportAnalytics, TbReportSearch} from "react-icons/tb";
import {IoSettingsOutline} from "react-icons/io5";

const AsideBar: React.FC = () => {
    const currentPath = usePathname();

    const isActive = (path: string) => {
        const normalizedPath = currentPath.replace(/^\/[a-z]{2}\//, '/');

        if (normalizedPath === '/admin' && path === '/admin') {
            return 'bg-blue-600 text-white';
        } else if (path !== '/admin' && normalizedPath.startsWith(path)) {
            return 'bg-blue-600 text-white';
        }

        return 'hover:bg-blue hover:text-white';
    };


    return (
            <aside className="bg-white dark:bg-neutral-950 rounded-xl min-h-screen w-fit p-4 flex flex-col items-center">
                <Image src="/logo.svg" alt="logo" width={120} height={120} />
                <div className="text-center text-neutral-500 text-[0.8rem]">Admin panel</div>

                <div className="bg-blue-600 text-white hover:bg-blue hover:text-white" />

                <div className="mt-5 flex flex-col space-y-1">
                    <Link href="/admin">
                        <div className={`flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer ${isActive('/admin')}`}>
                            <FiUsers />
                            <div>User Management</div>
                        </div>
                    </Link>
                    <Link href="/admin/video-management">
                        <div className={`flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer ${isActive('/admin/video-management')}`}>
                            <RiFolderVideoLine />
                            <div>Video Management</div>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <FaRegComment />
                        <div>Comments and Moderation</div>
                    </div>
                    <Link href="/admin/content-reports">
                        <div
                            className={`flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer ${isActive('/admin/content-reports')}`}>
                            <TbReportSearch/>
                            <div>Content Reports</div>
                        </div>
                    </Link>
                    <Link href="/admin/statistic">
                        <div
                            className={`flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer ${isActive('/admin/statistic')}`}>
                            <TbReportAnalytics/>
                            <div>Analytics and Statistics</div>
                        </div>
                    </Link>
                    <Link href="/admin/ad-managament">
                        <div
                            className={`flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer ${isActive('/admin/ad-management')}`}>
                            <RiAdvertisementLine/>
                            <div>Ad Management</div>
                        </div>
                    </Link>
                    <div
                        className="flex items-center space-x-2.5 min-w-32 p-3 rounded-[0.5rem] cursor-pointer hover:bg-blue hover:text-white">
                        <IoSettingsOutline/>
                        <div>System Settings</div>
                    </div>
                </div>
            </aside>
    );
}

export default AsideBar