"use client";

import React, {useState} from 'react'
import {MdBugReport} from "react-icons/md";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import AddContentReportPopover from "@/components/pages/home/aside/popover-add-content-report";
import {Button} from "@/components/ui/button";
import api from "@/services/axiosApi";
import {useUser} from "@clerk/nextjs";
import {toast} from "@/hooks/use-toast";

const AddContentReportDialog: React.FC = () => {
    const {user} = useUser();

    const [open, setOpen] = useState(false)
    const [type, setType] = React.useState("bug")
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [subjectId, setSubjectId] = React.useState<number | null>(0)
    const [isLoading, setIsLoading] = useState(false)

    if (!user) return null;

    const handleAdd = async () => {
        setIsLoading(true);

        try {
            await api.post("/ContentReport", { senderUserId: user.id, type, title, description, subjectId });
            setIsLoading(false);
            toast({
                title: "Content reported",
                description: "The content has been successfully reported.",
            });
            setOpen(false);
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className={"w-full flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                <div className="text-2xl"><MdBugReport/></div>
                <div>Content Report</div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <h1 className="text-2xl">Report content</h1>
                </DialogHeader>

                <div className="flex flex-col">
                    <Label className="pb-1.5">Type</Label>
                    <AddContentReportPopover disabled={isLoading} value={type} setValue={setType} />
                </div>

                <div>
                    <Label>Title</Label>
                    <Input disabled={isLoading} placeholder={"Title"} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                    <Label>Description</Label>
                    <Input disabled={isLoading} placeholder={"Description"} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <DialogFooter>
                    <Button disabled={isLoading} onClick={handleAdd}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddContentReportDialog