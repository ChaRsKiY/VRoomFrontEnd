"use client"

import Image from "next/image";
import React, {useContext} from "react";
import {ThemeContext} from "@/components/providers/theme.provider";

const Logo = () => {
    const { theme } = useContext(ThemeContext);

    return theme === 'light'
        ? <Image src="/logo.svg" alt="logo" width={125} height={125} />
        : <Image src="/logo_final_white.png" alt="logo" width={125} height={125} />
}

export default Logo;