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
    }
    
    render() {
        const { children, location } = this.props;

        if(location.pathname === "/")
        {
            return(
                <div id="appRoot">
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
    