'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/services/axiosApi';
import VideoPlayer from './player';
import { BiArrowFromTop, BiCircle, BiPen, BiPencil, BiPlus, BiPlusCircle, BiSolidKeyboard, BiTrash, BiX } from 'react-icons/bi';
import '@/styles/modalsubtitles.css';
import handler from '@/services/upload';
import * as Accordion from '@radix-ui/react-accordion';
import { ISubtitle } from '@/types/subtitle.interface';
import Hls from 'hls.js';
import MDialog from "@/components/pages/channel/subtitle/menuwindow";
import { toast } from "@/hooks/use-toast";

interface IProps {
    videoId: number;
    onClose: () => void;
    subtitleUrl: string,
    langCode: string,
    langName: string,
}

const FoulCopySubtitleEditor: React.FC<IProps> = ({ videoId, onClose, subtitleUrl, langCode, langName }) => {

    const [duration, setDuration] = useState(0); // Общая длина видео
    const [subtitleId, setSubtitleId] = useState(0);
    const [currentTime, setCurrentTime] = useState(0); // Текущее время на шкале
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // URL видео
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
    const [selectedLanguage, setSelectedLanguage] = useState({ name: "English", code: "en" });
    const [fileSubtitle, setFileSubtitle] = useState<File | undefined>();
    const [isValid1, setIsValid1] = useState<boolean>(true);
    const [isValid2, setIsValid2] = useState<boolean>(true);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const [draftsDialog, setDraftsDiaolg] = useState<boolean>(false);
    const [publishDialog, setPublishDiaolg] = useState<boolean>(false);
    const [validMessage, setValidMessage] = useState<string>("");


    const SaveDrafts = () => {
        savePublishSubtitles(false);
      
    }

    const PublishSubtitle = () => {

        savePublishSubtitles(true);

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



    const fetchSubtitleFile = async (url: string) => {
        try {
            console.log("langname:", langName + langCode);
            const response = await api.get('/Subtitle/getsubtitlefile/' + url
                , {
                    responseType: 'blob',
                });


            if (response.status != 200) {
                throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
            }
            const blob = await response.data;
            console.log('blob:' + blob);
            const file = new File([blob], videoId + langCode + "subtitle.vtt", { type: blob.type });

            setFileSubtitle(file);
            parseVTTFile(file);
        } catch (error) {
            console.error("Ошибка при загрузке файла:", error);
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

        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const file = new File([blob], videoId + langCode + 'subtitle.vtt', { type: 'text/vtt' });
        setFileSubtitle(file);
    }


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
        updatedForms[index] = { ...updatedForms[index], [name]: timeInSeconds };
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
            PublishSubtitle();;

    };

    const downloadSubtitlesAsVTT = () => {
        if (isValid2) {
            const vttContent = [
                'WEBVTT\n\n',
                ...forms.map(
                    (subtitle, index) =>
                        `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`
                ),
            ].join('');

            const blob = new Blob([vttContent], { type: 'text/vtt' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = videoId + langCode + 'subtitle.vtt';
            link.click();

            URL.revokeObjectURL(link.href);
        }
    };

    const uploadVTTToBackend = async (file: File, topublish: boolean) => {
        const formData = new FormData();
        formData.append('fileVTT', file);

        const sub: ISubtitle = {
            id: 0,
            languageCode: langCode,
            languageName: langName,
            videoId: videoId,
            isPublished: topublish,
            puthToFile: subtitleUrl
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
                    description: "Your subtitles have been "+ str,
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

        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const file = new File([blob], videoId + selectedLanguage.code + 'subtitle.vtt', { type: 'text/vtt' });

        await uploadVTTToBackend(file, publish);

    };

    const addForm = () => {
        setForms([...forms, { text: '', start: 0, end: 0 }]);
    };

    const removeForm = (index: number) => {
        setForms(forms.filter((_, i) => i !== index));
        closeDelete();
    };

    const handleFormChange = (index: number, name: string, value: string | number) => {
        const updatedForms = forms.map((form, i) =>
            i === index ? { ...form, [name]: value } : form
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
                i === index ? { ...form, [name]: value } : form
            )
        );
    };

    const insertForm = (index: number) => {
        const newForm = { text: '', start: 0, end: 0 };
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
                        i === selectedIndex ? { ...form, start: sortedPoints[1], end: sortedPoints[2] } : form
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
                            ? { ...form, start: sortedPoints2[0] }
                            : form
                    )
                );
            }
            if (sortedPoints2.length === 2) {
                setForms((prevForms) =>
                    prevForms.map((form, i) =>
                        i === selectedIndex
                            ? { ...form, start: sortedPoints2[0], end: sortedPoints2[1] }
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


    useEffect(() => {
        changeFile();
    }, [forms]);

    useEffect(() => {
        if (subtitleUrl) {
            const encodedUrl = encodeURIComponent(subtitleUrl);
            fetchSubtitleFile(encodedUrl);
        }
    }, [subtitleUrl]);

    useEffect(() => {
        if (videoSrc && videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
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
        <div className="subtitle-editor" onClick={closeDelete} >


            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <div style={{ width: "100%", backgroundColor: '#eeeeee ', }}>
                    <div style={{ padding: "10px", borderBottom: "0.5px solid #bdbdbd" }}>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <div className='flex'>
                                <div style={{ padding: "5px", borderRadius: "8px" }}>


                                    <BiSolidKeyboard size={25} style={{
                                        display: 'inline', marginRight: '5px',
                                    }} />
                                    <label style={{ fontWeight: 'bold' }}>{langName} **</label></div>


                            </div>

                            <div>

                                <button className='modal-button'
                                    onClick={SaveDrafts}>Save to draft</button>

                                <button className='publish-button'
                                    onClick={validateSubtitles}>Publish</button>

                                <button className='modal-button ' onClick={downloadSubtitlesAsVTT} title='Download' >
                                    <BiArrowFromTop />
                                </button>

                                <button className='modal-button ' onClick={() => { setDraftsDiaolg(true) }}
                                    title='Exit' >
                                    <BiPlus style={{ transform: 'rotate(45deg)' }} />
                                </button>
                                <MDialog isOpen={draftsDialog} onClose={onClose} onAcsept={SaveDrafts} toDo="Save to draft" />
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

                        <div style={{ padding: '20px', paddingLeft: '0' }}>

                            <div style={{ padding: '5px', paddingLeft: '0', minWidth: '500px', justifyContent: 'center', display: 'flex' }}>


                                <div style={{ padding: "5px", borderRadius: "3px", backgroundColor: "lightgrey" }}>
                                    <video ref={videoRef} controls style={{ maxHeight: '450px' }} >
                                        {fileSubtitle && (
                                            <track
                                                src={URL.createObjectURL(fileSubtitle)}
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

                        </div>

                        <div >

                            <div style={{
                                padding: '5px', width: '100%',
                                maxHeight: "360px", overflowX: 'hidden', overflowY: 'scroll', minHeight: "360px",
                                marginTop: '35px'

                            }}
                                className="custom-scroll" >
                                {forms.map((form, index) => (
                                    <div className="subtitle-form " style={{
                                        padding: '5px',
                                        backgroundColor: index == selectedIndex ? "lightgrey" : "", border: '1px solid #bdbdbd',
                                        marginBottom: '2px'
                                    }}
                                        onClick={() => { changeIndex(index) }} >
                                        <div style={{ display: 'flex', }}>
                                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between" }}>
                                                <small>{index + 1}</small>
                                                <button  >
                                                    <BiPlusCircle onClick={() => insertForm(index + 1)} title='Insert' />
                                                </button>
                                            </div>
                                            <div style={{ marginRight: '3px' }}  >

                                                <textarea
                                                    className="custom-scroll"
                                                    name="text"
                                                    value={form.text}
                                                    onChange={(e) => handleFormChangeValue(index, 'text', e.target.value)}
                                                    placeholder="Text"
                                                    style={{
                                                        border: '1px solid #bdbdbd', padding: '3px', minHeight: "100%", resize: "none",
                                                        borderRadius: "6px", minWidth: '300px'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between" }} >
                                                <div>
                                                    <BiX onClick={() => clearText(index)} title='Clear text' />
                                                </div>

                                            </div>
                                            <div style={{ marginRight: "10px", }}>
                                                <div style={{ margin: '3px' }}>
                                                    <input
                                                        type="text"
                                                        name="start"
                                                        value={formatTime2(form.start)}
                                                        onChange={(e) =>
                                                            handleFormChangeNEW(index, 'start', e.target.value)
                                                        }
                                                        min={0}
                                                        style={{
                                                            border: '1px solid #bdbdbd', padding: '3px', width: '80px',
                                                            borderRadius: "10px", paddingLeft: "10px"
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ margin: '3px' }}>
                                                    <input
                                                        type="text"
                                                        name="end"
                                                        value={formatTime2(form.end)}
                                                        onChange={(e) =>
                                                            handleFormChangeNEW(index, 'end', e.target.value)
                                                        }
                                                        min={0}
                                                        style={{
                                                            border: '1px solid #bdbdbd', padding: '3px', width: '80px',
                                                            borderRadius: "10px", paddingLeft: "10px"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "end" }}  >

                                                <div>
                                                    <BiTrash className='remove-button' onClick={(event) => toggleDeleteMenu(index, event)}
                                                        style={{ margin: '5px', }}
                                                        title='Delete' />
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
                                                        <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-red-300"
                                                            style={{ display: 'flex', justifyContent: 'center', color: 'red', fontWeight: 'bold' }}
                                                            onClick={() => removeForm(index)}>
                                                            <span >Delete #{index + 1}</span></div>


                                                        <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-gray-300"
                                                            style={{ display: 'flex', justifyContent: 'center' }}
                                                            onClick={closeDelete}>
                                                            <span >Cancel</span></div>
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
                                + Add form</button>

                        </div>


                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                <span>{formatTime(currentTime)}</span>
                <span >{formatTime(duration)}</span>
            </div>
            <div style={{ backgroundColor: 'lightgrey ', }}   >
                <div className="custom-scroll2"
                    ref={scrollContainerRef}
                    style={{
                        overflowX: "scroll",
                        whiteSpace: "nowrap",
                        width: "100%",
                        maxWidth: "100%",
                        padding: "10px 0",
                        borderRadius: "10px",
                        border: '1px solid lightgrey'
                    }}
                >
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.01"
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


        </div>
    );
};

export default FoulCopySubtitleEditor;
