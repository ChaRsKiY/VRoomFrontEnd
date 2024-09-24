"use client"

import {useState, DragEvent, ChangeEvent, useEffect} from 'react';
import {CiVideoOn} from "react-icons/ci";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface Props {
    videoFile: File | null,
    setVideoFile: (data: any) => void,
}

const DragDropVideo: React.FC<Props> = ({ videoFile, setVideoFile }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        handleFile(file);
    };

    const handleFile = (file: File | null) => {
        if (file && file.type.startsWith('video/')) {
            setVideoFile((prev: any) => ({ ...prev, videoFile: file }));
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setIsModalOpened(true);
        }
    };

    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setPreviewUrl(url);
        }
    }, [videoFile]);

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
                className="p-5 rounded-xl border border-dashed border-neutral-200 text-center cursor-pointer"
            >
                <input
                    type="file"
                    id="fileInput"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileInput}
                />

                {videoFile ? (
                    <>
                        <video className="w-full rounded">
                            <source src={previewUrl} type={videoFile.type} />
                            Your browser does not support the video tag.
                        </video>
                    </>
                ) : (
                    <div className="flex items-center flex-col p-3">
                        <CiVideoOn size={50} />
                        <div className="pt-4">Drag and drop a video file here, or click to select one</div>
                    </div>
                )}
            </div>
            <AlertDialog open={isModalOpened}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please upload a valid video file.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsModalOpened(false)}>Ok</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DragDropVideo;