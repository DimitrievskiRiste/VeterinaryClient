import {NextRequest, NextResponse} from "next/server";
import {sendData} from "@/Components/config";


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
}
export const config = {
    matcher:['/install/:path*']
}