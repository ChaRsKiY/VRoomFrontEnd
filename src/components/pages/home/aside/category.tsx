import React from 'react'
import Link from "next/link";
import Image from "next/image";
import { ICategoryBlock } from "@/components/pages/home/aside/category.interface";
import { validateCategoryBlock } from "@/lib/category.utils";

const CategoryBlock: React.FC<ICategoryBlock> = ({ title, data }: ICategoryBlock) => {
    validateCategoryBlock({ title, data })

    return (
        <div>
            {title && <div className="pl-5 font-bold mb-2">{title}</div>}
            <div className="flex flex-col space-y-1">
                {data.map((el, key) => (
                    <Link href={el.path} key={key} className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                        {el.icon ? (
                            <div className="text-2xl">{el.icon}</div>
                        ) : (
                            <div className="text-2xl">
                                <Image className={el.iconClassNames} src={el.iconPath!} alt={el.name} width={26} height={26} />
                            </div>
                        )}
                        <div>{el.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategoryBlock