"use client";
import NavigationComponent from "@/Components/NavigationComponent";
import Link from "next/link";
import FooterComponent from "@/Components/FooterComponent";
import Button from "@/Components/Button";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {LoadingLoop} from "@/Components/Icons";

export default function Logout()
{
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const HandleRedirect = () => {
        setIsLoading(true);
        router.push("/");
    }
    useEffect(() => {
        async function LogOut() {
            const res = await fetch("/api/logout", {
                method:"POST"
            });
            const data = await res.json();
            if(data.hasErrors){
                alert("An error occured while logging out.");
            } else {
                setIsLoading(false);
            }
        }
        LogOut();
    },[]);
    return (
        <>
            <div className="flex w-[100%] flex-col flex-wrap items-start space-y-1">
                <NavigationComponent/>
                <div className="flex flex-col space-y-1 w-[100%] flex-wrap min-h-[700px] justify-center relative content-center items-center">
                    <div className="flex flex-row w-[100%] flex-wrap space-x-1 items-center p-5">
                        <Link href="/" title="Home page">Home</Link>
                        <span className="separator"></span>
                        <Link href="/profile/logout" title="Logout">Logout</Link>
                    </div>
                    <section className="block p-5 flex flex-col space-y-1 w-[80%] md:w-[50%] flex-wrap justify-center">
                        <h1 className="font-extrabold text-center">{isLoading ? "Logging you out, please wait" : "Logout successflly"}</h1>
                        {isLoading ? (
                            <>
                                <div className="flex flex-row w-[100%] justify-center">
                                    <LoadingLoop className="text-[20px] text-center"/>
                                </div>
                            </>
                        ) : (
                            <p>You have been successfully logged out.</p>
                        )}
                        <div className="flex flex-row space-x-1 justify-center w-[100%]">
                            <Button type="button" label="Go to Home" isLoading={isLoading} className="button-primary flex justify-center min-w-[200px]"
                                    onClick={HandleRedirect}/>
                        </div>
                    </section>
                </div>
                <div className="flex relative flex-wrap w-[100%]">
                    <FooterComponent/>
                </div>
            </div>
        </>
    )
}