"use client";
import {FC, memo, Suspense, useState} from "react";
import {LoadingLoop} from "@/Components/Icons";
import VaccinationComponent from "@/Components/VaccinationComponent";
import MembersTemplate from "@/Components/MembersTemplate";
import PageLoading from "@/Components/PageLoading";
type VP = {
    pet:any;
    vaccines:any;
    [children:string]:any;
}
const VaccinationsPage :FC = memo<VP>(function VaccinationsPage({pet, vaccines}){
    const [userData, setUserData] = useState(null);
    const [petData, setPetData] = useState(pet);
    console.log(vaccines);
    const [vaccinationData, setVaccinationData] = useState(vaccines);
    return (
        <>
            <Suspense name="MembersTemplate" fallback={<PageLoading/>}>
                <MembersTemplate data={setUserData}>
                    {userData ? (
                        <>
                            <Suspense name="VaccinationComponent" fallback={<PageLoading/>}>
                                <VaccinationComponent pet={petData} vaccines={vaccinationData} user={userData}/>
                            </Suspense>
                        </>
                    ) : (
                        <PageLoading/>
                    )}
                </MembersTemplate>
            </Suspense>
        </>
    )
});
export default VaccinationsPage;