import React from 'react'
import {SignUp} from "@clerk/nextjs";

const SignUpPage: React.FC = () => {
    return (
        <div className="fixed top-0 flex w-full h-screen justify-center items-center">
            <SignUp />
        </div>
    )
}

export default SignUpPage