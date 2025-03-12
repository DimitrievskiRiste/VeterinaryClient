"use client";
import {memo, useState} from "react";
import AnimatedInput from "@/Components/AnimatedInput";
import Button from "@/Components/Button";
import {useRouter} from "next/navigation";

const RegisterForm = memo(function RegisterForm() {
    type FormData = {
        Name: string | null;
        Email: string | null;
        Surname: string | null;
        BirthDate: string | null;
        Age: bigint | null;
        isVeterinarian: null | boolean | bigint;
        Password: null | string;
    }
    const [formData, setFormData] = useState<FormData>({
        Name: null,
        Email: null,
        Surname: null,
        BirthDate: null,
        Age: null,
        isVeterinarian: false,
        Password: null,
    });
    const [formErrors, setFormErrors] = useState<FormData>({
        Name:null,
        Email:null,
        Surname:null,
        BirthDate:null,
        Age:null,
        isVeterinarian:null,
        Password:null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginPageLoading, setIsLoginPageLoading] = useState(false);
    const router = useRouter();
    const RedirectToLoginPage = () => {
        setIsLoginPageLoading(true);
        router.push('/profile/login');
    }
    return (
        <>
            <div className="flex flex-col w-[100%] flex-wrap justify-center items-center">
                <div className="register flex flex-col flex-wrap w-[80%] md:w-[60%] space-y-2">
                    <div className="flex flex-row w-[100%] flex-wrap">
                        <form className="flex flex-col space-y-1 flex-wrap w-[100%] md:w-[50%] p-10">
                            <div className="flex flex-wrap w-[100%] justify-center">
                                <h1 className="font-extrabold drop-shadow-md">Register form</h1>
                            </div>
                            <AnimatedInput type="text" label="Name" className="control-input rounded-md w-[100%]"/>
                            <AnimatedInput type="email" label="Email address" className="control-input rounded-md w-[100%]"/>
                            <AnimatedInput type="text" label="Surname" className="control-input rounded-md w-[100%]"/>
                            <AnimatedInput type="date" label="Birth date" className="control-input rounded-md w-[100%]"/>
                            <AnimatedInput type="password" label="Password" className="control-input rounded-md w-[100%]"/>
                            <Button type="submit" isLoading={isLoading} label="Complete Registration"
                                    className="button-default flex justify-center min-w-[150px] md:min-w-[200px]"/>
                            <div className="flex flex-row items-center w-[100%]">
                                <div className="whiteline w-[50%]"></div>
                                <span>OR</span>
                                <div className="whiteline w-[50%]"></div>
                            </div>
                            <Button type="button" isLoading={isLoginPageLoading} label="Back to login" className="button-primary flex justify-center"
                             onClick={RedirectToLoginPage}/>
                        </form>
                        <div className="w-[50%] hidden md:flex">
                            <div className="reg-bg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
});
export default RegisterForm;