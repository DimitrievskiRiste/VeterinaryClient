"use client"
import {FC, memo, useRef, useState} from "react";
type AnimatedInputProps = {
    type: string | null;
    label: string | null;
    name: string;
    value?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any; // Allow additional props
};
const AnimatedInput:FC<AnimatedInputProps> = memo(function AnimatedInput({type, label, ...props})
{
    const [inputType] = useState(type);
    const [inputLabel] = useState(label);
    const inputRef = useRef(null);
    const labelRef = useRef(null);
    const HandleTransformAnim = (e) => {
        labelRef.current.classList.add('anim-label');
    }
    return (
        <>
            <div className="control-group">
                <label ref={labelRef} className="control-label" onMouseEnter={HandleTransformAnim} onClick={HandleTransformAnim} >{inputLabel}</label>
                <input ref={inputRef} type={inputType} onMouseEnter={HandleTransformAnim} onFocus={HandleTransformAnim} onClick={HandleTransformAnim}  {...props}/>
            </div>
        </>
    )
});
export default AnimatedInput;