import React from 'react'
import {Label} from "@/components/ui/label";

interface Props {
    icon: React.ReactNode,
    title: string,
    description: string,
    color: "red" | "green" | "yellow" | "gray",
    setAdminLevel: (level: number) => void,
    level: number,
    adminLevel: number
}

const AdminCategory = ({ icon, title, description, color, level, setAdminLevel, adminLevel }: Props) => {
    const handleClick = () => {
        setAdminLevel(level);
    }

    return (
        <article onClick={handleClick} className={"rounded-[0.5rem] border p-3 border-neutral-200 dark:border-neutral-500 duration-150 hover:bg-neutral-200 hover:dark:bg-neutral-800 cursor-pointer " + (adminLevel === level ? "bg-neutral-200 dark:bg-neutral-800" : "")}>
            <div className="flex justify-between">
                <div className="flex space-x-2 items-center">
                    {icon}
                    <Label className="text-[1rem] cursor-pointer">{title}</Label>
                </div>
                <div className={"w-3 h-3 rounded-full " + (color === "red" ? "bg-red-500" : color === "green" ? "bg-green-500" : color === "yellow" ? "bg-yellow-500" : "bg-gray-500")}/>
            </div>
            <p className="text-[0.9rem] text-neutral-500 mt-2.5">{description}</p>
        </article>
    )
}

export default AdminCategory