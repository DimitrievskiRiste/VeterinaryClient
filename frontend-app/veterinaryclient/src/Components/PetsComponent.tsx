"use client"
import {FC, memo, useEffect, useRef, useState} from "react";
import AnimatedInput from "@/Components/AnimatedInput";
import Button from "@/Components/Button";
import PetForm from "@/Components/PetForm";
type PetsComponent = {
    data:any;
    user:any;
}
const PetsComponent:FC<PetsComponent> = memo(function PetsComponent({data, user}) {
    const [petData, setPetData] = useState(data);
    const [searchResults, setSearchResults] = useState([]);
    const petsTable = useRef(null);
    const [userData, setUserData] = useState(user);
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
            const searchResults = petData.filter((pet) => {
                pet.user.fullname = `${pet.user.name} ${pet.user.surname}`;
                return pet.name.toLowerCase().includes(value.toLowerCase()) || pet.age.toString().includes(value) || pet.type.toLowerCase().includes(value.toLowerCase()) || pet.user.name.toLowerCase().includes(value.toLowerCase()) || pet.user.surname.toLowerCase().includes(value.toLowerCase()) || pet.user.fullname.toLowerCase().includes(value.toLowerCase());
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
    const searchRef = useRef(null);
    const [searchData, setSearchData] = useState(null);
    const [IsVaccinePageLoading, setIsVaccinePageLoading] = useState(false);
    const [petInfo, setPetInfo] = useState(null);
    const EditPet = (pet,index) => {
        setEditButtons((prev) => ({...prev, [`button_${index}`]:true}));
        setPetInfo(pet);
    }
    const [editButtons, setEditButtons] = useState(null);
    const [vButtons, setVButtons] = useState(null);
    useEffect(() => {
        async function updateButtons() {
            if(petData) {
                for(let i = 0; i < petData.length; i++) {
                    setPetData((prev) => {
                        prev[i].btnIndex = i;
                        return prev;
                    });
                    setEditButtons((prev) => ({...prev, [`button_${i}`]:false}));
                    setVButtons((prev) => ({...prev,[`button_${i}`]:false}));
                }
            }
        }
        updateButtons();
    }, []);
    const closeModal = () => {
        const index = petInfo.btnIndex;
        setEditButtons((prev) => ({...prev, [`button_${index}`]:false}));
        setPetInfo(null);
    }
    return (
        <>
            <div className="flex w-[100%] flex-col flex-wrap items-start space-y-1">
                <div className="flex flex-col space-y-1 w-[100%] p-5 justify-center items-center block">
                    <AnimatedInput type="search" label="Search pet by name, age, type or owner.." className="control-input rounded-md w-[100%]"
                                   onChange={DoSearch}/>
                    {formErrors.search ? <span className="error-text">{formErrors.search}</span> : null}
                </div>
                <div ref={petsTable} className="flex w-[100%] flex-col flex-wrap items-center space-y-1 p-1 md:p-5  block">
                    <table className="w-[100%]" cellSpacing="0" cellPadding="0" role="table">
                        <thead className="p-5">
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th className="hidden md:table-cell">Type</th>
                            <th>Age</th>
                            <th className={userData.group.isAdminGroup ? "table-cell" : "hidden"}>
                                Owner
                            </th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody className="w-[100%]">
                        {petData && editButtons && petData.map((pet, index) => (
                                    <tr key={index}>
                                        <td><img src={`${pet.avatar?.imagePath}`} title={pet.name} alt={pet.name} className="avatar-image w-[50px] h-[50px] md:w-[100px] md:h-[100px]"/></td>
                                        <td>{pet.name}</td>
                                        <td className="hidden md:table-cell">{pet.type}</td>
                                        <td>{pet.age}</td>
                                        <td className={userData.group.isAdminGroup ? "table-cell" : "hidden"}>
                                            {pet.user.name} {pet.user.surname}
                                        </td>
                                            <td>
                                                <div className="flex flex-col space-y-3 items-center w-[100%] mt-1">

                                                    <Button isLoading={editButtons[`button_${index}`]} type="button" label="Edit pet" onClick={() => EditPet(pet,index)} className="p-0 md:p-auto button-primary text-center"/>
                                                    <Button isLoading={IsVaccinePageLoading} type="button" label="Vaccines" className="p-0 md:p-auto button-green text-center"/>
                                                </div>
                                            </td>
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
                            <th className="hidden md:table-cell">Type</th>
                            <th>Age</th>
                            <th className={userData.group.isAdminGroup ? "table-cell" : "hidden"}>
                                Owner
                            </th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody className="w-[100%]">
                        {editButtons && searchResults.map((pet, index) => (
                                <tr key={index}>
                                    <td><img src={`${pet.avatar.imagePath}`} title={pet.name} alt={pet.name} className="avatar-image w-[50px] h-[50px] md:w-[100px] md:h-[100px]"/></td>
                                    <td>{pet.name}</td>
                                    <td className="hidden md:table-cell">{pet.type}</td>
                                    <td>{pet.age}</td>
                                    <td className={userData.group.isAdminGroup ? "table-cell" : "hidden"}>
                                        {pet.user.name} {pet.user.surname}
                                    </td>
                                    <td>
                                        <div className="flex flex-col space-y-3 items-center w-[100%] mt-1">
                                            <Button isLoading={editButtons[`button_${index}`]} type="button" label="Edit pet" className="p-0 md:p-auto button-primary text-center"/>
                                            <Button isLoading={IsVaccinePageLoading} type="button" label="Vaccines" className="p-0 md:p-auto button-green text-center"/>
                                        </div>
                                    </td>
                                </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
                {petInfo !== null ? (
                    <>
                        <div className="flex fixed h-[100%] w-[100%] items-start  z-[100] left-0 ">
                            <div className="flex flex-col space-y-1 w-[100%] items-start">
                                <PetForm data={petInfo} user={user} dismissCallback={closeModal}/>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    )
});
export default PetsComponent;