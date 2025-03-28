import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";


export async function GET(req:NextRequest)
{
    try {
        const token = req.cookies.get("token")?.value;
        if(!token){
            console.log("[API] User is not authenticated. Missing token.");
            return NextResponse.json({status:401, message:"Unauthorized"},{status:401, statusText:"Unauthorized API access."});
        }
        const query = req.nextUrl.searchParams;
        const id = query.get("id");
        if(!id) {
            return NextResponse.json({status: 400, body: "Bad Request"}, {status: 400, statusText: "Bad Request"});
        }
        const res = await fetchAuthorizedData(`api/vaccines/get?PetId=${id}`, token, "GET", null);
        switch(res.code)
        {
            case 200:
                const data = await res.data;
                return NextResponse.json(data.value);
            case 401:
                console.log(res);
                return NextResponse.json(res);
            case 404:
                console.log(res);
                return NextResponse.json(res);
            default:
                console.error(`Error in GET /api/vaccine/get: ${res.message}`);
                return NextResponse.json({status: res.code, body: res.message}, {status: res.code, statusText: res.message});
        }
    } catch (e){
        console.error(e);
        return NextResponse.json({status: 500, body: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your request!"});
    }
}