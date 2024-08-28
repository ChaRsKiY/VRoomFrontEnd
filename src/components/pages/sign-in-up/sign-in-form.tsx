import {FcGoogle} from "react-icons/fc";
import {ImAppleinc} from "react-icons/im";
import Image from "next/image";
import Link from "next/link";

const SignInForm = ( ) => {
    return (
        <div className="drop-shadow-2xl mr-12 bg-white rounded-xl p-10 min-w-96 border">
            <div className="text-center text-[1.06rem] font-[700]">Sign in</div>
            <div className="text-neutral-500 text-[0.8rem] text-center mt-1">Welcome back! Please sign in to continue</div>

            <div className="space-y-2 mt-6">
                <div className="flex justify-between space-x-2">
                    <div className="flex flex-1 items-center justify-center border py-2 rounded-[0.5rem] hover:bg-neutral-200 cursor-pointer">
                        <FcGoogle size={22} />
                    </div>
                    <div className="flex flex-1 items-center justify-center border rounded-[0.5rem] hover:bg-neutral-200 cursor-pointer">
                        <Image width={45} height={45} src="/facebook.svg" alt="Facebook" />
                    </div>
                    <div className="flex flex-1 items-center justify-center border rounded-[0.5rem] hover:bg-neutral-200 cursor-pointer">
                        <ImAppleinc size={22} />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                <div className="h-[0.8px] rounded-3xl bg-neutral-300 flex-1"/>
                    <div className="px-3 text-neutral-500 text-[0.9rem]">or</div>
                    <div className="h-[0.8px] rounded-3xl bg-neutral-300 flex-1"/>
                </div>

                <div className="flex flex-col pb-5">
                    <span className="font-[300] text-[0.9rem] mb-0.5">Email or Username</span>
                    <input className="px-3 rounded-[0.5rem] border border-neutral-300 bg-transparent py-1 pr-20 text-base/6 text-neutral-950 ring-2 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none focus:ring-neutral-950/10"/>
                </div>

                <button className="rounded-[0.5rem] w-full py-1 bg-neutral-600 text-white duration-150 hover:bg-neutral-700">Continue</button>

                <div className="text-center pt-3 text-neutral-600 text-[0.9rem]">Don’t have an account? <Link href="/auth/signup" className="text-neutral-800 font-[500]">Sign up</Link></div>
            </div>

        </div>
    )
}

export default SignInForm;