'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Plus, Info } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import api from '@/services/axiosApi'
import { IChannel } from '@/types/channelinfo.interface'

interface Category {
    id: number
    name: string
    videosId: []
}

interface Tag {
    id: number
    name: string
    videosId: []
}

const VideoUploadInterface: React.FC = () => {
    const [visibility, setVisibility] = useState('private')
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isAgeRestricted, setAgeRestricted] = useState(false)
    const [videoName, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
    const [thumbnailBase64, setThumbnailBase64] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [video, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [newCategory, setNewCategory] = useState('')
    const [currentTag, setCurrentTag] = useState('')
    const [isCopyright, setIsCopyright] = useState<boolean>(false)
    const [audience, setAudience] = useState<string>('all')
    const [userChannel, setUserChannel] = useState<IChannel | null>()
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [tagIds, setTagIds] = useState<number[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const { user } = useUser()

    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [isShort, setIsShort] = useState(false);

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setCurrentTag(input)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile)
            const fileUrl = URL.createObjectURL(selectedFile)
            setPreview(fileUrl)
            const videoElement = document.createElement('video')
            videoElement.src = fileUrl

            videoElement.onloadedmetadata = () => {
                const durationInSeconds = Math.floor(videoElement.duration)
                sessionStorage.setItem('videoDuration', durationInSeconds.toString())
                URL.revokeObjectURL(fileUrl)
            }
        } else {
            alert('Please select a valid video file.')
        }
    }

    useEffect(() => {
        api.get('/Category')
            .then((response) => response.data)
            .then((data: Category[]) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error))
    }, [])

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const droppedFile = event.dataTransfer.files[0]
        if (droppedFile && droppedFile.type.startsWith('video/')) {
            setFile(droppedFile)
            const fileUrl = URL.createObjectURL(droppedFile)
            setPreview(fileUrl)
        } else {
            alert('Please drop a valid video file.')
        }
    }

    const removeFile = () => {
        setFile(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
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

    const addTag = async (tagName: string) => {
        if (tagName && !tags.some(tag => tag.name === tagName)) {
            const newTagObj: Tag = {
                id: 0,
                name: tagName,
                videosId: [],
            }
    
            setTags(prevTags => [...prevTags, newTagObj])
    
            try {
                await DownloadTag(newTagObj)
                await fetchTagIdByName(tagName)
            } catch (error) {
                console.error('Error adding tag:', error)
            } finally {
                setCurrentTag("")
            }
        }
    }
    
    const DownloadTag = async (tag: Tag): Promise<void> => {
        try {
            const response = await api.post('/Tag/add', tag, {
                headers: { 'Content-Type': 'application/json' },
            })
    
            if (response.status !== 200) {
                throw new Error('Failed to add tag')
            }
        } catch (error) {
            console.error('Error adding tag to server:', error)
            throw error
        }
    }
    
    const fetchTagIdByName = async (tagName: string): Promise<void> => {
        try {
            const response = await api.get(`/Tag/getbytagname/${tagName}`)
    
            if (response.status !== 200 || !response.data.id) {
                throw new Error('Failed to fetch tag ID')
            }
    
            const tagId = response.data.id
    
            setTagIds((prevIds) => {
                if (!prevIds.includes(tagId)) {
                    return [...prevIds, tagId]
                }
                return prevIds
            })
    
            setTags((prevTags) =>
                prevTags.map(tag =>
                    tag.name === tagName ? { ...tag, id: tagId } : tag
                )
            )
        } catch (error) {
            console.error('Error fetching tag ID:', error)
            throw error
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

    const fetchCategories = async () => {
        try {
            const response = await api.get('/Category')
            if (response.status != 200) {
                throw new Error('Error fetching categories')
            }
            const data: Category[] = await response.data
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const removeTag = (id: number) => {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== id))
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
    
    const openFilePicker = () => {
        fileInputRef.current?.click()
    }

    const handleButtonClick = () => {
        document.getElementById('thumbnailInput')?.click()
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    const base64String = reader.result.split(",")[1]
                    resolve(base64String)
                } else {
                    reject(new Error("Error: FileReader result is not a string."))
                }
            }

            reader.onerror = (error) => reject(error)
        })
    }

    const getUserChannel = async () => {
        if (user) {
            const response = await api.get('/ChannelSettings/getbyownerid/' + user?.id)
            console.log("chch", response)
            if (response.status === 200) {
                const data: IChannel = await response.data
                setUserChannel(data)
            } else {
                console.error('Ошибка при получении пользователя:', response.statusText)
            }
        }
    }

    useEffect(() => {
        getUserChannel()
    }, [user])

    const handleSubmit = async () => {
        setIsUploading(true)
        setUploadProgress(0)
        setUploadComplete(false)

        const formData = new FormData()

        if (!video) {
            console.error('No video file selected!')
            setIsUploading(false)
            return
        }

        const duration = Number(sessionStorage.getItem('videoDuration')) || 0
        formData.append('videoFile', video)
        const emptyFile = new Blob([], { type: 'application/octet-stream' })
        formData.append('file', emptyFile, 'empty-file.bin')

        const videoUrls = await fileToBase64(video)

        if (Array.isArray(tagIds) && tagIds.length > 0) {
            tagIds.forEach((id, index) => {
                formData.append(`tagIds[${index}]`, id.toString())
            })
        } else {
            console.warn('tagIds is empty or not an array.')
        }

        const videoData = {
            id: 0,
            objectID: 'some-generated-id',
            channelSettingsId: userChannel?.id,
            tittle: videoName,
            description: description,
            uploadDate: new Date().toISOString(),
            duration,
            videoUrl: videoUrls,
            vRoomVideoUrl: "", // Додане нове поле
            viewCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            isShort: isShort,
            cover: thumbnailBase64,
            visibility: visibility === 'public',
            isAgeRestriction: isAgeRestricted,
            isCopyright: isCopyright,
            audience: audience,
            categoryIds: selectedCategoryId,
            tagIds,
            historyOfBrowsingIds: [], // Додане нове поле
            commentVideoIds: [], // Додане нове поле
            playLists: [], // Додане нове поле
            lastViewedPosition: '00:00:00',
            file: emptyFile,
        }

        console.log("Payload to be sent:", videoData)

        Object.entries(videoData).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                formData.append(key, value.toString())
            } else if (typeof value === 'boolean' || typeof value === 'number') {
                formData.append(key, value.toString())
            } else if (value instanceof Blob) {
                formData.append(key, value)
            } 
        })

        try {
            const response = await api.post('/Video/add', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
                    setUploadProgress(percentCompleted)
                }
            })

            if (response.status != 201) throw new Error('Failed to upload video data')
            const result = await response.data
            console.log('Video uploaded successfully:', result)
            setUploadComplete(true)
        } catch (error) {
            console.error('Error uploading video data:', error)
        } finally {
            setIsUploading(false)
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        const value = e.target.value === "true";
        setIsShort(value);
    };
    return (
        <>
            {user ? (
                <div className="container p-4">
                    <Tabs defaultValue="details" className="right">
                        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
                        <TabsList className="grid w-full grid-cols-1 mb-1">
                            <TabsTrigger value="details">Details</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer hover:border-gray-400 transition-colors duration-400"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {video ? (
                                        <div className="relative">
                                            <video className="w-full h-48 object-cover rounded"
                                                   src={preview || undefined}/>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile();
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove video</span>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">Drag and drop a video file here, or click to select a file</p>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                    />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold mb-6">Title </h1>
                            <Input
                                placeholder="Enter video title"
                                value={videoName}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-2xl font-bold"
                            />
                            <div>
                                <Label>Privacy Settings</Label>
                                <RadioGroup value={visibility} onValueChange={setVisibility}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="public" id="public" selectedValue={visibility} onValueChange={setVisibility}>
                                            Public
                                        </RadioGroupItem>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="private" id="private" selectedValue={visibility} onValueChange={setVisibility}>
                                            Private
                                        </RadioGroupItem>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="unlisted" id="unlisted" selectedValue={visibility} onValueChange={setVisibility}>
                                            Unlisted
                                        </RadioGroupItem>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label>Selected Privacy Setting</Label>
                                <p className="text-sm font-medium">{visibility.charAt(0).toUpperCase() + visibility.slice(1)}</p>
                            </div>

                            <Textarea
                                placeholder="Enter video description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[200px]"
                            />
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Choose a thumbnail</h3>
                                    <p>Set a thumbnail that stands out and draws viewers' attention.</p>
                                    <p className="text-sm text-gray-500">Recommended size is 1280x720</p>

                                    <Button variant="outline" onClick={handleButtonClick}>
                                        Choose file
                                    </Button>

                                    <input
                                        id="thumbnailInput"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
                                    />

                                    {thumbnailPreview && (
                                        <div className="mt-4">
                                            <p>Thumbnail preview:</p>
                                            <img
                                                src={thumbnailPreview as string}
                                                alt="Thumbnail Preview"
                                                className="thumbnail-preview"
                                                style={{ width: "300px", height: "auto" }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    <img
                                        src={thumbnailPreview ? thumbnailPreview as string : "/placeholder.svg?height=720&width=1280"}
                                        alt="Selected Thumbnail"
                                        className="w-full rounded-lg"
                                    />
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
                                            <input
                                                type="text"
                                                placeholder="Enter a tag"
                                                value={currentTag}
                                                onChange={handleTagInputChange}
                                                className="border border-gray-300 rounded-md px-2 py-1"
                                            />
                                            <Button onClick={() => addTag(currentTag)}>+ Add Tag</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="tags">Video type</Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <select id="countries" name="country"
                                                    value={isShort.toString()}
                                                    onChange={handleChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

                                                <option value={'false'} selected={true}>Video</option>
                                                <option value={'true'} >Short video</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-2">Age Restriction</h3>
                                <p className="text-sm text-gray-600 mb-2">Would you like to restrict this video to viewers over 18 years old?</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Age-restricted content may not appear in certain parts of the platform and could have limited advertising options. <a href="#" className="text-blue-500 hover:underline">Learn more</a>
                                </p>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="ageRestriction"
                                            checked={isAgeRestricted}
                                            onChange={() => setAgeRestricted(true)}
                                        />
                                        <span className="ml-2">Yes, restrict to viewers over 18 only</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="ageRestriction"
                                            checked={!isAgeRestricted}
                                            onChange={() => setAgeRestricted(false)}
                                        />
                                        <span className="ml-2">No, allow all viewers</span>
                                    </label>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">Copyright Status</h3>
                                <p className="text-sm text-gray-600 mb-2">Does this video contain copyrighted material?</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Ensure compliance with copyright regulations by declaring whether this content contains copyrighted materials. <a href="#" className="text-blue-500 hover:underline">Learn more</a>
                                </p>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="copyrightStatus"
                                            checked={isCopyright}
                                            onChange={() => setIsCopyright(true)}
                                        />
                                        <span className="ml-2">Yes, this video contains copyrighted content</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="copyrightStatus"
                                            checked={!isCopyright}
                                            onChange={() => setIsCopyright(false)}
                                        />
                                        <span className="ml-2">No, this video does not contain copyrighted content</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Video Preview</h2>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                                            {preview ? (
                                                <video className="w-full h-full object-cover rounded-lg" src={preview} controls />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    Video preview will appear here
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold mb-2">Video Title</h3>
                                        <p className="text-sm text-gray-500">
                                            0 views • Just now
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Privacy: {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {isUploading && (
                                <div className="mt-4">
                                    <p>Uploading video... {uploadProgress}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{width: `${uploadProgress}%`}}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            {uploadComplete && (
                                <div className="mt-4 text-green-600">
                                    Upload complete!
                                </div>
                            )}
                            <Button onClick={handleSubmit} disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </TabsContent>
                        <TabsContent value="video-elements">Video elements content</TabsContent>
                        <TabsContent value="checks">Checks content</TabsContent>
                        <TabsContent value="visibility">Visibility content</TabsContent>
                    </Tabs>
                </div>
            ) : <></>}
        </>
    )
}

export default VideoUploadInterface