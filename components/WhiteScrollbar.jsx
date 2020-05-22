
import React, { PureComponent } from "react";

import { Scrollbars } from 'react-custom-scrollbars';

export default class WhiteScrollbar extends React.Component {
    render() {
        return (
            <Scrollbars
                renderTrackHorizontal={props => <div {...props} className="track horizontal"/>}
                renderTrackVertical={props => <div {...props} className="track vertical"/>}
                renderThumbHorizontal={props => <div {...props} className="thumb horizontal"/>}
                renderThumbVertical={props => <div {...props} className="thumb vertical"/>}
            >
                {this.props.children}
            </Scrollbars>
        );
    }
}