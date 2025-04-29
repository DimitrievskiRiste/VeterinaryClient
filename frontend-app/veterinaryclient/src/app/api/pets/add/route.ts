import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function POST(req:NextRequest)
{
    try {
        const token = req.cookies.get("token")?.value;
        if(!token) {
            return NextResponse.json({status: 401, body: "Unauthorized"}, {
                status: 401,
                statusText: "Unauthorized API access."
            });
        }
        const data = await req.json();
        const res = await fetchAuthorizedData("api/pets/add", token, "POST", data);
        const d = await res.data;
        console.log(d);
        return NextResponse.json({status: res.code, body: d}, {status: res.code, statusText: res.message});
    } catch(e) {
        console.error(e);
        return NextResponse.json({status: 500, body: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your request!"});
    }
}