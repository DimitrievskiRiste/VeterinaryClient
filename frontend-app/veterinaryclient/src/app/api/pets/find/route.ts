import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function GET(req:NextRequest)
{
    const token = req.cookies.get("token")?.value;
    const petid = req.nextUrl.searchParams.get("id");
    if(!token) {
        return NextResponse.json({status: 401, message: "Unauthorized"},{status: 401, statusText: "Unauthorized API access."});
    }
    const apiReq = await fetchAuthorizedData(`api/Pets/find/?PetId=${petid}`, token, "GET", null);
    if(apiReq.code !== 200) {
        return NextResponse.json({status: apiReq.code, message: apiReq.message},{status: apiReq.code, statusText: apiReq.message});
    }
    const pet = apiReq.data;
    if(!pet) {
        return NextResponse.json({status: 404, message: "Pet not found"},{status: 404, statusText: "Pet not found"});
    }
    return NextResponse.json({status: 200, data: pet},{status: 200, statusText: "Pet found"});
}