import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import TrackVisibility from 'react-on-screen';
import CodeBlock from "./CodeBlock";
import IframeWrapper from './IframeWrapper';
import {Gh1, Gh2} from './Gh';

function getCoreProps(props) {
    return props['data-sourcepos'] ? {'data-sourcepos': props['data-sourcepos']} : {}
}

function MdHeading(props) {
    if(props.level == 1) return (<Gh1 glitchType="2">{props.children}</Gh1>);
    if(props.level == 2) return (<Gh2 glitchType="2">{props.children}</Gh2>);
    return React.createElement(`h${props.level}`, getCoreProps(props), props.children);
}

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.prevPath = "";
        this.state = {
            mdText: "# Loading",
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
    return (
            <IframeWrapper {...node.attribs} />
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

    updateArticle() {
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
        
    componentDidUpdate() {
        if(this.prevPath !== this.props.path) {
            this.updateArticle();
        }
        this.prevPath = this.props.path;
    }
        
    componentDidMount() {
        this.prevPath = this.props.path;
        this.updateArticle();
    }
            
    render() {
        if(this.state.loading) return (
            <Gh1 glitchType="1">Loading</Gh1>
        )
        else return (
            <ReactMarkdown
                className="mdArticle"
                source={this.state.mdText}
                escapeHtml={false}
                sourcePos={true}
                allowNode={() => true}
                renderers={{
                    code: CodeBlock,
                    heading: MdHeading
                }}
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
            {({ isVisible }) => isVisible ? <MdArticle path={path} /> : <Gh1 glitchType="1">Loading</Gh1>}
        </TrackVisibility>
    )
}
    
export function RoutedMdArticle({ location })
{
    return (
        <MdArticle path={location.pathname} />
    )
}