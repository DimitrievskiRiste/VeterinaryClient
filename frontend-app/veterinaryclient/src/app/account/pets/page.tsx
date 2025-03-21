"use client";
import Link from "next/link";
import {Suspense, useEffect, useState} from "react";
import PetsComponent from "@/Components/PetsComponent";
import {useRouter} from "next/navigation";
import MembersTemplate from "@/Components/MembersTemplate";
import {LoadingLoop} from "@/Components/Icons";

export default function Pets()
{
    const [pets, setPets] = useState([]);
    const [isPetsLoading, setIsPetsLoading] = useState(true);
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
                    setPets(data.body.$values);
                    console.log(data.body);
                    setIsPetsLoading(false);
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
    },[]);
    return (
        <>
            <MembersTemplate>
                <div className="flex w-[100%] flex-col space-y-1 flex-wrap items-start">
                    <div className="flex-row flex w-[100%] items-center space-x-2">
                        <Link href="/account" title="Account">Home</Link>
                        <span className="separator"></span>
                        <span className="font-extrabold">My pets</span>
                    </div>
                    {isPetsLoading ? (
                        <>
                            <div className="flex block p-5 w-[100%] justify-center items-center">
                                <LoadingLoop/>
                            </div>
                        </>
                    ) : (
                        <>
                            <PetsComponent data={pets}/>
                        </>
                    )}
                </div>
            </MembersTemplate>
        </>
    )
}