
import {NextRequest, NextResponse} from "next/server";
import {sendData} from "@/Components/config";

export async function GET(req:NextRequest){
    return NextResponse.json({message:"Hello, world!"});
}
export async function POST(req:NextRequest){
    try {
        const formData = await req.json();
        const res = await sendData("api/register/", "POST", formData);
        return NextResponse.json(res);
    } catch (e) {
        console.error(e);
        return NextResponse.json({hasError:true, message:"An error occurred while processing your request!"});
    }
}