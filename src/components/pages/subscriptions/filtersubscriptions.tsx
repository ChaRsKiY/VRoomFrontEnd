
import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { buttonCancelStyles } from '@/styles/buttonstyles/buttonCancelStyles';

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

const FilterComponent = ({ applyFilters }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const openModal = () => {
        if (isModalOpen)
            setIsModalOpen(false);
        else
            setIsModalOpen(true);
    }
    const closeModal = () => setIsModalOpen(false);
    const sortUp = () => {
        applyFilters("sortUp");
        closeModal();
    };
    const sortDown = () => {
        applyFilters("sortDown");
        closeModal();
    };

    return (
        <div>
            <FilterButton openModal={openModal} />
            {isModalOpen && (
                <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2 "
                    style={{ width: '110px', paddingTop: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={sortUp}
                            style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>A-z</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={sortDown}
                            style={isHovered2 ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
                            onMouseEnter={() => setIsHovered2(true)}
                            onMouseLeave={() => setIsHovered2(false)}>Z-a</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;