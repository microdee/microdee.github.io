# HERE Technologies, CES 2019

### Versatile presentation tool

Developed during 2018 maintained until 2019 summer.

This article is just a quick summary about some of the problems we faced and the solutions we came up with to tackle them during the software development of this project. My role was in engineering the on-site presenter software architecture, which was dubbed HERE Reality Core

<iframe full="true" src="https://player.vimeo.com/video/325198966?color=a88e54&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

This article focuses on my involvement in the project and the challanges I faced. For an official representation of the entire project, and the list of others involved, please follow this link:

## [Read the official article at MESO](https://meso.design/en/projects/here-technologies-scalable-storytelling-environment-for-international-location-technology-firm)

## Main Challange:

The audience facing frontend of this presenter were written using [VVVV](https://vvvv.org). The visual presentation, interaction and the look/feel of the presenter was developed by my colleague and the underlying C# components and architecture was my responsibility. VVVV as always gave us exceptionally rapid prototyping results, which in turn allowed us to show visible progress to our client. However this meant many iterations/refactorings were needed to be done to the core architecture during early development.

### Display diverse content from many external sources with high efficiency

We needed to communicate the vast and complex solutions HERE Technologies can provide for customers. As a result big variety of content was required to be seamlessly blended together, under a consistent look and feel of the application. These contents could come from many sources, simple image/video, third-party HTML demos (both local and remote), internally developed HTML content, Unity applications and feed from a capture card.

To control it all we needed to organize these into a hierarchy of presentations, grouped under experiences. In order to allow authors to modify this hierarchy and its content a backend system is developed which we dubbed ___Experience Management System___ (EMS). That was developed by our backend-server departmnent and I don't have the credibility to go into detail about it. In a nutshell backend was written mostly in Crystal and clients could communicate with it through a GraphQL proxy which would translate GraphQL queries to ones the EMS backend database could process.

However it was not operational before we needed to demo a working software for the client. To cope with that my C# core needed to merge and accept a hierarchy graph of presentations and the description of their content from a variety of sources. In the end besides the EMS implementation, JSON, XAML, YAML and Ceras local data formats were supported. Ceras was used for offline caches of data received from EMS.

### Displaying HTML content

For HTML we had some more challanges. First of all we needed to present HTML content as seen in Chrome, embedded seamlessly into the look and feel of the application. VVVV does come with a built in HTMLTexture node, however that is somewhat limited in functionality. It is based on CEF (Chromium Embedded Framework), which would be great, if getting the rendered texture wouldn't be a slow process from CEF's OSR (Off Screen Rendering) mode. In CEF OSR mode the entire bitmap of the rendered HTML content is copied to system RAM, which then the vanilla VVVV implementation has to upload it back to the GPU so it can display it in a texture. This process yielded 10-20 FPS in 4K resolution, a.k.a. somewhat disappointing.

Besides vanilla HTMLTexture node is lacking some integration functionality such as a better integrated Javascript interoperability, touch support, and a better developer experience.

Fortunately luckily at the right time, a pull-request surfaced for CEF which implements texture sharing as an OSR image output. This means we could have a HTML rendering performance matching Chrome embedded inside our VVVV app. I combined that PR with one implementing touch support then built ChromiumFX targeting our custom version of CEF.

I packaged the result in a quasy public VVVV plugin dubbed ___Vanadium___

### Interactive Unity content displayed in VVVV

Other challanging content type was embedding Unity applications owned by the client but which we had no source-code access to. Displaying was achieved by hooking into the DX11 runtime of the Unity app and sharing the swapchain as a texture to be accessed by VVVV.

Luckily Unity apps implicitly allow developers to specify a parent window handle in command line args. Which means I could create a WinForms window as a host for the Unity apps and control how they are displayed on screen or more precisely how they're hidden. We used dummy HDMI diplay dongles which were containing the custom Unity windows. It was not necessary to have a dummy display at all in order to just get the output image of the Unity apps. I could move the window off screen and we wouldn't have needed the HDMI dongle. BUT we needed touch interaction, in which case the window needs to be on a valid visible screen.

Touches were handled with Windows Touch Simulation API, which was originally meant for UI tests but it worked fine duplicating touches to an invisible monitor.

### Automatic updating of running instances

This was achieved by our internal tool dubbed ___Warden Daemon___ which was not only managing updates, but restarted VVVV on potential but unlikely crashes and memory leaks. Once an update notification got published via our Gitlab CI/CD pipeline, Warden Daemon would fade in its full screen covers, stop VVVV and its subprocesses, update VVVV and even itself, then restart the application. All while a potential witness of the process would never see a Windows desktop or anything outside of HERE brand space.

### Conclusion

Of course this article was a quick simplified version, we faced many more intricate endeavours during developing this presenter. This was our last large scope project built with VVVV at MESO. We are now transitioning to UE4 and our first project with it was actually the next version of the HERE Reality Core presenter.

[See the HERE Reality Core presenter made for CES 2020](/c/works/here2020/insights)
