"use client";
import React ,{ useEffect, useState } from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import { useVideo } from '@/app/[locale]/channel/videocontext';
import initTranslations from "@/app/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
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
  const [language, setLanguage] = useState<string | null>(null);
  const [titleLanguage, setTitleLanguage] = useState<string | null>(null);
  const [recordingDate, setRecordingDate] = useState<string | null>(null);
  const [videoLocation, setVideoLocation] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTitleLanguageOpen, setIsTitleLanguageOpen] = useState(false);
  const [isRecordingDateOpen, setIsRecordingDateOpen] = useState(false);
  const [isVideoLocationOpen, setIsVideoLocationOpen] = useState(false);
  const [madeForKids, setMadeForKids] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Стан для вибраного файлу
  const [thumbnailPreview, setThumbnailPreview] = useState<string | ArrayBuffer | null>(null);
  const { selectedVideo } = useVideo(); 
  useEffect(() => {
    const savedTitle = sessionStorage.getItem('fileName') || '';
    const savedDescription = sessionStorage.getItem('fileDescription') || '';
    setTitle(savedTitle);
    setDescription(savedDescription);
  }, []);

  useEffect(() => {
    fetch('https://localhost:7154/api/Category')
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setSelectedFile(file); 
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setThumbnailPreview(reader.result); // Зберігаємо URL для попереднього перегляду
  //     };
  //     reader.readAsDataURL(file); // Читання файлу як data URL для відображення
  //   }
  // };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file); // Зберігаємо обрану обкладинку
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result); // Показуємо попередній перегляд обкладинки
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('thumbnailInput')?.click();
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

  const handleSubmit = async () => {
    const formData = new FormData();
    
    if (!selectedFile) {
      console.error('No video file selected!');
      return;
    }

    // Додаємо відеофайл
    formData.append('videoFile', selectedFile);

    // Записуємо дані відео
    const videoData = {
      id: 0,
      objectID: 'some-generated-id', 
      channelSettingsId: 1, // Задайте реальний ID каналу
      tittle: title, // Записуємо назву
      description: description, // Записуємо опис
      uploadDate: new Date().toISOString(),
      duration: Number(sessionStorage.getItem('videoDuration')) || 0,
      videoUrl: selectedFile, // Вказуємо файл відео
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      isShort: false,
      cover: thumbnail ? URL.createObjectURL(thumbnail) : '', // Якщо є обкладинка, додаємо її
      visibility: visibility === 'public', // Перевіряємо видимість
      categoryIds: [], 
      tagIds: [], 
      historyOfBrowsingIds: [], 
      commentVideoIds: [], 
      playLists: [], 
      lastViewedPosition: '00:00:00',
    };

    // Додаємо відео до formData
    Object.entries(videoData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value); 
      }
    });

    try {
      const response = await fetch('https://localhost:7154/api/Video/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video data');
      }

      const result = await response.json();
      console.log('Video uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading video data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
    return (
        <>
            <HeaderHome t={t} />
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t} />
                <main className="pl-[20%] ml-[5%] max-lg:pl-[15%] max-md:pl-[10%] max-sm:pl-0 max-w-[75%]">
                <div className="container  p-4">
                <Tabs defaultValue="details" className="right">
                    <TabsList className="grid w-full grid-cols-6 mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="monetisation">Monetisation</TabsTrigger>
                    <TabsTrigger value="ad-suitability">Ad suitability</TabsTrigger>
                    <TabsTrigger value="video-elements">Video elements</TabsTrigger>
                    <TabsTrigger value="checks">Checks</TabsTrigger>
                    <TabsTrigger value="visibility">Visibility</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                        <Input
                      defaultValue={title}
                      className="text-2xl font-bold"
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                        <div className="space-y-2">
                            <Label className="text-lg">Visibility</Label>
                            <RadioGroup value={visibility} onValueChange={setVisibility} className="flex space-x-4">
                            <RadioGroupItem value="private" id="private" selectedValue={visibility} onValueChange={setVisibility}>
                                Private
                            </RadioGroupItem>
                            <RadioGroupItem value="unlisted" id="unlisted" selectedValue={visibility} onValueChange={setVisibility}>
                                Unlisted
                            </RadioGroupItem>
                            <RadioGroupItem value="public" id="public" selectedValue={visibility} onValueChange={setVisibility}>
                                Public
                            </RadioGroupItem>
                            </RadioGroup>
                        </div>
                        {visibility === "private" && (
                            <Button variant="outline">Grant access</Button>
                        )}
                        <Textarea
                        className="min-h-[200px]"
                        defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)} 
                      />
                        <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Choose a thumbnail</h3>
      <p>Set a thumbnail that stands out and draws viewers' attention.</p>
      <p className="text-sm text-gray-500">Recommended size is 1280x720</p>

      <Button variant="outline" onClick={handleButtonClick}>
                        Choose file
                      </Button>

                      <input
                        id="thumbnailInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange} // Обробляємо зміну обкладинки
                      />

                      {thumbnailPreview && (
                        <img
                          src={thumbnailPreview.toString()}
                          alt="Thumbnail preview"
                          className="mt-4"
                          style={{ width: '300px', height: 'auto' }}
                        />
                      )}
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Video language</Label>
            <Select>
              <SelectTrigger onClick={() => setIsLanguageOpen(!isLanguageOpen)}>
                <SelectValue value={language} placeholder="Not selected" />
              </SelectTrigger>
              <SelectContent isOpen={isLanguageOpen}>
                <SelectItem value="en" onClick={() => { setLanguage('en'); setIsLanguageOpen(false); }}>
                  English
                </SelectItem>
                <SelectItem value="es" onClick={() => { setLanguage('es'); setIsLanguageOpen(false); }}>
                  Spanish
                </SelectItem>
                <SelectItem value="fr" onClick={() => { setLanguage('fr'); setIsLanguageOpen(false); }}>
                  French
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title and description language</Label>
            <Select>
              <SelectTrigger onClick={() => setIsTitleLanguageOpen(!isTitleLanguageOpen)}>
                <SelectValue value={titleLanguage} placeholder="Not selected" />
              </SelectTrigger>
              <SelectContent isOpen={isTitleLanguageOpen}>
                <SelectItem value="en" onClick={() => { setTitleLanguage('en'); setIsTitleLanguageOpen(false); }}>
                  English
                </SelectItem>
                <SelectItem value="es" onClick={() => { setTitleLanguage('es'); setIsTitleLanguageOpen(false); }}>
                  Spanish
                </SelectItem>
                <SelectItem value="fr" onClick={() => { setTitleLanguage('fr'); setIsTitleLanguageOpen(false); }}>
                  French
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>Video location</Label>
            <Select>
              <SelectTrigger onClick={() => setIsVideoLocationOpen(!isVideoLocationOpen)}>
                <SelectValue value={videoLocation} placeholder="Not specified" />
              </SelectTrigger>
              <SelectContent isOpen={isVideoLocationOpen}>
                <SelectItem value="usa" onClick={() => { setVideoLocation('usa'); setIsVideoLocationOpen(false); }}>
                  United States
                </SelectItem>
                <SelectItem value="uk" onClick={() => { setVideoLocation('uk'); setIsVideoLocationOpen(false); }}>
                  United Kingdom
                </SelectItem>
                <SelectItem value="canada" onClick={() => { setVideoLocation('canada'); setIsVideoLocationOpen(false); }}>
                  Canada
                </SelectItem>
              </SelectContent>
            </Select>
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
                        </div>
                        <div className="space-y-8">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_3-sevZfgkEubNta78nk0AMTuWADQT2oU.png" 
                            alt="Video Thumbnail" 
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Upload status</div>
                            <Progress value={66} />
                            <div className="grid grid-cols-3 text-sm">
                            <div>
                                <div className="font-medium">HD</div>
                                <div className="text-green-600">Complete</div>
                            </div>
                            <div>
                                <div className="font-medium">SD</div>
                                <div className="text-green-600">Complete</div>
                            </div>
                            <div>
                                <div className="font-medium">Downloads</div>
                                <div className="text-blue-600">Processing...</div>
                            </div>
                            </div>
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
