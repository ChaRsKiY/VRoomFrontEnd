import React from 'react'
import {SignIn} from "@clerk/nextjs";
import SignInForm from "@/components/pages/sign-in-up/sign-in-form";

const SignInPage: React.FC = () => {
    return (
        <div className="fixed top-0 flex w-full h-screen justify-center items-center">
            <SignInForm />
            <SignIn />
        </div>
    )
}

export default SignInPage