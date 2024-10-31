import React, {useState, useEffect} from 'react';
import {BsShare} from 'react-icons/bs'; // Иконка Share
import {FaFacebook, FaTwitter, FaTelegram, FaWhatsapp} from 'react-icons/fa';
import ShareDialog from "@/components/pages/shorts/share-dialog"; // Иконки соцсетей

interface IProps {
    URL: string;
}

const ShareComponent: React.FC<IProps> = (URL) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };
    /*const [isShareOpen, setIsShareOpen] = useState(false);
    const [hrefFB, setHrefFB] = useState('');
    const [hrefTW, setHrefTW] = useState('');
    const [hrefT, setHrefT] = useState('');
    const [hrefW, setHrefW] = useState('');
    const [url, setUrl] = useState('');

    const toggleShareWindow = () => {
        setIsShareOpen(!isShareOpen);
    };
    const onCloseShare = () => {
        setIsShareOpen(false);
    };

    useEffect(() => {
        setUrl(URL.URL);
        setHrefFB("https://www.facebook.com/sharer/sharer.php?u=" + url);
        setHrefTW("https://twitter.com/intent/tweet?url=" + url);
        setHrefT("https://telegram.me/share/url?url=" + url);
        setHrefW("https://api.whatsapp.com/send?text=" + url);
    }, [URL]);*/

    return (
        <div>
            <div className="flex items-center space-x-2.5" onClick={openDialog}>
                <BsShare size={22}/>
                <div className="font-[300] cursor-pointer">Share</div>
            </div>
            <ShareDialog isOpen={isDialogOpen} onClose={closeDialog} URL={URL}/>
            {/* Кнопка Share */}
            {/* <div className="flex items-center space-x-2.5" onClick={toggleShareWindow}>
                <BsShare size={22}/>
                <div className="font-[300] cursor-pointer">Share</div>
            </div>

             Окно с иконками соцсетей
            {isShareOpen && (
                <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2 "
                     style={{maxWidth: '410px'}}>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'end'}}>
                        <button style={{padding: '10px', paddingTop: '0', fontWeight: 'bold', color: 'gray'}}
                                onClick={onCloseShare}>
                            X
                        </button>
                    </div>
                    <div>
                        <div className="flex space-x-4 justify-center">

                            <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={44} className="text-blue-600 cursor-pointer"
                                            title='Share on Facebook'/>
                            </a>
                            <a href={hrefTW} target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={44} className="text-blue-400 cursor-pointer" title='Share on Twitter'/>
                            </a>
                            <a href={hrefT} target="_blank" rel="noopener noreferrer">
                                <FaTelegram size={44} className="text-blue-500 cursor-pointer"
                                            title='Share on Telegram'/>
                            </a>
                            <a href={hrefW} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={44} className="text-green-500 cursor-pointer"
                                            title='Share on Whatsapp'/>
                            </a></div>
                        <br/>
                        <div style={{wordWrap: 'break-word'}}>{url}</div>
                    </div>
                </div>
            )}*/}
        </div>
    );
};

export default ShareComponent;
