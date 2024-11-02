import {FiMessageCircle} from "react-icons/fi";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {User} from "@clerk/nextjs/server";

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
            <div>
                <h1 className="text-xl font-bold">{data.title}</h1>
                <h3 className="mt-1.5 text-neutral-500">{data.description}</h3>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-8 space-x-4">
                    <FiMessageCircle size={27} className="text-neutral-500"/>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl}/>
                        <AvatarFallback>VR</AvatarFallback>
                    </Avatar>
                </div>
                <input className="p-2 px-3.5 min-h-12 bg-[rgb(237,237,237)] rounded-[0.5rem] outline-none"
                       placeholder="Search here.."/>
            </div>
        </header>
    );
}

export default Header;