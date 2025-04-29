"use client"
import {createRef, Suspense, useRef, useState} from "react";
import PageLoading from "@/Components/PageLoading";
import {DotsVerticalOutline} from "@/Components/Icons";
import Button from "@/Components/Button";
import VaccinesComponent from "@/Components/VaccinesComponent";
import EditPetVaccine from "@/Components/EditPetVaccine";
import Link from "next/link";

export default function VaccinationComponent({pet, vaccines, user})
{
    const [petData, setPetData] = useState(pet);
    const [vaccinationData, setVaccinationData] = useState(vaccines);
    const ref = createRef();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(null);
    const [userData, setUserData] = useState(user);
    const modalRef = useRef();
    return (
        <>
            <div className="flex flex-row space-x-1 items-center w-[100%] flex-wrap">
                <Link href="/account" title="Home page">Home</Link>
                <span className="separator"></span>
                <Link href={`/account/pet/${petData.data.id}/vaccines`} title={`${petData.data.name} Vaccines`}>{petData.data.name} Vaccines</Link>
            </div>
            <div className="flex flex-wrap flex-col space-y-1 items-start w-[100%]">
                {editData && isEditMode && userData && userData.group.isAdminGroup ? (
                    <>
                        <div ref={modalRef} className="modal-overlay h-[100%] justify-center w-[100%] flex flex-col">
                            <div className="modal w-[100%] justify-center" aria-modal="true" role="dialog">
                                <div className="flex flex-row w-[100%] flex-wrap items-end justify-end ">
                                    <span className="pointer p-5 close" onClick={() => {
                                        setEditData(null);
                                        setIsEditMode(null);
                                    }}>X</span>
                                </div>
                                <Suspense name="LoadVaccineComponent" fallback={<PageLoading/>}>
                                    <EditPetVaccine pet={petData} data={editData}/>
                                </Suspense>
                            </div>
                        </div>
                    </>
                ) : null}
                {petData.data ? (
                    <>
                        <div className="flex flex-col block p-5 flex-wrap w-[100%] items-start space-y-1">
                            <div className="flex flex-row space-x-1 items-center w-[100%]">
                                <img src={petData.data.avatar.imagePath} className="avatar-image w-[100px] h-[100px] rounded-full"
                                     alt="Pet avatar"/>
                                <div className="flex flex-col space-y-1 items-baseline">
                                    <span className="text-[17px]">Name:{petData.data.name}</span>
                                    <span className="text-[13px]">Age: {petData.data.age}</span>
                                    <span className="text-[13px]">Owner: {petData.data.user?.name} {petData.data.user?.surname}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <PageLoading/>
                    </>
                )}
                <h2>Vaccinations</h2>
                <p>Here are displayed vaccination history for your pet.</p>
                <table className="table w-[100%]">
                    <thead>
                     <tr>
                         <th>Vaccine name</th>
                         <th>Vaccination date</th>
                         <th>Action</th>
                     </tr>
                    </thead>
                    <tbody className="p-5">
                    {vaccinationData.map((vaccine, key) => (
                        <tr key={key}>
                            <td>{vaccine.vaccine?.name}</td>
                            <td>{new Date(vaccine.dateAdded).toLocaleDateString()}</td>
                            <td>
                                {userData.group.isAdminGroup ? (
                                    <>
                                        <div className="flex w-[100%] flex-col relative flex-wrap items-start">
                                            <DotsVerticalOutline className="text-[30px] pointer" onClick={() => {
                                                const menu = document.getElementById(`menu_${vaccine.vaccineId}`);
                                                if (menu) {
                                                    ref.current = menu;
                                                    const items = ref.current;
                                                    if (items.classList.contains("hidden")) {
                                                        items.classList.remove("hidden");
                                                        items.classList.add("flex");
                                                    } else {
                                                        items.classList.remove("flex");
                                                        items.classList.add("hidden");
                                                    }
                                                }
                                            }}/>
                                            <div id={`menu_${vaccine.vaccineId}`} ref={ref} className="hidden flex-col flex-wrap absolute top-[15px] z-[100]">
                                                <div className="flex flex-col w-[100%] flex-wrap dropdown-content">
                                                    <div className="flex flex-row w-[100%] flex-wrap items-end justify-end">
                                            <span className="pointer p-5" onClick={() => {
                                                const menu = ref.current;
                                                if (menu) {
                                                    menu.classList.remove("flex");
                                                    menu.classList.add("hidden");
                                                }
                                            }}>X</span>
                                                    </div>
                                                    <Button className="button button-green" label="Edit" onClick={() => {
                                                        const menu = ref.current;
                                                        setIsEditMode(true);
                                                        setEditData(vaccine);
                                                        if (menu) {
                                                            menu.classList.remove("flex");
                                                            menu.classList.add("hidden");
                                                        }
                                                    }}/>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}