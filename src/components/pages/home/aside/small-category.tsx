import React from 'react'
import { validateCategoryBlock } from "@/lib/category.utils";
import { ICategoryBlock } from "@/components/pages/home/aside/category.interface";
import Link from "next/link";
import Image from "next/image";

const SmallCategoryBlock: React.FC<ICategoryBlock> = ({ data }: ICategoryBlock) => {
    validateCategoryBlock({ data })

    return (
        <div>
            <div className="flex space-y-4 sm:flex-col max-sm:space-y-0 max-sm:justify-around">
                {data.map((el, key) => (
                    <Link href={el.path} key={key}
                        className={"flex flex-col space-y-1 items-center p-2.5 rounded-xl hover:bg-neutral-200 text-neutral-600 dark:text-white dark:hover:bg-neutral-700"}>
                        {el.icon ? (
                            <div className="text-3xl">{el.icon}</div>
                        ) : (
                            <div className="text-3xl">
                                <Image className={el.iconClassNames} src={el.iconPath!} alt={el.name} width={26}
                                    height={26} />
                            </div>
                        )}
                        <div className="text-[0.6rem]">{el.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SmallCategoryBlock