import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdText: "### Loading"
        }
    }

    getRealMdPath(path) {
        return path.replace("/c/", "/content/") + ".md";
    }

    componentDidMount()
    {
        fetch(this.getRealMdPath(this.props.location.pathname))
            .then((response) => response.text())
            .then((data) => this.setState({
                mdText: data
            }))
            .catch((reason) => this.setState({
                mdText: `## Sucks to be you.\n\n\`\`\`\n${JSON.stringify(reason, null, 4)}\n\`\`\``
            }));
    }

    render() {
        return (
            <ReactMarkdown source={this.state.mdText} escapeHtml={false} />
        )
    }
}