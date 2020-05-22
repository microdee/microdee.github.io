import React, { PureComponent } from "react";

export default class IframeWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 200,
            height: 0,
            pos: 0
        }
    }

    getAppDomNode() {
        return document.getElementById("appRoot");
    }

    handleResize() {
        let aspect = 0;
        if(this.props.height) {
            aspect = this.props.height / this.props.width;
        }
        if(this.props.full) {
            this.setState({
                width: window.innerWidth,
                height: window.innerWidth * aspect,
                pos: -this.getAppDomNode().offsetLeft
            });
        } else {
            this.setState({
                width: this.getAppDomNode().clientWidth,
                height: this.getAppDomNode().clientWidth * aspect, 
                pos: 0
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }
    
    render() {
        let iframeProps = {...this.props};
        iframeProps.width = this.state.width;
        if(this.state.height)
            iframeProps.height = this.state.height;
        
        return (
            <iframe
                {...iframeProps }
                style={{
                    position: 'relative',
                    left: this.state.pos
                }}
            />
        );
    }
}