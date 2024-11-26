import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterButton = ({ openModal }: { openModal: () => void }) => {
    return (
        <div style={{ width: '100%' }}>
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
            <div className="bg-white p-6 rounded-lg w-[90%]" style={{ width: '600px' }}>
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold mb-4">Search filter</h2>
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                        X
                    </button>
                </div>
                <div className='flex'>
                    {/* Фильтр по дате загрузки */}
                    <div className="m-5">
                        <label className="block mb-2" style={{ textAlign: 'center', fontWeight: 'bold' }}>Upload
                            date</label>
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
                        <label className="block mb-2" style={{ textAlign: 'center', fontWeight: 'bold' }}>Content
                            type</label>
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
                        <label className="block mb-2" style={{ textAlign: 'center', fontWeight: 'bold' }}>Sort</label>
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

// import { useState } from 'react';
// import { FaFilter } from 'react-icons/fa';
// import * as Accordion from '@radix-ui/react-accordion';

// // Кнопка для открытия фильтров
// const FilterButton = ({ openAccordion }: { openAccordion: () => void }) => {
//     return (
//         <div style={{ width: '100%' }}>
//             <button onClick={openAccordion} className="filter-button flex items-center ml-5 mb-5">
//                 <FaFilter size={20} />
//                 <span className="ml-2">Filter</span>
//             </button>
//         </div>
//     );
// };

// // Компонент аккордеона для фильтрации
// const FilterAccordion = ({ isOpen, closeAccordion, applyFilters }: any) => {
//     const [uploadDate, setUploadDate] = useState('');
//     const [contentType, setContentType] = useState('');
//     const [sortBy, setSortBy] = useState('');

//     const handleApply = () => {
//         applyFilters({ uploadDate, contentType, sortBy });
//         closeAccordion();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="w-full flex justify-center">
//             <Accordion.Root type="single" collapsible className="w-[90%] max-w-xl bg-white rounded-lg shadow-md p-4">
//                 <div className="flex justify-between mb-4">
//                     <h2 className="text-lg font-semibold">Search filter</h2>
//                     <button onClick={closeAccordion} className="px-4 py-2 bg-gray-300 rounded">
//                         X
//                     </button>
//                 </div>

//                 {/* Фильтр по дате загрузки */}
//                 <Accordion.Item value="uploadDate" className="border-b">
//                     <Accordion.Trigger className="w-full text-left py-2 font-bold">Upload Date</Accordion.Trigger>
//                     <Accordion.Content className="p-4">
//                         <select
//                             value={uploadDate}
//                             onChange={(e) => setUploadDate(e.target.value)}
//                             className="w-full border px-2 py-1"
//                         >
//                             <option value="">Not selected</option>
//                             <option value="today">Today</option>
//                             <option value="month">For a month</option>
//                         </select>
//                     </Accordion.Content>
//                 </Accordion.Item>

//                 {/* Фильтр по типу контента */}
//                 <Accordion.Item value="contentType" className="border-b">
//                     <Accordion.Trigger className="w-full text-left py-2 font-bold">Content Type</Accordion.Trigger>
//                     <Accordion.Content className="p-4">
//                         <select
//                             value={contentType}
//                             onChange={(e) => setContentType(e.target.value)}
//                             className="w-full border px-2 py-1"
//                         >
//                             <option value="">Not selected</option>
//                             <option value="video">Video</option>
//                             <option value="shorts">Shorts</option>
//                         </select>
//                     </Accordion.Content>
//                 </Accordion.Item>

//                 {/* Сортировка */}
//                 <Accordion.Item value="sortBy" className="border-b">
//                     <Accordion.Trigger className="w-full text-left py-2 font-bold">Sort By</Accordion.Trigger>
//                     <Accordion.Content className="p-4">
//                         <select
//                             value={sortBy}
//                             onChange={(e) => setSortBy(e.target.value)}
//                             className="w-full border px-2 py-1"
//                         >
//                             <option value="">Not selected</option>
//                             <option value="date">By upload date</option>
//                             <option value="views">By number of views</option>
//                             <option value="rating">By rating</option>
//                         </select>
//                     </Accordion.Content>
//                 </Accordion.Item>

//                 <div className="flex justify-end mt-4">
//                     <button onClick={handleApply} className="px-4 py-2 bg-blue-500 text-white rounded">
//                         Apply Filters
//                     </button>
//                 </div>
//             </Accordion.Root>
//         </div>
//     );
// };

// const FilterComponent = ({ applyFilters }: any) => {
//     const [isAccordionOpen, setIsAccordionOpen] = useState(false);

//     const openAccordion = () => setIsAccordionOpen(true);
//     const closeAccordion = () => setIsAccordionOpen(false);

//     return (
//         <div>
//             <FilterButton openAccordion={openAccordion} />
//             <FilterAccordion isOpen={isAccordionOpen} closeAccordion={closeAccordion} applyFilters={applyFilters} />
//         </div>
//     );
// };

// export default FilterComponent;




// import { useState } from 'react';
// import { FaFilter } from 'react-icons/fa';

// const FilterButton = ({ togglePanel }: { togglePanel: () => void }) => {
//     return (
//         <div style={{ width: '100%' }}>
//             <button onClick={togglePanel} className="filter-button flex items-center ml-5 mb-5">
//                 <FaFilter size={20} />
//                 <span className="ml-2">Filter</span>
//             </button>
//         </div>
//     );
// };

// const FilterPanel = ({ applyFilters }: { applyFilters: (filters: any) => void }) => {
//     const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
//     const [selectedSorts, setSelectedSorts] = useState<string[]>([]);

//     const toggleFilter = (filter: string) => {
//         setSelectedFilters((prev) =>
//             prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
//         );
//     };

//     const toggleSort = (sort: string) => {
//         setSelectedSorts((prev) =>
//             prev.includes(sort) ? prev.filter((s) => s !== sort) : [...prev, sort]
//         );
//     };

//     const handleApply = () => {
//         applyFilters({ filters: selectedFilters, sorts: selectedSorts });
//     };

//     return (
        
//         <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto mt-4">
//             <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
//             <div className="flex justify-between flex-wrap">
//                 {/* Фильтр по дате загрузки */}
//                 <div className="m-2">
//                     <span className="block mb-2 font-bold text-center">Upload Date</span>
//                     <button
//                         onClick={() => toggleFilter('today')}
//                         className={`px-4 py-2 rounded ${selectedFilters.includes('today') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         Today
//                     </button>
//                     <button
//                         onClick={() => toggleFilter('month')}
//                         className={`px-4 py-2 rounded ml-2 ${selectedFilters.includes('month') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         For a month
//                     </button>
//                 </div>

//                 {/* Фильтр по типу контента */}
//                 <div className="m-2">
//                     <span className="block mb-2 font-bold text-center">Content Type</span>
//                     <button
//                         onClick={() => toggleFilter('video')}
//                         className={`px-4 py-2 rounded ${selectedFilters.includes('video') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         Video
//                     </button>
//                     <button
//                         onClick={() => toggleFilter('shorts')}
//                         className={`px-4 py-2 rounded ml-2 ${selectedFilters.includes('shorts') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         Shorts
//                     </button>
//                 </div>

//                 {/* Сортировка */}
//                 <div className="m-2">
//                     <span className="block mb-2 font-bold text-center">Sort By</span>
//                     <button
//                         onClick={() => toggleSort('date')}
//                         className={`px-4 py-2 rounded ${selectedSorts.includes('date') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         By upload date
//                     </button>
//                     <button
//                         onClick={() => toggleSort('views')}
//                         className={`px-4 py-2 rounded ml-2 ${selectedSorts.includes('views') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         By number of views
//                     </button>
//                     <button
//                         onClick={() => toggleSort('rating')}
//                         className={`px-4 py-2 rounded ml-2 ${selectedSorts.includes('rating') ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                     >
//                         By rating
//                     </button>
//                 </div>
//             </div>
//             <div className="flex justify-end mt-4">
//                 <button onClick={handleApply} className="px-4 py-2 bg-blue-500 text-white rounded">
//                     Apply Filters
//                 </button>
//             </div>
//         </div>
//     );
// };

// const FilterComponent = ({ applyFilters }: any) => {
//     const [isPanelOpen, setIsPanelOpen] = useState(false);

//     const togglePanel = () => setIsPanelOpen(!isPanelOpen);

//     return (
//         <div>
//             <FilterButton togglePanel={togglePanel} />
//             {isPanelOpen && <FilterPanel applyFilters={applyFilters} />}
//         </div>
//     );
// };

// export default FilterComponent;


