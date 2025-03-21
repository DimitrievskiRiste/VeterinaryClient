import {NextRequest, NextResponse} from "next/server";
import fs from "fs";
import {fetchAuthorizedData} from "@/Components/config";
import {fileTypeFromBuffer} from "file-type";
import {use} from "react";
export async function POST(req:NextRequest)
{
    try {
        const token = req.cookies.get("token")?.value;
        if(!token){
            return new NextResponse.json({status:401, body:"Unauthorized"},{status:401, statusText:"Unauthorized API access."});
        }
        const form = await req.formData();
        const file = form.get("avatar") as File;
        const userId = form.get("userId") as string;
        if(!file || !userId){
            return NextResponse.json({status:400, body:"No file was uploaded!"},{status:400, statusText:"No file was uploaded!"});
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const filetype = await fileTypeFromBuffer(buffer);
        if(!filetype){
            return NextResponse.json({status:400, body:"Invalid file type!"},{status:400, statusText:"Invalid file type!"});
        }
        const mime = filetype.mime;
        switch(mime){
            case "image/jpeg":
            case "image/png":
                const name = generateRandomName();
                const ext = filetype.ext;
                const size = file.size;
                const avatarPath = `public/avatars/${userId}/${name}.${ext}`;
                if(!fs.existsSync("public/avatars")) {
                    fs.mkdirSync("public/avatars");
                    if (!fs.existsSync(`public/avatars/${userId}`)) {
                        fs.mkdirSync(`public/avatars/${userId}`);
                    }
                }
                const publicAvatar = `/avatars/${userId}/${name}.${ext}`;
                fs.writeFileSync(avatarPath, buffer);
                const e = {
                    Name:name,
                    UserId:userId,
                    ImagePath:publicAvatar,
                    ImageSize:size,
                    MimeType:mime,
                    Extension:ext
                }
                const res = await fetchAuthorizedData("api/avatars/add", token, "POST", e);
                const d = await res.data;
                return NextResponse.json({status:res.code, body:d},{status:res.code, statusText:res.message});
            default:
                return NextResponse.json({status:400, body:"Invalid file type!"},{status:400, statusText:"Invalid file type!"});
        }
    } catch (e){
        console.error(e);
        return new NextResponse({status:500, body:"An error occurred while processing your request!"});
    }
}
function generateRandomName():string
{
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let name = "";
    for(let i = 0; i < 10; i++){
        name += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return name;
}