import React, { useState, useEffect }  from 'react';
import { FaTwitter, FaTelegram, FaWhatsapp, FaInstagram, 
    FaTiktok,FaDiscord, FaLink } from 'react-icons/fa'; 
import { IChannel } from '@/types/channelinfo.interface';

    interface IProps{
        ch:IChannel;
       
    }

const LinkBlock: React.FC<IProps> = async ({ch}) => {
    const [channel,setChannel]=useState<IChannel |null>(null);
    const [hrefFB, setHrefFB] = useState(''); 
    const [hrefTW, setHrefTW] = useState(''); 
    const [hrefT, setHrefT] = useState(''); 
    const [hrefW, setHrefW] = useState(''); 
    const [hrefL, setHrefL] = useState(''); 
    const [url,setUrl]=useState('');
    const[date,setDate]=useState('');

   
    useEffect(() => {
        if(ch){ 
        setUrl(ch.channelNikName);
        setHrefFB("https://www.instagramm.com/sharer/sharer.php?u="+ch.channelNikName);
        setHrefTW("https://twitter.com/intent/tweet?url="+ch.channelNikName);
        setHrefT("https://telegram.me/share/url?url="+ch.channelNikName);
        setHrefW("https://api.whatsapp.com/send?text="+ch.channelNikName);
        setHrefL(ch.channel_URL);
    }

      }, [ch]);

      useEffect(() => {
        setChannel(ch);
       
      }, [ch]);
    return (
        <div style={{display:'flex', flexDirection:'column',paddingTop:'30px',justifyContent:'space-around', paddingLeft:'20px'}}>
            <div  className="flex">

                         <div>
                        <div   style={{padding:'5px'}}>
                        <a href={hrefFB} target="_blank" >
                            <FaTiktok size={18} className="text-black-600 cursor-pointer" title='Tiktok'/> </a>
                        </div>
                        </div>

                        <div>
                        <div   style={{padding:'5px'}}>
                        <a href={hrefFB} target="_blank" >
                            <FaInstagram size={18} className="text-black-600 cursor-pointer" title='Instagram'/></a>
                        </div>
                        </div>

                        <div>
                        <div  style={{padding:'5px'}}>
                        <a href={hrefFB} target="_blank" >
                            <FaTwitter size={18} className="text-black-600 cursor-pointer" title='Twitter'/></a>
                        </div>
                        </div>

                        <div>
                        <div   style={{padding:'5px'}}>
                        <a href={hrefFB} target="_blank"  >
                            <FaDiscord size={18} className="text-black-600 cursor-pointer" title='Discord'/></a>
                        </div>
                        </div>

                        <div>
                        <div  style={{padding:'5px'}}>
                        <a href={hrefFB} target="_blank"  >
                            <FaTelegram size={18} className="text-black-600 cursor-pointer" title='Telegram'/> </a>                      
                        </div>
                        </div>

                        <div>
                        <div   style={{padding:'5px'}}>  
                        <a href={hrefFB} target="_blank"  >                        
                            <FaWhatsapp size={18} className="text-black-600 cursor-pointer" title='Whatsapp'/></a>
                        </div>
                        </div>
                        
                        <div>
                        <div   style={{padding:'5px'}}>  
                        <a href={hrefL} target="_blank"  >                        
                            <FaLink size={18} className="text-black-600 cursor-pointer" title='Link'/></a>
                        </div>
                        </div>
                    
                        
                         </div>
                        <br/>
                                    
            <div className="mb-24" />
        </div>
    )
}

export default LinkBlock