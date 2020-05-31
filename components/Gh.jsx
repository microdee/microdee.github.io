import React from 'react';

let GhOrigStyle = {
    position: "relative",
    opacity: 0,
    marginTop: 0
}
let GhMiddleStyle = {
    position: "absolute",
    top: 0, left: 0
}

export function Gh1(props)
{
    return (
        <div className={`glitch-${props.glitchType}`} style={{ position: "relative"}}>
            <h1 {...props} style={{...props.style, ...GhOrigStyle}}>
                {props.children}
            </h1>
            <h1 {...props} style={{...props.style, ...GhMiddleStyle}}>
                {props.children}
            </h1>
            <h1 {...props} className={`${props.className} before`}>
                {props.children}
            </h1>
            <h1 {...props} className={`${props.className} after`}>
                {props.children}
            </h1>
        </div>
    )
}

export function Gh2(props)
{
    return (
        <div className={`glitch-${props.glitchType}`} style={{ position: "relative"}}>
            <h2 {...props} style={{...props.style, ...GhOrigStyle}}>
                {props.children}
            </h2>
            <h2 {...props} style={{...props.style, ...GhMiddleStyle}}>
                {props.children}
            </h2>
            <h2 {...props} className={`${props.className} before`}>
                {props.children}
            </h2>
            <h2 {...props} className={`${props.className} after`}>
                {props.children}
            </h2>
        </div>
    )
}