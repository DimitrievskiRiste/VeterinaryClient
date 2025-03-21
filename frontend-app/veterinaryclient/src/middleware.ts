import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData, sendData} from "@/Components/config";

async function getData(req:NextRequest){
    try {
        const token = req.cookies.get("token")?.value;
        if(!token){
            return false;
        }
        const res = await fetchAuthorizedData("api/user/", token, "POST", null);
        switch(res.code)
        {
            case 200:
                return true;
            case 401:
                return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}
export async function middleware(request:NextRequest)
{

    console.log(`[MIDDLEWARE] ${request.method} ${request.nextUrl.pathname}`);
    if(request.method === "GET" && request.nextUrl.pathname.startsWith("/install"))
    {
        console.log("[GET] /install");
        console.log("[API] Checking if the application is installed...");
        const req = await sendData("api/installer/step1", "GET");
        console.log(req);
        switch(req.isInstalled)
        {
            case true:
                console.log("[API] Application is installed.");
                return NextResponse.redirect(new URL("/profile/login", request.url));
            case false:
                console.log("[API] Application is not installed.");
                return;
        }
    }
    const parsedUrl = new URL(request.url); // Parse the full URL
    const path = parsedUrl.pathname;
    console.log(`[MIDDLEWARE] ${request.method} ${path}`);
    if(request.method === "GET" && path.match(new RegExp("^\/$")))
    {
        console.log(`[GET] Triggered / route}`);
        console.log("[API] Checking if user is authenticated...");
        const r = await getData(request);
        if(!r){
            console.log("[API] User is not authenticated.");
        } else {
            console.log("[API] User is authenticated. Proceeding to /account");
            return NextResponse.redirect(new URL("/account", request.url));
        }
    }
    if(path.match(new RegExp("^/account(/.*)?$")))
    {
        console.log(`[GET] Triggered /account route}`);
        console.log("[API] Checking if user is authenticated...");
        const r = await getData(request);
        if(!r){
            console.log("[API] User is not authenticated. Redirecting to /profile/login");
            return NextResponse.redirect(new URL("/profile/login", request.url));
        }
        console.log("[API] User is authenticated. Proceeding to /account");
    }
}
export const config = {
    matcher:['/:path*']
}