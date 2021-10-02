import React from 'react';
import { Link } from 'react-router';
import { Gh1, Gh2 } from './Gh';
import MainMenu from './MainMenu';
import Logo from './Logo';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount()
    {
        function registerScrollTest()
        {
            let root = document.getElementById("root");
            let scrolltest = document.getElementById("scrolltest");
            var scrollRange = root.scrollHeight - root.clientHeight;
            return new WorkletAnimation('scroll-test',
                new KeyframeEffect(scrolltest, [
                    {transform: 'translateY(0)'},
                    {transform: `translateY(${scrollRange}px)`}
                ], scrollRange),
                new ScrollTimeline({
                    scrollSource: root,
                    orientation: 'block',
                    timeRange: scrollRange
                })
            );
        }
        
        window.testAnimator = registerScrollTest();
        window.testAnimator.play();

        new ResizeObserver(e => {
            const [{
                borderBoxSize,
                contentBoxSize,
                contentRect,
                devicePixelContentBoxSize: [devicePixelBoxSize]
            }] = e;
            console.log(borderBoxSize, contentBoxSize, contentRect, devicePixelBoxSize)

            window.testAnimator?.cancel();
            window.testAnimator = registerScrollTest();
            window.testAnimator.play();
            
        }).observe(document.querySelector("#appRoot"));
    }
    
    render() {
        const { children, location } = this.props;

        if(location.pathname === "/")
        {
            return(
                <div id="appRoot">
                    <div
                        id="scrolltest"
                        style={{
                            position: "absolute",
                            top: 60,
                            left: 100,
                            width: 100,
                            height: 100,
                            background: "#FFF",
                            zIndex: 20000
                        }}
                    ></div>
                    <Logo />
                    <Gh1 className="h0" glitchtype="1" id="mcrode"><Link to="/">mcro.de</Link></Gh1>
                    <MainMenu />
                    {children}
                    <div id="footer"></div>
                </div>
            );
        }
        else
        {
            return(
                <div id="appRoot">
                    <Gh1 className="h0" glitchtype="1" id="mcrode"><Link to="/">mcro.de</Link></Gh1>
                    <MainMenu />
                    {children}
                    <div id="footer"></div>
                </div>
            );
        }
    }
}
    