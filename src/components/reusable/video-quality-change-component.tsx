"use client"

import React, {useState} from 'react'

const qualities = [
    {
        value: "1080p",
        label: "1080p (Full HD)",
    },
    {
        value: "720p",
        label: "720p (HD)",
    },
    {
        value: "480p",
        label: "480p (SD)",
    },
    {
        value: "360p",
        label: "360p",
    },
]

const VideoQualityChangeComponent: React.FC = () => {
    const [active, setActive] = useState(qualities[0].value);

    return (
            <div className="w-[275px] bg-white shadow rounded-lg p-4"><h2
                className="font-title text-lg text-neutral-950 mb-4">Video Quality</h2>
                <ul className="space-y-2">
                    {qualities.map((quality) => (
                        <li key={quality.value}>
                            <button
                                onClick={() => setActive(quality.value)}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:ring-2 hover:ring-accent hover:ring-opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 ${active === quality.value ? 'bg-accent text-accent-foreground' : 'text-neutral-900'}`}
                            >
                                {quality.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
    )
}

export default VideoQualityChangeComponent