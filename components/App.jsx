import React from 'react';
import { Link } from 'react-router';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { children, routes } = this.props;
        
        return(
            <div id="appRoot">
                <h1>mcro.de/WIP</h1>
                {children}
            </div>
        );
    }
}
    