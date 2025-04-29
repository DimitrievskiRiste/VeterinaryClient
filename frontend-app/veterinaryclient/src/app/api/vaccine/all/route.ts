import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function GET(req:NextRequest){
    const token = req.cookies.get("token")?.value;
    if(!token){
        return NextResponse.json({status:401, message:"Unauthorized"},{status:401, statusText:"Unauthorized API access."});
    }
    const data = await fetchAuthorizedData("api/Vaccines/all",token,"GET",null);
    if(data.code !== 200){
        return NextResponse.json({status:data.code, message:data.message},{status:data.code, statusText:data.message});
    }
    const vaccines = data.data;
    if(vaccines.length < 1){
        return NextResponse.json({status:200, message:"No vaccines found"},{status:200, statusText:"No vaccines found"});
    }
    return NextResponse.json({status:200,data:vaccines},{status:200, statusText:"Vaccines found"});
}