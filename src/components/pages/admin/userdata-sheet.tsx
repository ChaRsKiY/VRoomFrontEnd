import React, { useEffect, useState, useMemo } from 'react';
import { banUser, getAdminLevel, getUserById, unbanUser } from "@/actions/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import DeleteUserModal from "@/components/pages/admin/delete-user-modal";
import { parseProvider, parseProviderToIcon } from "@/utils/admin-parsers";
import { DataUser } from "@/types/datauser.interface";
import SetAdminModal from "@/components/pages/admin/set-admin-modal";
import AdminUserEditModal from "@/components/pages/admin/admin-user-edit-modal";
import {SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toggleBanUser} from "@/lib/admin-user";

interface Props {
    userId: string;
    fetchTableUsers: () => void;
    onOpenSheetChange: (open: boolean) => void;
    currentUserAdminLevel: number;
}

export default function UserDataSheet({ currentUserAdminLevel, userId, onOpenSheetChange, fetchTableUsers }: Props) {
    const [user, setUser] = useState<DataUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useUser();
    const [highlightedEmail, setHighlightedEmail] = useState<string | null>(null);
    const [banStatePending, setBanStatePending] = useState<boolean>(false);

    const parseAdminLevelToBadge = useMemo(() => (level: number) => {
        const badgeStyles = "py-0.5 px-2 text-[0.9rem] ml-3 text-white rounded-[0.5rem]";
        if (level === 1) return <div className={`${badgeStyles} bg-green-400`}>Moderator</div>;
        if (level === 2) return <div className={`${badgeStyles} bg-yellow-400`}>Content Manager</div>;
        if (level === 3) return <div className={`${badgeStyles} bg-red-400`}>Admin</div>;
        return null;
    }, []);

    const handleClick = (email: string) => {
        setHighlightedEmail(email);
        document.getElementById(`email-${email}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        setTimeout(() => setHighlightedEmail(null), 2000);
    };

    const fetchUser = async () => {
        setLoading(true);
        const [responseUser] = await Promise.all([
            getUserById(userId),
        ]);

        if (responseUser !== "unauthorized") setUser(JSON.parse(responseUser));
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, [currentUser]);

    if (loading || !user || !currentUser) {
        return (
            <div className="w-full h-full flex justify-center items-center font-bold">
                <Label className="text-[1.5rem]">Loading</Label>
            </div>
        );
    }

    const isCurrentUser = user.id === currentUser.id;
    const canEdit = currentUserAdminLevel === 3 || isCurrentUser;
    const canBan = currentUserAdminLevel === 3 && !isCurrentUser;
    const canChangeAdmin = currentUserAdminLevel >= user.privateMetadata.adminLevel && !isCurrentUser;
    const canDelete = currentUserAdminLevel === 3 && !isCurrentUser;

    return (
        <>
            <SheetHeader>
                <SheetTitle className="flex items-center">
                    {user.username}
                    <div className="flex space-x-2 ml-3">
                        {isCurrentUser && <div className="py-0.5 px-2 text-[0.9rem] text-white bg-blue rounded-[0.5rem]">You</div>}
                        {user.banned && <div className="py-0.5 px-2 text-[0.9rem] ml-3 text-white bg-red-700 rounded-[0.5rem]">Banned</div>}
                        {user.privateMetadata.isAdmin && parseAdminLevelToBadge(user.privateMetadata.adminLevel)}
                    </div>
                </SheetTitle>
                <SheetDescription className="text-left">{user.id}</SheetDescription>
            </SheetHeader>
            <div className="my-6">
                <article className="flex space-x-4 items-center">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={user.imageUrl}/>
                        <AvatarFallback>VR</AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-2 items-center">
                        <div>
                            <Label>Firstname</Label>
                            <Input value={user.firstName} disabled/>
                        </div>
                        <div>
                            <Label>Lastname</Label>
                            <Input value={user.lastName} disabled/>
                        </div>
                    </div>
                </article>

                <article className="flex mt-5 max-sm:text-[0.75rem]">
                    <div className="flex-1">
                        <Label>Last active:</Label>
                        <p className="text-neutral-500">{user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : "-"}</p>
                    </div>
                    <div className="flex-1">
                        <Label>Created at:</Label>
                        <p className="text-neutral-500">{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                </article>

                <article className="flex mt-3 max-sm:text-[0.75rem]">
                    <div className="flex-1">
                        <Label>Last sign in:</Label>
                        <p className="text-neutral-500">{new Date(user.lastSignInAt).toLocaleString()}</p>
                    </div>
                    <div className="flex-1">
                        <Label>Updated at:</Label>
                        <p className="text-neutral-500">{new Date(user.updatedAt).toLocaleString()}</p>
                    </div>
                </article>

                <article className="flex mt-3 max-sm:text-[0.75rem]">
                    <div className="flex-1">
                        <Label>Two Factor Enabled:</Label>
                        <p className="text-neutral-500">{user.twoFactorEnabled ? "Yes" : "No"}</p>
                    </div>
                    <div className="flex-1">
                        <Label>Backup Code Enabled:</Label>
                        <p className="text-neutral-500">{user.backupCodeEnabled ? "Yes" : "No"}</p>
                    </div>
                </article>

                <div className="h-[1px] bg-neutral-200 rounded-[0.5rem] mt-4 mb-3"/>

                <article className="space-y-2">
                    <Label>Emails</Label>
                    <div className="space-y-2.5">{user.emailAddresses.map((email, key) => (
                        <div
                            key={key}
                            id={`email-${email.emailAddress}`}
                            className={`border-[1px] px-3 py-2 rounded-[0.5rem] transition-colors duration-500 ${
                                highlightedEmail === email.emailAddress ? 'bg-green-100 dark:bg-green-800' : 'bg-transparent'
                            }`}>
                            <div id="target-element" className="font-bold">{email.emailAddress}</div>
                            {user.primaryEmailAddressId === email.id &&
                                <div className="italic text-[0.9rem]">Primary</div>}

                            <div className="flex mt-2 space-x-2 flex-wrap">
                                {user.externalAccounts.map((provider, key) => {
                                        if (provider.emailAddress === email.emailAddress) {
                                            return (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <h2 className="text-[0.9rem]">{parseProvider(provider.verification?.strategy)}</h2>
                                                </div>
                                            )
                                        }
                                    }
                                )}
                            </div>
                        </div>
                    ))}</div>
                </article>

                <article className="mt-4 space-y-2">
                    <Label>Phone numbers</Label>
                    <div
                        className="space-y-2.5">{user.phoneNumbers.length ? user.phoneNumbers.map((phoneNumber, key) => (
                        <div key={key}>
                            <div className="border-b-[1px] pb-1">{phoneNumber.phoneNumber}</div>

                            {user.primaryPhoneNumberId === phoneNumber.id &&
                                <div className="italic text-[0.9rem]">Primary</div>}
                        </div>
                    )) : (
                        <div className="italic text-[0.8rem]">No phone numbers</div>
                    )}
                    </div>
                </article>

                <article className="mt-4 space-y-2">
                    <Label>External accounts</Label>
                    <div
                        className="space-y-2.5">{user.externalAccounts.length ? user.externalAccounts.map((provider, key) => (
                        <div key={key} className="border-[1px] px-3 py-2 rounded-[0.5rem]">
                            <div className="flex items-center space-x-2">
                                {parseProviderToIcon(provider.verification?.strategy)}
                                <h2 className="font-bold">{parseProvider(provider.verification?.strategy)}</h2>
                            </div>
                            <Button variant="link"
                                    onClick={() => handleClick(provider.emailAddress)}
                                    className="py-0 mt-1 italic text-[0.9rem]">{provider.emailAddress}
                            </Button>
                        </div>
                    )) : (
                        <div className="italic text-[0.8rem]">No external accounts</div>
                    )}
                    </div>
                </article>

                <div className="h-[1px] bg-neutral-200 rounded-[0.5rem] mt-4 mb-3"/>

                <article className="space-y-2">
                    <Label>Actions</Label>
                    <div className="flex flex-wrap">
                        {canBan && (
                            <Button className="mr-2 mb-2" disabled={banStatePending} variant="outline"
                                    onClick={() => toggleBanUser(user.id, user.banned ? "unban" : "ban", setBanStatePending, fetchUser)}>
                                {user.banned ? "Unban" : "Ban"}
                            </Button>
                        )}
                        {canEdit && <AdminUserEditModal user={user}/>}
                        {canChangeAdmin && <SetAdminModal user={user} userId={user.id} fetchUser={fetchUser}
                                                          currentUserAdminLevel={currentUserAdminLevel}/>}
                        {canDelete && <DeleteUserModal userId={user.id} username={user.username}
                                                     onOpenSheetChange={onOpenSheetChange}
                                                     fetchTableUsers={fetchTableUsers}/>}
                    </div>
                </article>
            </div>

            <SheetFooter>
                <SheetClose asChild>
                    <Button type="submit">Close</Button>
                </SheetClose>
            </SheetFooter>
        </>
    );
}