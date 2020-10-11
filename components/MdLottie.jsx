import React from 'react';
import Lottie from 'react-lottie';
import * as loadingData from '../lottie/blender-loader.json';
import * as errorData from '../lottie/404.json';

export default class MdLottie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animData: loadingData
        };
    }

    componentDidMount() {
        fetch(this.props.href)
        .then(response => {
            if(response.status < 200 || response.status >= 300)
            throw {
                status: response.statusText
            }
            return response.text()
        })
        .then(data => this.setState({
            animData: JSON.parse(data)
        }))
        .catch(reason => this.setState({
            animData: errorData
        }));
    }

    render() {
        let passProps = {...this.props};
        delete passProps.href;
        if('filter' in passProps) {
            passProps.style = {filter: passProps.filter};
        }
        return (
            <div className="mdLottie" {...passProps}>
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