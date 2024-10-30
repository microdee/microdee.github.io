<!-- {
    "title": "Nuke.Unreal 2.1",
    "desc": "Automate the tasks involved in creating Marketplace complaint plugins and other useful scripts"
} -->

# Nuke.Unreal 2.1
[(16.05.2023)](/c/log/nuke-unreal-2-1)

![_parallax(side) notInArticle](../nu_logo.svg)

Nuke.Unreal 2.1 is released with a lot's of new goodies. Probably [1.2](/c/log/nuke-unreal-1-2) should have been 2.0, but well here we are.

This article is just a stub and will be filled in eventually with juicy details like the previous one. Until then:

* Now you can install Nuke.Unreal into your project with the appropriate build class already set up for you with a remote powershell script:
  ```
  Set-ExecutionPolicy Unrestricted -Scope Process -Force; iex (iwr 'https://raw.githubusercontent.com/microdee/Nuke.Unreal/refs/heads/main/install/install.ps1').ToString()
  ```
* Install third-party C++ libraries via [xrepo](https://xrepo.xmake.io) [(details)](https://github.com/microdee/Nuke.Unreal?tab=readme-ov-file#use-library-from-xrepo)
* Nuke.Cola brings in
  * [Standalone C# file build plugins](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins)
  * [Folder Composition](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins)
  * [Fluent API error tolerance](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins)

I will most probably have more here later (famous last words).