'use client';

import {useState, useRef, useEffect} from 'react';
import api from '@/services/axiosApi';
import VideoPlayer from './player';
import {
    BiArrowFromTop,
    BiCircle,
    BiPen,
    BiPencil,
    BiPlus,
    BiPlusCircle,
    BiSolidKeyboard,
    BiTrash,
    BiX
} from 'react-icons/bi';
import '@/styles/modalsubtitles.css';
import handler from '@/services/upload';
import * as Accordion from '@radix-ui/react-accordion';
import {ISubtitle} from '@/types/subtitle.interface';

import Hls from 'hls.js';
import MDialog from "@/components/pages/channel/subtitle/menuwindow";
import {toast} from "@/hooks/use-toast";
import initTranslations from "@/app/i18n";
import { useTranslation } from 'react-i18next';



interface IProps {
    videoId: number;
    onClose: () => void;
    params: {
        locale: string;
    };
}

const VideoSubtitleEditor: React.FC<IProps> = ({ videoId, onClose, params: { locale } }) => {

     const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);
   // const { t } = useTranslation();

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [forms, setForms] = useState([{ text: '', start: 0, end: 0 },]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [timePoints, setTimePoints] = useState<number[]>([]);
    const [deleteMenuOpenIndex, setDeleteMenuOpenIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const start = forms[selectedIndex]?.start || 0;
    const end = forms[selectedIndex]?.end || 0;
    const startPercentage = (start / duration) * 100;
    const endPercentage = (end / duration) * 100;
    const percentage = (currentTime / duration) * 100;
    const [selectedLanguage, setSelectedLanguage] = useState({name: "English", code: "en"});
    const [languages, setLanguages] = useState([{name: "Русский", code: "ru"}, {name: "English", code: "en"}]);
    const [languageIndex, setLanguageIndex] = useState<number>(0);
    const [urlSubtitles, setUrlSubtitles] = useState<string | null>(null);
    const [fileSubtitle, setFileSubtitle] = useState<File | undefined>();
    const [isChoosen, setIsChoosen] = useState<boolean>(false);
    const [language, setLanguage] = useState<[{ name: string, code: string }]>();
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [draftsDialog, setDraftsDiaolg] = useState<boolean>(false);
    const [publishDialog, setPublishDiaolg] = useState<boolean>(false);
    const [validMessage, setValidMessage] = useState<string>("");
    const [isValid2, setIsValid2] = useState<boolean>(true);
    // const [manualText, setManualText] = useState('');
    // const [lfileText, setFileText] = useState('');
    // const [delText, setDelText] = useState('');

     useEffect(() => {
            const loadTranslations = async () => {
                const { t } = await initTranslations(locale, ['subtitles']);
                setT(() => t);
                // setManualText(t('manual'));
                // setFileText(t('file'));
                // setDelText(t('del'));
            };
            loadTranslations();
        }, [locale]);


    const SaveDrafts = () => {
        savePublishSubtitles(false);
        // onClose();
    }

    const PublishSubtitle = () => {

        savePublishSubtitles(true);
        // onClose();

        savePublishSubtitles(true);
        // onClose();

    }

    const parseVTTFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;

            console.log("Raw content:", content);

            const lines = content.split("\n").map((line) => line.trim()).filter((line) => line !== "" && line !== "WEBVTT");

            const subtitles = [];
            let i = 0;

            while (i < lines.length) {
                const index = parseInt(lines[i], 10);
                const [start, end] = lines[i + 1].split(" --> ");
                const textLines = [];
                let j = i + 2;
                while (j < lines.length && isNaN(parseInt(lines[j], 10))) {
                    textLines.push(lines[j]);
                    j++;
                }
                subtitles.push({
                    index,
                    start: parseVTTTime(start),
                    end: parseVTTTime(end),
                    text: textLines.join(" "),
                });
                i = j;
            }

            console.log("Parsed subtitles:", subtitles);
            setForms(subtitles);
            setIsChoosen(true);
        };

        reader.readAsText(file);
    };

    const parseVTTTime = (time: string) => {
        const [hours, minutes, seconds] = time.split(":");
        const [sec, millis] = seconds.split(".");
        return (
            parseInt(hours, 10) * 3600 +
            parseInt(minutes, 10) * 60 +
            parseInt(sec, 10) +
            parseFloat("0." + millis)
        );
    };


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileSubtitle(file);
        console.log("File:", file);
        console.log("url", fileSubtitle?.name)
        if (file && file.type === "text/vtt") {
            const fileURL = URL.createObjectURL(file);
            setUrlSubtitles(fileURL);
            console.log("Generated fileURL:", fileURL);
            parseVTTFile(file);
        } else {
            alert("Please upload the .vtt file");
        }
    };

    const changeFile = () => {
        const vttContent = [
            'WEBVTT\n\n',
            ...forms.map(
                (subtitle, index) =>
                    `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`
            ),
        ].join('');

        const blob = new Blob([vttContent], {type: 'text/vtt'});
        const file = new File([blob], videoId + selectedLanguage.code + 'subtitle.vtt', {type: 'text/vtt'});
        setFileSubtitle(file);
    }

    const handleLanguageChange = () => {
        setLanguageIndex(languageIndex + 1)
        if (languageIndex >= languages.length - 1)
            setLanguageIndex(0)
        setSelectedLanguage(languages[languageIndex]);
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 1000);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    };

    const formatTime2 = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const parseTime2 = (time: string) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };
    const parseTime = (time: string) => {
        const [hours, minutes, secondsWithMillis] = time.split(':');
        const [seconds, millis = '0'] = secondsWithMillis.split('.');

        return (
            parseInt(hours, 10) * 3600 +
            parseInt(minutes, 10) * 60 +
            parseInt(seconds, 10) +
            parseFloat(`0.${millis}`)
        );
    };

    const handleFormChangeNEW = (index: number, name: string, value: string) => {
        const updatedForms = [...forms];
        const timeInSeconds = parseTime2(value);
        updatedForms[index] = {...updatedForms[index], [name]: timeInSeconds};
        setForms(updatedForms);
    };

    const handleTimeChangeNEW = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);

        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const validateSubtitles = () => {

        let errorMessages = "";
        let isV = true;

        forms.forEach((subtitle, index) => {

            if (subtitle.start >= subtitle.end || !subtitle.text.trim()) {
                errorMessages += `Error in subtitle #${index + 1}:\n`;
                if (subtitle.start >= subtitle.end) {
                    errorMessages += "- The beginning must be less than the end.\n";
                }
                if (!subtitle.text.trim()) {
                    errorMessages += "- The text must not be empty.\n";
                }
                errorMessages += "\n";
                isV = false;
            }
        });

        setIsValid2(isV);
        setValidMessage(errorMessages);
        if (isV)
            PublishSubtitle();
        ;

    };

    const downloadSubtitlesAsVTT = () => {
            const vttContent = [
                'WEBVTT\n\n',
                ...forms.map(
                    (subtitle, index) =>
                        `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`
                ),
            ].join('');

            const blob = new Blob([vttContent], {type: 'text/vtt'});

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'subtitle.vtt';
            link.click();

            URL.revokeObjectURL(link.href);
            console.log("Скачено");
    };

    const uploadVTTToBackend = async (file: File, topublish: boolean) => {
        const formData = new FormData();
        formData.append('fileVTT', file);

        const sub: ISubtitle = {
            id: 0,
            languageCode: selectedLanguage.code,
            languageName: selectedLanguage.name,
            videoId: videoId,
            isPublished: topublish,
        };
        console.log("sub", JSON.stringify(sub));
        Object.entries(sub).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                formData.append(key, value.toString());
            } else if (typeof value === 'boolean' || typeof value === 'number') {
                formData.append(key, value.toString());
            }
        });
        try {
            const response = await api.post('/Subtitle/add', formData);

            if (response.status === 200) {
                let str = "";
                if (topublish)
                    str = "published";
                else
                    str = "saved to drafts";
                toast({
                    title: "Subtitles added",
                    description: "Your subtitles have been " + str,
                    className: "text-green-600 bg-green-100",
                    duration: 3000,
                });
                onClose();
            } else {
                toast({
                    title: "Error subtitles adding",
                    description: "Error while adding subtitles",
                    className: "text-green-600 bg-red-100",
                    duration: 3000,
                });
                onClose();
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const savePublishSubtitles = async (publish: boolean) => {

        const vttContent = [
            'WEBVTT\n\n',
            ...forms.map(
                (subtitle, index) =>
                    `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`
            ),
        ].join('');

        const blob = new Blob([vttContent], {type: 'text/vtt'});
        const file = new File([blob], videoId + selectedLanguage.code + 'subtitle.vtt', {type: 'text/vtt'});

        await uploadVTTToBackend(file, publish);

    };

    const addForm = () => {
        setForms([...forms, {text: '', start: 0, end: 0}]);
    };

    const removeForm = (index: number) => {
        setForms(forms.filter((_, i) => i !== index));
        closeDelete();
    };

    const handleFormChange = (index: number, name: string, value: string | number) => {
        const updatedForms = forms.map((form, i) =>
            i === index ? {...form, [name]: value} : form
        );
        setForms(updatedForms);
    };
    const clearText = (index: number) => {
        handleFormChange(index, "text", "");
    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/Video/${videoId}`); // Запрос к серверу
                if (response.status !== 200) {
                    throw new Error("Failed to fetch video data");
                }
                const videoData = await response.data;

                setVideoSrc(videoData.videoUrl);

            } catch (error) {
                console.error("Ошибка при загрузке видео:", error);
                setVideoError("Error fetching video");
            }
        };

        fetchVideo();
    }, [videoId]);

    const getLanguages = async () => {
        try {
            const res = await api.get(`/Language`);
            if (res.status === 200) {
                const data = await res.data;
                setLanguage(data);
            } else {
                console.error('Ошибка загрузки lang');
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
        }
    }

    useEffect(() => {
        getLanguages();
        // getVideo();
    }, [videoId]);


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', () => {
                setDuration(videoRef.current!.duration);
            });

            videoRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(videoRef.current!.currentTime);
            });
        }
    }, [videoUrl]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);

        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };


    const handleFormChangeValue = (
        index: number,
        name: string,
        value: string | number
    ) => {
        setForms((prevForms) =>
            prevForms.map((form, i) =>
                i === index ? {...form, [name]: value} : form
            )
        );
    };

    const insertForm = (index: number) => {
        const newForm = {text: '', start: 0, end: 0};
        setForms((prevForms) => {
            const updatedForms = [...prevForms];
            updatedForms.splice(index, 0, newForm);
            return updatedForms;
        });
    };

    const setTimeCode = () => {
        setTimePoints((prevPoints) => {
            const sortedPoints = [...prevPoints].sort((a, b) => a - b);
            if (sortedPoints.length > 2) {

                setForms((prevForms) =>
                    prevForms.map((form, i) =>
                        i === selectedIndex ? {...form, start: sortedPoints[1], end: sortedPoints[2]} : form
                    )
                );
                return [];
            }
            const updatedPoints = [...prevPoints, currentTime];
            const sortedPoints2 = [...updatedPoints].sort((a, b) => a - b);

            if (sortedPoints2.length === 1) {
                setForms((prevForms) =>
                    prevForms.map((form, i) =>
                        i === selectedIndex
                            ? {...form, start: sortedPoints2[0]}
                            : form
                    )
                );
            }
            if (sortedPoints2.length === 2) {
                setForms((prevForms) =>
                    prevForms.map((form, i) =>
                        i === selectedIndex
                            ? {...form, start: sortedPoints2[0], end: sortedPoints2[1]}
                            : form
                    )
                );
            }

            return sortedPoints2;
        });
    };

    const toggleDeleteMenu = (index: number, event: React.MouseEvent) => {
        if (deleteMenuOpenIndex === index) {
            setDeleteMenuOpenIndex(null);
        } else {
            setDeleteMenuOpenIndex(index);
            setIsOpen(true);
        }
    };


    const closeDelete = () => {
        if (isOpen) {
            setDeleteMenuOpenIndex(null);
            setIsOpen(false);
        }
    };

    const changeIndex = (index: number) => {
        setSelectedIndex(index);
        setTimePoints([]);
    }
    const changeSelectedLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.selectedOptions[0];
        const name = selectedOption.getAttribute("data-label");
        const code = selectedOption.getAttribute("data-code");
        if (name && code) {
            console.log("name:" + name);
            console.log("code:" + code)
            if (!isLanguageSelected(code)) {
                addLanguage({name, code});
                triggerRef.current?.click();
            } else {
                removeLanguage(code);
                triggerRef.current?.click();
            }

        } else {
            console.error("Не удалось извлечь данные языка");
        }
    };

    const addLanguage = (newLanguage: { name: string; code: string }) => {
        setLanguages((prevLanguages) => [...prevLanguages, newLanguage]);

    };

    const removeLanguage = (code: string) => {
        if (languages.length > 1)
            setLanguages((prevLanguages) =>
                prevLanguages.filter((lang) => lang.code !== code)
            );
    }

    const isLanguageSelected = (code: string) => {
        return languages.some((language) => language.code === code);
    };

    useEffect(() => {
        setSelectedLanguage(languages[languages.length - 1]);
    }, [languages]);

    useEffect(() => {
        changeFile();
    }, [forms]);

    useEffect(() => {
        if (videoSrc && videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoSrc);
                hls.attachMedia(videoRef.current);
                hls.loadSource(videoSrc);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log("HLS: Манифест загружен, воспроизведение готово");
                });
            } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
                videoRef.current.src = videoSrc;
            } else {
                console.error("HLS не поддерживается в этом браузере.");
            }
        }
    }, [videoSrc]);

    return (
        <div className="subtitle-editor" onClick={closeDelete}>

            <div style={{display: 'flex', justifyContent: "space-around"}}>
                <div style={{width: "100%", backgroundColor: '#eeeeee ',}}>
                    <div style={{padding: "10px", borderBottom: "0.5px solid #bdbdbd"}}>
                        <div style={{display: 'flex', justifyContent: "space-between"}}>
                            <div className='flex'>
                                <button style={{padding: "5px", borderRadius: "8px"}}
                                        onClick={handleLanguageChange}
                                        title='Select language'>

                                    <BiSolidKeyboard size={25} style={{
                                        display: 'inline', marginRight: '5px',
                                    }}/>
                                    <label style={{fontWeight: 'bold'}}>{selectedLanguage.name}</label></button>

                                <Accordion.Root
                                    type="single"
                                    collapsible
                                    style={{
                                        marginLeft: '10px',
                                        maxHeight: '28px',
                                        overflow: 'visible',
                                        zIndex: '10',
                                    }}
                                    title="Add language"
                                >
                                    <Accordion.Item
                                        value="ru"
                                        className="border-b"
                                        style={{borderBottom: 'none'}}
                                    >
                                        <Accordion.Trigger
                                            className="w-full text-left py-2 font-bold"
                                            ref={triggerRef}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '0',
                                                boxShadow: 'none',

                                            }}
                                        >
                                            <BiPlus
                                                size={25}
                                                title="Add language"
                                                style={{marginTop: '8px', color: 'black'}}
                                            />
                                        </Accordion.Trigger>
                                        <Accordion.Content
                                            className="p-4"

                                            style={{marginTop: '-40px', marginLeft: '25px'}}
                                        >
                                            <div>
                                                <select
                                                    value={selectedLanguage.code}
                                                    onChange={changeSelectedLanguage}
                                                    className="w-full border px-2 py-1"
                                                    style={{color: 'black', padding: '5px', borderRadius: '0'}}
                                                >
                                                    <option data-label="Русский" data-code="ru" value="ru"
                                                            style={{padding: '10px'}}>
                                                        Русский{' '}
                                                        {isLanguageSelected('ru') && (
                                                            <span style={{color: 'green', marginLeft: '10px'}}>●</span>
                                                        )}
                                                    </option>
                                                    <option data-label="English" data-code="en" value="en">
                                                        English{' '}
                                                        {isLanguageSelected('en') && (
                                                            <span style={{color: 'green', marginLeft: '10px'}}>●</span>
                                                        )}
                                                    </option>
                                                    <option data-label="Deutsch" data-code="de" value="de">
                                                        Deutsch{' '}
                                                        {isLanguageSelected('de') && (
                                                            <span style={{color: 'green', marginLeft: '10px'}}>●</span>
                                                        )}
                                                    </option>
                                                    <option data-label="Espaniola" data-code="es" value="es">
                                                        Espaniola{' '}
                                                        {isLanguageSelected('es') && (
                                                            <span style={{color: 'green', marginLeft: '10px'}}>●</span>
                                                        )}
                                                    </option>
                                                </select>
                                            </div>
                                        </Accordion.Content>
                                    </Accordion.Item>
                                </Accordion.Root>


                                {/* <Accordion.Item value={selectedLanguage.code} className="border-b">
                                   <Accordion.Trigger className="w-full text-left py-2 font-bold" ref={triggerRef}>
                                   <BiPlus size={20} title='Добавить язык' />
                                   </Accordion.Trigger >
                                   <Accordion.Content className="p-4">
                                   <select
                                            value={selectedLanguage.code}
                                             onChange={changeSelectedLanguage}
                                            className="w-full border px-2 py-1"
                                        >
                                               {language?.map((el, key) => (
                                            <option data-label={el.name} data-code={el.code} value={el.code}>{el.name}
                                             {isLanguageSelected(el.code) && (
                                                        <span style={{ color: "green", marginLeft: "10px" }}>●</span>)}
                                            </option>
                                        ))}
                                        </select>
                                   </Accordion.Content>
                               </Accordion.Item> */}


                                {/* </Accordion.Root > */}
                            </div>

                            <div>
                                {isChoosen && (<>
                                    <button className='modal-button'
                                            onClick={SaveDrafts}>Save to draft
                                    </button>
                                    <button className='publish-button'
                                        onClick={validateSubtitles}>Publish</button>
                                    <button className='modal-button ' onClick={downloadSubtitlesAsVTT}
                                    >
                                        <BiArrowFromTop title='Download'/>
                                    </button>
                                    <button className='modal-button ' onClick={() => { setDraftsDiaolg(true) }}
                                        title='Exit' >
                                        <BiPlus style={{ transform: 'rotate(45deg)' }} />
                                    </button>
                                    <MDialog isOpen={draftsDialog} onClose={onClose} onAcsept={SaveDrafts} toDo="Save to draft" />
                                </>)}
                                {!isChoosen && (
                                    <button className='modal-button ' onClick={onClose}
                                        title='Exit' >
                                        <BiPlus style={{ transform: 'rotate(45deg)' }} />
                                    </button>
                                )}
                                {!isValid2 && (
                                    <div style={{
                                        border: '1px solid darkgray', padding: '10px', position: 'fixed', marginTop: "-40px",
                                        backgroundColor: "lightgray", color: 'red', borderRadius: "8px", marginRight: '100px'
                                    }}>
                                        <div>
                                            <div style={{ paddingLeft: '10px', fontWeight: 'bold' }}>Warning! </div>
                                            <div>{validMessage}</div><br />
                                            <div className='flex' style={{ justifyContent: 'space-around' }}>
                                                <button className='modal-button ' onClick={() => { setIsValid2(true) }}>Cancel</button>
                                                <button className='modal-button ' onClick={PublishSubtitle}>Publish subtitles</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <div style={{ padding: '20px', paddingLeft: '0', minWidth: '500px', justifyContent: 'center', display: 'flex' }}>


                            <div style={{ padding: "5px", borderRadius: "3px", backgroundColor: "lightgrey" }}>
                                <video ref={videoRef} controls style={{ maxHeight: '450px' }} >
                                    {fileSubtitle && (
                                        <track
                                            src={URL.createObjectURL(fileSubtitle)} // Создаём временный URL для файла
                                            kind="subtitles"
                                            srcLang="ru"
                                            label="Русский"
                                            default
                                        />
                                    )}
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </div>

                        </div>
                        {!isChoosen ? (<>
                            <div style={{
                                padding: "20px",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around'
                            }}>
                                <p style={{
                                    borderBottom: "1px solid #bdbdbd", padding: '10px',
                                    borderRadius: '0px', color: 'black', fontWeight: 'bold',

                                }}>
                                    <label htmlFor="subtitle-upload" style={{ cursor: "pointer", padding: "10px" }}>
                                        {t("subtitles:upload" )}
                                    </label>
                                    <input
                                        id="subtitle-upload"
                                        type="file"
                                        accept=".vtt"
                                        onChange={handleFileUpload}
                                        style={{
                                            display: "block", marginTop: "10px",
                                            marginBottom: '10px',
                                        }}
                                    />
                                </p>
                                <p style={{
                                    borderBottom: "1px solid #bdbdbd", padding: "10px",
                                    borderRadius: '0px', color: 'black', fontWeight: 'bold',

                                }}>
                                    <button onClick={() => { setIsChoosen(true) }}>   {t("subtitles:manual" )}
                                        <BiPencil style={{ display: 'inline', marginLeft: '10px' }} />
                                    </button>
                                </p>
                                <div></div>
                            </div>
                        </>) : <>
                            {/* Форма добавления субтитров */}
                            <div>

                                <div style={{
                                    padding: '5px', width: '100%',
                                    maxHeight: "360px", overflowX: 'hidden', overflowY: 'scroll', minHeight: "360px",
                                    marginTop: '35px'

                                }}
                                     className="custom-scroll">
                                    {forms.map((form, index) => (
                                        <div className="subtitle-form " style={{
                                            padding: '5px',
                                            backgroundColor: index == selectedIndex ? "lightgrey" : "",
                                            border: '1px solid #bdbdbd',
                                            marginBottom: '2px'
                                        }}
                                             onClick={() => {
                                                 changeIndex(index)
                                             }}>
                                            <div style={{display: 'flex',}}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: "column",
                                                    justifyContent: "space-between"
                                                }}>
                                                    <small>{index + 1}</small>
                                                    <button>
                                                        <BiPlusCircle onClick={() => insertForm(index + 1)}
                                                                      title='Insert'/>
                                                    </button>
                                                </div>
                                                <div style={{marginRight: '3px'}}>

                                                    <textarea
                                                        className="custom-scroll"
                                                        name="text"
                                                        value={form.text}
                                                        onChange={(e) => handleFormChangeValue(index, 'text', e.target.value)}
                                                        placeholder="Text"
                                                        style={{
                                                            border: '1px solid #bdbdbd',
                                                            padding: '3px',
                                                            minHeight: "100%",
                                                            resize: "none",
                                                            // background: 'transparent', color: "white",
                                                            borderRadius: "6px",
                                                            minWidth: '300px'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: "column",
                                                    justifyContent: "space-between"
                                                }}>
                                                    <div>
                                                        <BiX onClick={() => clearText(index)} title='Clear text'/>
                                                    </div>

                                                </div>
                                                <div style={{marginRight: "10px",}}>
                                                    <div style={{margin: '3px'}}>
                                                        <input
                                                            type="text"
                                                            name="start"
                                                            value={formatTime2(form.start)}
                                                            onChange={(e) =>
                                                                handleFormChangeNEW(index, 'start', e.target.value)
                                                            }
                                                            min={0}
                                                            style={{
                                                                border: '1px solid #bdbdbd',
                                                                padding: '3px',
                                                                width: '80px',
                                                                borderRadius: "10px",
                                                                paddingLeft: "10px"
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{margin: '3px'}}>
                                                        <input
                                                            type="text"
                                                            name="end"
                                                            value={formatTime2(form.end)}
                                                            onChange={(e) =>
                                                                handleFormChangeNEW(index, 'end', e.target.value)
                                                            }
                                                            min={0}
                                                            style={{
                                                                border: '1px solid #bdbdbd',
                                                                padding: '3px',
                                                                width: '80px',
                                                                borderRadius: "10px",
                                                                paddingLeft: "10px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: "column",
                                                    justifyContent: "end"
                                                }}>

                                                    <div>
                                                        <BiTrash className='remove-button'
                                                                 onClick={(event) => toggleDeleteMenu(index, event)}
                                                                 style={{margin: '5px',}}
                                                                 title='Delete'/>
                                                    </div>
                                                    {deleteMenuOpenIndex === index ? (
                                                        <div
                                                            className=" bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[160px] subtitle-editor"
                                                            style={{
                                                                marginTop: '-40px',
                                                                paddingBottom: '4px',
                                                                position: 'relative',
                                                                marginLeft: '-120px',
                                                                borderRadius: '3px',
                                                                backgroundColor: 'lightgrey',
                                                                border: '1px solid #212f3c',

                                                            }}
                                                        >
                                                            <div
                                                                className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-red-300"
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    color: 'red',
                                                                    fontWeight: 'bold'
                                                                }}
                                                                onClick={() => removeForm(index)}>
                                                                <span>Delete #{index + 1}</span></div>


                                                            <div
                                                                className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-gray-300"
                                                                style={{display: 'flex', justifyContent: 'center'}}
                                                                onClick={closeDelete}>
                                                                <span>Cancel</span></div>
                                                        </div>
                                                    ) : (<></>)}

                                                </div>


                                            </div>

                                        </div>
                                    ))}
                                </div>

                                <button onClick={addForm} style={{
                                    margin: '20px', marginTop: '12px',
                                    fontSize: '10px'
                                }}
                                        className='modal-button'>
                                    + Add form
                                </button>

                            </div>

                        </>}


                    </div>
                </div>
            </div>
            {isChoosen && (<>
                <div style={{display: 'flex', justifyContent: 'space-between',}}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div style={{backgroundColor: 'lightgrey ',}}>
                    <div className="custom-scroll2"
                         ref={scrollContainerRef}
                         style={{
                             overflowX: "scroll",
                             whiteSpace: "nowrap",
                             width: "100%",
                             maxWidth: "100%", // Видимая область для 5 мину
                             padding: "10px 0",
                             borderRadius: "10px",
                             border: '1px solid lightgrey'
                         }}
                    >
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            step="0.01" // Позволяет выбирать с точностью до 0.01 сек
                            value={currentTime}
                            onChange={handleTimeChangeNEW}
                            onDoubleClick={setTimeCode}

                            style={{

                                width: (duration / 300) >= 1 ? `${(duration / 300) * 100}%` : '100%',
                                marginBottom: '20px',

                                appearance: 'none',
                                position: 'relative',
                                height: '6px',
                                background: `linear-gradient(
                          to right,
                          #000 0%,
                          #000 ${startPercentage}%,
                          #fff ${startPercentage}%,
                          #fff ${endPercentage}%,
                          #000 ${endPercentage}%,
                          #000 100%
                        )`,
                                borderRadius: '3px',
                                outline: 'none',
                            }}
                        />


                    </div>
                </div>
            </>)}


        </div>
    );
};

export default VideoSubtitleEditor;