import React from 'react'
import {SignIn} from "@clerk/nextjs";

const SignInPage: React.FC = () => {
    return (
        <div className="fixed top-0 flex w-full h-screen justify-center items-center">
            <SignIn />
        </div>
    )
}

export default SignInPage