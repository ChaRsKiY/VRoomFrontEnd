"use client"

import React, { useState } from 'react'
import { Mukta } from "next/font/google";

const mukta = Mukta({ subsets: ['latin'], weight: ["400", "700"] })


const CategoriesHeader: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Free');

    const categories: string[] = ['Free', 'Recommended', 'Subscriptions', 'Library', 'Live'];

    return (
        <div className="flex space-x-2 items-center">
            {categories.map((category) => (
                <div
                    key={category}
                    className={`px-3 py-1 rounded ${mukta.className} ${selectedCategory === category
                            ? 'border-b-2 border-red-400'
                            : 'border-b-2 border-transparent'
                        } hover:cursor-pointer`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </div>
            ))}
        </div>
    );
};

export default CategoriesHeader