'use client'

import React, { useState, useEffect, useRef } from 'react'
import api from '@/services/axiosApi';
import { BiArrowBack } from 'react-icons/bi';
import { buttonMyScroll } from '@/styles/buttonstyles/scrollbutton';

interface IProps {
    tagName: string | null
}

const TagNavigation: React.FC<IProps> = ({ tagName }: IProps) => {

    const [tags, setTags] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isHovering2, setIsHovering2] = useState(false);

    const getTags = async () => {
        try {
            const response = await api.get('/Tag');

            if (response.status === 200) {
                const mydata: string[] = await response.data;
                console.log('успешный list of video', mydata);
                setTags(mydata);
            } else {
                console.error('Ошибка получения видео:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    useEffect(() => {
        getTags();
    }, []);



    const updateButtonsVisibility = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setShowLeftButton(scrollLeft > 0); 
            setShowRightButton(scrollLeft + clientWidth < scrollWidth); 
        }
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 300;
            updateButtonsVisibility();
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 300;
            updateButtonsVisibility();
        }
    };

    useEffect(() => {
        updateButtonsVisibility();
        window.addEventListener('resize', updateButtonsVisibility);

        return () => {
            window.removeEventListener('resize', updateButtonsVisibility);
        };
    }, [tags]);



    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {showLeftButton && (
                <button
                    onClick={scrollLeft}
                    style={isHovering ? { ...buttonMyScroll.base, ...buttonMyScroll.hover } : buttonMyScroll.base}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <BiArrowBack size={20} />
                </button>
            )}
            <div
                ref={containerRef}
                className='flex'
                style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    padding: '10px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
                onScroll={updateButtonsVisibility}
            >

                {tags ? (
                    <div
                        style={{
                            padding: '5px', width: '40px', margin: '5  5px',
                            backgroundColor: tagName === "All" ? 'black' : 'rgba(211, 211, 211, 0.5)', borderRadius: '10px',
                            color: tagName === 'All' ? 'white' : 'black', cursor: 'pointer'
                        }}
                        onClick={() => { window.location.href = `/`; }}
                    >
                        All
                    </div>
                ) : null}

                {tags.map((tag, index) => (
                    <div key={index} style={{
                        margin: '0 5px', backgroundColor: tagName === tag ? 'black' : 'rgba(211, 211, 211, 0.5)',
                        borderRadius: '10px', color: tagName === tag ? 'white' : 'black'
                    }}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                window.location.href = `/mainbytag?search=${tag}`;
                            }}
                        >
                            <input
                                style={{ padding: '5px', cursor: 'pointer' }}
                                type='submit'
                                value={tag}
                            />
                        </form>
                    </div>
                ))}
            </div>

            {showRightButton && (
                <button
                    onClick={scrollRight}
                    style={isHovering2 ? { ...buttonMyScroll.base, ...buttonMyScroll.hover } : buttonMyScroll.base}
                    onMouseEnter={() => setIsHovering2(true)}
                    onMouseLeave={() => setIsHovering2(false)}
                >
                    <div style={{ transform: 'rotate(180deg)' }}>
                        <BiArrowBack size={20} />
                    </div>

                </button>
            )}
        </div>
    );
};
export default TagNavigation