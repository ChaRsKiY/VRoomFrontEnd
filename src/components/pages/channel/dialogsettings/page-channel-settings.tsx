import React, { ReactElement } from "react";

interface PageChannelSettingsProps {
    onSelect: (key: string) => void;
}

const PageChannelSettings: React.FC<PageChannelSettingsProps> = ({ onSelect }) => {
    return <div className="flex-auto overflow-hidden">
        <div className="mb-6"><br />
            <div className="flex mt-2">
                <p onClick={() => onSelect('page-channel.json-basic-info')} className="cursor-pointer mr-4 text-gray-500  pb-2">Basic information</p>
                <p className="mr-4 text-gray-500 border-b-2 border-gray-800 hover:text-gray-800 pb-2">Advanced settings</p>
                <p onClick={() => onSelect('page-channel.json-avail-func')}
                    className="cursor-pointer text-gray-500 hover:text-gray-800 pb-2">Availability of functions</p>
            </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="flex-1">


        </div>

    </div>;
}

export default PageChannelSettings;