import React from 'react';
import MdFullParallaxWrap from './MdFullParallaxWrap';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default class MdCompare extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSlider() {
        let extraProps = {...this.props};
        delete extraProps.ls;
        delete extraProps.rs;
        delete extraProps.full;
        delete extraProps.children;
        return (
            <ReactCompareSlider className="md-expand"
                itemOne={<ReactCompareSliderImage src={this.props.ls} {...extraProps}/>}
                itemTwo={<ReactCompareSliderImage src={this.props.rs} {...extraProps}/>}
            />
        )
    }

    render() {
        if(('full' in this.props) && this.props.full)
        {
            return (
                <MdFullParallaxWrap>
                    {this.renderSlider()}
                </MdFullParallaxWrap>
            );
        }
        else
        {
            return this.renderSlider();
        }
    }
}