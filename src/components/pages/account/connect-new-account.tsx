"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";
import {OAuthStrategy} from "@clerk/types";

const availableProviders = ["apple", "google", "facebook"];

const iconMap: { [key: string]: JSX.Element } = {
    google: <FcGoogle />,
    facebook: <FaFacebookF />,
    apple: <FaApple />,
};

export function ConnectNewAccount() {
    const { user } = useUser();

    if (!user) return null;

    const connectedProviders: string[] =
        user.externalAccounts.filter(el => el.verification?.status === "verified").map((account) => account.provider) || [];

    const providersToDisplay = availableProviders.filter(
        (provider) => !connectedProviders.includes(provider)
    );

    const redirectUrl = "/account";

    const createExternalAccount = async (provider: string) => {
        try {
            const res: any = await user.createExternalAccount({
                strategy: ("oauth_" + provider) as OAuthStrategy,
                redirectUrl: `${window.location.origin}${redirectUrl}`,
            });

            if (res.verification.externalVerificationRedirectURL) {
                window.location.href = res.verification.externalVerificationRedirectURL.href;
            }
        } catch (error) {
            console.error("Error creating external account:", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="mt-7">Connect new</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {providersToDisplay.length > 0 ? (
                    providersToDisplay.map((provider) => (
                        <DropdownMenuItem
                            key={provider}
                            onClick={() => createExternalAccount(provider)}
                        >
                            {iconMap[provider.toLowerCase()] || (
                                <span>Unknown Platform</span>
                            )}
                            <div className="ml-1.5">
                                {provider.charAt(0).toUpperCase() +
                                    provider.slice(1)}
                            </div>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>
                        All providers connected
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
