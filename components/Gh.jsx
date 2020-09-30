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

        let hoverSuffix = props.onlyhover ? "-hover" : "";
        let idattr = props.id ? { id: props.id } : {};

        let hprops = {...props};
        try {
            delete hprops.glitchtype;
        } catch (error) {
        }
        try {
            delete hprops.onlyhover;
        } catch (error) {
        }

        return (
            <div {...idattr} className={`glitch-${props.glitchtype}${hoverSuffix}`} style={{ position: "relative"}}>
                <h1 {...hprops} style={{...props.style, ...GhOrigStyle}}>
                    {props.children}
                </h1>
                <h1 {...hprops} style={{...props.style, ...GhMiddleStyle}}>
                    {props.children}
                </h1>
                <h1 {...hprops} className={`${props.className} before`}>
                    {props.children}
                </h1>
                <h1 {...hprops} className={`${props.className} after`}>
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
        
        let hoverSuffix = props.onlyhover ? "-hover" : "";
        let idattr = props.id ? { id: props.id } : {};

        let hprops = {...props};
        try {
            delete hprops.glitchtype;
        } catch (error) {
        }
        try {
            delete hprops.onlyhover;
        } catch (error) {
        }

        return (
            <div {...idattr} className={`glitch-${props.glitchtype}${hoverSuffix}`} style={{ position: "relative"}}>
                <h2 {...hprops} style={{...props.style, ...GhOrigStyle}}>
                    {props.children}
                </h2>
                <h2 {...hprops} style={{...props.style, ...GhMiddleStyle}}>
                    {props.children}
                </h2>
                <h2 {...hprops} className={`${props.className} before`}>
                    {props.children}
                </h2>
                <h2 {...hprops} className={`${props.className} after`}>
                    {props.children}
                </h2>
            </div>
        )
    }
}