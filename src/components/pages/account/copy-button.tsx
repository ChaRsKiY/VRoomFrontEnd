"use client"

import React from 'react'
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";

interface Props {
    text: string;
    hint: string;
}

const CopyButton: React.FC<Props> = ({ text, hint }: Props) => {
    const copyUserId = () => {
        navigator.clipboard.writeText(text)
        toast({
            title: hint
        });
    }

    return (
        <Button onClick={copyUserId} variant="outline">Copy</Button>
    )
}

export default CopyButton