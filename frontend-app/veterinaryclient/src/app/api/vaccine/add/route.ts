import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";

export async function POST(req:NextRequest)
{
    async function getVaccine(token, data){
        const res = await fetchAuthorizedData("api/vaccines/add", token, "POST", data);
        return res;
    }
    async function addPetVaccine(token, data){
        const res = await fetchAuthorizedData("api/PetVaccines/add", token, "POST", data);
        return res;
    }
    try {
        const token = req.cookies.get("token")?.value;
        if(!token) {
            return {status: 401, body: "Unauthorized"};
        }
        const data = await req.json();
        const vaccine = await getVaccine(token, data);
        if(vaccine.code !== 200) {
            console.log("Vaccine cant be added");
            return NextResponse.json({status: vaccine.code, body: vaccine.message},{status: vaccine.code, statusText: vaccine.message});
        }
        console.log(data);
        data.VaccineId = vaccine.data?.vaccine.vaccineId;
        const petdata = {};
        petdata.VaccineId = parseInt(data.VaccineId);
        petdata.PetId = parseInt(data.PetId);
        petdata.DateAdded = data.DateAdded;
        const petvaccine = await addPetVaccine(token, petdata);
        console.log(petvaccine);
        if(petvaccine.code !== 200) {
            return NextResponse.json({status: petvaccine.code, body: petvaccine.message},{status: petvaccine.code, statusText: petvaccine.message});
        }
        return NextResponse.json({status: vaccine.code, body: petvaccine.data},{status: vaccine.code, statusText: "Vaccine added successfully!"});
    } catch(e) {
        console.error(e);
        return NextResponse.json({status: 500, body: "An error occurred while processing your request!"},{status: 500, statusText: "An error occurred while processing your request!"});
    }
}