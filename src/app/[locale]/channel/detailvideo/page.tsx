"use client";
import React ,{ useEffect, useState, useRef } from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, Info, Plus, Badge} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface IHomeProps {
    params: {
        locale: string;
    };
}
interface Category {
  id: number;
  name: string;
}
const VideoUploadInterface: React.FC<IHomeProps> = ({ params: { locale } }) => {
  const [t, setT] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibility, setVisibility] = useState('private');
  const [videoLocation, setVideoLocation] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVideoLocationOpen, setIsVideoLocationOpen] = useState(false);
  const [madeForKids, setMadeForKids] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);
  const [titl, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile)
      const fileUrl = URL.createObjectURL(selectedFile)
      setPreview(fileUrl)
      const videoElement = document.createElement('video');
      videoElement.src = fileUrl;

      videoElement.onloadedmetadata = () => {
        const durationInSeconds = Math.floor(videoElement.duration); 
        sessionStorage.setItem('videoDuration', durationInSeconds.toString());
        URL.revokeObjectURL(fileUrl); 
      };
    } else {
      alert('Please select a valid video file.')
    }
  }
  useEffect(() => {
    fetch('https://localhost:7154/api/Category')
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);
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
        id: Date.now(),
        name: newCategory,
      };
      setCategories([...categories, newCategoryObj]);
      setSelectedCategory(newCategoryObj);
      setNewCategory('');
    }
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null;
  //   if (file) {
  //     setSelectedFile(file); 
  //     const fileURL = URL.createObjectURL(file);
  //     sessionStorage.setItem('fileURL', fileURL);
  //     sessionStorage.setItem('fileName', file.name);

  //     const videoElement = document.createElement('video');
  //     videoElement.src = fileURL;

  //     videoElement.onloadedmetadata = () => {
  //       const durationInSeconds = Math.floor(videoElement.duration); 
  //       sessionStorage.setItem('videoDuration', durationInSeconds.toString());
  //       URL.revokeObjectURL(fileURL); 
  //     };
  //   }
  // };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setThumbnail(file); 
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result); 
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Unsupported file format. Please select a PNG or JPEG image.");
    }
  };
 const openFilePicker = () => {
      fileInputRef.current?.click(); 
  };
  const handleButtonClick = () => {
    document.getElementById('thumbnailInput')?.click();
  };
  
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

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const { t } = await initTranslations(locale, ['common', 'categories']);
        setT(() => t);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTranslations();
  }, [locale]);
  if (loading) return <div>Loading...</div>;
  const handleSubmit = async () => {
    const formData = new FormData();

    if (!file) {
      console.error('No video file selected!');
      return;
    }
    const duration = Number(sessionStorage.getItem('videoDuration')) || 0;
    formData.append('videoFile', file);
    const emptyFile = new Blob([], { type: 'application/octet-stream' });
    formData.append('file', emptyFile, 'empty-file.bin');
    const videoUrls = await fileToBase64(file);
    const videoData = {
      id: 0,
      objectID: 'some-generated-id',
      channelSettingsId: 3,
      title: titl,
      description: description ,
      uploadDate: new Date().toISOString(),
      duration,
      videoUrl: videoUrls, 
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      isShort: false,
      cover: thumbnail ? URL.createObjectURL(thumbnail) : '',
      visibility: visibility === 'public',
      lastViewedPosition: '00:00:00',
      file: emptyFile
    };
   
    Object.entries(videoData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        formData.append(key, value.toString());
      } else if (value instanceof Blob) {
        formData.append(key, value);
      }  else if (value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await fetch('https://localhost:7154/api/Video/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload video data');
      const result = await response.json();
      console.log('Video uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading video data:', error);
    }
  };

    return (
        <>
            <HeaderHome t={t} />
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t} />
                <main className="pl-[10%] ml-[35%] max-lg:pl-[15%] max-md:pl-[10%] max-sm:pl-0 max-w-[75%]">
                <div className="container  p-4">
                <Tabs defaultValue="details" className="right">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    {/* <TabsTrigger value="monetisation">Monetisation</TabsTrigger>
                    <TabsTrigger value="ad-suitability">Ad suitability</TabsTrigger> */}
                    <TabsTrigger value="video-elements">Video elements</TabsTrigger>
                    <TabsTrigger value="checks">Checks</TabsTrigger>
                    <TabsTrigger value="visibility">Visibility</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer hover:border-gray-400 transition-colors duration-400"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {file ? (
                                            <div className="relative">
                                                <video className="w-full h-48 object-cover rounded" src={preview || undefined} />
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
                    <Input placeholder="Enter video title"
                        value={titl}
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
                  <Badge key={tag} className="text-sm">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove tag</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Enter a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>
        </div>
      </div>
      <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">'Made for Kids'</h3>
      <p className="text-sm text-gray-600 mb-2">This video is set to {madeForKids ? "'Made for Kids'" : "not 'Made for Kids'"}</p>
      <p className="text-xs text-gray-500 mb-4">
        Regardless of your location, you're legally required to comply with the Children's Online Privacy Protection Act (COPPA) and/or other laws. You're required to tell us whether your videos are 'Made for Kids'. <a href="#" className="text-blue-500 hover:underline">What is 'Made for Kids' content?</a>
      </p>
      <div className="flex items-center space-x-2 mb-2">
        <Info/>
        <p className="text-xs text-gray-500">
          Features like personalised ads and notifications won't be available on videos 'Made for Kids'. Videos that are set as 'Made for Kids' by you are more likely to be recommended alongside other children's videos. <a href="#" className="text-blue-500 hover:underline">Learn more</a>
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="madeForKids"
            checked={madeForKids}
            onChange={() => setMadeForKids(true)}
          />
          <span className="ml-2">Yes, it is 'Made for Kids'</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="madeForKids"
            checked={!madeForKids}
            onChange={() => setMadeForKids(false)}
          />
          <span className="ml-2">No, it is not 'Made for Kids'</span>
        </label>
      </div>

      {/* 'Age restriction' налаштування */}
      <h3 className="text-lg font-semibold mb-2">Age restriction</h3>
      <p className="text-sm text-gray-600 mb-2">Do you want to restrict your video to an adult audience?</p>
      <p className="text-xs text-gray-500 mb-4">
        Age-restricted videos are not shown in certain areas of YouTube. These videos may have limited or no ads monetisation. <a href="#" className="text-blue-500 hover:underline">Learn more</a>
      </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="ageRestriction"
                        checked={ageRestricted}
                        onChange={() => setAgeRestricted(true)}
                      />
                      <span className="ml-2">Yes, restrict my video to viewers over 18</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="ageRestriction"
                        checked={!ageRestricted}
                        onChange={() => setAgeRestricted(false)}
                      />
                      <span className="ml-2">No, don't restrict my video to viewers over 18 only</span>
                    </label>
                  </div>
                </div>
                        <Button onClick={handleSubmit}>Upload </Button>
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
                    
                    </TabsContent>
                    <TabsContent value="monetisation">Monetisation content</TabsContent>
                    <TabsContent value="ad-suitability">Ad suitability content</TabsContent>
                    <TabsContent value="video-elements">Video elements content</TabsContent>
                    <TabsContent value="checks">Checks content</TabsContent>
                    <TabsContent value="visibility">Visibility content</TabsContent>
                    
                </Tabs>
                </div>
                </main>
                
            </div>
            
        </>
    );
};

export default VideoUploadInterface;
