import {FC, memo} from "react";
import {LoadingLoop} from "@/Components/Icons";
type ButtonType = {
    type:string;
    isLoading:boolean|string;
    child:string|null;
    label:string;
    props:string|null;
    [key:string]:string|null;
}
const Button :FC<ButtonType> =  memo(function Button({type, isLoading, child, label, ...props}){
    return (
        <>
            <button type={type} disabled={isLoading} {...props}>
                <>
                    {isLoading ? (
                        <>
                            <LoadingLoop/>
                        </>
                    ) : (
                        <>
                            {label}
                        </>
                    )}
                </>
            </button>
        </>
    )
});
export default Button;