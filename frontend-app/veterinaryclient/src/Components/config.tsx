type ApiConfig = {
    token:string
}
/**
 * @returns API Backend URL
 */
export const apiUrl = () => {
    return 'http://localhost:4000'
}

/**
 *
 * @param endpoint
 * @param method
 * @param data
 * @returns API response data from the server
 */
export async function sendData(endpoint:string, method:string, data:object){
    const request = await fetch(apiUrl+endpoint,{
        headers:{
            "Content-Type":"application/json"
        },
        method:method,
        credentials:"include",
        body:JSON.stringify(data)
    });
    if(!request.ok)
    {
        const errors = request.statusText;
        return {
            hasErrors:true,
            message:errors
        }
    } else {
        return request.json();
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
    const request = await fetch(apiUrl+endpoint, {
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