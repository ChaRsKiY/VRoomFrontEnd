"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, {useEffect, useRef, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {useUser} from "@clerk/nextjs";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";

export function AddEmailDialog({}: any) {
    const { user } = useUser()

    const [email, setEmail] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [codeResendTimer, setCodeResendTimer] = useState<number>(30);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (codeResendTimer === 0 && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [codeResendTimer]);

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Очистка предыдущего таймера
        }
        setCodeResendTimer(30);
        intervalRef.current = setInterval(() => {
            setCodeResendTimer((prev) => prev - 1);
        }, 1000);
    }

    const handleAddEmail = async () => {
        try {
            const res = await user?.createEmailAddress({ email })
            await user?.reload()
            const emailAddress = user?.emailAddresses.find((a) => a.id === res?.id)
            if (emailAddress) {
                emailAddress.prepareVerification({ strategy: "email_code" });
                setIsVerifying(true);
                resetInterval();
            }
        } catch (e: any) {
            toast({
                title: e.errors[0].message,
                description: e.errors[0].longMessage,
                className: "text-red-500 bg-red-100",
            });
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const verifyEmail = async (code: string) => {
        try {
            const emailAddress = user?.emailAddresses.find((a) => a.emailAddress === email);
            await emailAddress?.attemptVerification({ code });

            toast({
                title: "Email verified",
                description: "Your email has been successfully verified",
                className: "text-green-500 bg-green-100",
            })

            await user?.reload();

            setIsVerifying(false); // Сброс флага верификации после успешного подтверждения
            setEmail(''); // Очистка поля email
            setIsOpen(false); // Закрытие диалога
        } catch (e: any) {
            toast({
                title: e.errors[0].message,
                description: e.errors[0].longMessage,
                className: "text-red-500 bg-red-100",
            });
        }
    }

    const handleCodeChanged = async (value: string) => {
        if (value.length === 6) {
            await verifyEmail(value);
        }
    }

    const closeDialog = () => {
        setEmail(''); // Очистка email
        setIsVerifying(false); // Сброс состояния верификации
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Очистка интервала при закрытии
        }
    }

    const handleOpenCloseChange = (open: boolean) => {
        setIsOpen(open)

        if (!open) {
            closeDialog();
        }
    }

    return (
        <Dialog onOpenChange={handleOpenCloseChange} open={isOpen}>
            <DialogTrigger asChild>
                <Button className="mt-7">Add new</Button>
            </DialogTrigger>
            {!isVerifying ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add new email</DialogTitle>
                        <DialogDescription>
                            An email containing a verification code will be sent to this email address.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pb-4">
                        <div className="">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input onChange={handleEmailChange} id="email" value={email} required type="email" placeholder="Type here" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddEmail} type="submit">Send</Button>
                    </DialogFooter>
                </DialogContent>
            ) : (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Verify your email</DialogTitle>
                        <DialogDescription>
                            A verification code has been sent to your email address. Please check your inbox.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pb-4 flex flex-col items-center">
                        <div className="flex flex-col">
                            <Label htmlFor="code" className="mb-1.5">
                                Code
                            </Label>
                            <InputOTP name="code" onChange={handleCodeChanged} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            {codeResendTimer === 0 ? (
                                <Button variant="ghost" className="mt-4 w-full" onClick={() => {
                                    const emailAddress = user?.emailAddresses.find((a) => a.emailAddress === email);
                                    emailAddress?.prepareVerification({ strategy: "email_code" });
                                    resetInterval();
                                }}>Resend code</Button>
                            ) : (
                                <Button variant="ghost" className="mt-4 w-full" disabled>Resend code in {codeResendTimer} seconds</Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    )
}
