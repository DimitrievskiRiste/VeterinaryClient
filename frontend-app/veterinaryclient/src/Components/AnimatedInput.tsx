"use client"
import {FC, memo, useEffect, useRef, useState} from "react";
type AnimatedInputProps = {
    type: string | null;
    label: string | null;
    name: string;
    value?: string;
    className?: string;
    labelRef:any;
    inputRef:any;
    ref:string|null;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any; // Allow additional props
};
const AnimatedInput:FC<AnimatedInputProps> = memo(function AnimatedInput({type, label, labelRef, inputRef, children, ...props})
{
    const [inputType] = useState(type);
    const [inputLabel] = useState(label);
    if(!labelRef){
        labelRef = useRef(null);
    }
    if(!inputRef){
        inputRef = useRef(null);
    }
    const HandleTransformAnim = (e) => {
        labelRef.current.classList.add('anim-label');
    }
    useEffect(() => {
        if(inputRef.current?.value?.length > 0 || inputRef.current?.value?.length == "") {
            labelRef.current.classList.add('anim-label');
        }
    }, [inputRef.current]);
    return (
        <>
            <div className="control-group w-[100%]">
                <label ref={labelRef} className={type === "date" ? "control-label anim-label" : "control-label"} onMouseEnter={HandleTransformAnim} onClick={HandleTransformAnim} >{inputLabel}</label>
                {type === "select" ? (
                    <select  name={props.name} {...props} onMouseEnter={HandleTransformAnim} onClick={HandleTransformAnim} ref={inputRef}>
                        {children}
                    </select>
                ) : (
                <input ref={inputRef} type={inputType} onMouseEnter={HandleTransformAnim} onFocus={HandleTransformAnim} onClick={HandleTransformAnim}  {...props}/>
                )}
            </div>
        </>
    )
},(prevProps, nextProps) => {
    return (
        prevProps.type === nextProps.type &&
        prevProps.label === nextProps.label &&
        prevProps.name === nextProps.name &&
        prevProps.value === nextProps.value &&
        prevProps.className === nextProps.className &&
        prevProps.onChange === nextProps.onChange &&
        prevProps.children === nextProps.children
    );
});
export default AnimatedInput;