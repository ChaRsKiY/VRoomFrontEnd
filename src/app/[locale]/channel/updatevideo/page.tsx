"use client";
import React, { useEffect, useState, useRef } from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, Info, Plus, Badge } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import api from '@/services/axiosApi';
import { IChannel } from '@/types/channelinfo.interface';



interface Category {
    id: number;
    name: string;
    videosId: number[];
}

interface Tag {
    id: number;
    name: string;
    videosId: number[];
}

interface Video {
    id: number;
    tittle: string;
    description: string;
    uploadDate: string;
    duration: number;
    visibility: boolean;
    videoUrl: string,
    isAgeRestricted: boolean;
    isCopyright: boolean;
    audience: string;
    thumbnailBase64: string;
    categoryIds: number | null;
    tags: string[];
}

const VideoEditInterface: React.FC<{ videoId: number }> = ({ videoId }) => {
    const [visibility, setVisibility] = useState('private');
    const [isAgeRestricted, setIsAgeRestricted] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [videoName, setVideoName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [thumbnailBase64, setThumbnailBase64] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [isCopyright, setIsCopyright] = useState(false);
    const [audience, setAudience] = useState<string>('all');
    const [videoData, setVideoData] = useState<Video | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useUser();
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // Завантаження відео за ID
    const fetchVideoById = async (id: number) => {
        try {
            const response = await api.get(`/Video/${id}`);
            if (response.status === 200) {
                const data = response.data;
                setVideoData(data);
                setThumbnailBase64(data.cover || '');
            } else {
                console.error('Failed to fetch video:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching video:', error);
        }
    };

    // Оновлення або створення відео
    const uploadOrUpdateVideo = async () => {
        if (!videoFile && !videoId) {
            console.error('No video file selected or video ID provided!');
            return;
        }

        const formData = new FormData();

        // Конвертація відео у Base64 для оновлення
        const fileToBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                    if (typeof reader.result === "string") {
                        const base64String = reader.result.split(",")[1];
                        resolve(base64String);
                    } else {
                        reject(new Error("Error: FileReader result is not a string."));
                    }
                };

                reader.onerror = (error) => reject(error);
            });
        };

        const videoUrls = videoFile ? await fileToBase64(videoFile) : videoData?.videoUrl;

        const updatedVideoData = {
            id: videoId || 0,
            tittle: videoData?.tittle || '',
            description: videoData?.description || '',
            uploadDate: videoData?.uploadDate || new Date().toISOString(),
            duration: videoData?.duration || 0,
            videoUrl: videoUrls,
            isShort: false,
            cover: thumbnailBase64,
            visibility: videoData?.visibility || false,
            isAgeRestriction: videoData?.isAgeRestricted || false,
            isCopyright: videoData?.isCopyright || false,
            audience: videoData?.audience || 'all',
            categoryIds: videoData?.categoryIds || [],
        };

        // Додавання даних у FormData
        Object.entries(updatedVideoData).forEach(([key, value]) => {
            if (value instanceof Blob) {
                formData.append(key, value);
            } else if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        try {
            const response = videoId
                ? await api.put(`/Video/${videoId}`, formData)
                : await api.post('/Video/add', formData);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to upload/update video data');
            }

            console.log('Video uploaded/updated successfully:', response.data);
        } catch (error) {
            console.error('Error uploading/updating video data:', error);
        }
    };

    // Додавання файлу відео
    const setFile = (file: File) => {
        if (file.type.startsWith('video/')) {
            setVideoFile(file);
        } else {
            console.error('Invalid video file type');
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchVideoData();
    }, []);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Перевірка типу файлу
            if (!file.type.startsWith("https://localhost:7154/api/Video/9")) {
                alert("Please select a valid video file (MP4, WebM, or OGG).");
                return;
            }

            // Перевірка розміру файлу (до 10 ГБ)
            const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
            if (file.size > maxSize) {
                alert("The file size exceeds the maximum limit of 10GB.");
                return;
            }

            // Встановлення відео у стан
            setVideo(file);

            // Створення URL для попереднього перегляду
            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];
        if (file) {
            // Обробка файлу, як і в `handleFileChange`
            if (!file.type.startsWith("video/")) {
                alert("Please select a valid video file (MP4, WebM, or OGG).");
                return;
            }

            const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
            if (file.size > maxSize) {
                alert("The file size exceeds the maximum limit of 10GB.");
                return;
            }

            setVideo(file);
            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);
        }
    };

    const handleClearVideo = () => {
        setVideo(null);
        setVideoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('https://localhost:7154//api/Category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchVideoData = async () => {
        try {
            const response = await api.get(`https://localhost:7154/api/Video/${9}`);
            const data = response.data;
            setVideoData(data);

            // Заповнення полів
            setVideoName(data.title);
            setDescription(data.description);
            setVisibility(data.visibility ? 'public' : 'private');
            setIsAgeRestricted(data.isAgeRestricted);
            setIsCopyright(data.isCopyright);
            setAudience(data.audience);
            setThumbnailPreview(`data:image/png;base64,${data.thumbnailBase64}`);
            setSelectedCategory(categories.find((category) => category.id === data.categoryIds) || null);
            setTags(data.tags);
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    };

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result?.toString().split(',')[1] || '';
                setThumbnailBase64(base64);
                setThumbnailPreview(`data:${file.type};base64,${base64}`);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    };

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!videoData) {
            console.error('No video data available.');
            return;
        }

        const updatedVideoData = {
            ...videoData,
            title: videoName,
            description,
            visibility: visibility === 'public',
            isAgeRestricted,
            isCopyright,
            audience,
            thumbnailBase64,
            categoryIds: selectedCategory?.id || null,
            tags,
        };

        try {
            const response = await api.put(`/Video/update/${videoId}`, updatedVideoData);
            if (response.status !== 200) throw new Error('Failed to update video.');
            console.log('Video updated successfully.');
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Upload Video</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div>
                          <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Video Information</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              Provide details about your video to help viewers find and understand your content.
                            </p>
                          </div>
    
                          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="video-file" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Video File
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="space-y-1 text-center">
                                    <svg
                                      className="mx-auto h-12 w-12 text-gray-400"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 48 48"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                      <label
                                        htmlFor="video-file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                      >
                                        <span>Upload a video</span>
                                        <input
                                          id="video-file-upload"
                                          name="video-file-upload"
                                          type="file"
                                          className="sr-only"
                                          onChange={handleFileChange}
                                          accept="video/*"
                                          ref={fileInputRef}
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">MP4, WebM, or OGG up to 10GB</p>
                                  </div>
                                </div>
                                {videoPreview && (
                                  <div className="mt-4">
                                    <video src={videoPreview} controls className="w-full h-64 object-cover rounded-lg" />
                                  </div>
                                )}
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Thumbnail
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="space-y-1 text-center">
                                    <svg
                                      className="mx-auto h-12 w-12 text-gray-400"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 48 48"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                      <label
                                        htmlFor="thumbnail-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                      >
                                        <span>Upload a thumbnail</span>
                                        <input
                                          id="thumbnail-upload"
                                          name="thumbnail-upload"
                                          type="file"
                                          className="sr-only"
                                          onChange={handleThumbnailChange}
                                          accept="image/png,image/jpeg,image/jpg"
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                                  </div>
                                </div>
                                {thumbnailPreview && (
                                  <div className="mt-4">
                                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-40 object-cover rounded-lg" />
                                  </div>
                                )}
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="video-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Video Title
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input
                                  type="text"
                                  name="video-name"
                                  id="video-name"
                                  value={videoName}
                                  onChange={(e) => setVideoName(e.target.value)}
                                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Description
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={3}
                                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                />
                                <p className="mt-2 text-sm text-gray-500">Write a brief description of your video.</p>
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="category" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Category
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <select
                                  id="category"
                                  name="category"
                                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                  value={selectedCategory?.id || ''}
                                  onChange={(e) => setSelectedCategory(categories.find(c => c.id === Number(e.target.value)) || null)}
                                >
                                  <option value="">Select a category</option>
                                  {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                      {category.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Tags
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex rounded-md shadow-sm">
                                  <input
                                    type="text"
                                    name="tag"
                                    id="tag"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                    placeholder="Add a tag"
                                  />
                                  <button
                                    type="button"
                                    onClick={addTag}
                                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                                  >
                                    Add
                                  </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {tags.map((tag) => (
                                    <span key={tag} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700">
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                                      >
                                        <span className="sr-only">Remove tag</span>
                                        <X className="h-2 w-2" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
    
                        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                          <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Video Settings</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              Configure additional settings for your video.
                            </p>
                          </div>
                          <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Visibility
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <select
                                  id="visibility"
                                  name="visibility"
                                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                  value={visibility}
                                  onChange={(e) => setVisibility(e.target.value)}
                                >
                                  <option value="private">Private</option>
                                  <option value="public">Public</option>
                                  <option value="unlisted">Unlisted</option>
                                </select>
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="age-restriction" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Age Restriction
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="age-restriction"
                                    name="age-restriction"
                                    type="checkbox"
                                    checked={isAgeRestricted}
                                    onChange={(e) => setIsAgeRestricted(e.target.checked)}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  />
                                  <label htmlFor="age-restriction" className="ml-2 block text-sm text-gray-900">
                                    Restrict video to viewers 18 and older
                                  </label>
                                </div>
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="copyright" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Copyright
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <input
                                    id="copyright"
                                    name="copyright"
                                    type="checkbox"
                                    checked={isCopyright}
                                    onChange={(e) => setIsCopyright(e.target.checked)}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                  />
                                  <label htmlFor="copyright" className="ml-2 block text-sm text-gray-900">
                                    This video contains copyrighted content
                                  </label>
                                </div>
                              </div>
                            </div>
    
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                              <label htmlFor="audience" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Audience
                              </label>
                              <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <select
                                  id="audience"
                                  name="audience"
                                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                  value={audience}
                                  onChange={(e) => setAudience(e.target.value)}
                                >
                                  <option value="all">All audiences</option>
                                  <option value="kids">Made for kids</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Upload Video
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>


    );
};

export default VideoEditInterface;
