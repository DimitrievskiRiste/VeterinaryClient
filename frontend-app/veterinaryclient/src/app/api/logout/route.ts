import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function POST(req:NextRequest){
    const token = await cookies();
    if(token.get("token")){
        token.delete("token");
    }
    return NextResponse.json({message:"You have been logged out!", isLoggedOut:true});
}