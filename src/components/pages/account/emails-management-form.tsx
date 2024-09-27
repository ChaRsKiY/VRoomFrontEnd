"use client"

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { EmailAddressResource } from "@clerk/types";
import { deleteEmailAddress, setPrimaryEmailAddress } from "@/actions/account";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AddEmailDialog } from "@/components/pages/account/add-email-dialog";
import VerifyEmailDialog from "@/components/pages/account/verify-email-dialog";

const EmailsManagementForm: React.FC = () => {
    const { user } = useUser();
    const emails = user?.emailAddresses || [];
    const [refreshKey, setRefreshKey] = useState(0);

    const removeEmail = async (email: EmailAddressResource) => {
        const response = await deleteEmailAddress(email.id);

        if (response.success) {
            user?.reload();
            setRefreshKey(prev => prev + 1); // Обновляем состояние для перерисовки
        } else {
            toast({
                title: response.error,
                description: response.longError,
                className: "text-red-500 bg-red-100",
            });
        }
    };

    const setPrimaryEmail = async (email: EmailAddressResource) => {
        const response = await setPrimaryEmailAddress(email.id);

        if (response.success) {
            user?.reload();
            setRefreshKey(prev => prev + 1); // Обновляем состояние для перерисовки
        } else {
            toast({
                title: response.error,
                description: response.longError,
                className: "text-red-500 bg-red-100",
            });
        }
    };

    return (
        <div className="mt-5">
            {emails.map((email, index) => (
                <div key={index} className="flex items-center justify-between mt-4">
                    <div className="flex space-x-3">
                        <div>{email.emailAddress}</div>
                        {email.id === user?.primaryEmailAddressId && (
                            <div className="px-2 py-0.5 text-[0.85rem] rounded-[0.5rem] bg-neutral-100 items-center">Primary</div>
                        )}
                        {email.verification.status !== "verified" && (
                            <div className="px-2 py-0.5 text-[0.85rem] rounded-[0.5rem] bg-neutral-100 items-center">
                                {(email.verification.status?.charAt(0).toUpperCase() ?? '') + (email.verification.status?.slice(1) ?? '')}
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-1">
                        {email.verification.status !== "verified" && (
                            <VerifyEmailDialog key={email.id} emailId={email.id} />
                        )}
                        {email.id !== user?.primaryEmailAddressId && email.verification.status === "verified" && (
                            <Button variant="ghost" onClick={() => setPrimaryEmail(email)} className="text-blue-500 hover:text-blue-500">
                                Set primary
                            </Button>
                        )}
                        <Button variant="ghost" onClick={() => removeEmail(email)} className="text-red-500 hover:text-red-500 hover:bg-red-100">
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
            <AddEmailDialog refreshKey={refreshKey} />
        </div>
    );
};

export default EmailsManagementForm;
