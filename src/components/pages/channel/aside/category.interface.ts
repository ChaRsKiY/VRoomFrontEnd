import {ReactNode} from "react";

export interface ICategoryBlock {
    title?: string,
    data: {
        name: string,
        icon?: ReactNode,
        iconPath?: string,
        path: string,
        iconClassNames?: string
    }[]
}