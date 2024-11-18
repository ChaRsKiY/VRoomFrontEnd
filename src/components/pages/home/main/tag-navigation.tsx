'use client'

import React, { useState, useEffect, useRef } from 'react'
import api from '@/services/axiosApi';
import { BiArrowBack } from 'react-icons/bi';
import { buttonMyScroll } from '@/styles/buttonstyles/scrollbutton';
import { useTranslation } from 'react-i18next';

interface IProps {
    tagName: string | null,
}
interface ITag {
    name: string,
    translatedName: string
}

const TagNavigation: React.FC<IProps> = ({ tagName }: IProps) => {

    const [tagsDB, setTagsDB] = useState<string[]>([]);
    const [tags, setTags] = useState<ITag[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isHovering2, setIsHovering2] = useState(false);
    const { t } = useTranslation();

    const getTags = async () => {
        try {
            const response = await api.get('/Tag');

            if (response.status === 200) {
                const mydata: string[] = await response.data;
                setTagsDB(mydata);
                // const translatedTags: ITag[] = mydata.map((nameT) => ({
                //     name: nameT, 
                //     translatedName: t("tags:"+nameT), 
                // }));
                // console.log('успешный list of translatedTags', translatedTags);
                // setTags(translatedTags);
            } else {
                console.error('Ошибка получения tags:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    };

    useEffect(() => {
        getTags();
    }, []);

    useEffect(() => {
        const translatedTags: ITag[] = tagsDB.map((nameT) => ({
            name: nameT,
            translatedName: t("tagname:" + nameT),
        }));
        console.log('успешный list of translatedTags', translatedTags);
        setTags(translatedTags);
    }, [tagsDB, t]);



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
    }, [tagsDB]);



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

                {tagsDB ? (

                    <div
                        style={{
                            padding: '5px', width: '40px', margin: '5  5px',
                            backgroundColor: tagName === "All" ? 'black' : 'rgba(211, 211, 211, 0.5)', borderRadius: '10px',
                            color: tagName === 'All' ? 'white' : 'black', cursor: 'pointer'
                        }}
                        onClick={() => { window.location.href = `/`; }}
                    >
                      
                       {t("tagname:All")}
                    </div>
                ) : null}

                {tags.map((tag, index) => (
                    <div key={index} style={{
                        margin: '0 5px', backgroundColor: tagName === tag.name ? 'black' : 'rgba(211, 211, 211, 0.5)',
                        borderRadius: '10px', color: tagName === tag.name ? 'white' : 'black'
                    }}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                window.location.href = `/mainbytag?search=${tag.name}`;
                            }}
                        >
                            <input
                                style={{ padding: '5px', cursor: 'pointer' }}
                                type='submit'
                                value={tag.translatedName}
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