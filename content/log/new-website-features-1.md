<!-- {
    "desc": "Recording some new features on this website"
} -->

# Updates!
[(11.02.2022)](/c/log/new-website-features-1)

![md.parallax md.not-in-article](mcrode.logo.SQR.png)

Some months ago Chromium introduced some changes which broke the previous, pure-CSS implementation of parallax scrolling on this site. As a result I reimplemented the feature in Javascript, swallowing its consequence that parallax elements might fall out of sync when scrolling, due to how scrolling is done on a thread independent of rendering. If that delay becomes really severe I made the effect automatically disable tho.

Inspired by that I also made some subtle improvements to the looks and performance:

* Improved lazy loading articles
* 99% of content is lazy loaded only when they're appearing on screen. This also means that heavier embedded `<iframes>` are only loaded when absolutely necessary for example.
* The landing page video is now proper full-screen and the `mcro.de` text can seamlessly overlap it without visual artifacts.
* Parallax fullscreen content has a replicated blurred background content, in-case it'd be visible due to narrower aspect ratio.
* Parallax is fully disabled on mobile devices
* Added a simple custom scrollbar but it only indicates the scrolling progress of the page, it's not interactive.

Enjoy!

<mdcomment></mdcomment>