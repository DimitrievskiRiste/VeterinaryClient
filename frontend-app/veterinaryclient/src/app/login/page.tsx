"use client"
import AnimatedInput from "@/Components/AnimatedInput";
import {useState} from "react";
import NavigationComponent from "@/Components/NavigationComponent";
import {memo} from "react";
import dynamic from "next/dynamic";
import FooterComponent from "@/Components/FooterComponent";
const CookieNotice = dynamic(() => import("@/Components/CookieNotice"),{ssr:false});
export default function Login({...props}:{props:any}) {
    type FormData = {
        email:null|string,
        password:null|string
    }
    const [data, setData] = useState<FormData>({
        email:null,
        password:null
    });
    const [formErrors, setFormErrors] = useState<FormData>({
        email:null,
        password:null
    });
    const setEmail = (e) => {
        const v = e.target.value;
        if(/^([a-zA-Z0-9_]+@[a-zA-Z0-9]{2,}\.[a-z]{2,})$/.test(v)){
            setFormErrors((prev) => ({...prev, email:null}));
            setData((prev) => ({...prev, email:v}));
        } else {
            setFormErrors((prev) => ({...prev, email: "Invalid email address!"}));
            setData((prev) => ({...prev, email:null}));
        }
    }
    const setPassword = (e) => {
        const password = e.target.value;
        setData((prev) => ({...prev, password:password}));
    }
    const handleData = async () => {
        if(!data.email || !data.password) {
            return;
        }
        // to do handling login process.
    }
    return (
        <>
            <CookieNotice/>
            <NavigationComponent/>
            <div className="flex flex-col flex-wrap items-start space-y-1 w-[100%] items-center content-center h-[500px] md:h-[800px] justify-center">
                <div className="flex login w-[80%] md:w-[50%]  flex-row flex-wrap flex-wrap space-y-1 flex-wrap rounded-sm">
                    <div className="flex flex-col w-[100%] md:w-[50%]  p-10 flex-wrap items-start space-y-[50px]">
                        <div className="flex w-[100%] flex-wrap justify-center">
                            <h1 className="font-bold">Veterinary Clinic Login</h1>
                        </div>
                        <div className="login-formFields w-[100%] flex flex-row space-x-1 space-y-1">
                            <form className="flex w-[100%] flex-col space-y-1">
                                <AnimatedInput type="email" label="Email address" className="control-input w-[100%] rounded-md"
                                               onChange={setEmail}/>
                                {formErrors.email ?
                                    <span className="error-text">Error: {formErrors.email}</span> : null}
                                <AnimatedInput type="password" label="Account password"
                                               className="control-input rounded-md w-[100%]"
                                               onChange={setPassword}/>
                                <div className="flex w-[100%] justify-center space-y-1">
                                    <button type="button" className="button-default w-[100%]">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex-col hidden md:flex md:w-[50%] flex-wrap items-start min-h-[400px] relative">
                        <div className="login-bg"></div>
                    </div>
                </div>
            </div>
            <div className="flex relative flex-col space-y-1 mt-1 flex-wrap w-[100%]">
                <FooterComponent/>
            </div>
        </>
    )
}