import React, { useState, useEffect }  from 'react';
import { FaTwitter, FaTelegram, FaWhatsapp, FaInstagram, 
    FaTiktok,FaDiscord,FaEnvelope,FaUsers,
    FaInfo, FaLink ,FaVideo} from 'react-icons/fa'; 
import { IChannel } from '@/types/channelinfo.interface';
import RadioButtonList  from "@/components/pages/comments/report";
import { FiFlag } from 'react-icons/fi';
import ShareComponent from "./share";
import { IUser } from '@/types/user.interface';

    interface IProps{
        ch:IChannel;
        v:number;
    }

const LinkList: React.FC<IProps> = async ({ch,v}) => {
    const [channel,setChannel]=useState<IChannel |null>(null);
    const [hrefFB, setHrefFB] = useState(''); 
    const [hrefTW, setHrefTW] = useState(''); 
    const [hrefT, setHrefT] = useState(''); 
    const [hrefW, setHrefW] = useState(''); 
    const [url,setUrl]=useState('');
    const [display2, setDisplay2] = useState('none'); 
    const [display1, setDisplay1] = useState('block'); 


    const openReport = () => {
        if(display2==='none'){ 
        setDisplay2('block');
        setDisplay1('none');}
        else{
            setDisplay1('block');
            setDisplay2('none'); 
        }
       };
     

    useEffect(() => {
        if(channel){ 
        setUrl(channel.channel_URL);
        setHrefFB("https://www.instagramm.com/sharer/sharer.php?u="+url);
        setHrefTW("https://twitter.com/intent/tweet?url="+url);
        setHrefT("https://telegram.me/share/url?url="+url);
        setHrefW("https://api.whatsapp.com/send?text="+url);}

      }, [channel]);

      useEffect(() => {
        setChannel(ch);   
      }, [ch]);

    return (
        <div>
            <div style={{fontWeight:'bolder'}} >Links</div>
            <div className="flex  " style={{flexDirection:'column'}}>

                         <div>
                        <div className="flex" style={{padding:'2px'}}>
                            <div className="flex " style={{flexDirection:'column',justifyContent:'center'}}>
                        <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                            <FaTiktok size={18} className="text-black-600 cursor-pointer" title='Tiktok'/>
                        </a> </div>
                        <div className="flex " style={{flexDirection:'column',paddingLeft:'20px',fontSize:'12px'}}>
                        <div style={{color:'black'}}>tik tok //short tutorials</div>
                            <a href={hrefFB} target="_blank" style={{color:'blue',fontSize:'12px'}}> tiktok.com/@juxtopposed</a>
                        </div>
                        </div>
                        </div>

                        <div>
                        <div className="flex" style={{padding:'2px'}}>
                            <div className="flex " style={{flexDirection:'column',justifyContent:'center'}}>
                        <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={18} className="text-black-600 cursor-pointer" title='Instagram' />
                        </a> </div>
                        <div className="flex " style={{flexDirection:'column',paddingLeft:'20px',fontSize:'10px'}}>
                        <div style={{color:'black'}}>instagram //only for the cats</div>
                            <a href={hrefFB} target="_blank" style={{color:'blue',fontSize:'10px'}}> instagram.com/@juxtopposed</a>
                        </div>
                        </div>
                        </div>

                        <div>
                        <div className="flex" style={{padding:'2px'}}>
                            <div className="flex " style={{flexDirection:'column',justifyContent:'center'}}>
                        <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={18} className="text-black-600 cursor-pointer" title='Twitter'/>
                        </a> </div>
                        <div className="flex " style={{flexDirection:'column',paddingLeft:'20px',fontSize:'10px'}}>
                        <div style={{color:'black'}}>twitter //tweet me something</div>
                            <a href={hrefTW} target="_blank" style={{color:'blue',fontSize:'10px'}}> twitter.com/@juxtopposed</a>
                        </div>
                        </div>
                        </div>

                        <div>
                        <div className="flex" style={{padding:'2px'}}>
                            <div className="flex " style={{flexDirection:'column',justifyContent:'center'}}>
                        <a href={hrefFB} target="_blank" rel="noopener noreferrer">
                            <FaDiscord size={18} className="text-black-600 cursor-pointer" title='Discord'/>
                        </a> </div>
                        <div className="flex " style={{flexDirection:'column',paddingLeft:'20px',fontSize:'10px'}}>
                        <div style={{color:'black'}}>discord //join hospitable designers community</div>
                            <a href={hrefFB} target="_blank" style={{color:'blue',fontSize:'10px'}}> discord.gg/@juxtopposed</a>
                        </div>
                        </div>
                        </div>

                        <div>
                        <div className="flex" style={{padding:'2px'}}>
                            <div className="flex " style={{flexDirection:'column',justifyContent:'center'}}>
                        <a href={hrefT} target="_blank" rel="noopener noreferrer">
                            <FaTelegram size={18} className="text-black-600 cursor-pointer" title='Telegram'/>
                        </a> </div>
                        <div className="flex " style={{flexDirection:'column',paddingLeft:'20px',fontSize:'10px'}}>
                        <div style={{color:'black'}}>telegramm //message me for business</div>
                            <a href={hrefFB} target="_blank" style={{color:'blue',fontSize:'10px'}}> t.me/@juxtopposed</a>
                        </div>
                        </div>
                        </div>

                        <div>
                        <div className="flex" style={{padding:'2px'}}>
                            <div className="flex " style={{flexDirection:'column',justifyContent:'center'}}>
                        <a href={hrefW} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp size={18} className="text-black-600 cursor-pointer" title='Whatsapp'/>
                        </a> </div>
                        <div className="flex " style={{flexDirection:'column',paddingLeft:'20px',fontSize:'10px'}}>
                        <div style={{color:'black'}}>Whatsapp //message me</div>
                            <a href={hrefFB} target="_blank" style={{color:'blue',fontSize:'10px'}}> watsapp.com@Whatsapp</a>
                        </div>
                        </div>
                        </div>

                    <div style={{paddingBottom:'5px', fontWeight:'bolder'}}>Channel details</div>
                        <div className="flex" style={{padding:'2px',paddingLeft:'10px'}}>                                                
                            <FaEnvelope size={12} className="text-600 cursor-pointer" title='email'/> 
                            <div style={{paddingLeft:'20px',fontSize:'12px', width:"105px"}}>Email</div>   
                           <div style={{paddingLeft:'10px',fontSize:'12px'}}>channelVroom@gmail.com</div>                          
                        </div>
                        <div className="flex" style={{padding:'2px',paddingLeft:'10px'}}>                                                
                            <FaUsers size={14} className="text-600 cursor-pointer" title='followers'/>
                            <div style={{paddingLeft:'20px',fontSize:'12px', width:"105px"}}>Follower Count</div>      
                           <div style={{paddingLeft:'10px',fontSize:'12px'}}>{channel?.subscriptionCount} </div>                          
                        </div>
                        <div className="flex" style={{padding:'2px',paddingLeft:'10px'}}>                                                
                            <FaLink size={12} className="text-600 cursor-pointer" title='link'/> 
                            <div style={{paddingLeft:'20px',fontSize:'11px', width:"105px"}}>Channel link</div>     
                           <div style={{paddingLeft:'10px',fontSize:'11px'}}>{channel?.channel_URL} </div>                          
                        </div>
                        <div className="flex" style={{padding:'2px',paddingLeft:'10px'}}>                                                
                            <FaInfo size={12} className="text-600 cursor-pointer" title='joind date'/>  
                            <div style={{paddingLeft:'20px',fontSize:'12px', width:"105px"}}>Joined VRoom</div>
                            { channel?(   
                           <div style={{paddingLeft:'10px',fontSize:'12px'}}>{channel.dateJoined.toString().split('T')[0]} 
                          </div> ):<></>}                         
                        </div>
                        <div className="flex" style={{padding:'2px',paddingLeft:'10px'}}>                                                
                            <FaVideo size={12} className="text-600 cursor-pointer" title='videos count'/>  
                            <div style={{paddingLeft:'20px',fontSize:'12px', width:"105px"}}>Total videos</div>    
                           <div style={{paddingLeft:'10px',fontSize:'12px'}}>{v}</div>                          
                        </div>
                       
                        
                         
                    <div  style={{display:'flex'}}>
                     <div style={{ paddingTop:'10px'}}>
                  <div onClick={() => openReport()} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300" 
                   style={{display:'flex', justifyContent:'center',backgroundColor:'lightgray',
                    borderRadius:'4px'}}>
                   
                <FiFlag size={15} />
                       
                <span style={{fontSize:'15px'}}>Report</span>
                    </div> </div>
                    {channel?(
                     <div className="flex items-center space-x-2.5" style={{ paddingTop:'10px'}}>
                        <ShareComponent URL={channel?.channel_URL} />
                       
                    </div> ):<></>}
                   {channel?(

                    <div
                    className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
                    style={{
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      position: 'absolute',
                     marginTop:'-350px',
                     marginLeft:'-400px',
                     display:display2,
                     maxWidth: '400px',
                     minWidth:'300px',
                     borderRadius:'20px'
                    }}
                  >    
                        <RadioButtonList userName={channel?.channelNikName} onClose={openReport}/> </div>):<></>}
                     </div>

                    </div>
        </div>
    )
}

export default LinkList