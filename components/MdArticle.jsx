import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import TrackVisibility from 'react-on-screen';

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdText: "### Loading",
            loading: true,
            error: false,
            nextProcessed: false,
            next: null
        }
    }

    getRealMdPath() {
        return this.props.path.replace("/c/", "/content/") + ".md";
    }

    componentDidUpdate()
    {
        if(this.state.error || this.state.loading || this.state.nextProcessed) return;

        let nextMatch = /\<nextmd\s+href="(.*?)"\s+\/\>/gm.exec(this.state.mdText);
        if(nextMatch && nextMatch.length > 0)
        {
            this.setState({
                next: nextMatch[1]
            });
        }

        this.setState({
            nextProcessed: true
        })
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
        else return ( <div>
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
            { this.state.next &&
                <ArticleLoader path={this.state.next} />
            }
        </div> )
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