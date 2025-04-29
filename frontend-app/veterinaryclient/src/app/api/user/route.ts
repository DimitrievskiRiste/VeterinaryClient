import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";
import {cookies} from "next/headers";

export async function POST(req:NextRequest)
{
    try {
        const c= await cookies();
        const token = c.get("token")?.value;
        if(!token){
            console.log("[API] User is not authenticated. Missing token.");
            return NextResponse.redirect(new URL("/profile/login", req.url));
        }
        const res = await fetchAuthorizedData("api/user", token, "POST",null);
        switch(res.code)
        {
            case 200:
                const data = res.data;
                return NextResponse.json(data);
            case 401:
                console.log(res);
                return NextResponse.json(res);
            default:
                console.error(`Error in POST /api/user: ${res.message}`);
                return NextResponse.json({hasError:true, message:res.message});
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({hasError:true, message:"An error occurred while processing your request!"});
    }
}