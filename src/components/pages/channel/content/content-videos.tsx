"use client";

import React, { useState, useEffect } from 'react';
import ContentTable from "@/components/pages/channel/content/content-table";
import FilterDialog from "@/components/pages/channel/filter/filter-dialog";
import { IContentVideo } from "@/types/videoDTO.interface";
import { Filters } from "@/types/filters.interface";
import { useUser } from "@clerk/nextjs";
import { FaFilter } from "react-icons/fa";
import fetchVideos from "@/components/pages/channel/content/fetch-filtered-videos-by-type";

interface IContentVideoProps {
    isShort: boolean;
}

const ContentVideo: React.FC<IContentVideoProps> = ({ isShort }) => {
    const { user } = useUser(); // Получаем текущего пользователя
    const [videos, setVideos] = useState<IContentVideo[]>([]);
    const [filters, setFilters] = useState<Filters>({
        copyright: '', ageRestriction: '', audience: '',
        access: '', title: '', description: '',
        minViews: 0, maxViews: 0,
    });
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (user && isLoading) {
            const fetchData = async () => {
                const result = await fetchVideos(user.id, isShort, filters);
                setVideos(result);
            };
            fetchData();
        }
        setIsLoading(false);
    }, [user, isLoading, filters]);

    const applyFilters = async (newFilters: any) => {
        setFilters(newFilters);
        if (user) {
            setVideos(await fetchVideos(user.id, isShort, newFilters));
        }
        setIsFilterDialogOpen(false);
    };

    if (isLoading)
        return <div>Загрузка...</div>;

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6 my-3">
                <button onClick={() => setIsFilterDialogOpen(true)}
                    className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                    <FaFilter className="pr-0.5" /> Filter
                </button>
            </div>

            <FilterDialog isOpen={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}
                onApplyFilters={applyFilters} />

            <ContentTable videos={videos} />
        </div>
    );
};
export default ContentVideo;