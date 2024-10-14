'use client'
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import { FC, useRef, useState, useEffect } from 'react';
import "@/app/[locale]/channel/uploadvideo/style.css";
import { MdCloudUpload } from "react-icons/md";
import initTranslations from "@/app/i18n";
import { useRouter } from 'next/navigation';
import ReactPlayer from 'react-player';

interface IHomeProps {
    params: {
        locale: string;
    };
}

const VideoUpload: FC<IHomeProps> = ({ params: { locale } }) => {
    const router = useRouter();
    const [t, setT] = useState<any>(null); 
    const [loading, setLoading] = useState(true); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [error, setError] = useState<string | null>(null); 
    const [fileURL, setFileURL] = useState<string | null>(null); 
    const fileInputRef = useRef<HTMLInputElement>(null); 


    const openFilePicker = () => {
        fileInputRef.current?.click(); 
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file); 
        if (file) {
            const fileURL = URL.createObjectURL(file); 
            sessionStorage.setItem('fileURL', fileURL); 
            setFileURL(fileURL); 
        }
    };
    
    const handleNextPage = () => {
        if (selectedFile) {
            router.push('http://localhost:3000/ru/channel/detailvideo'); 
        } else {
            setError('No file selected');
        }
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

    if (loading) {
        return <div>Loading translations...</div>;
    }

    return (
        <>
            <HeaderHome t={t} />
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t} />
                <main className="pl-[25%] ml-[-5%] max-lg:pl-[70%] max-sm:pl-10">
                    <div className="upload-section">
                        <h1 className="text-4xl font-bold ">{t('Upload media')}</h1>

                        <div className="upload-box" onClick={openFilePicker}>
                            <MdCloudUpload />
                            <p>Click "Upload" to select a video file from your computer</p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <button type="button">
                                {t('select_file')}
                            </button>
                        </div>

                        {fileURL && (
                            <div className="mt-5">
                                <ReactPlayer url={fileURL} controls={true} />
                            </div>
                        )}

                        {error && <p className="text-red-500">{error}</p>}

                        <button type="button" className="submit-btn mt-5" onClick={handleNextPage}>
                            {t('Next')}
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default VideoUpload;




