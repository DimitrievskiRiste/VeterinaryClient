import axios from "axios";

/**
 * @returns API Backend URL
 */
export const apiUrl = () => {
    return 'http://localhost:5207'
}

/**
 *
 * @param endpoint
 * @param method
 * @param data
 * @returns API response data from the server
 */
export async function sendData(endpoint:string, method:string, data:object){
    try {
        const request = await axios(`${apiUrl()}/${endpoint}`,{
            headers:{
                "Content-Type":"application/json",
                "User-Agent":"Mozilla/5.0"
            },
            method:method,
            data:JSON.stringify(data)
        });
        if(!request.data)
        {
            const errors = request.statusText;
            return {
                hasErrors:true,
                message:errors
            }
        } else {
            return request.data;
        }
    } catch(error) {
        console.error("Error in sendData:", error.response?.data || error.message);
        return {
            hasErrors:true,
            message:"An error occurred while processing your request!"
        }
    }
}

/**
 *
 * @param endpoint
 * @param jwtToken
 * @param method
 * @param data
 * @returns Error message or JSON data if successfully
 */
export async function fetchAuthorizedData(endpoint:string, jwtToken:any, method:string, data:object|null, cacheTtl = 300)
{
    var request;
    if(data){
        request = await fetch(`${apiUrl()}/${endpoint}`, {
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+jwtToken,
                "Cache-Control":`private, max-age=${cacheTtl}, must-revalidate`
            },
            method:method,
            body:JSON.stringify(data)
        });
    } else {
        request = await fetch(`${apiUrl()}/${endpoint}`, {
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${jwtToken}`
            },
            method:method,
        });
    }
    switch(request.status)
    {
        case 200:
            return {
                hasErrors: false,
                data: request.json(),
                code: request.status
            }
        default:
            return {
                hasErrors:true,
                message:request.statusText,
                code:request.status,
                request:request,
                headers:request.headers.entries()
            }
    }
}