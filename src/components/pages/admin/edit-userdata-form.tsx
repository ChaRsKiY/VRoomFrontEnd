"use client"

import React, {useRef} from 'react'
import {EditData} from "@/components/pages/admin/admin-user-edit-modal";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {IoIosClose} from "react-icons/io";
import {updateUserBaseData} from "@/actions/admin";
import {useTranslation} from "next-i18next";

interface Props {
    setData: (prev: EditData) => void,
    data: EditData,
    userHasImage: boolean,
    baseAvatarUrl: string
}

const EditUserDataForm = ({ setData, data, userHasImage, baseAvatarUrl }: Props) => {
    const { t } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            userData: {
                ...data.userData,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <article className="px-1 space-y-2">
            <div>
                <Label>{t("admin-main:username")}</Label>
                <Input
                    value={data.userData.username}
                    name="username"
                    onChange={handleChange}/>
            </div>
            <div>
                <Label>{t("admin-main:first-name")}</Label>
                <Input
                    value={data.userData.firstName}
                    name="firstName"
                    onChange={handleChange}/>
            </div>
            <div>
                <Label>{t("admin-main:last-name")}</Label>
                <Input
                    value={data.userData.lastName}
                    name="lastName"
                    onChange={handleChange}/>
            </div>
        </article>
    )
}

export default EditUserDataForm