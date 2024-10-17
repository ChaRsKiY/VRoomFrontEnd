
import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterButton = ({ openModal }: { openModal: () => void }) => {
    return (
        <div style={{width:'100%'}}>
        <button onClick={openModal} className="filter-button flex items-center ml-5 mb-5">
             <FaFilter size={20} />
            <span className="ml-2">Filter</span>
        </button>
        </div>
    );
};

const FilterModal = ({ isOpen, closeModal, applyFilters }: any) => {
    const [uploadDate, setUploadDate] = useState('');
    const [contentType, setContentType] = useState('');
    const [sortBy, setSortBy] = useState('');

    const handleApply = () => {
        applyFilters({ uploadDate, contentType, sortBy });
        closeModal();
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy(e.target.value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20" >
            <div className="bg-white p-6 rounded-lg w-[90%]" style={{width:'600px'}}>
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold mb-4">Search filter</h2>
                <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                        X
                    </button>
                    </div>
                <div className='flex'>
                {/* Фильтр по дате загрузки */}
                <div className="m-5">
                    <label className="block mb-2" style={{textAlign:'center', fontWeight:'bold'}}>Upload date</label>
                    <select
                        value={uploadDate}
                        onChange={(e) => setUploadDate(e.target.value)}
                        className="w-full border px-2 py-1"
                    >
                        <option value="">Not selected</option>
                        <option value="today">Today</option>
                        <option value="month">For a month</option>
                    </select>
                </div>

                {/* Фильтр по типу контента */}
                <div className="m-5">
                    <label className="block mb-2" style={{textAlign:'center', fontWeight:'bold'}}>Content type</label>
                    <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full border px-2 py-1"
                    >
                        <option value="">Not selected</option>
                        <option value="video">Video</option>
                        <option value="shorts">Shorts</option>
                    </select>
                </div>

                {/* Сортировка */}
                <div className="m-5">
                    <label className="block mb-2" style={{textAlign:'center', fontWeight:'bold'}}>Sort</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border px-2 py-1"
                    >
                        <option value="">Not selected</option>
                        <option value="date">By upload date</option>
                        <option value="views">By number of views</option>
                        <option value="rating">By rating</option>
                    </select>
                </div>
                </div>
                <div className="flex justify-between">
                   
                 <div></div>
                    <button onClick={handleApply} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Filter
                    </button>
                </div>
            </div>
        </div>
    );

};

const FilterComponent = ({ applyFilters }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <FilterButton openModal={openModal} />
            <FilterModal isOpen={isModalOpen} closeModal={closeModal} applyFilters={applyFilters} />
        </div>
    );
};

export default FilterComponent;
