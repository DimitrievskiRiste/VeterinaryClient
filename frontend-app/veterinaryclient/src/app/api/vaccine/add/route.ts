import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function POST(req:NextRequest)
{
    try {
        const token = req.cookies.get("token")?.value;
        if(!token) {
            return {status: 401, body: "Unauthorized"};
        }
        const data = await req.json();
        const res = await fetchAuthorizedData("api/vaccine/add", token, "POST", data);
        const d = await res.data;
        return NextResponse.json({status: res.code, body: d}, {status: res.code, statusText: res.message});
    } catch(e) {
        console.error(e);
        return NextResponse.json({status: 500, body: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your
    }
}