import React from 'react';
import ParallaxEffect from './parallax';

export default class MdImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parallax: new ParallaxEffect()
        };
        this.mainDiv = React.createRef();
        this.mainImg = React.createRef();
    }
    componentDidMount() {
        let alt = 'alt' in this.props ? this.props.alt : "";
        let isParallax = alt.search("md.parallax") >= 0;
        let isFull = alt.search("md.full") >= 0;

        if(isParallax || isFull)
            this.state.parallax.register(this.mainImg.current);
    }

    render() {
        let alt = 'alt' in this.props ? this.props.alt : "";
        if(alt.search("md.full") >= 0)
        {
            return (
                <div ref={this.mainDiv} className="md-full" style={{
                    backgroundColor: "black",
                }} >
                    <img {...this.props} style={{
                        position: "absolute",
                        filter: "blur(40px)"
                    }} />
                    <img ref={this.mainImg} {...this.props} />
                </div>
            );
        }
        else
        {
            return <img ref={this.mainImg} {...this.props} />;
        }
    }
}