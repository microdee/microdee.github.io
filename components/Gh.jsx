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

export class Gh1 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            props,
        } = this;

        let hoverSuffix = props.onlyHover ? "-hover" : "";
        let idattr = props.id ? { id: props.id } : {};

        return (
            <div {...idattr} className={`glitch-${props.glitchType}${hoverSuffix}`} style={{ position: "relative"}}>
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
}

export class Gh2 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            props,
        } = this;
        
        let hoverSuffix = props.onlyHover ? "-hover" : "";
        let idattr = props.id ? { id: props.id } : {};

        return (
            <div {...idattr} className={`glitch-${props.glitchType}${hoverSuffix}`} style={{ position: "relative"}}>
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
}