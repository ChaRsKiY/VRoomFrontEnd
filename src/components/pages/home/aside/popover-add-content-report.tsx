"use client"

import * as React from "react"

const contentReportTypes = [
    {
        value: "bug",
        label: "Bug",
    },
    {
        value: "inappropriate",
        label: "Inappropriate",
    },
    {
        value: "other",
        label: "Other",
    },
]

export default function AddContentReportPopover({ value, setValue, disabled }: { value: string; setValue: (value: string) => void, disabled: boolean }) {
    return (
        <select disabled={disabled} className="p-2 border rounded-[0.5rem] dark:bg-black" defaultValue={value} onChange={(e) => setValue(e.target.value)}>
            {contentReportTypes.map((crt) => (
                <option key={crt.value} value={crt.value}>
                    {crt.label}
                </option>
            ))}
        </select>
    )
}
