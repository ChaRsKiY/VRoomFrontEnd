"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { changeAdminLevelMetadata } from "@/actions/admin";
import AdminCategory from "@/components/pages/admin/admin-category";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdOutlineAddModerator } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import { useUser } from "@clerk/nextjs";
import { DataUser } from "@/types/datauser.interface";

interface Props {
    user: DataUser;
    userId: string;
    fetchUser: () => void;
    currentUserAdminLevel: number;
}

const ROLES = [
    {
        level: 0,
        icon: <AiOutlineUserDelete size={23} />,
        title: "User",
        description: "Standard user with no administrative access, only able to view and interact with content.",
        color: "gray"
    },
    {
        level: 1,
        icon: <MdOutlineAddModerator size={23} />,
        title: "Moderator",
        description: "Reviews user complaints and flagged content, enforcing guidelines; can block users but lacks administrative access.",
        color: "green"
    },
    {
        level: 2,
        icon: <GrUserManager size={23} />,
        title: "Content Manager",
        description: "Oversees ads, content quality, and user complaints, with access to performance reports but limited system permissions.",
        color: "yellow"
    },
    {
        level: 3,
        icon: <RiAdminLine size={23} />,
        title: "Administrator",
        description: "Has full platform control, managing users, settings, security, and content standards across the system.",
        color: "red"
    }
];

const SetAdminModal = ({ user, userId, fetchUser, currentUserAdminLevel }: Props) => {
    const userAdminLevel = user.privateMetadata.adminLevel || 0;
    const { user: currentUser } = useUser();
    const [newAdminLevel, setNewAdminLevel] = useState<number>(userAdminLevel);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    if (!currentUser) return null;

    const handleSubmit = async () => {
        setIsPending(true);
        const response = await changeAdminLevelMetadata(userId, newAdminLevel);
        if (response === 'success') {
            await fetchUser();
            setOpen(false);
        }
        setIsPending(false);
    };

    const onOpenChange = (isOpen: boolean) => {
        setNewAdminLevel(userAdminLevel);
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {currentUserAdminLevel > 1 && (
                    <Button variant="outline" className="mr-2 mb-2">
                        {user.privateMetadata.isAdmin ? "Edit Admin" : "Set Admin"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set {user.username} as admin</DialogTitle>
                    <DialogDescription>
                        You are about to set {user.username} as an admin. Are you sure you want to proceed?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="adminlvl_number" className="text-right pb-1.5">Admin Level</Label>
                        {ROLES.map(
                            ({ level, icon, title, description, color }) =>
                                level !== userAdminLevel &&
                                (currentUserAdminLevel > level || currentUserAdminLevel === 3) && (
                                    <AdminCategory
                                        key={level}
                                        icon={icon}
                                        title={title}
                                        description={description}
                                        color={color as "red" | "green" | "yellow" | "gray"}
                                        setAdminLevel={setNewAdminLevel}
                                        adminLevel={newAdminLevel}
                                        level={level}
                                    />
                                )
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={isPending} onClick={handleSubmit} type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SetAdminModal;
