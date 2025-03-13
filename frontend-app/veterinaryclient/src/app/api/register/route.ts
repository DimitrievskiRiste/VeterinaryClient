import {NextApiRequest, NextApiResponse} from "next";
import {NextRequest, NextResponse} from "next/server";
import {sendData} from "@/Components/config";

export async function GET(req:NextRequest){
    return NextResponse.json({message:"Hello, world!"});
}
export async function POST(req:NextRequest){
    const formData = await req.json();
    const res = await sendData("api/login/register", "POST", formData);
    console.log(res);
    return NextResponse.json(res);
}