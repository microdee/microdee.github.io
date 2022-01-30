import React from 'react';

export default class MainScrollbar extends React.Component {
    constructor(props) {
        super(props);
        this.prevOffsTop = 0;
        this.prevHeight = 0;
        this.firstScrollFrame = false;
    }
    componentDidMount() {
        let pageRoot = document.getElementById("root");
        let root = document.getElementById("appRoot");
        this.mainDiv = document.createElement("div");
        document.querySelector("body").appendChild(this.mainDiv);
        this.mainDiv.classList.add("mainScrollbar");
        this.mainDiv.style.position = "fixed";
        this.mainDiv.style.right = "0px";
        this.mainDiv.style.width = "11px";
        this.mainDiv.style.backgroundColor = "white";
        this.mainDiv.style.minHeight = "50px";
        let opacityTrans = "opacity 2s ease-in-out";

        pageRoot.addEventListener('scroll', ((el, ev) => {
            this.mainDiv.style.transition = "none";
            this.firstScrollFrame = true;
        }).bind(this));
        

        let animBody = (timestamp => {
            let rootBounds = root.getBoundingClientRect();
            let offsetTop = rootBounds.top * -1;
            let scrollDelta = offsetTop - this.prevOffsTop;
            let moved = scrollDelta == 0;
            let resized = this.prevHeight != rootBounds.height;
            let notScrollable = rootBounds.height < window.innerHeight;
            this.prevOffsTop = offsetTop;
            
            if(resized) {
                this.mainDiv.style.transition = "none";
                this.firstScrollFrame = true;
            }
            this.prevHeight = rootBounds.height;

            if((notScrollable || moved) && !this.firstScrollFrame) {
                this.mainDiv.classList.add("hidden");
            }
            else {
                this.mainDiv.classList.remove("hidden");

                let mdivH = (window.innerHeight / rootBounds.height) * window.innerHeight;
                let mdivT = (offsetTop / rootBounds.height) * (window.innerHeight);
                this.mainDiv.style.height = `${mdivH}px`;
                this.mainDiv.style.top = `${mdivT}px`;
            }
            if(this.firstScrollFrame) {
                this.firstScrollFrame = false;
            }
            else {
                this.mainDiv.style.transition = opacityTrans;
            }
            window.requestAnimationFrame(animBody);
        }).bind(this);

        window.requestAnimationFrame(animBody);
    }

    componentWillUnmount() {
        if('mainDiv' in this)
        {
            document.querySelector("body").removeChild(this.mainDiv);
        }
    }

    render() {
        return (
            <div></div>
        )
    }
}