import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function GET(request:NextRequest)
{
    try {
        const token = request.cookies.get("token")?.value;
        if(!token) {
            return new NextResponse.json({status: 401, body: "Unauthorized"}, {
                status: 401,
                statusText: "Unauthorized API access."
            });
        }
        const res = await fetchAuthorizedData("api/pets/get", token, "GET", null);
        const d = await res.data;
        return NextResponse.json({status: res.code, body: d}, {status: res.code, statusText: res.message});
    } catch(e) {
        console.error(e);
        return NextResponse.json({status: 500, body: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your request!"});
    }
}