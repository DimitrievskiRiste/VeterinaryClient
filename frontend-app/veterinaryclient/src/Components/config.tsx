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
export async function fetchAuthorizedData(endpoint:string, jwtToken:string, method:string, data:object)
{
    const request = await fetch(`${apiUrl()}/${endpoint}`, {
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${jwtToken}`
        },
        method:method,
        body:JSON.stringify(data)
    });
    if(!request.ok){
        const errorMessage = request.statusText, code = request.status;
        return {
            hasErrors:true,
            message:errorMessage,
            code:code
        }
    } else {
        return request.json();
    }
}