import {NextRequest, NextResponse} from "next/server";
import {sendData} from "@/Components/config";
import {cookies} from "next/headers";

export async function POST(req:NextRequest)
{
    try {
        const formData = await req.json();
        const res = await sendData("api/login/", "POST", formData);
        if(!res.isLoggedIn){
            return NextResponse.json({hasError:true, message:"Invalid email or password"});
        } else {
            const c = await cookies();
            c.set({
                name:"token",
                value:res.token,
                maxAge:3600,
                path:"/",
                sameSite:"Strict",
                httpOnly:false,
                secure:process.env.NODE_ENV !== "development"
            });
            return NextResponse.json({isLoggedIn:true});
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({hasError:true, message:"An error occurred while processing your request!"});
    }
}