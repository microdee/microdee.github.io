import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdText: "### Loading"
        }
    }

    getRealMdPath() {
        return this.props.location.pathname.replace("/c/", "/content/") + ".md";
    }

    componentDidMount()
    {
        fetch(this.getRealMdPath())
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
            <ReactMarkdown
                className="mdArticle"
                source={this.state.mdText}
                escapeHtml={false}
                sourcePos={true}
                allowNode={() => true}
                transformLinkUri={((uri) => {
                    if(uri === undefined || uri == "" || uri == null) return uri;
                    try {
                        return new URL(uri).href
                    } catch {
                        let base = new URL(this.props.location.pathname, window.origin);
                        return new URL(uri, base.href).href;
                    }
                }).bind(this)}
                transformImageUri={((uri) => {
                    if(uri === undefined || uri == "" || uri == null) return uri;
                    try {
                        return new URL(uri).href
                    } catch {
                        let base = new URL(this.getRealMdPath(), window.origin);
                        return new URL(uri, base.href).href
                    }
                }).bind(this)}
                parserOptions={{
                    gfm: true,
                }}
            />
        )
    }
}