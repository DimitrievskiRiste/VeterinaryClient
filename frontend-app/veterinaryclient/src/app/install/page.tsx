"use client";
import {useState} from "react";
import Button from "@/Components/Button";
import AnimatedInput from "@/Components/AnimatedInput";
import {useRouter} from "next/navigation";


export default function Install() {
    type FormData = {
        UserName:string|null;
        Name: string | null;
        Email: string | null;
        Surname: string | null;
        BirthDate: string | null;
        Password: null | string;
    }
    const [isLoading, setIsLoading] = useState(false);
    const [statusTitle, setStatusTitle] = useState("Installation process")
    const [activeStep, setActiveStep] = useState(1);
    const HandleStep1 = async () => {
        setIsLoading(true);
        const res = await fetch("/api/install", {
            method: "GET"
        });
        const data = await res.json();
        if(data.hasErrors){
            setStatusTitle("Installation failed")
            alert("Installation failed.")
        } else {
            setIsLoading(false);
            setActiveStep(2);
            setStatusTitle("Admin account creation")
        }
    }
    const [formData, setFormData] = useState<FormData>({
        UserName: null,
        Name: null,
        Email: null,
        Surname: null,
        BirthDate: null,
        Password: null
    });
    const [formErrors, setFormErrors] = useState<FormData>({
        UserName: null,
        Name: null,
        Email: null,
        Surname: null,
        BirthDate: null,
        Password: null
    });
    const onChangeInput = (e) => {
        const {name,type,value} = e.target;
        switch(type){
            case "text":
                if(value.length < 3 || /^\W+$/.test(value)){
                    setFormErrors((prev) => ({...prev, [name]: "Name must be at least 3 characters long!"}));
                } else {
                    if(name === "UserName"){
                       // If username contains only letters and numbers without space
                        if(/^[a-zA-Z0-9]+$/.test(value)){
                            setFormData((prev) => ({...prev, [name]: value}));
                            setFormErrors((prev) => ({...prev, [name]: null}));
                        } else {
                            setFormErrors((prev) => ({...prev, [name]: "Invalid username!"}));
                        }
                    } else {
                        setFormData((prev) => ({...prev, [name]: value}));
                        setFormErrors((prev) => ({...prev, [name]: null}));
                    }
                }
                break;
            case "email":
                if(/^([a-zA-Z0-9_]+@[a-zA-Z0-9]{2,}\.[a-z]{2,})$/.test(value)){
                    setFormData((prev) => ({...prev, [name]: value}));
                    setFormErrors((prev) => ({...prev, [name]: null}));
                } else {
                    setFormErrors((prev) => ({...prev, [name]: "Invalid email address!"}));
                }
                break;
            case "date":
                // if date is not valid or user is younger than 18 years old or older than 100 years old
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                if(age < 18 || age > 100){
                    setFormErrors((prev) => ({...prev, [name]: "You must be at least 18 years old to register!"}));
                } else {
                    setFormData((prev) => ({...prev, [name]: value}));
                    setFormErrors((prev) => ({...prev, [name]: null}));
                }
                break;
            case "password":
                if(value.length < 8){
                    setFormErrors((prev) => ({...prev, [name]: "Password must be at least 8 characters long!"}));
                } else {
                    setFormData((prev) => ({...prev, [name]: value}));
                    setFormErrors((prev) => ({...prev, [name]: null}));
                }
                break;
        }
    }
    const HandleFormSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formErrors).every(x => x === null) && Object.values(formData).every(x => x !== null)) {
            setIsLoading(true);
            const res = await fetch("/api/admin/register", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.hasError) {
                setStatusTitle("Installation failed")
                alert("Installation failed.");
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setActiveStep(3);
                setStatusTitle("Installation completed");
            }
        }
    }
    const router = useRouter();
    const RedirectToLoginPage = () => {
        setIsLoading(true);
        router.push("/profile/login");
    }
    return (
        <>
            <div className="flex w-[100%] flex-col flex-wrap items-start space-y-1">
                <header className="navigation flex flex-row w-[100%] flex-wrap justify-center p-5">
                    <h1 className="font-extrabold">Web application installer</h1>
                </header>
                <div className="flex flex-col justify-center w-[100%] min-h-[350px] md:min-h-[700px] items-center">
                    <div className="block w-[80%] md:w-[50%] flex flex-col flex-wrap">
                        <div className="flex w-[100%] flex-wrap justify-center">
                            <h2 className="font-extrabold p-5">{statusTitle}</h2>
                        </div>
                        <div className="flex flex-col w-[100%] p-5 flex-wrap space-y-1 items-start">
                            <span>Step {activeStep} / 3</span>
                            {activeStep === 1 ? (
                                <>
                                    <p>On this step, the installation script will create default user groups Admins and users.</p>
                                    <p>Click on the button below to start with installation.</p>
                                    <div className="flex flex-row flex-wrap w-[100%] justify-center">
                                        <Button type="button" isLoading={isLoading} label="Start installation" className="button-primary flex justify-center min-w-[200px]" onClick={HandleStep1}/>
                                    </div>
                                </>
                            ) : null}
                            {activeStep === 2 ? (
                                <>
                                    <form onSubmit={HandleFormSubmit} className="flex flex-col space-y-1 flex-wrap w-[100%] items-start">
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
                                                className="button-default flex w-[100%] justify-center min-w-[150px] md:min-w-[200px]"/>
                                    </form>
                                </>
                            ) : null}
                            {activeStep === 3 ? (
                                <>
                                    <p>Successfully created default user groups and administrative account.</p>
                                    <div className="flex w-[100%] justify-center flex-wrap">
                                        <Button type="button" isLoading={isLoading}
                                                className="button-primary flex justify-center min-w-[200px]"
                                                label="Go to login page" onClick={RedirectToLoginPage}/>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}