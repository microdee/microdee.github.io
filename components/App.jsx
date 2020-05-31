import React from 'react';
import { Link } from 'react-router';
import { Gh1, Gh2 } from './Gh';
import MainMenu from './MainMenu';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { children, routes } = this.props;
        
        return(
            <div id="appRoot">
                <Gh1 className="h0" glitchType="1">mcro.de</Gh1>
                <MainMenu />
                {children}
            </div>
        );
    }
}
    