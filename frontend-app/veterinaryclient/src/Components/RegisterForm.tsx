"use client";
import React, {memo, useEffect, useState} from "react";
import AnimatedInput from "@/Components/AnimatedInput";
import Button from "@/Components/Button";
import {useRouter} from "next/navigation";
import axios from "axios";
const RegisterForm = memo(function RegisterForm() {
    type FormData = {
        UserName:string|null;
        Name: string | null;
        Email: string | null;
        Surname: string | null;
        BirthDate: string | null;
        Age: string | null;
        isVeterinarian: string | boolean;
        Password: null | string;
    }
    const [formData, setFormData] = useState<FormData>({
        UserName:null,
        Name: null,
        Email: null,
        Surname: null,
        BirthDate: null,
        Age: null,
        IsVeterinarian: false,
        Password: null,
    });
    const [formErrors, setFormErrors] = useState<FormData>({
        UserName:null,
        Name:null,
        Email:null,
        Surname:null,
        BirthDate:null,
        Age:null,
        isVeterinarian:null,
        Password:null
    });
    useEffect(() => {
        console.log(formData);
    },[formData]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginPageLoading, setIsLoginPageLoading] = useState(false);
    const router = useRouter();
    const RedirectToLoginPage = () => {
        setIsLoginPageLoading(true);
        router.push('/profile/login');
    }
    const onChangeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, type, value} = e.target;
        switch(type)
        {
            case "text":
                if(value.length < 3 || /^\W+$/.test(value)){
                    setFormErrors((prev) => ({...prev, [name]: "Name must be at least 3 characters long!"}));
                } else {
                    if(name === "UserName"){
                        if(/^[a-zA-Z0-9]+$/.test(value)){
                            setFormData((prev) => ({...prev, [name]: value}));
                            setFormErrors((prev) => ({...prev, [name]: null}));
                        } else {
                            setFormErrors((prev) => ({...prev, [name]: "Invalid username!"}));
                        }
                    } else {
                        setFormErrors((prev) => ({...prev, [name]: null}));
                        setFormData((prev) => ({...prev, [name]: value}));
                    }
                }
                break;
            case "email":
                if(!/^([a-zA-Z0-9_]+@[a-zA-Z0-9]{2,}\.[a-z]{2,})$/.test(value)){
                    setFormErrors((prev) => ({...prev, [name]: "Invalid email address!"}));
                } else {
                    setFormErrors((prev) => ({...prev, [name]: null}));
                    setFormData((prev) => ({...prev, [name]: value}));
                }
                break;
            case "date":
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                if(age < 18){
                    setFormErrors((prev) => ({...prev, [name]: "You must be at least 18 years old to register!"}));
                } else {
                    setFormErrors((prev) => ({...prev, [name]: null}));
                    setFormData((prev) => ({...prev, [name]: value, Age: age}));
                }
                break;
            case "password":
                if(value.length < 8){
                    setFormErrors((prev) => ({...prev, [name]: "Password must be at least 8 characters long!"}));
                } else {
                    setFormErrors((prev) => ({...prev, [name]: null}));
                    setFormData((prev) => ({...prev, [name]: value}));
                }
                break;
        }
    }
    const onFormSubmit = async (e) => {
        e.preventDefault();
        if(Object.values(formErrors).every((val) => val === null)) {
            setIsLoading(true);
            const req = await axios("/api/register", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                data:JSON.stringify(formData)
            });
            if(req.data){
                const res = req.data;
                if(!res.hasError && !res.hasErrors){
                    router.push("/profile/login");
                } else {
                    setIsLoading(false);
                    alert("Error: "+res.message);
                }
            } else {
                setIsLoading(false);
                alert("Error: "+req.statusText);
            }
        }
    }
    return (
        <>
            <div className="flex flex-col w-[100%] flex-wrap justify-center items-center">
                <div className="register flex flex-col flex-wrap w-[80%] md:w-[60%] space-y-2">
                    <div className="flex flex-row w-[100%] flex-wrap">
                        <form onSubmit={onFormSubmit} className="flex flex-col space-y-1 flex-wrap w-[100%] md:w-[50%] p-10">
                            <div className="flex flex-wrap w-[100%] justify-center">
                                <h1 className="font-extrabold drop-shadow-md">Register form</h1>
                            </div>
                            <AnimatedInput type="text" label="User name" name="UserName" className="control-input rounded-md w-[100%]" onChange={onChangeInput}/>
                            {formErrors.UserName ? <span className="error-text">Error: {formErrors.UserName}</span> : null}
                            <AnimatedInput type="text" label="Name" name="Name" className="control-input rounded-md w-[100%]" onChange={onChangeInput}/>
                            {formErrors.Name ? <span className="error-text">Error: {formErrors.Name}</span> : null}
                            <AnimatedInput type="email" label="Email address" name="Email" className="control-input rounded-md w-[100%]" onChange={onChangeInput}/>
                            {formErrors.Email ? <span className="error-text">Error: {formErrors.Email}</span> : null}
                            <AnimatedInput type="text" label="Surname" name="Surname" className="control-input rounded-md w-[100%]" onChange={onChangeInput}/>
                            {formErrors.Surname ? <span className="error-text">Error: {formErrors.Surname}</span> : null}
                            <AnimatedInput type="date" label="Birth date"  min="1930-01-01" name="BirthDate" className="control-input rounded-md w-[100%]" onChange={onChangeInput}/>
                            {formErrors.BirthDate ? <span className="error-text">Error: {formErrors.BirthDate}</span> : null}
                            <AnimatedInput type="password" label="Password" name="Password" className="control-input rounded-md w-[100%]" onChange={onChangeInput}/>
                            {formErrors.Password ? <span className="error-text">Error: {formErrors.Password}</span> : null}
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