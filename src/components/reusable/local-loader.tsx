import React from 'react'

interface Props {
    width?: number;
    height?: number;
    borderW?: number;
}

const LocalLoader = ({width = 25, height = 25, borderW = 2}: Props) => {
    return (
        <div className={`animate-spin h-[${height}px] w-[${width}px] border-${borderW} border-green border-t-transparent rounded-full`} />
    )
}

export default LocalLoader