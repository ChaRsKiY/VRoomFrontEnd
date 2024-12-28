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

export default function AdAddDialog({ fetchAds }: { fetchAds: (page: number, perPage: number, searchQuery: string) =>  Promise<{data: any;total: any;}> }) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({
        title: '',
        description: '',
        url: '',
        imageURL: ''
    })

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
                title: 'Error',
                description: 'All fields are required.',
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
                title: 'Error',
                description: 'An error occurred. Please try again later.',
            })
            console.error(e)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Add new ad</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to add a new ad.
                    </DialogDescription>
                </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input id="title" value={data.title} className="col-span-3" onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input id="description" value={data.description} className="col-span-3"
                                   onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                Url
                            </Label>
                            <Input id="url" value={data.url} className="col-span-3"
                                   onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageURL" className="text-right">
                                Image URL
                            </Label>
                            <Input id="imageURL" value={data.imageURL} className="col-span-3" onChange={handleChange}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
