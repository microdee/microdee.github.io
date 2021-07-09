import React from 'react';
import Utterances from "utterances-react"

export default function MdComment({term}) {
    console.log("Comment thread: " + term);
    return (
        <details className="md-comments">
            <summary>Ackchyually...</summary>
            <Utterances
                repo="microdee/microdee.github.io"
                issueTerm={term}
                theme="github-dark"
                crossorigin="anonymous"
                async
            />
        </details>
    )
}