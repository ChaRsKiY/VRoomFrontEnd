
'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/services/axiosApi';
import VideoPlayer from '../../watch/player';
import { BiArrowFromTop, BiCircle, BiPen, BiPlus, BiPlusCircle, BiSolidKeyboard, BiTrash, BiX } from 'react-icons/bi';
import '@/styles/modalsubtitles.css';
import handler from '@/services/upload';
import * as Accordion from '@radix-ui/react-accordion';
import { ISubtitle } from '@/types/subtitle.interface';


interface IProps {
    videoId: number;
    onClose: () => void;
}

const VideoSubtitleEditor: React.FC<IProps> = ({ videoId, onClose }) => {

    const [duration, setDuration] = useState(0); // Общая длина видео
    const [currentTime, setCurrentTime] = useState(0); // Текущее время на шкале
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // URL видео
    // const [subtitles, setSubtitles] = useState<{ start: number; end: number; text: string }[]>([]);
    // const [currentSubtitle, setCurrentSubtitle] = useState({ start: 0, end: 0, text: '', });
    const [forms, setForms] = useState([{ text: '', start: 0, end: 0 },]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    // const [currentStart, setCurrentSratr] = useState(0);
    // const [currentEnd, setCurrentEnd] = useState(0);
    const [timePoints, setTimePoints] = useState<number[]>([]);
    const [deleteMenuOpenIndex, setDeleteMenuOpenIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const start = forms[selectedIndex]?.start || 0;
    const end = forms[selectedIndex]?.end || 0;
    const startPercentage = (start / duration) * 100;
    const endPercentage = (end / duration) * 100;
    const percentage = (currentTime / duration) * 100;
    const [selectedLanguage, setSelectedLanguage] = useState({ name: "Русский", code: "ru" });
    const [languages, setLanguages] = useState([{ name: "English", code: "en" }, { name: "Русский", code: "ru" }]);
    const [languageIndex, setLanguageIndex] = useState<number>(0);
    const [urlSubtitles, setUrlSubtitles] = useState<string | null>(null);
    const [fileSubtitle, setFileSubtitle] = useState<File | undefined>();
    const [isValid1, setIsValid1] = useState<boolean>(true);
    const [isValid2, setIsValid2] = useState<boolean>(true);
    const [isChoosen, setIsChoosen] = useState<boolean>(false);
    const [language, setLanguage] = useState<[{ name: string, code: string }]>();
    const triggerRef = useRef<HTMLButtonElement | null>(null);

   const SaveBeforeExit =()=>{
    savePublishSubtitles(false);
    onClose();
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
            // uploadSubtitleToServer(file);
            // console.log("!!////");
            parseVTTFile(file);
        } else {
            alert("Пожалуйста, загрузите файл формата .vtt");
        }
    };

    const changeFile =()=>{
        const vttContent = [
            'WEBVTT\n\n',
            ...forms.map(
                (subtitle, index) =>
                    `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`
            ),
        ].join('');

        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const file = new File([blob], 'subtitles.vtt', { type: 'text/vtt' });
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

        forms.forEach((subtitle, index) => {
            if (subtitle.start >= subtitle.end || !subtitle.text.trim()) {
                alert(`Ошибка в субтитре #${index + 1}: 
              - Начало должно быть меньше конца.
              - Текст не должен быть пустым.`);
                setIsValid1(false);
            }
        });

        if (isValid1) {
            setIsValid2(true);
        }
        else {
            setIsValid2(false);
            setIsValid1(true);
        }
    };

    const downloadSubtitlesAsVTT = () => {
        validateSubtitles();
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
            link.download = 'subtitles.vtt';
            link.click();

            URL.revokeObjectURL(link.href);
        }
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
                alert('Файл успешно загружен на сервер!');
            } else {
                alert('Ошибка загрузки файла.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const savePublishSubtitles = async (publish: boolean) => {
        validateSubtitles();
        if (isValid2) {
            const vttContent = [
                'WEBVTT\n\n',
                ...forms.map(
                    (subtitle, index) =>
                        `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n\n`
                ),
            ].join('');

            const blob = new Blob([vttContent], { type: 'text/vtt' });
            const file = new File([blob], 'subtitles.vtt', { type: 'text/vtt' });

            await uploadVTTToBackend(file, publish);
        }
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

    const getVideo = async () => {
        try {
            const res = await api.get(`/Video/${videoId}`);
            if (res.status === 200) {
                const data = await res.data;
                setVideoUrl(data.videoUrl);
            } else {
                console.error('Ошибка загрузки видео');
                setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4")
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        }
    }
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
        getVideo();
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


    // const generateGradient = () => {
    //     const gradients = forms.map(({ start, end }) => {
    //       const startPercentage = (start / duration) * 100;
    //       const endPercentage = (end / duration) * 100;
    //       return `#fff ${startPercentage}%, #fff ${endPercentage}%`;
    //     });

    //     // Добавляем чёрный цвет для неактивных областей
    //     return `linear-gradient(to right, #000 0%, ${gradients.join(
    //       ', '
    //     )}, #000 100%)`;
    //   };

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
        // generateGradient();
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
                addLanguage({ name, code });
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

    return (
        <div className="subtitle-editor" onClick={closeDelete}>

            <div style={{ display: 'flex', justifyContent: "space-around" }}>
                <div style={{ width: "100%", backgroundColor: '#424242 ', color: "white" }}>
                    <div style={{ padding: "10px", borderBottom: "0.5px solid #bdbdbd" }}>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <div className='flex'>
                                <button style={{ padding: "5px", borderRadius: "8px" }}
                                    onClick={handleLanguageChange}>
                                    <BiSolidKeyboard style={{ display: 'inline', marginRight: '5px' }} />
                                    <label>{selectedLanguage.name}</label></button>

                                <Accordion.Root type="single" collapsible style={{
                                    marginLeft: '10px',
                                    maxHeight: "30px", overflow: 'visible', zIndex: '10'
                                }}>

                                    <Accordion.Item value="ru" className="border-b">
                                        <Accordion.Trigger className="w-full text-left py-2 font-bold "
                                            ref={triggerRef}>
                                            <BiPlus size={20} title='Добавить язык' className='modal-button ' />
                                        </Accordion.Trigger>
                                        <Accordion.Content className="p-4">
                                            <select
                                                value={selectedLanguage.code}
                                                onChange={changeSelectedLanguage}
                                                className="w-full border px-2 py-1"
                                                style={{ color: 'black' }}
                                            >
                                                <option data-label="Русский" data-code="ru" value="ru">
                                                    Русский {isLanguageSelected("ru") && (
                                                        <span style={{ color: "green", marginLeft: "10px" }}>●</span>)}
                                                </option>
                                                <option data-label="English" data-code="en" value="en">English
                                                    {isLanguageSelected("en") && (
                                                        <span style={{ color: "green", marginLeft: "10px" }}>●</span>)}
                                                </option>
                                                <option data-label="Deutsch" data-code="de" value="de">Deutsch
                                                    {isLanguageSelected("de") && (
                                                        <span style={{ color: "green", marginLeft: "10px" }}>●</span>)}
                                                </option>
                                                <option data-label="Espaniola" data-code="es" value="es">Espaniola
                                                    {isLanguageSelected("es") && (
                                                        <span style={{ color: "green", marginLeft: "10px" }}>●</span>)}
                                                </option>
                                            </select>
                                        </Accordion.Content>
                                    </Accordion.Item>



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


                                </Accordion.Root >
                            </div>

                            <div>
                                {isChoosen && (<>
                                    <button className='modal-button'
                                        onClick={() => { savePublishSubtitles(false) }}>Добавить в черновик</button>
                                    <button className='publish-button'
                                        onClick={() => { savePublishSubtitles(true) }}>Опубликовать</button>
                                    <button className='modal-button ' onClick={downloadSubtitlesAsVTT}>
                                        <BiArrowFromTop title='скачать' />
                                    </button>
                                </>)}
                                <button className='modal-button ' onClick={SaveBeforeExit}>
                                    <BiPlus style={{ transform: 'rotate(45deg)' }} title='Выйти' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                        {!isChoosen ? (<>
                            <div style={{ padding: "20px" }}>
                                <p style={{ borderBottom: "1px solid #bdbdbd" }}>
                                    <label htmlFor="subtitle-upload" style={{ cursor: "pointer", padding: "10px" }}>
                                        Загрузить файл субтитров (.vtt)
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
                                <p style={{ borderBottom: "1px solid #bdbdbd", padding: "10px" }}>
                                    <button onClick={() => { setIsChoosen(true) }}> Ввести субтитры вручную
                                        <BiPen style={{ display: 'inline', marginLeft: '10px' }} />
                                    </button>
                                </p>
                            </div>
                        </>) : <>
                            {/* Форма добавления субтитров */}
                            <div >
                                <button onClick={addForm} style={{ margin: '20px', marginBottom: '12px', marginTop: '12px' }}
                                    className='modal-button'>
                                    + Добавить подпись</button>
                                <div style={{
                                    padding: '5px', backgroundColor: '#424242 ', color: "white", width: '100%',
                                    maxHeight: "330px", overflowX: 'hidden', overflowY: 'scroll', minHeight: "330px",

                                }}
                                    className="custom-scroll" >
                                    {forms.map((form, index) => (
                                        <div className="subtitle-form " style={{
                                            padding: '5px',
                                            backgroundColor: index == selectedIndex ? "black" : ""
                                        }}
                                            onClick={() => { changeIndex(index) }} >
                                            <div style={{ display: 'flex', }}>
                                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between" }}>
                                                    <small>{index + 1}</small>
                                                    <button  >
                                                        <BiPlusCircle onClick={() => insertForm(index + 1)} title='Вставить подпись' />
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
                                                            backgroundColor: '#424242 ', color: "white", borderRadius: "12px", minWidth: '300px'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "space-between" }} >
                                                    <div>
                                                        <BiX onClick={() => clearText(index)} title='Очистить текс' />
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
                                                                backgroundColor: '#424242 ', color: "white", borderRadius: "12px"
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
                                                                backgroundColor: '#424242 ', color: "white", borderRadius: "12px"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "end" }}  >

                                                    <div>
                                                        <BiTrash className='remove-button' onClick={(event) => toggleDeleteMenu(index, event)}
                                                            style={{ margin: '5px', }}
                                                            title='удалить' />
                                                    </div>
                                                    {deleteMenuOpenIndex === index ? (
                                                        <div
                                                            className=" bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[140px] subtitle-editor"
                                                            style={{
                                                                marginTop: '-40px',
                                                                paddingBottom: '4px',
                                                                position: 'relative',
                                                                marginLeft: '-120px',
                                                                backgroundColor: '#34495e',
                                                                border: '2px solid #212f3c'
                                                            }}
                                                        >
                                                            <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-red-300"
                                                                style={{ display: 'flex', justifyContent: 'center', color: 'red', fontWeight: 'bold' }}
                                                                onClick={() => removeForm(index)}>
                                                                <span >Удалить</span></div>


                                                            <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-gray-300"
                                                                style={{ display: 'flex', justifyContent: 'center' }}
                                                                onClick={closeDelete}>
                                                                <span >Отмена</span></div>
                                                        </div>
                                                    ) : (<></>)}

                                                </div>



                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>

                        </>}





                        <div style={{ padding: '20px', paddingLeft: '0' }}>

                            {/* {videoUrl ? (
                                <VideoPlayer src={videoUrl} id={videoId} />
                            ) : (
                                <p>Загрузка видео...</p>
                            )} */}

                            {videoUrl && (

                                <video ref={videoRef} controls style={{ width: '800px', marginTop: '20px' }}>
                                    <source src={videoUrl} type="video/mp4" />
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

                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isChoosen && (<>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                    <span>{formatTime(currentTime)}</span>
                    <span >{formatTime(duration)}</span>
                </div>
                <div style={{ color: "white", backgroundColor: '#424242 ', }}   >
                    <div className="custom-scroll"
                        ref={scrollContainerRef}
                        style={{
                            overflowX: "scroll",
                            whiteSpace: "nowrap",
                            width: "100%",
                            maxWidth: "100%", // Видимая область для 5 минут
                            backgroundColor: "#424242",
                            padding: "10px 0",
                            borderRadius: "10px",

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
                                // width: '100%',
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
            {/* 
            <div style={{ marginTop: "10px" }}>
                <label htmlFor="subtitle-upload" style={{ cursor: "pointer" }}>
                    Загрузить файл субтитров (.vtt)
                </label>
                <input
                    id="subtitle-upload"
                    type="file"
                    accept=".vtt"
                    onChange={handleFileUpload}
                    style={{ display: "block", marginTop: "10px" }}
                />
            </div> */}


        </div>
    );
};

export default VideoSubtitleEditor;