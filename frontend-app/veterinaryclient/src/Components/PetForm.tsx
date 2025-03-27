import {FC, memo, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import MembersTemplate from "@/Components/MembersTemplate";
import Link from "next/link";
import {LoadingLoop} from "@/Components/Icons";
import Button from "@/Components/Button";
import AnimatedInput from "@/Components/AnimatedInput";

type PetForm = {
    data:any;
    user:any;
}
const PetForm:FC<PetForm> = memo(function PetForm({data, user}) {
    type PetInfo = {
        PetId: number | null;
        Name: string | null;
        Age: number;
        AvatarId: number | null;
        Type: string | null;
    }
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [userData, setUserData] = useState(user ? user : null);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [formData, setFormData] = useState(data ? data : null);
    const [usersData, setUsersData] = useState([]);
    const [petInfo, setPetInfo] = useState<PetInfo>({
        PetId: formData ? formData.PetId : null,
        Name: formData ? formData.Name : null,
        Age: formData ? formData.age : 0,
        AvatarId: formData ? formData.avatarid : null,
        UserId:null,
        Type:formData ? formData.type : null
    });
    const [formErrors, setFormErrors] = useState<PetInfo>({
        Name: null,
        Age: null,
        AvatarId: null,
        Type: null
    });
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searchQuery, setSearchQuery] = useState(null);
    const searchInput = useRef(null);
    const searchDiv = useRef(null);
    const [buttons, setButtons] = useState({});
    const handleSearch = (e) => {
        const {value} = e.target;
        // Filter usersData by search query (username, email and name)
        if(value.length < 3){
            setSearchResults([]);
            if(searchDiv.current.classList.contains("flex")){
                searchDiv.current.classList.remove("flex");
                searchDiv.current.classList.add("hidden");
            }
            return;
        }
        setSearchQuery(value);
        const results = usersData.filter((user, index) => {
            user.index = index;
            return user.userName.toLowerCase().includes(value.toLowerCase()) || user.email.toLowerCase().includes(value.toLowerCase()) || user.name.toLowerCase().includes(value.toLowerCase());
        });
        setSearchResults(results);
        if(searchDiv.current.classList.contains("hidden")) {
            searchDiv.current.classList.remove("hidden");
            searchDiv.current.classList.add("flex");
        }
    }
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
                formData.set("UserId", userData.id);
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
        async function GetUsers() {
            const res = await fetch("/api/admin/users", {
                headers:{
                    "Content-Type":"application/json",
                    "Cache-Control":"private, max-age=600, must-revalidate, must-understand"
                }
            });
            switch(res.status){
                case 200:
                    const data = await res.json();
                    const r = [];
                    for(let i = 0; i < data.length; i++){
                        setButtons((prev) => ({...prev, [`button_${i}`]:false}));
                    }
                    setUsersData(data);
                    return;
                case 401:
                    //router.push("/profile/login");
                    console.log(res);
                    return;
                default:
                    console.error(res);
                    return;
            }
        }
        GetUsers();
    }, []);
    useEffect(() => {
        if(user != null && typeof user === "object"){
            setPetInfo((prev) => ({...prev, UserId:user.id}));
        }
        if(data != null && typeof data === "object"){
            setPetInfo((prev) => ({...prev, ...data}));
            setFormData(data);
            setAvatarPreview(data.avatar.imagePath);
        }
    },[user, data]);
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
        let res;
        if(formData != null ){
            res = await fetch("/api/pets/edit", {
                method: "POST",
                body: JSON.stringify(petInfo)
            });
        } else {
            res = await fetch("/api/pets/add", {
                method: "POST",
                body: JSON.stringify(petInfo)
            });
        }
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
    const SetOwner = (e, index) => {
        e.preventDefault();
        setButtons((prev) => ({...prev, [`button_${index}`]:true}));
        const user = searchResults[index];
        setPetInfo((prev) => ({...prev, UserId:user["id"]}));
        setButtons((prev) => ({...prev, [`button_${index}`]:false}));
        setSearchQuery(null);
        setSearchResults(null);
        searchInput.current.value = `${user.name} ${user.surname}`;
        searchDiv.current.classList.remove("flex");
        searchDiv.current.classList.add("hidden");
    }
    const findOwnerBy = (criteria, value) => {
        if(usersData != null){
            const user = usersData.find((user) => user[criteria] === value);
            if(user != null ){
                console.log(user);
                return `${user.name} ${user.surname}`;
            }
        }
    }
    return (
        <>
                <div className="flex flex-row items-center space-x-1">
                    <Link href="/account" title="Account">Home</Link>
                    <span className="separator"></span>
                    {formData ? (
                        <>
                            <span className="font-extrabold">Edit pet {formData.Name}</span>
                        </>
                    ) : (
                        <>
                            <span className="font-extrabold">Add new pet</span>
                        </>
                    )}
                </div>
                <section className="flex flex-col space-y-1 w-[100%] flex-wrap items-start relative">
                    <div className="flex flex-row space-y-1 space-x-[10px] md:justify-center flex-wrap items-start relative w-[100%]">
                        <div className="flex block w-[100%] md:w-[40%] flex-col space-y-1 p-5 flex-wrap items-start">
                            <div className="flex w-[100%] text-center justify-center">
                                {formData.name != null ? (
                                    <>
                                        <h2 className="font-extrabold">Edit pet {formData.name}</h2>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="font-extrabold">Add new pet</h2>
                                    </>
                                )}
                            </div>
                            <p>Use this form to submit your pet for vaccination. When staff issue vaccine, you may review vaccinations applied to your pet on my pets page.</p>
                            <form className="flex flex-col w-[100%] flex-wrap items-start space-y-1" onSubmit={handleForm}>
                                <div className="flex w-[100%]  flex-wrap p-5 flex-col items-center justify-center space-y-1">
                                    <div className="avatar-image w-[150px] h-[150px] relative flex flex-col space-y-0 space-x-0">
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
                                <AnimatedInput type="text" label="Pet name" name="Name" defaultValue={formData.name ? formData.name : ""} className="control-input rounded-md w-[100%]" onChange={ValidateInput}/>
                                {formErrors.Name ? <span className="error-text">{formErrors.Name}</span> : null}
                                <AnimatedInput type="number" label="Pet age" name="Age" defaultValue={formData.age ? formData.age : 0} className="control-input rounded-md w-[100%]" min="1" max="50" onChange={ValidateInput}/>
                                {formErrors.Age ? <span className="error-text">{formErrors.Age}</span> : null}
                                <AnimatedInput type="text" label="Pet type" name="Type" defaultValue={formData.type ? formData.type : ""} className="control-input rounded-md w-[100%]" onChange={ValidateInput}/>
                                {formErrors.Type ? <span className="error-text">{formErrors.Type}</span> : null}
                                {userData.group.isAdminGroup && usersData ? (
                                    <>
                                        <AnimatedInput type="search" label="Search for pet owner" defaultValue={formData.user.id && usersData != null ? findOwnerBy('id', formData.user.id) : ""} className="control-input rounded-md w-[100%]" ref={searchInput} onChange={handleSearch}/>
                                        <div ref={searchDiv} className="hidden flex-col space-y-1 w-[100%] search-result">
                                            <span>Search results for: {searchQuery}</span>
                                            {searchResults && searchResults.map((user, index) => (
                                                <div key={index} className="flex flex-row search-data p-5 w-[100%] space-x-1 items-center">
                                                    <strong className="font-extrabold text-[16px]">{user.name} {user.surname}</strong>
                                                    <Button type="button" label="Select owner" isLoading={buttons[`button_${index}`]} className="button-default flex justify-center" onClick={(e) => SetOwner(e,index)}/>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : null}
                                <Button type="submit" isLoading={isFormSubmitting} label="Save Changes"
                                        className="button-default flex justify-center w-[100%]"/>
                            </form>
                        </div>

                    </div>
                </section>
        </>
    )
});
export default PetForm;