import {NextRequest, NextResponse} from "next/server";
import {fetchAuthorizedData} from "@/Components/config";


export async function GET(req:NextRequest)
{
    try {
        const token = req.cookies.get("token")?.value;
        if(!token){
            console.log("[API] User is not authenticated. Missing token.");
            return NextResponse.json({hasError:true, message:"Unauthorized API access."},{status:401, statusText:"Unauthorized API access."});
        }
        const res = await fetchAuthorizedData("api/users/all", token, "GET", null);
        switch(res.code)
        {
            case 200:
                const data = await res.data;
                return NextResponse.json(data.value);
            case 401:
                console.log(res);
                return NextResponse.json(res);
            default:
                console.error(`Error in GET /api/users/all: ${res.message}`);
                return NextResponse.json({hasError:true, message:res.message}, {status:res.code, statusText:res.message});
        }
    } catch(e){
        console.error(e);
        return NextResponse.json({hasError:true, message:"An error occurred while processing your request!"},{status:500, statusText:"An error occurred while processing your request!"});
    }
}