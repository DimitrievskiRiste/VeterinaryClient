import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function POST(req:NextRequest)
{
    try {
        const token = req.cookies.get("token")?.value;
        const data = await req.json();
        if(!token) {
            return NextResponse.json({status: 401, message: "Unauthorized"},{status: 401, statusText: "Unauthorized API access."});
        }
        if(!data) {
            return NextResponse.json({status: 400, message: "Bad Request"},{status: 400, statusText: "Bad Request"});
        }
        if(!data.PetId) {
            return NextResponse.json({status: 400, message: "PetId is required"},{status: 400, statusText: "Bad Request"});
        }
        if(!data.VaccineId) {
            return NextResponse.json({status: 400, message: "VaccineId is required"},{status: 400, statusText: "Bad Request"});
        }
        if(!data.DateAdded) {
            return NextResponse.json({status: 400, message: "Date is required"},{status: 400, statusText: "Bad Request"});
        }
        const apiReq = await fetchAuthorizedData("api/PetVaccines/add", token, "POST", data);
        if(apiReq.code !== 200) {
            return NextResponse.json({status: apiReq.code, message: apiReq.message},{status: apiReq.code, statusText: apiReq.message});
        }
        const petVaccine = apiReq.data;
        if(!petVaccine) {
            return NextResponse.json({status: 404, message: "Pet vaccine not found"},{status: 404, statusText: "Pet vaccine not found"});
        }
        return NextResponse.json({status: 200, message:petVaccine.message, data: petVaccine.pet},{status: 200, statusText: "Pet vaccine added successfully"});
    } catch(e) {
        console.error(e);
        return NextResponse.json({status: 500, message: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your request!"});
    }
}