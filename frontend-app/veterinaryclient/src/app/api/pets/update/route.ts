import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function POST(re:NextRequest)
{
    try {
        const data = await re.json();
        const token = re.cookies.get("token")?.value;
        if(!token) {
            return NextResponse.json({status: 401, body: "Unauthorized"},{status:401, statusText: "Unauthorized API access."});
        }
        const apiRequest = await fetchAuthorizedData("api/pets/update", token, "POST", data);
        const apiResponse = await apiRequest.data;
        return NextResponse.json({status: apiRequest.code, body: apiResponse}, {status: apiRequest.code, statusText: apiRequest.message});
    } catch(e) {
        return NextResponse.json({status: 500, body: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your request!"});
    }
}