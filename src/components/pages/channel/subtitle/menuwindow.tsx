
import React  from 'react';

interface FilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAcsept: () => void;
    toDo: string;
}

const MDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose, onAcsept, toDo }) => {
   

    if (!isOpen) return null;

    return (
            <div
                className=" bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[160px] subtitle-editor"
                style={{
                    paddingBottom: '4px',
                    position: 'fixed',
                    marginLeft: '200px',
                    borderRadius: '3px',
                    backgroundColor: 'lightgrey',
                    border: '1px solid #212f3c',
        
                }}
            >
                <div className="flex items-center space-x-2 cursor-pointer p-1 modal-button hover:bg-red-300"
                    style={{ display: 'flex', justifyContent: 'center' }}
                    onClick={onClose}>
                    <span >Exit</span></div>
        
        
                <div className="flex items-center cursor-pointer  modal-button hover:bg-gray-300"
                    style={{ display: 'flex', justifyContent: 'center',padding:'0' , paddingBottom:'5px' }}
                    onClick={onAcsept}>
                    <span >{toDo}</span></div>
            </div>

    );
};

export default MDialog;