# HERE Technologies, CES 2020

### Versatile presentation tool

- [HERE Technologies, CES 2020](#here-technologies-ces-2020)
    - [Versatile presentation tool](#versatile-presentation-tool)
  - [Read the official article at MESO](#read-the-official-article-at-meso)
  - [Main Challanges:](#main-challanges)
    - [Automatic updating of running instances](#automatic-updating-of-running-instances)
    - [Versatile, zero-config, responsive, multi-monitor support](#versatile-zero-config-responsive-multi-monitor-support)
    - [Display diverse content from many external sources with high efficiency](#display-diverse-content-from-many-external-sources-with-high-efficiency)
    - [Conclusion](#conclusion)

Developed during 2019 and still actively maintained.

This article is just a quick summary about some of the problems we faced and the solutions we came up with to tackle them during the software development of this project. My role was in engineering the on-site presenter software architecture, which we dubbed ___UnrealityCore___ (this is a word-play combining "Unreal Engine" with the official internal name of the software package "HERE Reality Core")

<iframe full="true" src="https://player.vimeo.com/video/412334178?color=a88e54&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

This article focuses on my involvement in the project and the challanges I faced. For an official representation of the entire project, and the list of others involved, please follow this link:
## [Read the official article at MESO](https://meso.design/en/projects/here-technologies-holistic-experience-platform-on-the-future-of-location-intelligence)

## Main Challanges:

The audience facing frontend of this presenter were written using Unreal Engine 4. Problem with UE4 is that it is somewhat purpose-built for end-user single-screen interactive applications, however it is versatile and open-source enough to make it do thy bidding in an industrial environment. Epic Games are also aware of this section of industry, and they are actively developing features aimed at enterprises (like nDisplay or PixelStreaming). However still a lot of features needed to be rewritten or abused in order to fit into our use-case.

### Automatic updating of running instances

This was achieved by our internal tool dubbed ___Warden Daemon___ which was not only managing updates, but restarted UnrealityCore on potential but unlikely crashes and memory leaks.

### Versatile, zero-config, responsive, multi-monitor support

UnrealityCore needs to run on many different screen configurations ranging from 1 to 3 screens. This was achived by developing an internal plugin package which I dubbed ___BlueWindow___, which makes it easy to manage multiple windows on multiple screens created from UE4. These Windows at the time of writing only support UMG or Slate widgets, but arbitrary viewport and level loading is planned.

### Display diverse content from many external sources with high efficiency

The previous version of this presenter made for CES 2019 in VVVV had to deal with video/picture slides and demos made in HTML, Unity and even demos just served as a video input through a capture card. Fortunately in the version made for CES 2020 we only needed to deal with videos/pictures and HTML content. Videos and pictures of course were trivial to handle with UE4's built in Media Player system and they were fetched from our **Experience Management System** (EMS).

In fact actually 90% of the content were controlled by the EMS, including the presentation hierarchy, all the text and the selection of demos.

For HTML we had some more challanges. First of all we needed to present HTML content as seen in Chrome, embedded into UE4 widgets in 4K. UE4 does come with a built in WebBrowser widget, however that is somewhat limited in functionality to keep a cross-platform interface viable. The desktop implementation of that is based on CEF (Chromium Embedded Framework), which would be great, if getting the rendered texture wouldn't be a slow process from CEF's OSR (Off Screen Rendering) mode. In CEF OSR mode the entire bitmap of the rendered HTML content is copied to system RAM, which then the vanilla UE4 implementation has to upload it back to the GPU so it can display it in a texture. This process yielded 4-5 FPS in 4K resolution, a.k.a. it was useless.

Previously for CES 2019 we were working with a custom version of CEF which supported rendering via sharing a texture on VRAM so it didn't need to copy any bitmaps. For CES 2020 we used the same technique, however of course the implementation had to be rewritten for UE4 in C++. That was a slightly easier process this time because I didn't need to deal with the C# bindings for CEF.

Because I was not familiar yet with lower level graphics development in UE4 (with RHI) at the time and we needed this feature quickly, I opted for having an entirely separate process handle CEF rendering and share the result in a shared texture. This allowed us to test demos received from HERE very quickly, without the need for launching the editor, but of course it had many other issues inherently coming from going with the multi-process route.

Since then of course I became more familiar with RHI and UE4 inner workings in general and this multi-process system had been since replaced by a proper implementation of CEF via shared textures, we dubbed ___Uranium___.

### Conclusion

Of course this article was a quick simplified version, we faced many more intricate endeavours during developing UnrealityCore, but I will skip them for the time being and maybe write more about them for the upcoming versions (if CES 2021 will happen despite the changes Corona virus implied on our society).

UnrealityCore was our first ambitious software realized in UE4 at MESO and it helped us a lot transitioning to it from VVVV.

<nextmd href="/c/works/here2019" />