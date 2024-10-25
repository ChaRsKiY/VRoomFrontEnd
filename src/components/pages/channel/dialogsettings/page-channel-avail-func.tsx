import React, {ReactElement} from "react";

interface PageChannelAvailabilityFunctionsProps {
    onSelect: (key: string) => void;
}

const PageChannelAvailabilityFunctions: React.FC<PageChannelAvailabilityFunctionsProps> = ({ onSelect }) => {
    return <div className="flex-auto overflow-hidden">
        <div className="mb-6"><br/>
            <div className="flex mt-2">
                <p onClick={() => onSelect('page-channel-basic-info')} className="cursor-pointer mr-4 text-gray-500 pb-2">Basic information</p>
                <p onClick={() => onSelect('page-channel-settings')} className="cursor-pointer mr-4 text-gray-500 hover:text-gray-800 pb-2">Advanced settings</p>
                <p className=" text-gray-800  border-b-2 border-gray-800 hover:text-gray-800 pb-2">Availability of functions</p>
            </div>
        </div>
        <hr className="my-4 border-gray-300"/>
        <div className="flex-1">




        </div>

    </div>;
}

export default PageChannelAvailabilityFunctions;