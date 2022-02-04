import React from 'react';
import ParallaxEffect from './parallax';
import MdFullParallaxWrap from './MdFullParallaxWrap';

export default class MdImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parallax: new ParallaxEffect()
        };
        this.mainImg = React.createRef();
    }
    componentDidMount() {
        let alt = 'alt' in this.props ? this.props.alt : "";
        let isParallax = alt.search("md.parallax") >= 0;

        if(isParallax)
            this.state.parallax.register(this.mainImg.current);
    }

    render() {
        let alt = 'alt' in this.props ? this.props.alt : "";
        if(alt.search("md.full") >= 0)
        {
            return (
                <MdFullParallaxWrap>
                    <img {...this.props} />
                </MdFullParallaxWrap>
            );
        }
        else
        {
            return <img ref={this.mainImg} {...this.props} />;
        }
    }
}