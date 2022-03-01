import React from 'react';
import { Link } from 'react-router';
import { Gh1, Gh2 } from './Gh';
import MainMenu from './MainMenu';
import Logo from './Logo';
import MainScrollbar from './MainScrollbar';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { children, intro } = this.props;

        return (
            <div id="appRoot">
                {intro ? <Logo /> : <div style={{display: "none"}} />}
                <Gh1 className="h0" glitchtype="1" id="mcrode"><Link to="/">mcro.de</Link></Gh1>
                <MainMenu />
                {children}
                <div id="footer"></div>
                <MainScrollbar />
            </div>
        );
    }
}
    