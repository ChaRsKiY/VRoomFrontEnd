"use client";
import { useEffect, useState } from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import { FC } from 'react';
import initTranslations from "@/app/i18n";
//import "@/app/[locale]/channel/uploadvideo/style.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface IHomeProps {
    params: {
        locale: string;
    };
}
const VideoUploadInterface: React.FC<IHomeProps> = ({ params: { locale } }) => {
  const [t, setT] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 
  const [visibility, setVisibility] = useState("private");
  const [category, setCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [titleLanguage, setTitleLanguage] = useState<string | null>(null);
  const [recordingDate, setRecordingDate] = useState<string | null>(null);
  const [videoLocation, setVideoLocation] = useState<string | null>(null);
  
  // Стан для відкриття/закриття меню Select
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTitleLanguageOpen, setIsTitleLanguageOpen] = useState(false);
  const [isRecordingDateOpen, setIsRecordingDateOpen] = useState(false);
  const [isVideoLocationOpen, setIsVideoLocationOpen] = useState(false);

    // Ініціалізація перекладів
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

    // Обробка збереженого файлу (якщо необхідно)
    useEffect(() => {
        const storedFileURL = sessionStorage.getItem('fileURL');
        if (storedFileURL) {
            console.log("Stored file URL:", storedFileURL);
            // Додайте код для обробки fileURL, якщо це необхідно
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // Можна додати спіннер або будь-який інший елемент завантаження
    }


    return (
        <>
            <HeaderHome t={t} />
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t} />
                <main className="pl-[25%] ml-[-5%] max-lg:pl-[10%] max-sm:pl-0">
                <div className="container mx-auto p-4">
                <Tabs defaultValue="details" className="w-full">
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
                        <Input defaultValue="11 Sep, 2024 - Baldur's Gate 3" className="text-2xl font-bold" />
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
                            defaultValue={`Based on Just Facts video! - Go check out their channel!`}
                        />
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Choose a thumbnail</h3>
                            <p>Set a thumbnail that stands out and draws viewers' attention.</p>
                            <p className="text-sm text-gray-500">Recommended size is 1280x720</p>
                            <Button variant="outline">Choose file</Button>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                            <img src="/placeholder.svg?height=720&width=1280" alt="Thumbnail 1" className="w-full rounded-lg" />
                            <img src="/placeholder.svg?height=720&width=1280" alt="Thumbnail 2" className="w-full rounded-lg" />
                            <img src="/placeholder.svg?height=720&width=1280" alt="Thumbnail 3" className="w-full rounded-lg" />
                            <img src="/placeholder.svg?height=720&width=1280" alt="Thumbnail 4" className="w-full rounded-lg" />
                            </div>
                        </div>
                        <div className="space-y-4">
        <h3 className="text-lg font-semibold">Video details</h3>

        {/* Video Category */}
        <div className="space-y-2">
          <Label>Video category</Label>
          <Select>
            <SelectTrigger onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
              <SelectValue value={category} placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent isOpen={isCategoryOpen}>
              <SelectItem value="people-blogs" onClick={() => { setCategory('people-blogs'); setIsCategoryOpen(false); }}>
                People and blogs
              </SelectItem>
              <SelectItem value="gaming" onClick={() => { setCategory('gaming'); setIsCategoryOpen(false); }}>
                Gaming
              </SelectItem>
              <SelectItem value="education" onClick={() => { setCategory('education'); setIsCategoryOpen(false); }}>
                Education
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Language */}
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

          {/* Title and Description Language */}
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

        {/* Recording Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Recording date</Label>
            <Select>
              <SelectTrigger onClick={() => setIsRecordingDateOpen(!isRecordingDateOpen)}>
                <SelectValue value={recordingDate} placeholder="Not set" />
              </SelectTrigger>
              <SelectContent isOpen={isRecordingDateOpen}>
                <SelectItem value="today" onClick={() => { setRecordingDate('today'); setIsRecordingDateOpen(false); }}>
                  Today
                </SelectItem>
                <SelectItem value="yesterday" onClick={() => { setRecordingDate('yesterday'); setIsRecordingDateOpen(false); }}>
                  Yesterday
                </SelectItem>
                <SelectItem value="custom" onClick={() => { setRecordingDate('custom'); setIsRecordingDateOpen(false); }}>
                  Custom
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Video Location */}
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

      {/* Audience Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Audience</h3>

        {/* Made for Kids */}
        <div className="space-y-2">
          <Label>Made for Kids</Label>
          <p className="text-sm text-gray-500">
            Regardless of your location, you're legally required to comply with the Children's Online Privacy Protection Act (COPPA) and/or other laws. You're required to tell us whether your videos are Made for Kids. What is 'Made for Kids' content?
          </p>
          {/* RadioGroup logic можна винести окремо для вибору так/ні */}
        </div>

        {/* Age restriction */}
        <div className="space-y-2">
          <Label>Age restriction</Label>
          <p className="text-sm text-gray-500">Do you want to restrict your video to an adult audience?</p>
          {/* RadioGroup logic */}
        </div>
      </div>
                        <Button>Show more</Button>
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
                            <Label>Video link</Label>
                            <Input defaultValue="https://vroon.tv/NuTnm2U7yYo" />
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Filename</div>
                            <div className="text-sm text-gray-500">11 Sep, 2024 - Baldur's Gate 3.mp4</div>
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
                                <div className="font-medium">4K</div>
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



// const VideoDetail: FC<IHomeProps> = ({ params: { locale } }) => {
//     const router = useRouter();
//     const [t, setT] = useState<any>(null); 
//     const [loading, setLoading] = useState(true); 

//     // Video metadata states
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [visibility, setVisibility] = useState('private');
//     const [videoFile, setVideoFile] = useState<File | null>(null);
//     const [thumbnail, setThumbnail] = useState<File | null>(null);
//     const [videoCategory, setVideoCategory] = useState('people_and_blogs');
//     const [isForKids, setIsForKids] = useState(false);
//     const [isAgeRestricted, setIsAgeRestricted] = useState(false);
//     const [fileURL, setFileURL] = useState<string | null>(null); 

//     const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => 
//         (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         setter(e.target.value);
//     };

//     const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => 
//         (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setter(e.target.files[0]);
//         }
//     };

//     const handleBooleanChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => 
//         (e: React.ChangeEvent<HTMLInputElement>) => {
//         setter(e.target.value === 'yes');
//     };

//     useEffect(() => {
//         const loadTranslations = async () => {
//             try {
//                 const { t } = await initTranslations(locale, ['common', 'categories']);
//                 setT(() => t);
//             } catch (error) {
//                 console.error('Error loading translations:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadTranslations();
//     }, [locale]);

//     useEffect(() => {
//         const storedFileURL = sessionStorage.getItem('fileURL');
//         if (storedFileURL) {
//             setFileURL(storedFileURL); 
//         }
//     }, []);

//     interface VideoData {
//         id: number;
//         objectID: number;
//         channelSettingsId: number;
//         tittle: string;
//         description: string;
//         uploadDate: string;
//         duration: number;
//         videoUrl: string;
//         viewCount: number;
//         likeCount: number;
//         dislikeCount: number;
//         isShort: boolean;
//         cover: string;
//         lastViewedPosition: string;
//     }

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
        
//         if (!videoFile) {
//             alert(t?.common?.upload_video); 
//             return;
//         }
    
//         const videoData: VideoData = {
//             id: 0,
//             objectID: 1,
//             channelSettingsId: 4,
//             tittle: title,
//             description: description,
//             uploadDate: new Date().toISOString(),
//             duration: 55,
//             videoUrl: "none", 
//             viewCount: 0,
//             likeCount: 0,
//             dislikeCount: 0,
//             isShort: false,
//             cover: thumbnail ? URL.createObjectURL(thumbnail) : "",
//             lastViewedPosition: "11",
//         };
    
//         try {
//             const formData = new FormData();
//             formData.append('file', videoFile); 

//             (Object.keys(videoData) as (keyof VideoData)[]).forEach(key => {
//                 const value = videoData[key];
        
//                 if (Array.isArray(value)) {
//                     formData.append(key, JSON.stringify(value)); 
//                 } else if (typeof value === 'boolean') {
//                     formData.append(key, value.toString()); 
//                 } else {
//                     formData.append(key, String(value)); 
//                 }
//             });

//             const videoUploadResponse = await fetch('https://localhost:7154/api/Video/add', {
//                 method: 'POST',
//                 body: formData,
//             });
    
//             if (videoUploadResponse.ok) {
//                 const result = await videoUploadResponse.json();
//                 console.log('Video uploaded successfully', result);
//                 router.push('/video/edit'); 
//             } else {
//                 console.error('Failed to upload video', await videoUploadResponse.text());
//             }
//         } catch (error) {
//             console.error('Error occurred during upload:', error);
//         }
//     };

//     if (loading) {
//         return <div>Loading translations...</div>;
//     }

//     return (
//         <>
//             <HeaderHome t={t} />
//             <div className="flex pt-20 overflow-hidden">
//                 <AsideHome t={t} />
//                 <main className="pl-[25%] ml-[-5%] max-lg:pl-[10%] max-sm:pl-0">
//                     <div className="p-8">
//                         <h1 className="text-2xl font-bold mb-6">Video Upload</h1>

//                         <form onSubmit={handleSubmit}>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Title</label>
//                                 <textarea
//                                     className="w-full border border-gray-300 rounded-md p-2"
//                                     value={title}
//                                     onChange={handleInputChange(setTitle)}
//                                     placeholder="Enter your title..."
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Description</label>
//                                 <textarea
//                                     className="w-full border border-gray-300 rounded-md p-2"
//                                     rows={8}
//                                     value={description}
//                                     onChange={handleInputChange(setDescription)}
//                                     placeholder="Enter your description..."
//                                 />
//                             </div>

//                             {/* Visibility */}
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Visibility</label>
//                                 <select
//                                     className="block w-full border border-gray-300 rounded-md p-2"
//                                     value={visibility}
//                                     onChange={handleInputChange(setVisibility)}
//                                 >
//                                     <option value="private">Private</option>
//                                     <option value="unlisted">Unlisted</option>
//                                     <option value="public">Public</option>
//                                 </select>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Choose a Video File</label>
//                                 <input
//                                     type="file"
//                                     accept="video/*"
//                                     onChange={handleFileChange(setVideoFile)}
//                                     className="border border-gray-300 rounded-md p-2"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Choose a Thumbnail</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleFileChange(setThumbnail)}
//                                     className="border border-gray-300 rounded-md p-2"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Category</label>
//                                 <select
//                                     className="block w-full border border-gray-300 rounded-md p-2"
//                                     value={videoCategory}
//                                     onChange={handleInputChange(setVideoCategory)}
//                                 >
//                                     <option value="people_and_blogs">People & Blogs</option>
//                                     <option value="education">Education</option>
//                                     <option value="entertainment">Entertainment</option>
//                                 </select>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Is this video for kids?</label>
//                                 <div className="flex">
//                                     <label className="mr-4">
//                                         <input
//                                             type="radio"
//                                             name="kids"
//                                             value="yes"
//                                             checked={isForKids}
//                                             onChange={handleBooleanChange(setIsForKids)}
//                                             className="mr-2"
//                                         />
//                                         Yes
//                                     </label>
//                                     <label>
//                                         <input
//                                             type="radio"
//                                             name="kids"
//                                             value="no"
//                                             checked={!isForKids}
//                                             onChange={handleBooleanChange(setIsForKids)}
//                                             className="mr-2"
//                                         />
//                                         No
//                                     </label>
//                                 </div>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Age Restriction</label>
//                                 <div className="flex">
//                                     <label className="mr-4">
//                                         <input
//                                             type="radio"
//                                             name="ageRestriction"
//                                             value="true"
//                                             checked={isAgeRestricted}
//                                             onChange={handleBooleanChange(setIsAgeRestricted)}
//                                             className="mr-2"
//                                         />
//                                         Yes, restrict to viewers over 18
//                                     </label>
//                                     <label>
//                                         <input
//                                             type="radio"
//                                             name="ageRestriction"
//                                             value="false"
//                                             checked={!isAgeRestricted}
//                                             onChange={handleBooleanChange(setIsAgeRestricted)}
//                                             className="mr-2"
//                                         />
//                                         No, don't restrict
//                                     </label>
//                                 </div>
//                             </div>
//                             <button type="submit" className="bg-green-500 text-white rounded-md px-4 py-2">
//                                 Save
//                             </button>
//                         </form>
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// };

// export default VideoDetail;

