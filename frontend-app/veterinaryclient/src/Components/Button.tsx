import {FC, memo} from "react";
import {LoadingLoop} from "@/Components/Icons";
type ButtonType = {
    type:string;
    isLoading:boolean;
    child:any;
    label:string;
    props:any;
    [key:string]:any;
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