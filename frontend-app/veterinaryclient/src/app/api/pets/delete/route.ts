import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function POST(req:NextRequest){
    const token = req.cookies.get("token")?.value;
    if(!token){
        return NextResponse.json({status:401, message:"Unauthorized"},{status:401, statusText:"Unauthorized API access."});
    }
    const body = await req.json();
    const apiReq = await fetchAuthorizedData("api/Pets/delete", token, "POST", body);
    if(apiReq.code !== 200){
        return NextResponse.json({status:apiReq.code, message:apiReq.message},{status:apiReq.code, statusText:apiReq.message});
    }
    const data = apiReq.data;
    if(!data){
        return NextResponse.json({status:404, message:"Pet not found"},{status:404, statusText:"Pet not found"});
    }
    return NextResponse.json({status:200, message:"Pet deleted successfully"},{status:200, statusText:"Pet deleted successfully"});
}