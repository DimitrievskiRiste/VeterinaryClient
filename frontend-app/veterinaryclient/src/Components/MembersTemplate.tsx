"use client"
import {FC, memo, useEffect, useState} from "react";
import {BarsOutline, LoadingLoop} from "@/Components/Icons";
import Link from "next/link";

type MembersTemplate = {
    data:Function|null;
    [children:string]:any;
}
const MembersTemplate:FC<MembersTemplate> = memo(function MembersTemplate({data, children}) {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        async function getUser() {
            const res = await fetch("/api/user", {
                headers:{
                    "Content-Type":"application/json",
                    "Cache-Control":"private, max-age=600, must-revalidate"
                },
                method:"POST"
            });
            const d = await res.json();
            if(data && typeof data === "function"){
                data(d);
            }
            setUserData(d);
        }
        getUser();
    },[]);
    const [activeMobilenav, setActiveMobilenav] = useState(false);
    return (
        <>
            <div className="flex flex-col space-y-0 flex-wrap w-[100%]">
                <header className="flex flex-col w-[100%] flex-wrap items-center justify-center">
                    <nav className="flex flex-row flex-wrap items-start w-[100%] navigation space-x-1 p-5 fixed top-0 z-50">
                        <div className="flex flex-row w-[100%] space-x-1 flex-wrap items-center">
                            <div id="bars" className="flex md:hidden flex-row cursor-pointer p-5" onClick={() => {
                                setActiveMobilenav((prev) => !prev);
                            }}>
                                <BarsOutline/>
                            </div>
                            <h1 className="font-extrabold">Members area</h1>
                            <div className="hidden md:flex flex-row items-cener w-[80%] justify-center">
                                <div className="flex w-[50%] justify-center nav-inner">
                                    <input type="search" className="control-input w-[100%] rounded-md" placeholder="Search"/>
                                </div>
                            </div>
                        </div>
                        <aside className={activeMobilenav ? "flex mobile-nav fixed top-0 h-[100%] left-0 flex-col flex-wrap items-start w-[100%] space-y-1 md:w-[300px] fixed z-50" : "hidden flex mobile-nav flex-col flex-wrap items-start"}>
                            <div className="flex flex-row w-[100%] justify-end">
                                <span className="cursor-pointer p-5" onClick={() => {
                                    setActiveMobilenav((prev) => !prev);
                                }}>X</span>
                            </div>
                            <ul className="nav-links nav-inner">
                                <li className="nav-item">
                                    <Link href="/account/settings" title="Settings">Settings</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/account/pets" title="Pets">My pets</Link>
                                </li>
                                {userData?.group.isAdminGroup ? (
                                    <>
                                        <li className="nav-item">
                                            <Link href="/account/vaccines/add" className="nav-link" title="Add vaccine">Add vaccine</Link>
                                        </li>
                                    </>
                                ) : null}
                                <li className="nav-item">
                                    <Link href="/profile/logout" title="Logout">Logout</Link>
                                </li>
                            </ul>
                        </aside>
                    </nav>
                </header>
                <div className="flex flex-row w-[100%] flex-wrap items-start space-x-10 relative">
                    <aside className="hidden side-nav lg:flex space-y-1 flex-row flex-wrap items-start w-[300px] fixed  z-50 top-[5.5em] h-[100%]">
                        <div className="profile-info flex w-[100%] flex-col space-y-1 items-center">
                            {userData ? (
                                <>
                                    <div className="flex profile-username">
                                        <span className="text-[15px]">{userData.name}</span>
                                    </div>
                                    {userData.group.isAdminGroup ? <div className="admin-badge"></div> : <div className="user-badge"></div> }
                                </>
                            ) : (
                                    <LoadingLoop/>
                            )}
                        </div>
                        <ul className="nav-links flex flex-col flex-wrap items-start h-[100%] w-[100%] overflow-y-auto">
                            <li className="nav-item">
                                <Link href="/account/settings" className="nav-link" title="Settings">Settings</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/account/pets" className="nav-link" title="Pets">Pets</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/profile/logout" className="nav-link" title="Logout">Logout</Link>
                            </li>
                            {userData?.group.isAdminGroup ? (
                                <>
                                    <li className="nav-item">
                                        <Link href="/account/vaccines/add" className="nav-link" title="Add vaccine">Add vaccine</Link>
                                    </li>
                                </>
                            ) : null}
                        </ul>
                    </aside>
                    <div className="flex flex-col w-[100%] top-[6em] lg:ml-[20em] md:w-[100%] lg:w-[80%] lg:max-w-[80%] flex-wrap items-start absolute md:top-[5.5em]">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )});
export default MembersTemplate;