import React from 'react';
import Lottie from 'react-lottie';
import ParallaxEffect from './parallax';
import * as loadingData from '../lottie/blender-loader.json';
import * as errorData from '../lottie/404.json';

export default class MdLottie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animData: loadingData,
            parallax: new ParallaxEffect()
        };
        this.mainDiv = React.createRef();
    }

    componentDidMount() {
        fetch(this.props.href)
        .then((response => {
            if(response.status < 200 || response.status >= 300)
            throw {
                status: response.statusText
            }
            return response.text()
        }).bind(this))

        .then((data => {
            this.setState({
                animData: JSON.parse(data)
            });
            if('parallax' in this.props) {
                this.state.parallax.register(this.mainDiv.current);
            }
        }).bind(this))

        .catch((reason => this.setState({
            animData: errorData
        }).bind(this)));
    }

    render() {
        let passProps = {...this.props};
        delete passProps.href;
        if('filter' in passProps) {
            passProps.style = {filter: passProps.filter};
        }
        return (
            <div ref={this.mainDiv} className="mdLottie" {...passProps}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: this.state.animData,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                />
            </div>
        );
    }
}