"use client";
import MembersTemplate from "@/Components/MembersTemplate";
import {Suspense, useEffect, useState} from "react";
import PageLoading from "@/Components/PageLoading";
import VaccineForm from "@/Components/VaccinesComponent";
import {useRouter} from "next/navigation";

export default function Add()
{
    const [userData, setUserData] = useState(null);
    const [petsData, setPetsData] = useState(null);
    const router = useRouter();
    useEffect(() => {
        async function getPets() {
            const res = await fetch("/api/pets/get", {
                headers:{
                    "Content-Type":"application/json",
                    "Cache-Control":"private, max-age=600, must-revalidate, must-understand"
                }
            });
            // if status code is 401, redirect to login page
            switch(res.status){
                case 200:
                    const data = await res.json();
                    setPetsData(data.body);
                    return true;
                case 401:
                    router.push("/profile/login");
                    return;
                default:
                    console.error(res);
                    return;
            }
        }
        getPets();
    }, []);
    return (
        <>
            <Suspense fallback={<PageLoading/>}>
                <MembersTemplate data={setUserData}>
                    <div className="flex flex-col w-[100%] flex-wrap md:justify-center md:items-center p-5 space-y-1">
                        <VaccineForm pets={petsData}/>
                    </div>
                </MembersTemplate>
            </Suspense>
        </>
    )
}