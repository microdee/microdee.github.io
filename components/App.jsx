import React from 'react';
import { Link } from 'react-router';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, routes } = this.props;

    return(
      <div style={{maxWidth: '500px'}}>
        <h2 style={{marginBottom: 0}}>Building here a new website</h2>
        {children}
      </div>
    );
  }
}
