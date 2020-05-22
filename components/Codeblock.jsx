
import React, { PureComponent } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export default class CodeBlock extends React.Component {
    
    render() {
        const { language, value } = this.props;
        return (
            <SyntaxHighlighter language={language} style={monokai}>
                {value}
            </SyntaxHighlighter>
        );
    }
}