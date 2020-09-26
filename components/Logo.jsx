import React from 'react';

export default function Logo({ useShaderToy }) {
    return useShaderToy ? (
        <div className="logo shadertoy">
            <iframe
                className="logo shadertoy"
                width="100%"
                height="107%"
                frameborder="0"
                src="https://www.shadertoy.com/embed/WlXcDH?gui=false&t=10&paused=false&muted=true"
                allowfullscreen
            ></iframe>
        </div>
    ) : (
        <div className="logo">
            <div className="pleaseScroll">
                <div className="indicator">
                </div>
            </div>
            <video loop muted autoPlay>
                <source src="/mcrode.logo.mp4" type="video/mp4" />
            </video>
        </div>
    );
}