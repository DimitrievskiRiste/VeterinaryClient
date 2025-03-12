"use client";
import {memo, useState} from "react";
const CookieNotice = dynamic(() => import("@/Components/CookieNotice"),{ssr:false});
import NavigationComponent from "@/Components/NavigationComponent";
import FooterComponent from "@/Components/FooterComponent";
import dynamic from "next/dynamic";
import Button from "@/Components/Button";
import {useRouter} from "next/navigation";
const HomePage = memo(function HomePage(){
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReg, setIsLoadingReg] = useState(false);
    const router = useRouter();
    const HandleLoginBtn = () => {
        setIsLoading(true);
        router.push("/profile/login");
    }
    const HandleRegisterBtn = () => {
        setIsLoadingReg(true);
        router.push("/profile/register");
    }
    return (
        <>
            <div className="flex flex-col space-y-1 w-[100%] flex-wrap">
                <CookieNotice/>
                <NavigationComponent activePage={1}/>
                <main className="main-content min-h-[400px] md:min-h-[700px] relative mb-auto w-[100%] flex flex-col justify-center md:items-center">
                    <div className="flex flex-col space-y-1 flex-wrap items-baseline p-10 w-[100%]" style={{zIndex: 1}}>
                        <section className="flex flex-col space-y-2 w-[100%] text-[16px] md:text-[20px]  justify-center items-center">
                            <h1 className="font-extrabold text-neutral-900 text-[20px] md:text-[25px] drop-shadow-lg">Welcome to our veterinary ambulance</h1>
                            <h2 className="font-extrabold text-neutral-900 text-[20px] md:text-[25px] drop-shadow-lg">Your pets deserve the best care, and at [Your Veterinary Ambulance Name], we’re committed to providing just that. Our dedicated team of experienced veterinarians and compassionate staff are here to ensure your furry friends receive the highest quality medical attention, whether it’s a routine check-up or an emergency situation.</h2>
                                <div className="flex flex-row flex-wrap items-start w-[100%] space-y-1 space-x-2 justify-center">
                                    <Button type="button" className="button-default min-w-[200px] justify-center items-center flex" label="Login to your account" disabled={isLoading} isLoading={isLoading} onClick={HandleLoginBtn}/>
                                    <Button type="button" isLoading={isLoadingReg} label="Create new account" className="button-primary min-w-[200px] flex justify-center items-center" onClick={HandleRegisterBtn}/>
                                </div>
                        </section>
                    </div>
                </main>
                <section className="flex flex-col flex-wrap items-start w-[100%] whychooseus">
                    <div className="flex w-[100%] flex-row justify-center">
                        <h2 className="font-extrabold text-neutral-900 text-[18px] md:text-[25px] drop-shadow-md">Why choose us?</h2>
                    </div>
                    <div className="flex flex-row space-x-2 items-start justify-center  flex-wrap relative space-y-1 w-[100%] p-10">
                        <section className="flex flex-row space-x-1 flex-wrap items-start relative max-w-[500px]">
                                <img src="/pets.jfif" width="200px" height="200px" title="24/7 emergency service"
                                     alt="24/7 emergency service"/>
                            <div className="flex relative max-w-[250px] flex-wrap items-center">
                                <h3 className="font-extrabold drop-shadow-sm">24/7 Emergency Service: We’re here for you
                                    and your pets around the clock, providing immediate care when it’s needed the
                                    most.</h3>
                            </div>
                        </section>
                        <section className="flex flex-row space-x-1 flex-wrap items-start relative max-w-[500px]">
                                <img src="/animals-care.jpg" width="200px" height="200px"
                                     title="Experienced Veterinarians: Our skilled team has years of experience and a genuine passion for animal health and well-being."
                                     alt="Experienced Veterinarians: Our skilled team has years of experience and a genuine passion for animal health and well-being."/>
                            <div className="flex flex-wrap max-w-[250px]">
                                <h3 className="font-extrabold drop-shadow-sm">Experienced Veterinarians: Our skilled
                                    team
                                    has years of experience and a genuine passion for animal health and well-being.</h3>
                            </div>
                        </section>
                        <section className="flex flex-row space-x-1 flex-wrap items-start relative max-w-[500px]">
                            <img src="/latest-tech.webp" width="200px" height="200px" title="State-of-the-Art Equipment: Equipped with the latest technology, we ensure accurate diagnoses and effective treatments."
                                 alt="State-of-the-Art Equipment: Equipped with the latest technology, we ensure accurate diagnoses and effective treatments."/>
                            <div className="flex flex-wrap relative max-w-[250px]">
                                <h3 className="font-extrabold drop-shadow-sm">State-of-the-Art Equipment: Equipped with
                                    the latest technology, we ensure accurate diagnoses and effective treatments.</h3>
                            </div>
                        </section>
                        <section className="flex flex-row space-x-1 flex-wrap items-start relative max-w-[500px]">
                        <img src="/pet-vaccinations.webp" width="200px" height="200px" title="Comprehensive Care: From emergency services to routine vaccinations, we offer a wide range of veterinary services to keep your pets healthy and happy."
                                 alt="Comprehensive Care: From emergency services to routine vaccinations, we offer a wide range of veterinary services to keep your pets healthy and happy."/>
                            <div className="flex flex-wrap relative max-w-[250px]">
                                <h3 className="font-extrabold drop-shadow-sm">Comprehensive Care: From emergency
                                    services to routine vaccinations, we offer a wide range of veterinary services to
                                    keep your pets healthy and happy.</h3>
                            </div>
                        </section>
                        <section className="flex flex-row space-x-1 flex-wrap items-start relative max-w-[500px]">
                            <img src="/petloving.jfif" width="200px" height="200px" title="Compassionate Approach: We treat your pets as if they were our own, with love, care, and respect." alt="Compassionate Approach: We treat your pets as if they were our own, with love, care, and respect."/>
                            <div className="flex flex-wrap relaive max-w-[250px]">
                                <h3 className="font-extrabold drop-shadow-sm">Compassionate Approach: We treat your pets
                                    as if they were our own, with love, care, and respect.</h3>
                            </div>
                        </section>
                        <section className="flex flex-row space-x-1 flex-wrap items-start relative max-w-[500px]">
                            <img src="/pet-management.jpg" width="200px" height="200px" title="Online Pet Management: Easily add your pets to our system and track their vaccination history and health records through our user-friendly online portal."
                                 alt="Online Pet Management: Easily add your pets to our system and track their vaccination history and health records through our user-friendly online portal."/>
                            <div className="flex flex-wrap relative max-w-[250px]">
                                <h3 className="font-extrabold drop-shadow-sm">Online Pet Management: Easily add your
                                    pets to our system and track their vaccination history and health records through
                                    our user-friendly online portal.</h3>
                            </div>
                        </section>
                    </div>
                </section>
                <div className="flex mt-1 flex-col space-y-1 w-[100%] flex-wrap relative items-start">
                <FooterComponent/>
                </div>
            </div>
        </>
    )
});
export default HomePage;