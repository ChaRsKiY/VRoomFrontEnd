'use client'

import React  from 'react'
import Image from "next/image";
import { FaImage, FaVideo } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import {buttonCancelStyles} from'@/components/styled/buttonstyles/buttonCancelStyles';


interface ICreatePostProps {
   id:number;
}

const CreatePost: React.FC<ICreatePostProps> = ({ id }) => {
    
    const [lineColor, setLineColor] = useState('lightgray');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('https://placehold.co/150x100.svg');
    const fileImageRef = useRef<HTMLInputElement | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null); // Состояние для ссылки на видео
    const fileVideoRef = useRef<HTMLInputElement | null>(null);
    const [display, setDisplay] = useState('none');
    const [display2, setDisplay2] = useState('block');
    const [display1, setDisplay1] = useState('none');
    const [display3, setDisplay3] = useState('block');
  
  
  
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
      if (image) formData.append('image', image);
      if (video) formData.append('video', video);
  
      const res = await fetch('https://localhost:7154/api/Post/add', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        alert('Данные успешно сохранены');
      } else {
        alert('Ошибка при сохранении данных');
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
      };
      const addVideo = () => {
        setDisplay3('none'); 
        setDisplay1('block'); 
      };

      useEffect(() => {    
          setLineColor('lightgray');
      },[id]);

      useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'; // Сбрасываем высоту
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
        }
      }, [text]);

      const handleCancelImg = () => {
        setImage(null);
        setImagePreview('https://placehold.co/250x150.svg');
        if (fileImageRef.current) {
          fileImageRef.current.value = ''; // Очищаем выбранный файл
        }
        setDisplay('none'); 
        setDisplay2('block'); 
      };
      const handleCancelVideo = () => {
        setVideo(null);
        setVideoPreview(null);
    if (fileVideoRef.current) {
      fileVideoRef.current.value = ''; // Очищаем поле выбора файла
    }
    setDisplay1('none'); 
    setDisplay3('block'); 
      };

    return (
     
        <div className="flex w-full  mt-20" style={{justifyItems:'center'}}>
            <div className=" w-3/4 px-8"  style={{border:'2px solid gray', padding:'10px',borderRadius:'10px'}}>
            <div style={{display:'flex', justifyContent:'space-around'}}>
            <h1 style={{textAlign:'center'}}>Enter text and/or add media</h1>
            <button onClick={handleSubmit} onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                 style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}>
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
          <FaImage size={40} color="blue" /> </div>
            <div style={{border:'2px solid gray', padding:'10px',borderRadius:'10px',margin:'10px', display}}>
            <label>Add image:</label>
          
                        <Image src={imagePreview} alt="Banner Image" width={200} height={150}
                              className="w-35 h-25 bg-gray-200 mr-6 mt-2"/>
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
                    <div onClick={addVideo} style={{display: display3} } >
                    <FaVideo size={40} color="green" /></div>
      <div  style={{border:'2px solid gray', padding:'10px',borderRadius:'10px',display: display1}}>
        <label>Add video:</label>
            
        {videoPreview && (
        <div className="mt-4">
          <video controls width="400" autoPlay  muted    loop >
            <source src={videoPreview} type="video/mp4" />
            Ваш браузер не поддерживает просмотр видео.
          </video>
          <button onClick={handleCancelVideo}   style={isHovered3 ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
      onMouseEnter={() => setIsHovered3(true)}
      onMouseLeave={() => setIsHovered3(false)}>Cancel</button>
        </div>
      )}

        <input type="file"  ref={fileVideoRef}
                                className="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0
        file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400" 
                                   onChange={handleVideoChange}
                            />
      </div>
            </div>

        </div>
        </div>
        
    )
}

export default CreatePost