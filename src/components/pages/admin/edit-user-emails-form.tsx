import React, {useState} from 'react'
import {DataUser} from "@/types/datauser.interface";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {addUserEmail, deleteUserEmail, makeEmailPrimary} from "@/actions/admin";
import {toast} from "@/hooks/use-toast";
import {Input} from "@/components/ui/input";
import {useTranslation} from "next-i18next";

interface Props {
    user: DataUser,
    fetchUser: () => Promise<void>
}

const EditUserEmailsForm: React.FC<Props> = ({ user, fetchUser }: Props) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const [newEmail, setNewEmail] = useState<string>("")

    const { t } = useTranslation();

    const onNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value)
    }

    const removeEmail = async (emailId: string) => {
        setIsPending(true)
        try {
            const response = await deleteUserEmail(user.id, emailId)

            if (response === 'success') {
                await fetchUser()
                setIsPending(false)
            } else {
                const message = JSON.parse(response).message
                const longMessage = JSON.parse(response).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });

                setIsPending(false)
            }
        } catch (error) {
            setIsPending(false)
            console.error('Error removing email:', error)
        }
    }

    const addEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newEmail) return

        setIsPending(true)
        try {
            const response = await addUserEmail(user.id, newEmail)

            if (response === 'success') {
                await fetchUser()
                setIsPending(false)
            } else {
                const message = JSON.parse(response).message
                const longMessage = JSON.parse(response).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });

                setIsPending(false)
            }
        } catch (error) {
            setIsPending(false)
            console.error('Error adding email:', error)
        }
    }

    const makePrimary = async (emailId: string) => {
        setIsPending(true)
        try {
            const response = await makeEmailPrimary(user.id, emailId)

            if (response === 'success') {
                await fetchUser()
                setIsPending(false)
            } else {
                const message = JSON.parse(response).message
                const longMessage = JSON.parse(response).longMessage

                toast({
                    title: message,
                    description: longMessage,
                    className: "text-red-500 bg-red-100",
                    duration: 6500
                });

                setIsPending(false)
            }
        } catch (error) {
            setIsPending(false)
            console.error('Error making email primary:', error)
        }
    }

    return (
        <article className="px-1 space-y-2">
            {user.emailAddresses.map((email) => (
                <div key={email.id} className="border border-neutral-200 rounded-[0.5rem] p-2.5">
                    <div className="flex justify-between items-center">
                        <p className="text-[1.05rem]">{email.emailAddress}</p>
                        {email.id === user.primaryEmailAddressId && (
                            <Label>{t("admin-main:primary")}</Label>
                        )}
                    </div>

                    {email.verification === null && (
                        <p className="text-neutral-500 text-[0.85rem]">{t("admin-main:not-verified")}</p>
                    )}

                    {email.verification && email.verification.status !== "verified" && (
                        <p className="text-neutral-500 text-[0.85rem]">{t("admin-main:not-verified")}</p>
                    )}

                    <div className="h-[1px] rounded-full bg-neutral-200 my-2"/>

                    <div className="space-x-1.5">
                        {email.verification && email.verification.status === "verified" && email.id !== user.primaryEmailAddressId && <Button disabled={isPending} variant="outline" onClick={() => makePrimary(email.id)}>Make primary</Button>}
                        <Button disabled={isPending} variant="outline" onClick={() => removeEmail(email.id)}>{t("admin-main:remove")}</Button>
                    </div>
                </div>
            ))}

            <form className="pt-3" onSubmit={addEmail}>
                <Label>{t("admin-main:adding-new-email")}</Label>
                <Input onChange={onNewEmailChange} type="email" placeholder={t("admin-main:email")} className="w-full"/>
                <Button disabled={isPending} className="w-full mt-2.5" type="submit">{t("admin-main:add-new")}</Button>
            </form>
        </article>
    )
}

export default EditUserEmailsForm