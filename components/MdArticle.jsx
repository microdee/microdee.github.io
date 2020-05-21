import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import TrackVisibility from 'react-on-screen';

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdText: "### Loading",
            loading: true,
            error: false
        }
        this.parseHtml = htmlParser({
            isValidNode: () => true,
            processingInstructions: [
                {
                    shouldProcessNode: node =>
                        node.name === 'iframe' || node.type === 'iframe',
                    replaceChildren: false,
                    processNode: this.handleIframe.bind(this)
                },
                {
                    shouldProcessNode: node =>
                        node.name === 'nextmd' || node.type === 'nextmd' ||
                        node.name === 'insertmd' || node.type === 'insertmd',
                    replaceChildren: false,
                    processNode: this.handleNextMd.bind(this)
                }
            ]
        })
    }

    handleIframe(node, children) {
        let iframeProps = {...node.attribs};
        iframeProps.width = this.getAppDomNode().clientWidth;

        if(node.attribs.height) {
            let aspect = node.attribs.width / node.attribs.height;
            iframeProps.height = iframeProps.width / aspect;
        }
        return (
            <iframe {...iframeProps} />
        )
    }

    handleNextMd(node, children) {
        return (
            <ArticleLoader path={node.attribs.href} />
        )
    }

    getAppDomNode() {
        return document.getElementById("appRoot");
    }

    getRealMdPath() {
        return this.props.path.replace("/c/", "/content/") + ".md";
    }

    componentDidUpdate()
    {
    }

    componentDidMount()
    {
        fetch(this.getRealMdPath())
            .then((response) => {
                if(response.status < 200 || response.status >= 300)
                    throw {
                        status: response.statusText
                    }
                return response.text()
            })
            .then((data) => this.setState({
                mdText: data,
                error: false,
                loading: false
            }))
            .catch((reason) => this.setState({
                mdText: `I'm sorry but **${this.props.path}** ain't gonna happen.\n\n\`\`\`\n${JSON.stringify(reason, null, 4)}\n\`\`\``,
                error: true,
                loading: false,
            }));
    }

    render() {
        if(this.state.loading) return (
            <h1>Loading</h1>
        )
        else return (
            <ReactMarkdown
                className="mdArticle"
                source={this.state.mdText}
                escapeHtml={false}
                sourcePos={true}
                allowNode={() => true}
                astPlugins={[
                    this.parseHtml
                ]}
                transformLinkUri={((uri) => {
                    if(uri === undefined || uri == "" || uri == null) return uri;
                    try {
                        return new URL(uri).href
                    } catch {
                        let base = new URL(this.props.path, window.origin);
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
                    gfm: true
                }}
            />
        )
    }
}

function ArticleLoader({ path }) {
    return (
        <TrackVisibility once partialVisibility>
            {({ isVisible }) => isVisible ? <MdArticle path={path} /> : <h2>Loading</h2>}
        </TrackVisibility>
    )
}

export function RoutedMdArticle({ location })
{
    return (
        <MdArticle path={location.pathname} />
    )
}