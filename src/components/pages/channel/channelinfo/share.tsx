import React, { useState, useEffect } from 'react';
import { BsShare } from 'react-icons/bs'; 
import { FaFacebook, FaTwitter, FaTelegram, FaWhatsapp } from 'react-icons/fa'; 

interface IProps {
    URL: string;
}

const ShareComponent: React.FC<IProps> = (URL) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [hrefFB, setHrefFB] = useState(''); 
    const [hrefTW, setHrefTW] = useState(''); 
    const [hrefT, setHrefT] = useState(''); 
    const [hrefW, setHrefW] = useState(''); 
    const [url,setUrl]=useState('');

    const toggleShareWindow = () => {
        setIsShareOpen(!isShareOpen); 
    };
    const onCloseShare = () => {
        setIsShareOpen(false); 
    };

    useEffect(() => {
        setUrl(URL.URL);
        setHrefFB("https://www.facebook.com/sharer/sharer.php?u="+url);
        setHrefTW("https://twitter.com/intent/tweet?url="+url);
        setHrefT("https://telegram.me/share/url?url="+url);
        setHrefW("https://api.whatsapp.com/send?text="+url)

      }, [URL]);

    return (
        <div style={{ paddingLeft:'10px'}}>
          
            <div className="flex items-center space-x-2.5" onClick={toggleShareWindow} 
             style={{backgroundColor:'lightgray', padding:'3px', borderRadius:'5px'}}>
                <BsShare size={12} />
                <div className="font-[400] cursor-pointer" >Share</div>
            </div>

            {isShareOpen && (
                <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2 "
                style={{maxWidth:'310px'}}>
                    <div style={{display:'flex',width:'100%',justifyContent:'end'}}>
                    <button  style={{padding:'10px',paddingTop:'0', fontWeight:'bold',color:'gray'}} onClick={onCloseShare}>
                        X
                    </button></div>
                    <div>
                    <div className="flex space-x-4 justify-center">
                        
                        <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} className="text-blue-600 cursor-pointer" title='Share on Facebook'/>
                        </a>
                        <a href={hrefTW} target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={24} className="text-blue-400 cursor-pointer" title='Share on Twitter'/>
                        </a>
                        <a href={hrefT} target="_blank" rel="noopener noreferrer">
                            <FaTelegram size={24} className="text-blue-500 cursor-pointer" title='Share on Telegram'/>
                        </a>
                        <a href={hrefW} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp size={24} className="text-green-500 cursor-pointer" title='Share on Whatsapp' />
                        </a> </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareComponent;