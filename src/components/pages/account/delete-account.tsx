"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useEffect, useRef, useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

export function DeleteAccount() {
    const { user } = useUser()
    const [timer, setTimer] = useState<number>(15)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { replace } = useRouter();

    const startTimer = () => {
        setTimer(15);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setTimer(prevState => prevState - 1)
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleDelete = async () => {
        await user?.delete();
        replace("/");
    }

    return (
        <div className="mt-5">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive" onClick={startTimer}>Delete</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={handleDelete} disabled={timer > 0} variant="destructive">{timer <= 0 ? "Yes, delete my account" : timer}</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}