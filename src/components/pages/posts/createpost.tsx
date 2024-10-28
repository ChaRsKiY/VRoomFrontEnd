'use client'

import React  from 'react'
import Image from "next/image";
import { FaImage, FaVideo } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import {buttonCancelStyles} from'@/styles/buttonstyles/buttonCancelStyles';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import {IPost} from "@/types/post.interface";
import PostList from "@/components/pages/posts/posts";
import {IUser} from "@/types/user.interface"
import { useUser } from '@clerk/nextjs';


interface ICreatePostProps {
   id:number;
}

const CreatePost: React.FC<ICreatePostProps> = ({ id }) => {
    // const idTest=1;
    const { t }: { t: ITranslationFunction } = useTranslation()
    
    const [lineColor, setLineColor] = useState('lightgray');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [isHovered4, setIsHovered4] = useState(false);
    const [isHovered5, setIsHovered5] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileImageRef = useRef<HTMLInputElement | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null); // Состояние для ссылки на видео
    const fileVideoRef = useRef<HTMLInputElement | null>(null);
    const [display, setDisplay] = useState('none');
    const [display2, setDisplay2] = useState('block');
    const [display1, setDisplay1] = useState('none');
    const [display3, setDisplay3] = useState('block');
    const [displayVideoMenu, setDisplayVideoMenu] = useState('none');
    const [postOwner, setPostOwner] = useState<IUser | null>(null);
    const {user}=useUser();

    const findOwner = async (id: number) => {
      try {
          
              const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfobychannelid/' + id, {
                  method: 'GET',
              });
  
              if (response.ok) {
                  const data: IUser = await response.json();
                  setPostOwner(data);
              } else {
                  console.error('Ошибка при получении пользователя:', response.statusText);
              }
          
      } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
      }
  };
  
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
  
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));

      }
    };
  
    const handleSubmit = async () => {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('id', id+'');
      if (image) formData.append('img', image);
      if (video) formData.append('video', video);
         const r=video?.size
      const res = await fetch('https://localhost:7154/api/Post/add', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        alert('Данные успешно сохранены');
        handleCancelImg ();
        handleCancelVideo ();
        setText('');
      } else {
        alert('Ошибка при сохранении данных');
        alert(res.statusText);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
       
        setText(event.target.value);   
      };
    

    const handleFocus = () => {
        setLineColor('black');  
      };
    
      const handleBlur = () => {
        setLineColor('lightgray'); 
      };
      
      const addImage = () => {
        setDisplay2('none'); 
        setDisplay('block'); 
        setDisplayVideoMenu('none'); 
      };
      const addVideo = () => {
        setDisplay3('none'); 
        setDisplay1('block'); 
        setDisplayVideoMenu('none'); 
      };

      const openVideoMenu = () => {
        setDisplayVideoMenu('block'); 
        setDisplay3('none');
      };
      const closeMenuVideo = () => {
        setDisplayVideoMenu('none'); 
        setDisplay3('block');
      };

      useEffect(() => {    
          setLineColor('lightgray');
          findOwner(id);
      },[id]);

      useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'; // Сбрасываем высоту
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
        }
      }, [text]);

      const handleCancelImg = () => {
        setImage(null);
        setImagePreview('');
        if (fileImageRef.current) {
          fileImageRef.current.value = ''; // Очищаем выбранный файл
        }
        setDisplay('none'); 
        setDisplay2('block'); 
        setDisplay3('block'); 
      };
      const handleCancelVideo = () => {
        setDisplay2('block'); 
        setVideo(null);
        setVideoPreview(null);
    if (fileVideoRef.current) {
      fileVideoRef.current.value = ''; // Очищаем поле выбора файла
    }
    setDisplay1('none'); 
    setDisplay3('block'); 
      };
    

    return (
     
        <div className=" w-full  mt-20" style={{justifyItems:'center',marginBottom:'20px'}}>

          {user && user?.id === postOwner?.clerk_Id && (  
          <div className=" w-full  mt-20" >           
            <div className=" w-3/4 px-8"  style={{border:'1px solid lightgray', padding:'10px',borderRadius:'10px'}}>
            <div style={{display:'flex', justifyContent:'space-around'}}>
            <small style={{textAlign:'center'}}>Enter text or/and add media</small>
            <button onClick={handleSubmit} onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                 style={isHovered ? { ...buttonCancelStyles.baseplus, ...buttonCancelStyles.hover } : buttonCancelStyles.baseplus}>
                      Publish </button>
            </div>
       <textarea
       ref={textareaRef}
       value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder='Write text here'
        style={{
          border: 'none',
          borderBottom: `2px solid ${lineColor}`,
          outline: 'none',
          width: '100%',
          resize: 'none',   
          overflow: 'hidden', 
          padding: '5px', 
          height:'30px',
          minHeight: '30px',
        }}
      />
          <div className='flex' style={{justifyContent:'space-around'}}>
          <div onClick={addImage} style={{display: display2} } >
          <TooltipProvider>
                <Tooltip >
                <TooltipTrigger className="max-sm:hidden">
                <FaImage size={40} color="#00b4ff"  style={{ opacity: 0.9 }}/>
                </TooltipTrigger>
                    <TooltipContent>
                        <p>add image</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
           </div>
            <div style={{border:'2px solid gray', padding:'10px',borderRadius:'10px',margin:'10px', display}}>
            <label>Add image:</label>
            {imagePreview!=''&&( 
                        <Image src={imagePreview} alt="Banner Image" width={200} height={150}
                              className="w-35 h-25 bg-gray-200 mr-6 mt-2" /> )}
                        <div>
                            <input type="file"  ref={fileImageRef}
                                className="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" 
                                   onChange={handleImageChange}
                            />
                           <button onClick={handleCancelImg}   style={isHovered2 ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
      onMouseEnter={() => setIsHovered2(true)}
      onMouseLeave={() => setIsHovered2(false)}>Cancel</button>
                        </div>
                    </div>
                    <div onClick={openVideoMenu} style={{display: display3} } >
                   
                    <TooltipProvider>
                <Tooltip >
                <TooltipTrigger className="max-sm:hidden">
                     <FaVideo size={40} color="green" style={{ opacity: 0.5 }} />
                </TooltipTrigger>
                    <TooltipContent>
                        <p>add video</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
                    </div>
                    <div style={{display:displayVideoMenu,border:'1px solid lightgray',borderRadius:'20px'}}>
                      <div style={{display:'flex'}}> <div>
                      <div   style={isHovered5 ? { ...buttonCancelStyles.baseplus, ...buttonCancelStyles.hover } : buttonCancelStyles.baseplus}
      onMouseEnter={() => setIsHovered5(true)}
      onMouseLeave={() => setIsHovered5(false)} >
                      <p>Choose from list</p></div>
                      <div onClick={addVideo}  style={isHovered4 ? { ...buttonCancelStyles.baseplus, ...buttonCancelStyles.hover } : buttonCancelStyles.baseplus}
      onMouseEnter={() => setIsHovered4(true)}
      onMouseLeave={() => setIsHovered4(false)}>
                      <p>Add new video</p></div>
                    </div>
                   <div> <button  style={{paddingRight:'10px',  color:'gray'}} onClick={closeMenuVideo}>
                      X</button></div>
                  </div></div>

      <div  style={{border:'2px solid gray', padding:'10px',borderRadius:'10px',display: display1}}>
        <label>Add video:</label>
            
        {videoPreview && (
        <div className="mt-4">
          <video controls width="400" autoPlay  muted    loop >
            <source src={videoPreview} type="video/mp4" />
            Ваш браузер не поддерживает просмотр видео.
          </video>
        
        </div>
      )}

        <input type="file"  ref={fileVideoRef}
                                className="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" 
                                   onChange={handleVideoChange}
                            />

           <button onClick={handleCancelVideo}   style={isHovered3 ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
      onMouseEnter={() => setIsHovered3(true)}
      onMouseLeave={() => setIsHovered3(false)}>Cancel</button>
      </div>
            </div>

        </div>
        </div> )}

           <PostList channelId={id}/>

        </div>
    )
}

export default CreatePost

