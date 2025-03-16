import {NextRequest, NextResponse} from "next/server";
import {sendData} from "@/Components/config";

export async function GET(req:NextRequest){
    const request = await sendData("api/installer", "GET");
    const data = request.data;
    if(request.hasErrors)
    {
        return NextResponse.json({hasErrors:true, message:request.message});
    } else {
        return NextResponse.json({groupsCreated:true});
    }

}