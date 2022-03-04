import React from 'react';
import ParallaxEffect from './parallax';
import mcrodeLogo from '../mcrode.logo.webm'

export default class Logo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parallax: new ParallaxEffect()
        };
        this.mainDiv = React.createRef();
    }

    componentDidMount() {
        this.state.parallax.register(this.mainDiv.current);
    }

    render() {
        let divcontainerStyle = {
            height: "100%"
        };
        return this.props.useShaderToy ? (
            <div className="logo shadertoy">
                <div className="pleaseScroll">
                    <div className="indicator">
                    </div>
                </div>
                <div ref={this.mainDiv} style={divcontainerStyle}>
                    <iframe
                        className="logo shadertoy"
                        width="100%"
                        height="107%"
                        frameborder="0"
                        src="https://www.shadertoy.com/embed/WlXcDH?gui=false&t=10&paused=false&muted=true"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        ) : (
            <div className="logo">
                <div className="pleaseScroll">
                    <div className="indicator">
                    </div>
                </div>
                <div ref={this.mainDiv} style={divcontainerStyle}>
                    <video loop muted autoPlay>
                        <source src={mcrodeLogo} type="video/webm" />
                    </video>
                </div>
            </div>
        );
    }
}