import React from 'react';
import {Gh1, Gh2} from './Gh';

export default class MdLazyLoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.intersectionObserver = null;
        this.placeHolderDiv = React.createRef();
    }
    
    handleIntersection(entries, observer) {
        entries.forEach(e => {
            if(e.isIntersecting && !this.state.visible) {
                this.intersectionObserver.unobserve(this.placeHolderDiv.current);
                this.setState({
                    visible: true
                });
                console.log("lazy element entered")
            }
        });
    }

    componentDidMount() {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
            root: document.querySelector("#root"),
            rootMargin: '0px',
            threshold: 0.01
        });
        this.intersectionObserver.observe(this.placeHolderDiv.current)
    }

    render() {
        return this.state.visible ? (
            this.props.children
        ) : (
            <div
                ref={this.placeHolderDiv}
                className="lazy-placeholder"
                style={{
                    position: "relative",
                    height: "50vh",
                    width: "100%"
                }}
            >
                <Gh1 glitchtype="1">scroll...</Gh1>
            </div>
        )
    }
}