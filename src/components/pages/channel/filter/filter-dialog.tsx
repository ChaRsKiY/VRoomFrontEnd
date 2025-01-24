// "use client"

import { Filters } from '@/types/filters.interface';
import React, { useState } from 'react';

interface FilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: Filters) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose, onApplyFilters }) => {
    const [filters, setFilters] = useState<Filters>({
        copyright: '', ageRestriction: '', audience: '',
        access: '', title: '', description: '',
        minViews: 0, maxViews: 0,
    });

    const onFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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
                <h2 className="text-xl font-bold mb-4">Filter</h2>

                <div className=" grid grid-cols-2 p-4 gap-4">
                    <div>
                        <span className="text-gray-700">Copyright</span>
                        <select name="copyright" value={filters.copyright} onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="">all</option>
                            <option value="claimed">Declared</option>
                            <option value="notClaimed">Not declared</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Age restrictions</span>
                        <select name="ageRestriction" value={filters.ageRestriction} onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="">All</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Audience</span>
                        <select name="audience" value={filters.audience} onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="all">All</option>
                            <option value="children">Children</option>
                            <option value="adults">Adults</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Access</span>
                        <select name="access" value={filters.access} onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm">
                            <option value="">All</option>
                            <option value="true">Public</option>
                            <option value="false">Private</option>
                        </select>
                    </div>

                    <div>
                        <span className="text-gray-700">Name</span>
                        <input name="title" value={filters.title} onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm" />
                    </div>

                    <div>
                        <span className="text-gray-700">Description</span>
                        <input name="description" value={filters.description} onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm" />
                    </div>

                    <div className="block">
                        <span className="text-gray-700">Views (More equal)</span>
                        <input min={0} type="number" name="minViews" value={filters.minViews || 0}
                            onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm" />
                    </div>
                    <div className="block">
                        <span className="text-gray-700">Views (Less equals)</span>
                        <input min={0} type="number" name="maxViews" value={filters.maxViews || 0}
                            onChange={onFilterChange}
                            className="block w-full mt-1 border-gray-300 rounded shadow-sm" />
                    </div>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onClose}>Close
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleApplyFilters}>Apply filters
                    </button>

                </div>
            </div>
        </div>
    );
};

export default FilterDialog;
