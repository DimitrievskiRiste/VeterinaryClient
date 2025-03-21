"use client"
import {FC, memo, useEffect, useRef, useState} from "react";
import AnimatedInput from "@/Components/AnimatedInput";
import Button from "@/Components/Button";
type PetsComponent = {
    data:any;
}
const PetsComponent:FC<PetsComponent> = memo(function PetsComponent({data}) {
    const [petData, setPetData] = useState(data);
    const [searchResults, setSearchResults] = useState([]);
    const petsTable = useRef(null);
    const DoSearch = (e) => {
        const {value} = e.target;
        if(value.length < 3) {
            if(!searchRef.current.classList.contains("hidden")) {
                searchRef.current.classList.remove("flex");
                searchRef.current.classList.add("hidden");
            }
            if(petsTable.current.classList.contains("hidden")) {
                petsTable.current.classList.add("flex");
                petsTable.current.classList.remove("hidden");
            }
            setSearchData(null);
            setFormErrors((prev) => ({...prev, search: "Search query must be at least 3 characters long!"}));
            return;
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
            setFormErrors((prev) => ({...prev, search: "Search query must contain only letters and numbers!"}));
            return;
        } else {
            setSearchData(value);
            setFormErrors((prev) => ({...prev, search: null}));
            console.log(petData);
            const searchResults = petData.filter((pet) => {
                return pet.name.toLowerCase().includes(value.toLowerCase()) || pet.age.toString().includes(value) || pet.type.toLowerCase().includes(value.toLowerCase()) || pet.user.name.toLowerCase().includes(value.toLowerCase());
            });
            setSearchResults(searchResults);
            if(!petsTable.current.classList.contains("hidden")) {
                petsTable.current.classList.remove("flex");
                petsTable.current.classList.add("hidden");
            }
            if(searchRef.current.classList.contains("hidden")) {
                searchRef.current.classList.add("flex");
                searchRef.current.classList.remove("hidden");
            }
        }
    }
    const [formErrors, setFormErrors] = useState({
        search:null
    });
    const [IsEditPageLoading, setIsEditPageLoading] = useState(false);
    const searchRef = useRef(null);
    const [searchData, setSearchData] = useState(null);
    return (
        <>
            <div className="flex w-[100%] flex-col flex-wrap items-start space-y-1">
                <div className="flex flex-col space-y-1 w-[100%] p-5 justify-center items-center block">
                    <AnimatedInput type="search" label="Search pet by name, age, type or owner.." className="control-input rounded-md w-[100%]"
                                   onChange={DoSearch}/>
                    {formErrors.search ? <span className="error-text">{formErrors.search}</span> : null}
                </div>
                <div ref={petsTable} className="flex w-[100%] flex-col flex-wrap items-center space-y-1 p-5  block">
                    <table className="w-[100%]" cellSpacing="0" cellPadding="0" role="table">
                        <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody className="w-[100%]">
                        {petData && petData.map((pet, index) => (
                                <tr key={index}>
                                    <td><img src={`${pet.avatar.imagePath}`} title={pet.name} alt={pet.name} className="avatar-image w-[50px] h-[50px] md:w-[100px] md:h-[100px]"/></td>
                                    <td>{pet.name}</td>
                                    <td>{pet.type}</td>
                                    <td>{pet.age}</td>
                                    <td><Button isLoading={IsEditPageLoading} type="button" label="Edit pet" className="p-0 md:p-auto button-primary text-center"/></td>
                                </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <section ref={searchRef} className="hidden flex-col block flex-wrap items-start w-[100%] space-y-1">
                    <h2 className="font-extrabold">Search results for: {searchData}</h2>
                    <table className="w-[100%]">
                        <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody className="w-[100%]">
                        {searchResults.map((pet, index) => (
                            <tr key={index}>
                                <td><img src={`${pet.avatar.imagePath}`} title={pet.name} alt={pet.name} className="avatar-image w-[50px] h-[50px] md:w-[100px] md:h-[100px]"/></td>
                                <td>{pet.name}</td>
                                <td>{pet.type}</td>
                                <td>{pet.age}</td>
                                <td><Button isLoading={IsEditPageLoading} type="button" label="Edit pet" className="p-0 md:p-auto button-primary text-center"/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    )
});
export default PetsComponent;