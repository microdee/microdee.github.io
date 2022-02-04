import React from 'react';
import ParallaxEffect from './parallax';

export default class MdFullParallaxWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parallax: new ParallaxEffect()
        };
        this.mainDiv = React.createRef();
        this.mainContent = React.createRef();
    }
    componentDidMount() {
        this.state.parallax.register(this.mainContent.current);
    }

    render() {
        let blurredChildren = React.cloneElement(
            this.props.children,
            {
                ...this.props.children.props,
                style: {
                    position: "absolute",
                    filter: "blur(40px)"
                }
            }
        );
        return (
            <div ref={this.mainDiv} className="md-full" style={{
                backgroundColor: "black",
            }} >
                {blurredChildren}
                <div ref={this.mainContent}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}