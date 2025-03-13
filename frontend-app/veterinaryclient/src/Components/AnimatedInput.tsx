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
    const HandleBackAnim = (e) => {
        if(e.target.value === undefined){
            return;
        }
        if(!e.target.value){
            labelRef.current.classList.add('animLabelOff');
            labelRef.current.classList.remove('anim-label');
        }
    }
    return (
        <>
            <div className="control-group">
                <label ref={labelRef} className="control-label" onMouseEnter={HandleTransformAnim} onMouseLeave={HandleBackAnim}>{inputLabel}</label>
                <input ref={inputRef} type={inputType} onMouseEnter={HandleTransformAnim} onMouseLeave={HandleBackAnim} {...props}/>
            </div>
        </>
    )
});
export default AnimatedInput;