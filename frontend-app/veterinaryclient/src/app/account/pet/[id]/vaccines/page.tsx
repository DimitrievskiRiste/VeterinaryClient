import MembersTemplate from "@/Components/MembersTemplate";
import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {fetchAuthorizedData} from "@/Components/config";
import {LoadingLoop} from "@/Components/Icons";
import VaccinationComponent from "@/Components/VaccinationComponent";
import VaccinationsPage from "@/Components/pages/VaccinationsPage";
import PageLoading from "@/Components/PageLoading";
import {Suspense} from "react";

export default async function Page({params}:Promise<{params:{id:bigint,req:NextRequest}}>){
    async function GetPet(token, petid) {
        const id = parseInt(petid);
        const data = await fetchAuthorizedData("api/pets/find?PetId=" + id, token, "GET", null);
        return data;
    }
    async function GetVaccines(token, petid) {
        const id = parseInt(petid);
        const data = await fetchAuthorizedData("api/PetVaccines/all?petid=" + id, token, "GET", null);
        return data;
    }
    const [page, cookie] = await Promise.all([
        params,
        cookies()
    ]);
    const [pet, vaccines] = await Promise.all([
        GetPet(cookie.get("token")?.value, page.id),
        GetVaccines(cookie.get("token")?.value, page.id)
    ]);
    console.log(pet);
    console.log(vaccines);
    switch(vaccines.code)
    {
        case 200:
            break;
        case 401:
            console.log(vaccines);
            return <p>Unauthorized</p>;
        default:
            console.error(vaccines);
            return <p>An error occured.</p>
    }
    return (
        <>
            <Suspense name="VaccinationsPage" fallback={<PageLoading/>}>
                <VaccinationsPage pet={pet} vaccines={vaccines.data}/>
            </Suspense>
        </>
    )
}