// "use client"

import {Filters} from '@/types/filters.interface';
import React, {useState} from 'react';

interface FilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: Filters) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({isOpen, onClose, onApplyFilters}) => {
    const [filters, setFilters] = useState<Filters>({
        copyright: '', ageRestriction: '', audience: '',
        access: '', title: '', description: '',
        minViews: 0, maxViews: 0,
    });

    const onFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
        onClose(); // Закрываем диалог после применения фильтров
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Фильтры</h2>

                <div className=" grid grid-cols-2 p-4 gap-4">
                    <div>
                        <span className="text-gray-700">Авторские права</span>
                        <select name="copyright" value={filters.copyright} onChange={onFilterChange}
                                className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="">Все</option>
                            <option value="claimed">Заявлены</option>
                            <option value="notClaimed">Не заявлены</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Возрастные ограничения</span>
                        <select name="ageRestriction" value={filters.ageRestriction} onChange={onFilterChange}
                                className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="">Все</option>
                            <option value="true">Есть</option>
                            <option value="false">Нет</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Аудитория</span>
                        <select name="audience" value={filters.audience} onChange={onFilterChange}
                                className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="all">Все</option>
                            <option value="children">Дети</option>
                            <option value="adults">Взрослые</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Доступ</span>
                        <select name="access" value={filters.access} onChange={onFilterChange}
                                className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="">Все</option>
                            <option value="true">Открытые</option>
                            <option value="false">Приватные</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Название</span>
                        <input name="title" value={filters.title} onChange={onFilterChange}
                               className="block w-full mt-1 border-gray-300 rounded shadow-sm"/>
                    </div>

                    <div>
                        <span className="text-gray-700">Описание</span>
                        <input name="description" value={filters.description} onChange={onFilterChange}
                               className="block w-full mt-1 border-gray-300 rounded shadow-sm"/>
                    </div>

                    <div className="block">
                        <span className="text-gray-700">Просмотры (Больше равно)</span>
                        <input min={0} type="number" name="minViews" value={filters.minViews || 0}
                               onChange={onFilterChange}
                               className="block w-full mt-1 border-gray-300 rounded shadow-sm"/>
                    </div>
                    <div className="block">
                        <span className="text-gray-700">Просмотры (Мeньше равно)</span>
                        <input min={0} type="number" name="maxViews" value={filters.maxViews || 0}
                               onChange={onFilterChange}
                               className="block w-full mt-1 border-gray-300 rounded shadow-sm"/>
                    </div>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={onClose}>Закрыть
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleApplyFilters}>Применить фильтры
                    </button>

                </div>
            </div>
        </div>
    );
};

export default FilterDialog;
