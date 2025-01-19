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
import {useState} from "react";
import api from "@/services/axiosApi";
import {toast} from "@/hooks/use-toast";
import {useTranslation} from "next-i18next";

export default function AdAddDialog({ fetchAds }: { fetchAds: (page: number, perPage: number, searchQuery: string) =>  Promise<{data: any;total: any;}> }) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({
        title: '',
        description: '',
        url: '',
        imageURL: ''
    })

    const { t } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (data.title.length < 2 || data.description.length < 2 || data.url.length < 2 || data.imageURL.length < 2) {
            toast({
                title: t("admin-main:error"),
                description: t("admin-main:all-fields-required-error"),
                className: 'bg-red-200 text-red-800'
            })
            return;
        }

        try {
            await api.post('/Ad', data);
            await fetchAds(1, 10, '');
            setOpen(false);
        } catch (e) {
            toast({
                title: t("admin-main:error"),
                description: t("admin-main:something-went-wrong"),
            })
            console.error(e)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("admin-main:add")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{t("admin-main:add-new-ad")}</DialogTitle>
                    <DialogDescription>
                        {t("admin-main:fill-in-all-fields")}
                    </DialogDescription>
                </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                {t("admin-main:title")}
                            </Label>
                            <Input id="title" value={data.title} className="col-span-3" onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                {t("admin-main:description")}
                            </Label>
                            <Input id="description" value={data.description} className="col-span-3"
                                   onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                {t("admin-main:url")}
                            </Label>
                            <Input id="url" value={data.url} className="col-span-3"
                                   onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageURL" className="text-right">
                                {t("admin-main:image-url")}
                            </Label>
                            <Input id="imageURL" value={data.imageURL} className="col-span-3" onChange={handleChange}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{t("admin-main:add")}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
