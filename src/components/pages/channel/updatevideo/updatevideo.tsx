'use client'

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IVideo } from "@/types/videoinfo.interface"
import { IChannel } from "@/types/channelinfo.interface"
import api from '@/services/axiosApi'
import { Upload, X, Plus } from 'lucide-react'


interface IChannelEditProps {
    params: { locale: string }
}

interface Category {
    id: number
    name: string
    videosId: number[]
}

interface Tag {
    id: number
    name: string
    videosId: number[]
}

const VideoUpdateInterface: React.FC = () => {

    const [video, setVideo] = useState<IVideo | null>(null)
    const [availableVideos, setAvailableVideos] = useState<IVideo[]>([])
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [visibility, setVisibility] = useState('private')
    const [isAgeRestricted, setAgeRestricted] = useState(false)
    const [videoName, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
    const [thumbnailBase64, setThumbnailBase64] = useState<string>("")
    const [newCategory, setNewCategory] = useState('')
    const [currentTag, setCurrentTag] = useState('')
    const [isCopyright, setIsCopyright] = useState<boolean>(false)
    const [audience, setAudience] = useState<string>('all')
    const [userChannel, setUserChannel] = useState<IChannel | null>(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [tagIds, setTagIds] = useState<number[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const { user } = useUser()

    const [isUpdating, setIsUpdating] = useState(false)
    const [updateProgress, setUpdateProgress] = useState(0)
    const [updateComplete, setUpdateComplete] = useState(false)


    useEffect(() => {
        if (user) {
            fetchAvailableVideos()
            fetchCategories()
            getUserChannel()
        }
    }, [user])

    const fetchAvailableVideos = async () => {
        try {
            const response = await api.get(`/Video/getbychannelid/${user?.id}`)
            setAvailableVideos(response.data)
        } catch (error) {
            console.error('Error fetching available videos:', error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await api.get('/Category')
            setCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const getUserChannel = async () => {
        if (user) {
            try {
                const response = await api.get('/ChannelSettings/getbyownerid/' + user.id)
                if (response.status === 200) {
                    setUserChannel(response.data)
                }
            } catch (error) {
                console.error('Error fetching user channel.json:', error)
            }
        }
    }

    const addCategory = () => {
        if (newCategory && !categories.some((category) => category.name === newCategory)) {
            const newCategoryObj: Category = {
                id: 0,
                name: newCategory,
                videosId: []
            }
            setCategories([...categories, newCategoryObj])
            DownloadCategory(newCategoryObj)
            setNewCategory('')
        }
    }

    const DownloadCategory = async (category: Category) => {
        try {
            const response = await api.post('/Category/add', category, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.status != 200) {
                throw new Error('Failed to add category')
            }
            console.log('Category added successfully')
            await fetchCategories()
            return response.data.id
        } catch (error) {
            console.error('Error adding category:', error)
        }
    }

    const handleVideoSelect = async (videoId: number) => {
        try {
            const response = await api.get(`/Video/${videoId}`)
            const videoData = response.data
            setVideo(videoData)
            setTitle(videoData.tittle)
            setDescription(videoData.description)
            setCategory(videoData.category)
            setTags(videoData.tags || [])
            setVisibility(videoData.visibility ? 'public' : 'private')
            setAgeRestricted(videoData.isAgeRestriction)
            setIsCopyright(videoData.isCopyright)
            setAudience(videoData.audience)
            setSelectedCategoryId(videoData.categoryIds)
            setTagIds(videoData.tagIds || [])
            setThumbnailPreview(`data:image/jpeg;base64,${videoData.cover}`)
        } catch (error) {
            console.error('Error fetching video details:', error)
        }
    }

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTag(e.target.value)
    }

    const addTag = async (tagName: string) => {
        if (tagName && !tags.some(tag => tag.name === tagName)) {
            const newTagObj: Tag = {
                id: 0,
                name: tagName,
                videosId: [],
            }
    
            setTags(prevTags => [...prevTags, newTagObj])
    
            try {
                await api.post('/Tag/add', newTagObj)
                await fetchTagIdByName(tagName)
            } catch (error) {
                console.error('Error adding tag:', error)
            } finally {
                setCurrentTag("")
            }
        }
    }

    const fetchTagIdByName = async (tagName: string): Promise<void> => {
        try {
            const response = await api.get(`/Tag/getbytagname/${tagName}`)
    
            if (response.status !== 200 || !response.data.id) {
                throw new Error('Failed to fetch tag ID')
            }
    
            const tagId = response.data.id
    
            setTagIds(prevIds => {
                if (!prevIds.includes(tagId)) {
                    return [...prevIds, tagId]
                }
                return prevIds
            })
    
            setTags(prevTags =>
                prevTags.map(tag =>
                    tag.name === tagName ? { ...tag, id: tagId } : tag
                )
            )
        } catch (error) {
            console.error('Error fetching tag ID:', error)
            throw error
        }
    }

    const removeTag = (id: number) => {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== id))
        setTagIds((prevIds) => prevIds.filter((tagId) => tagId !== id))
    }

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        
        if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
            setThumbnail(file)
            
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = reader.result?.toString().split(',')[1] || ""
                setThumbnailBase64(base64String)
                setThumbnailPreview(`data:${file.type};base64,${base64String}`)
            }
    
            reader.readAsDataURL(file)
        } else {
            console.error("Unsupported file format. Please select a PNG or JPEG image.")
        }
    }

    const handleSubmit = async () => {
        if (!video) return

        setIsUpdating(true)
        setUpdateProgress(0)
        setUpdateComplete(false)

        try {
            const updatedVideoData = {
                ...video,
                tittle: videoName,
                description: description,
                cover: thumbnailBase64 || video.cover,
                visibility: visibility === 'public',
                isAgeRestriction: isAgeRestricted,
                isCopyright: isCopyright,
                audience: audience,
                categoryIds: selectedCategoryId,
                tagIds: tagIds,
            }

            const response = await api.put(`/Video/${video.id}`, updatedVideoData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
                    setUpdateProgress(percentCompleted)
                }
            })

            if (response.status !== 200) throw new Error('Failed to update video data')
            console.log('Video updated successfully:', response.data)
            setUpdateComplete(true)
        } catch (error) {
            console.error('Error updating video data:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <>
                <div className="container p-4">
                    <h1 className="text-2xl font-bold mb-6">Update Video</h1>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mb-6">Select Video to Update</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select a Video</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {availableVideos.map((v) => (
                                    <Button key={v.id} onClick={() => handleVideoSelect(v.id)} className="justify-start">
                                        <Image
                                            src={`data:image/jpeg;base64,${v.cover}`}
                                            alt={v.tittle}
                                            width={120}
                                            height={68}
                                            className="mr-4 rounded"
                                        />
                                        <span className="truncate">{v.tittle}</span>
                                    </Button>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {video && (
                        <Tabs defaultValue="details">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="video-elements">Video elements</TabsTrigger>
                                <TabsTrigger value="checks">Checks</TabsTrigger>
                                <TabsTrigger value="visibility">Visibility</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-6">
                                <Input
                                    placeholder="Enter video title"
                                    value={videoName}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-2xl font-bold"
                                />

                                <Textarea
                                    placeholder="Enter video description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[200px]"
                                />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Thumbnail</h3>
                                    <div className="flex items-center space-x-4">
                                        <Image
                                            src={thumbnailPreview || `/placeholder.svg?height=720&width=1280`}
                                            alt="Video Thumbnail"
                                            width={320}
                                            height={180}
                                            className="rounded-lg"
                                        />
                                        <div>
                                            <Button variant="outline" onClick={() => document.getElementById('thumbnailInput')?.click()}>
                                                Change Thumbnail
                                            </Button>
                                            <input
                                                id="thumbnailInput"
                                                type="file"
                                                accept="image/png, image/jpeg, image/jpg"
                                                className="hidden"
                                                onChange={handleThumbnailChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Video details</h3>
                                    <div className="space-y-2">
                                        <Label>Video category</Label>
                                        <Select>
                                            <SelectTrigger onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                                                <SelectValue value={category} placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent isOpen={isCategoryOpen}>
                                                {categories.map((categoryItem) => (
                                                    <SelectItem
                                                        key={categoryItem.id}
                                                        value={categoryItem.name}
                                                        onClick={() => {
                                                            setSelectedCategoryId(categoryItem.id);
                                                            setCategory(categoryItem.name);
                                                            setIsCategoryOpen(false);
                                                        }}
                                                    >
                                                        {categoryItem.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="New category"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        />
                                        <Button type="button" onClick={addCategory}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="tags">Tags</Label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {tags.map((tag) => (
                                                    <div key={tag.id} className="badge text-sm flex items-center px-2 py-1 rounded-full bg-gray-200 text-gray-800">
                                                        <span className="mr-2">{tag.name}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="ml-1 h-4 w-4 p-0"
                                                            onClick={() => removeTag(tag.id)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                            <span className="sr-only">Remove tag</span>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter a tag"
                                                    value={currentTag}
                                                    onChange={handleTagInputChange}
                                                />
                                                <Button onClick={() => addTag(currentTag)}>Add Tag</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="video-elements">
                                {/* Add video elements content here */}
                            </TabsContent>

                        

                           
                        </Tabs>
                    )}

                    {isUpdating && (
                        <div className="mt-4">
                            <p>Updating video... {updateProgress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{width: `${updateProgress}%`}}
                                ></div>
                            </div>
                        </div>
                    )}

                    {updateComplete && (
                        <div className="mt-4 text-green-600">
                            Update complete!
                        </div>
                    )}

                    <Button onClick={handleSubmit} disabled={isUpdating} className="mt-6">
                        {isUpdating ? 'Updating...' : 'Update Video'}
                    </Button>
                </div>
        
        </>
    )
}

export default VideoUpdateInterface