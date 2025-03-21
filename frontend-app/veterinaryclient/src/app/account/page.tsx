"use client";
import MembersTemplate from "@/Components/MembersTemplate";
import Link from "next/link";
import AnimatedInput from "@/Components/AnimatedInput";
import Button from "@/Components/Button";
import {useEffect, useRef, useState} from "react";
import {LoadingLoop} from "@/Components/Icons";
import {useRouter} from "next/navigation";

export default function Account()
{
    type PetInfo = {
        Name: string | null;
        Age: number;
        AvatarId: number | null;
        Type: string | null;
    }
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isFileUploading, setIsFileUploading] = useState(false)
    const [petInfo, setPetInfo] = useState<PetInfo>({
        Name: null,
        Age: 0,
        AvatarId: null,
        UserId:null,
        Type:null
    });
    const [formErrors, setFormErrors] = useState<PetInfo>({
        Name: null,
        Age: null,
        AvatarId: null,
        Type: null
    });
    const uploadBtn = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const UploadAvatar = () => {
        uploadBtn.current.click();
    }
    const router = useRouter();
    const HandleUpload = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        switch(file.type){
            case "image/png":
            case "image/jpeg":
                setIsFileUploading(true);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAvatarPreview(e.target.result);
                }
                reader.readAsDataURL(file);
                const formData = new FormData();
                formData.set("avatar", file);
                formData.set("userId", userData.id);
                const upload = await fetch("/api/avatar", {
                    method:"POST",
                    body:formData
                });
                const data = await upload.json();
                switch(data.status){
                    case 200:{
                        if(data.hasErrors === true){
                            alert(data.message);
                            return;
                        } else {
                            setIsFileUploading(false);
                            setPetInfo((prev) => ({...prev, AvatarId: data.body.model.id}));
                            return;
                        }
                    }
                    case 401: {
                        alert("Your session has been expired, please re-login");
                        router.push("/profile/login");
                    }
                    default:{
                        alert(upload.statusText);
                    }
                }
                break;
            default:
                alert("Invalid file format.");
                break;
        }
    }
    const ValidateInput = (e) => {
        const {type, name, value} = e.target;
        switch(type){
            case "text":{
                if(value.length < 3){
                    setFormErrors((prev) => ({...prev, [name]: "Name must be at least 3 characters long!"}));
                } else if (!/^[a-zA-Z\s]+$/.test(value)){
                    setFormErrors((prev) => ({...prev, [name]: "Name must contain only letters!"}));
                } else {
                    setFormErrors((prev) => ({...prev, [name]: null}));
                    setPetInfo((prev) => ({...prev, [name]:value}));
                }
                break;
            }
            case "number":{
                if(value < 1 || value > 50){
                    setFormErrors((prev) => ({...prev, [name]: "Age must be between 1 and 50 years!"}));
                } else {
                    setFormErrors((prev) => ({...prev, [name]: null}));
                    setPetInfo((prev) => ({...prev, [name]:parseInt(value)}));
                }
                break;
            }
        }
    }
    useEffect(() => {
        if(userData != null && typeof userData === "object"){
            setPetInfo((prev) => ({...prev, UserId:userData.id}));
        }
    },[userData]);
    const handleForm = async (e) => {
        e.preventDefault();
        if (!petInfo.Name || !petInfo.Age) {
            alert("Please fill all fields.");
            return;
        }
        if (!petInfo.AvatarId) {
            alert("Please upload an avatar for your pet.");
            return;
        }
        setIsFormSubmitting(true);
        const res = await fetch("/api/pets/add", {
            method: "POST",
            body: JSON.stringify(petInfo)
        });
        const data = await res.json();
        switch (data.status) {
            case 200: {
                setIsFormSubmitting(false);
                if (data.hasErrors === true) {
                    alert(data.message);
                    return;
                } else {
                    alert("Pet added successfully.");
                    router.push("/account/pets");
                    return;
                }
            }
            case 401: {
                alert("Your session has been expired, please re-login");
                router.push("/profile/login");
                return;
            }
            default: {
                alert(res.statusText);
                return;
            }
        }
    }
    return (
        <>
            <MembersTemplate data={setUserData}>
                <div className="flex flex-row items-center space-x-1">
                    <Link href="/account" title="Account">Home</Link>
                    <span className="separator"></span>
                </div>
                <section className="flex flex-col space-y-1 w-[100%] flex-wrap items-start relative">
                    <div className="flex flex-row space-x-1 space-y-1 space-x-[10px] flex-wrap items-start relative w-[100%]">
                        <div className="flex block w-[100%] md:w-[40%] flex-col space-y-1 p-5 flex-wrap items-start">
                            <div className="flex w-[100%] text-center justify-center">
                                <h2 className="font-extrabold">Add new pet</h2>
                            </div>
                            <p>Use this form to submit your pet for vaccination. When staff issue vaccine, you may review vaccinations applied to your pet on my pets page.</p>
                            <form className="flex flex-col w-[100%] flex-wrap items-start space-y-1" onSubmit={handleForm}>
                                <div className="flex w-[100%]  flex-wrap p-5 flex-col items-center justify-center space-y-1">
                                    <div className="avatar-image relative flex flex-col space-y-0 space-x-0">
                                        {isFileUploading && avatarPreview ? (
                                            <>
                                                <img src={avatarPreview} title="Pet's avatar" alt="Pet's avatar" className="opacity-[0.4]"/>
                                                <div className="w-[150px] h-[150px] absolute top-0 flex justify-center items-center z-20">
                                                    <LoadingLoop className="text-[25px]"/>
                                                </div>
                                            </>
                                        ) : null}
                                        {!isFileUploading && avatarPreview ? (
                                            <>
                                                <img src={avatarPreview} title="Pet's avatar" alt="Pet's avatar"/>
                                            </>
                                        ) : null}
                                    </div>
                                    <Button type="button" isLoading={isFileUploading} label="Upload avatar"
                                            className="button-primary rounded-sm flex justify-center min-w-[200px]" onClick={UploadAvatar}/>
                                    <input type="file" className="hidden" ref={uploadBtn} accept={'image/png,image/jpeg'} onChange={HandleUpload}/>
                                    <span>Allowed extensions: jpg, jpeg and png format.</span>
                                </div>
                                <AnimatedInput type="text" label="Pet name" name="Name" className="control-input rounded-md w-[100%]" onChange={ValidateInput}/>
                                {formErrors.Name ? <span className="error-text">{formErrors.Name}</span> : null}
                                <AnimatedInput type="number" label="Pet age" name="Age" className="control-input rounded-md w-[100%]" min="1" max="50" onChange={ValidateInput}/>
                                {formErrors.Age ? <span className="error-text">{formErrors.Age}</span> : null}
                                <AnimatedInput type="text" label="Pet type" name="Type" className="control-input rounded-md w-[100%]" onChange={ValidateInput}/>
                                {formErrors.Type ? <span className="error-text">{formErrors.Type}</span> : null}
                                <Button type="submit" isLoading={isFormSubmitting} label="Add pet"
                                        className="button-default flex justify-center w-[100%]"/>
                            </form>
                        </div>

                    </div>
                </section>
            </MembersTemplate>
        </>
    )
}