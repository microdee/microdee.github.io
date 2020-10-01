import React, { Suspense, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import htmlParser from 'react-markdown/plugins/html-parser';
import CodeBlock from "./CodeBlock";
import IframeWrapper from './IframeWrapper';
import {Gh1, Gh2} from './Gh';

function getMainTextOfComponent(component) {
    if(typeof(component) === 'string') return component;
    return getMainTextOfComponent(component[0].props.children);
}

function getCoreProps(props) {
    return props['data-sourcepos'] ? {'data-sourcepos': props['data-sourcepos']} : {}
}

function MdHeading(props) {
    let headerText = getMainTextOfComponent(props.children);
    let anchorText = headerText
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/[^a-z0-9]+$/gi, '')
        .toLowerCase();
    if(props.level == 1) return (<Gh1 glitchtype="2" id={anchorText}>{props.children}</Gh1>);
    if(props.level == 2) return (<Gh2 glitchtype="2" id={anchorText}>{props.children}</Gh2>);
    let hprops = {
        ...props,
        id: anchorText
    }
    return React.createElement(`h${hprops.level}`, hprops, hprops.children);
}

function IsCurrentDomain(urlin) {
    return urlin.includes('localhost') || urlin.includes('mcro.de')
}

function GetLocalPathFromUrl(urlin) {
    return new URL(urlin).pathname;
}

function MdLinkHandler(props) {
    let localPath = GetLocalPathFromUrl(props.href);
    if(IsCurrentDomain(props.href) && localPath.includes('.')) return (
        <a {...props} href={props.href.replace('/c/', '/')} target="_blank">{props.children}</a>
    )
    if(IsCurrentDomain(props.href)) return (
        <Link to={GetLocalPathFromUrl(props.href)}>{props.children}</Link>
    )
    if(props.href.startsWith('about:blank#')) return (
        <a {...props} href={props.href.replace('about:blank', '')}>{props.children}</a>
    )
    return ( <a {...props} target="_blank">{props.children}</a> )
}

function trLinkUri(uri, path) {
    if(uri === undefined || uri == "" || uri == null) return uri;
    try {
        return new URL(uri).href
    } catch {
        let base = new URL(path, window.origin);
        return new URL(uri, base.href).href;
    }
}

function trImageUri(uri, path) {
    if(uri === undefined || uri == "" || uri == null) return uri;
    try {
        return new URL(uri).href
    } catch {
        let base = new URL(path, window.origin);
        return new URL(uri, base.href).href
    }
}

function MdSideToc({mdText, path, realMdPath}) {

    return (
        <div className="mdSideToc">
            <ReactMarkdown
                className="tocContent"
                source={mdText}
                escapeHtml={false}
                sourcePos={true}
                allowNode={() => true}
                renderers={{
                    code: CodeBlock,
                    heading: MdHeading,
                    link: MdLinkHandler
                }}
                astPlugins={[
                    htmlParser({
                        isValidNode: () => true
                    })
                ]}
                transformLinkUri={(uri) => trLinkUri(uri, path)}
                transformImageUri={(uri) => trImageUri(uri, realMdPath)}
                parserOptions={{
                    gfm: true
                }}
            />
        </div>
    )
}

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.prevPath = "";
        this.state = {
            mdText: "# Loading",
            enteredVp: false,
            loading: true,
            error: false
        };
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
                },
                {
                    shouldProcessNode: node =>
                    node.name === 'tocmd' || node.type === 'tocmd' ||
                    node.name === 'mdtoc' || node.type === 'mdtoc',
                    replaceChildren: false,
                    processNode: this.handleTocMd.bind(this)
                }
            ]
        });
        this.intersectionObserver = null;
        this.elementCache = null;
    }

    onRef(element) {
        if(element === null) return;
        if(this.elementCache !== element) {
            if(this.elementCache !== null && this.intersectionObserver !== null)
                this.intersectionObserver.unobserve(this.elementCache);
            if(this.intersectionObserver !== null)
                this.intersectionObserver.observe(element);
            this.elementCache = element;
        }
    }

    handleIntersection(entries, observer) {
        entries.forEach(e => {
            if(e.isIntersecting && !this.state.enteredVp) {
                this.setState({
                    enteredVp: true
                }, () => this.updateArticle());
                console.log("article entered")
            }
        });
    }
    
    handleIframe(node, children) {
        return (
            <IframeWrapper {...node.attribs} />
        )
    }
        
    handleNextMd(node, children) {
        return (
            <MdArticle path={node.attribs.href} />
        )
    }

    handleTocMd(node, children) {
        return (
            <MdSideToc
                mdText={node.children[0].data}
                path={this.props.path}
                realMdPath={this.getRealMdPath()}
            />
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
        if(this.prevPath !== this.props.path && this.state.enteredVp) {
            this.updateArticle();
        }
        this.prevPath = this.props.path;
    }
        
    componentDidMount() {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
            root: document.querySelector("#root"),
            rootMargin: '0px',
            threshold: 0.75
        });
        if(this.elementCache !== null)
            this.intersectionObserver.observe(this.elementCache);
        this.prevPath = this.props.path;
    }
            
    render() {
        return <div ref={this.onRef.bind(this)}>
            {
                this.state.loading ? (
                    <Gh1 glitchtype="1">Loading</Gh1>
                ) : (
                    <ReactMarkdown
                        className="mdArticle"
                        source={this.state.mdText}
                        escapeHtml={false}
                        sourcePos={true}
                        allowNode={() => true}
                        renderers={{
                            code: CodeBlock,
                            heading: MdHeading,
                            link: MdLinkHandler
                        }}
                        astPlugins={[
                            this.parseHtml
                        ]}
                        transformLinkUri={((uri) => trLinkUri(uri, this.props.path)).bind(this)}
                        transformImageUri={((uri) => trImageUri(uri, this.getRealMdPath())).bind(this)}
                        parserOptions={{
                            gfm: true
                        }}
                    />
                )
            }
        </div>
    }
}
    
export function RoutedMdArticle({ location })
{
    return (
        <MdArticle path={location.pathname} />
    )
}