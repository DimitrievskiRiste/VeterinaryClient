"use client"
import {useRef, useState} from "react";

export default function AnimatedInput({type, label, ...props}:{type:string, label:string, props:any})
{
    const [inputType, setInputType] = useState(type);
    const [inputLabel, setInputLabel] = useState(label);
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
}