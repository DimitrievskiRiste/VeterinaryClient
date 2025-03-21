"use client"
import AnimatedInput from "@/Components/AnimatedInput";
import {useState} from "react";
import NavigationComponent from "@/Components/NavigationComponent";
import {memo} from "react";
import dynamic from "next/dynamic";
import FooterComponent from "@/Components/FooterComponent";
import Button from "@/Components/Button";
import {useRouter} from "next/navigation";
const CookieNotice = dynamic(() => import("@/Components/CookieNotice"),{ssr:false});
export default function Login({...props}:{props:any}) {
    type FormData = {
        Email:null|string,
        Password:null|string
    }
    const [data, setData] = useState<FormData>({
        Email:null,
        Password:null
    });
    const [formErrors, setFormErrors] = useState<FormData>({
        Email:null,
        Password:null
    });
    const router = useRouter();
    const setEmail = (e) => {
        const v = e.target.value;
        if(/^([a-zA-Z0-9_]+@[a-zA-Z0-9]{2,}\.[a-z]{2,})$/.test(v)){
            setFormErrors((prev) => ({...prev, Email:null}));
            setData((prev) => ({...prev, Email:v}));
        } else {
            setFormErrors((prev) => ({...prev, Email: "Invalid email address!"}));
            setData((prev) => ({...prev, Email:null}));
        }
    }
    const setPassword = (e) => {
        const password = e.target.value;
        setData((prev) => ({...prev, Password:password}));
    }
    const handleData = async (e) => {
        e.preventDefault();
        if(!data.Email || !data.Password) {
            return;
        }
        setIsLoading(true);
        const req = await fetch("/api/login", {
           method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        const res = await req.json();
        if(res.isLoggedIn){
            router.push("/account");
        } else {
            alert("Error: "+res.message);
            setIsLoading(false);
        }
    }
    const [isLoading, setIsLoading] = useState(false);
    const [isAccountRecoveryLoading, setAccountRecoveryLoading] = useState(false);

    const RedirectToRegister = () => {
        setIsLoading(true);
        router.push("/profile/register");
    }
    const RedirectToResetPass = () => {
        setAccountRecoveryLoading(true);
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
                            <form onSubmit={handleData} className="flex w-[100%] flex-col space-y-1">
                                <AnimatedInput type="email" label="Email address" className="control-input w-[100%] rounded-md"
                                               onChange={setEmail}/>
                                {formErrors.email ?
                                    <span className="error-text">Error: {formErrors.email}</span> : null}
                                <AnimatedInput type="password" label="Account password"
                                               className="control-input rounded-md w-[100%]"
                                               onChange={setPassword}/>
                                <div className="flex w-[100%] flex-col justify-center space-y-1">
                                    <Button type="submit" isLoading={isLoading} className="button-default w-[100%] flex justify-center min-w-[200px]"
                                            label="Login"/>
                                    <div className="flex flex-row w-[100%] items-center">
                                        <span className="whiteline w-[50%]"></span>
                                        <span>OR</span>
                                        <span className="whiteline w-[50%]"></span>
                                    </div>
                                    <Button type="button" isLoading={isAccountRecoveryLoading} className="button-default flex justify-center" label="Forgot password?"
                                     onClick={RedirectToResetPass}/>
                                    <div className="flex flex-row w-[100%] items-center">
                                        <span className="whiteline w-[50%]"></span>
                                        <span>OR</span>
                                        <span className="whiteline w-[50%]"></span>
                                    </div>
                                    <Button type="button" className="button-primary flex justify-center" isLoading={isLoading} label="Create account" onClick={RedirectToRegister}/>
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