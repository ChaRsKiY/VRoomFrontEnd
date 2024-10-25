import React from 'react';
import {ITranslationFunction} from "@/types/translation.interface";

interface ISidebarProps {
    onSelect: (key: string) => void;  // Функция, принимающая строку и ничего не возвращающая
    t: ITranslationFunction;
}
const Sidebar: React.FC<ISidebarProps> =  ({t, onSelect}:ISidebarProps) => {

    const menuItems = [
        // { name: t("channel:General"), path: "Page1"},
        { name: t("channel:Channel"), path: "page-channel-basic-info"},
       /* { name: t("channel:Uploading_videos"), path: "page3"},
        { name: t("channel:Permissions"), path: "page4"},
        { name: t("channel:Community"), path: "page5"},
        { name: t("channel:Agreements"), path: "page6"},*/
    ]
    return (
        <div  className="w-[1/3.5]  text-black h-full">
            <div className=" ml-[-3%]"><h2 className="text-2xl font-semibold mb-4">Settings</h2>
                <div className="flex flex-col space-y-1">
                    {menuItems.map((item) => (
                        <p onClick={() => onSelect(item.path)} key={item.path}
                           className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                            <div>{item.name}</div>
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
