import React from 'react'

interface IDescriptionBlockProps {
    description: string
}

const DescriptionBlock: React.FC<IDescriptionBlockProps> = ({ description }: IDescriptionBlockProps) => {
    return (
        <div>
            <div className="text-[1.05rem] font-[500] mb-2">Description</div>
            <div>{description}</div>
        </div>
    )
}

export default DescriptionBlock