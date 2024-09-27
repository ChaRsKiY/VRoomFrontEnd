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
import { Label } from "@/components/ui/label"
import React, { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface VerifyEmailDialogProps {
    emailId: string;
}

const VerifyEmailDialog: React.FC<VerifyEmailDialogProps> = ({ emailId }) => {
    const { user } = useUser();

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
            clearInterval(intervalRef.current);
        }
        setCodeResendTimer(30);
        intervalRef.current = setInterval(() => {
            setCodeResendTimer((prev) => prev - 1);
        }, 1000);
    };

    const handleVerifyEmail = async () => {
        try {
            const emailAddress = user?.emailAddresses.find((a) => a.id === emailId);
            if (emailAddress) {
                await emailAddress.prepareVerification({ strategy: "email_code" });
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
    };

    const verifyEmailCode = async (code: string) => {
        try {
            const emailAddress = user?.emailAddresses.find((a) => a.id === emailId);
            if (emailAddress) {
                await emailAddress.attemptVerification({ code });
                await user?.reload();
                setIsVerifying(false);
                setIsOpen(false); // Закрытие диалога после успешной верификации
                if (intervalRef.current) {
                    clearInterval(intervalRef.current); // Очистка таймера после завершения
                }
            }
        } catch (e: any) {
            toast({
                title: e.errors[0].message,
                description: e.errors[0].longMessage,
                className: "text-red-500 bg-red-100",
            });
        }
    };

    const handleCodeChanged = async (value: string) => {
        if (value.length === 6) {
            await verifyEmailCode(value);
        }
    };

    return (
        <Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-blue-500 hover:text-blue-500">
                    Verify
                </Button>
            </DialogTrigger>
            {!isVerifying ? (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Verify email</DialogTitle>
                        <DialogDescription>
                            A verification code will be sent to this email address.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleVerifyEmail}>Send Code</Button>
                    </DialogFooter>
                </DialogContent>
            ) : (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Enter verification code</DialogTitle>
                        <DialogDescription>
                            Please enter the verification code sent to your email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pb-4 flex flex-col items-center">
                        <div className="flex flex-col">
                            <Label htmlFor="code" className="mb-1.5">
                                Code
                            </Label>
                            <InputOTP name="code" onChange={handleCodeChanged} maxLength={6}
                                      pattern={REGEXP_ONLY_DIGITS}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                    <InputOTPSlot index={4}/>
                                    <InputOTPSlot index={5}/>
                                </InputOTPGroup>
                            </InputOTP>

                            {codeResendTimer === 0 ? (
                                <Button variant="ghost" className="mt-4 w-full" onClick={() => {
                                    const emailAddress = user?.emailAddresses.find((a) => a.id === emailId);
                                    emailAddress?.prepareVerification({strategy: "email_code"});
                                    resetInterval();
                                }}>Resend code</Button>
                            ) : (
                                <Button variant="ghost" className="mt-4 w-full" disabled>Resend code
                                    in {codeResendTimer} seconds</Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default VerifyEmailDialog;
