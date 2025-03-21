"use client";
import {useState} from "react";
import MembersTemplate from "@/Components/MembersTemplate";
import PetForm from "@/Components/PetForm";
import {LoadingLoop} from "@/Components/Icons";

export default function Account()
{
    const [userData, setUserData] = useState(null);
    console.log(userData);
    return (
            <>
                <MembersTemplate data={setUserData}>
                    {userData ? (
                        <>
                            <PetForm user={userData}></PetForm>
                        </>
                    ) : (
                        <>
                            <div className="flex w-[100%] block flex-col space-y-1 justify-center items-center">
                                <LoadingLoop/>
                            </div>
                        </>
                    )}
                </MembersTemplate>
            </>
    )
}