import {FiMessageCircle} from "react-icons/fi";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {User} from "@clerk/nextjs/server";
import {Input} from "@/components/ui/input";
import {MdOutlineAssignmentReturn} from "react-icons/md";
import BackToHomeButton from "@/components/pages/admin/back-to-home-button";
import {SidebarTrigger} from "@/components/ui/sidebar";

interface HeaderProps {
    user: User | null,
    data: {
        title: string,
        description: string
    }
}

const Header = ({ user, data }: HeaderProps) => {
    return (
        <header className="flex justify-between items-center py-3">
            <div className="flex space-x-3 items-center">
                <SidebarTrigger className="w-12 h-12" />

                <div>
                    <h1 className="text-xl font-bold">{data.title}</h1>
                    <h3 className="mt-1.5 text-neutral-500">{data.description}</h3>
                </div>
            </div>

            <div className="flex items-center">
                <div className="flex items-center mr-8 space-x-5">
                    <BackToHomeButton />
                    <FiMessageCircle size={27} className="text-neutral-500"/>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl}/>
                        <AvatarFallback>VR</AvatarFallback>
                    </Avatar>
                </div>
                <Input placeholder="Search..." className="max-w-64 h-12"/>
            </div>
        </header>
    );
}

export default Header;