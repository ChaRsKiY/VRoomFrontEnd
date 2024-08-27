import React from 'react'

const DescriptionBlock: React.FC = ({ description }: { description: string }) => {
    return (
        <div>
            <div className="text-[1.05rem] font-[500] mb-2">Description</div>
            <div>{description}</div>
        </div>
    )
}

export default DescriptionBlock