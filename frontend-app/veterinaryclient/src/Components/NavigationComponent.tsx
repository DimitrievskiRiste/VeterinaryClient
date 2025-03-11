"use client";
import {useState} from "react";
import {BarsOutline} from "@/Components/Icons";
import Link from "next/link";

/**
 * To do when page is active set navigation item to selected. On both device.
 * @param activePage
 * @constructor
 */
export default function NavigationComponent({activePage}:{activePage:any})
{
    type PageNum = {
        activePage:any
    }
    const [page, setPage] = useState<PageNum>(activePage);
    return (
        <>
            <aside className="navigation flex flex-col flex-wrap w-[100%]">
                <div id="mobilenav" className="flex flex-col md:hidden lg:hidden flex-wrap">
                    <div className="nav-item">
                        <BarsOutline style={{fontSize:'24px', fontFamily:'Arial'}}/>
                    </div>
                </div>
                <div id="lgnav" className="flex-row items-center hidden md:flex lg:flex flex-wrap navigation space-x-1">
                    <div className="nav-item">
                        <Link href="/" title="Home page" className={page === 1 ? "nav-link nav-link-active" : "nav-link"}>Home</Link>
                    </div>
                    <div className="nav-item">
                        <Link href="#" title="Blog" className={page === 2 ? "nav-link nav-link-active" : "nav-link"}>Blog</Link>
                    </div>
                </div>
            </aside>
        </>
    )
}