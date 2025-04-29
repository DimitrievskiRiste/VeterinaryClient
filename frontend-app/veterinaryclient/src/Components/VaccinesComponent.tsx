import {FC, memo, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import AnimatedInput from "@/Components/AnimatedInput";
import Button from "@/Components/Button";
import * as sea from "node:sea";

type VaccineComponent = {
    pets:object;
    formData:object;
    [key:string]:any;
}
const VaccineForm:FC<VaccineComponent> = memo(function VaccineForm({pets, formData}){
    type VaccineFormData = {
        VaccineId:null|number;
        PetId:null|number;
        Name:null|string;
        DateAdded:null|string;
    }
    const [vaccineData, setVaccineData] = useState<VaccineFormData>({
        VaccineId:null,
        PetId:null,
        Name:null,
        DateAdded:null
    });
    const router = useRouter();
    const [formdata, setFormdata] = useState(null);
    const [formErrors, setFormErrors] = useState<VaccineFormData>({
        VaccineId:null,
        PetId:null,
        Name:null,
        DateAdded:null
    });
    const [petsData, setPetsData] = useState(null);
    useEffect(() => {
        setFormdata((prev) => ({...prev, ...formData}));
    }, [formData]);
    useEffect(() => {
        setPetsData(pets);
    }, [pets]);
    const [isLoading, setIsLoading] = useState(false);
    const handleForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if(!IsObjectEmpty(formdata)){
            let res = await fetch("/api/vaccine/edit", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formdata)
            });
            const data = await res.json();
            switch(data.status)
            {
                case 200:
                    setIsLoading(false);
                    console.log(data);
                    alert(data.body.message);
                    //const id = vaccineData.PetId ?? formdata.PetId;
                    //router.push(`/view_pet/${id}`);
                    break;
                case 401:
                    router.push("/profile/login");
                    break;
                default:
                    console.error(data);
                    setIsLoading(false);
                    break;
            }
        } else {
            if(vaccineData.Name === null || vaccineData.DateAdded === null){
                setFormErrors({
                    VaccineId:vaccineData.VaccineId === null ? "Vaccine ID is required" : null,
                    PetId:null,
                    Name:vaccineData.Name === null ? "Vaccine name is required" : null,
                    DateAdded:vaccineData.DateAdded === null ? "Date added is required" : null
                });
                setIsLoading(false);
                return;
            }
            let res = await fetch("/api/vaccine/add", {
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify(vaccineData)
            });
            const data = await res.json();
            switch(data.status)
            {
                case 200:
                    setIsLoading(false);
                    console.log(data);
                    alert(data.body.message);
                    const id = vaccineData.PetId;
                    //router.push(`/view_pet/${id}`);
                    return;
                case 401:
                    router.push("/profile/login");
                    return;
                default:
                    console.error(data);
                    setIsLoading(false);
                    return;
            }
        }

    }
    const inputRef = useRef(null);
    const labelRef = useRef(null);
    const validateInput = (e) => {
        const {type, name, value} = e.target;
        switch(name.toLowerCase())
        {
            case "name":{
                if(!/^[a-zA-Z0-9\s-,]+$/.test(value)){
                    setFormErrors((prev) => ({...prev, [name]:"Vaccine name can contain only characters and numbers."}));
                    return;
                } else {
                    setFormErrors((prev) => ({...prev, [name]:null}));
                    if(!IsObjectEmpty(formdata)){
                        setFormdata((prev) => ({...prev, [name]:value}));
                        return;
                    } else {
                        setVaccineData((prev) => ({...prev, [name]:value}));
                        return;
                    }
                }
            }
            case "dateadded":{
                if(!IsObjectEmpty(formdata)){
                    // if date is newer than today throw an error
                    const today = new Date();
                    const date = new Date(value);
                    if(date > today){
                        setFormErrors((prev) => ({...prev, [name]:"Vaccination date cannot be in the future."}));
                        return;
                    }
                    setFormdata((prev) => ({...prev, [name]:value.toString()}));
                    return;
                } else {
                    const today = new Date();
                    const date = new Date(value);
                    if(date > today){
                        setFormErrors((prev) => ({...prev, [name]:"Vaccination date cannot be in the future."}));
                        return;
                    }
                    setVaccineData((prev) => ({...prev, [name]:value.toString()}));
                    console.log(vaccineData);
                    setFormErrors((prev) => ({...prev, [name]:null}));
                }
                return;
            }
        }
    }
    const SetPet = (e) => {
        const pet = petsData.find((pet) => pet.id == e);
        return pet.name;
    }
    const [searchQuery, setSearchQuery] = useState(null);
    const [searchData, setSearchData] = useState(null);
    const SearchPet = (e) => {
        const {value} = e.target;
        if(value.length < 3) {
            if(searchRef.current.classList.contains("flex")){
                searchRef.current.classList.add("hidden");
                searchRef.current.classList.remove("flex");
            }
            setSearchData(null);
        } else {
            setSearchQuery(value);
            const pets = petsData.filter((pet) => {
                pet.user.fullname = `${pet.user.name} ${pet.user.surname}`;
                return pet.name.includes(value) || pet.user.name.includes(value.toLowerCase) || pet.user.fullname.includes(value.toLowerCase());
            });

            setSearchData(pets);
            if(searchRef.current.classList.contains("hidden")){
                searchRef.current.classList.add("flex");
                searchRef.current.classList.remove("hidden");
            }
        }
    }
    const searchRef = useRef(null);
    function IsObjectEmpty(obj){
        return Object.keys(obj).length === 0;
    }
    const AddPet = (data) => {
        if(!IsObjectEmpty(formdata)){
            setFormdata((prev) => ({...prev, PetId:data['id']}));
            setSearchQuery(null);
            setSearchData(null);
            inputRef.current.value = data['name'];
            if(searchRef.current.classList.contains("flex")) {
                searchRef.current.classList.add("hidden");
                searchRef.current.classList.remove("flex");
            }
            setVaccineData((prev) => ({...prev, PetId: data['id']}));
        } else {
            inputRef.current.value = data['name'];
            setVaccineData((prev) => ({...prev, PetId: data['id']}));
            setSearchQuery(null);
            setSearchData(null);
            if(searchRef.current.classList.contains("flex")) {
                searchRef.current.classList.add("hidden");
                searchRef.current.classList.remove("flex");
            }
        }
    }
    return (
        <>
            <div className="flex w-[100%] md:w-[50%] flex-wrap justify-center items-center space-y-1 block p-5">
                <h1 className="text-[25px] font-bold">{formdata?.name != null ? `Edit vaccine ${formdata?.name}` : "Add vaccine"}</h1>
                <form onSubmit={handleForm} role="form" className="flex flex-col space-y-1 flex-wrap items-start  w-[100%]">
                    <AnimatedInput type="text" label="Vaccine name" name="Name" className="control-input w-[100%] rounded-md" defaultValue={formdata && formdata.Name ? formdata.Name : ""} onChange={validateInput}/>
                    {formErrors.Name && <span className="error-text text-[15px]">{formErrors.Name}</span>}
                    <AnimatedInput type="date" label="Vaccination Date" name="DateAdded" className="control-input w-[100%] rounded-md" defaultValue={formdata && formdata.DateAdded ? formdata.DateAdded : ""} onChange={validateInput}/>
                    {formErrors.DateAdded && <span className="error-text text-[15px]">{formErrors.DateAdded}</span>}
                    <AnimatedInput type="search" label="Search for pet" name="Pet" labelRef={labelRef} inputRef={inputRef} defaultValue={formdata && formdata.PetId ? SetPet(formdata.PetId) : ""} className="control-input w-[100%] rounded-md" onChange={SearchPet}/>
                    <div ref={searchRef} className="hidden flex-col space-y-1 p-5 flex-wrap items-start search-result">
                        <span className="text-[15px]">Search results for: {searchQuery}</span>
                        {searchData && searchData.map((data, key) => (

                                <div key={key} className="search-data flex flex-row space-y-1 space-x-1 flex-wrap p-5 items-center">
                                    <div className="avatar-image w-[50px] h-[50px] rounded-full overflow-hidden">
                                        <img src={data.avatar.imagePath} title={`${data.name}'s avatar`} alt={`${data.name}'s avatar`}/>
                                    </div>
                                    <span className="text-[15px]">{data.name}</span>
                                    <Button type="button" className="button-default" label="Select this pet" onClick={() => AddPet(data)}/>
                                </div>

                        ))}
                    </div>
                    <Button type="submit" isLoading={isLoading} label="Save Changes" className="button-default"/>
                </form>
            </div>
        </>
    )
});
export default VaccineForm;