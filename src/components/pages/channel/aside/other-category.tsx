import React from 'react'

import Link from "next/link";
import {ICategoryBlock} from "@/components/pages/home/aside/category.interface";
import {validateCategoryBlock} from "@/lib/category.utils";
import {CiSettings} from "react-icons/ci";
import {MdOutlineFeedback} from "react-icons/md";
import OpenDialogButton from "@/components/pages/channel/dialogsettings/open-dialog-button";

const OtherCategoryBlock = () => {

    return (
        <div>

            <div className="flex flex-col space-y-1">
                <Link href={"/feedback"} className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                    <div className="text-2xl">
                        <MdOutlineFeedback width={26} height={26}/>
                    </div>
                    <div>Feedback</div>
                </Link>
            </div>
        </div>
    )
}

export default OtherCategoryBlock