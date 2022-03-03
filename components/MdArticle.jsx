import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import {
    useLocation
} from 'react-router-dom';

import CodeBlock from "./Codeblock";
import IframeWrapper from './IframeWrapper';
import {Gh1, Gh2} from './Gh';
import MdImg from './MdImg';
import MdLottie from './MdLottie';
import MdComment from './MdComment';
import MdCompare from './MdCompare';
import MdLazyLoad from './MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from './MdLinkHandler';

function getMainTextOfComponent(component) {
    if(typeof(component) === 'string') return component;
    if(typeof(component[0]) === 'string') return component[0];
    return getMainTextOfComponent(component[0].props.children);
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

function MdCodeComponent(props) {

    let langMatch = /language-(\w+)/.exec(props.className || '');
    return props.inline ? (<code {...props} />)
    : (
        <CodeBlock language={langMatch ? langMatch[1] : "text"} >
            {props.children}
        </CodeBlock>
    )
}

function MdHeadingComponent(props) {
    let headerText = getMainTextOfComponent(props.children);
    let anchorText = headerText
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/[^a-z0-9]+$/gi, '')
        .toLowerCase();
    let hprops = {
        ...props
    }
    function H(inprops, inhprops)
    {
        if(inprops.level == 1) return (<Gh1 glitchtype="2" id={anchorText}>{inprops.children}</Gh1>);
        if(inprops.level == 2) return (<Gh2 glitchtype="2" id={anchorText}>{inprops.children}</Gh2>);
        return React.createElement(`h${inhprops.level}`, inhprops, inhprops.children);
    }

    return (
        <>
            <a id={anchorText} className="header-anchor"></a>
            {H(props, hprops)}
        </>
    )
}

let baseComponents = {
    code: MdCodeComponent,
    h1: MdHeadingComponent,
    h2: MdHeadingComponent,
    h3: MdHeadingComponent,
    h4: MdHeadingComponent,
    h5: MdHeadingComponent,
    h6: MdHeadingComponent,
    a: MdLinkHandler,
};

function MdSideToc({mdText, path, realMdPath}) {
    return (
        <div className="mdSideToc">
            <ReactMarkdown
                className="tocContent"
                skipHtml={false}
                sourcePos={true}
                allowElement={() => true}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={baseComponents}
                transformLinkUri={(uri) => trLinkUri(uri, path)}
                transformImageUri={(uri) => trImageUri(uri, realMdPath)}
            >
                {mdText}
            </ReactMarkdown>
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
        this.intersectionObserver = null;
        this.elementCache = null;
    }

    MdNextComponent(props) {
        return <MdArticle path={props.href} />
    }

    MdTocComponent(props) {
        return (
            <MdSideToc
                mdText={props.children[0]}
                path={this.props.path}
                realMdPath={this.getRealMdPath()}
            />
        )
    }

    MdLottieComponent(props) {
        let {url, isFile, isDomain} = GetMdUrl(props.href);
        let passProps = {...props};
        delete passProps.href;
        if(isFile || !isDomain) return (
            <MdLazyLoad>
                <MdLottie href={url} {...passProps} />
            </MdLazyLoad>
        );
        return (
            <div className="mdLottie invalid"></div>
        )
    }

    MdCompareComponent(props) {
        let ls = GetMdUrl(props.ls);
        let rs = GetMdUrl(props.rs);
        let passAttribs = {...props};
        delete passAttribs.ls;
        delete passAttribs.rs;
        return (
            <MdLazyLoad>
                <MdCompare ls={ls.url} rs={rs.url} {...passAttribs} />
            </MdLazyLoad>
        );
    }

    MdCommentComponent(props) {
        return <MdComment term={this.props.path} />;
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
            threshold: 0.01
        });
        if(this.elementCache !== null)
            this.intersectionObserver.observe(this.elementCache);
        this.prevPath = this.props.path;
    }
            
    render() {
        return <div ref={this.onRef.bind(this)}>
            {
                this.state.loading ? (
                    <div
                        style={{
                            position: "relative",
                            height: "100vh"
                        }}
                    >
                        <Gh1 glitchtype="1">scroll...</Gh1>
                    </div>
                ) : (
                    <ReactMarkdown
                        className="mdArticle"
                        skipHtml={false}
                        sourcePos={true}
                        allowElement={() => true}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            ...baseComponents,

                            img: props => (
                                <MdLazyLoad>
                                    <MdImg {...props} />
                                </MdLazyLoad>
                            ),
                            iframe: props => (
                                <MdLazyLoad>
                                    <IframeWrapper {...props} />
                                </MdLazyLoad>
                            ),
                            nextmd: this.MdNextComponent.bind(this),
                            mdnext: this.MdNextComponent.bind(this),
                            mdinsert: this.MdNextComponent.bind(this),
                            insertmd: this.MdNextComponent.bind(this),

                            tocmd: this.MdTocComponent.bind(this),
                            mdtoc: this.MdTocComponent.bind(this),

                            lottiemd: this.MdLottieComponent.bind(this),
                            mdlottie: this.MdLottieComponent.bind(this),

                            comparemd: this.MdCompareComponent.bind(this),
                            mdcompare: this.MdCompareComponent.bind(this),

                            commentmd: this.MdCommentComponent.bind(this),
                            mdcomment: this.MdCommentComponent.bind(this)
                        }}

                        transformLinkUri={((uri) => trLinkUri(uri, this.props.path)).bind(this)}
                        transformImageUri={((uri) => trImageUri(uri, this.getRealMdPath())).bind(this)}
                    >
                        {this.state.mdText}
                    </ReactMarkdown>
                )
            }
        </div>
    }
}
    
export function RoutedMdArticle()
{
    let location = useLocation();
    let loc = location.pathname.replace(/\/$/gm, '');
    return (
        <MdArticle path={loc} />
    )
}