<!-- {
    "title": "Nuke.Unreal 1.2",
    "desc": "Automate the tasks involved in creating Marketplace complaint plugins and other useful scripts"
} -->

# Nuke.Unreal 1.2
[(16.15.2023)](/c/log/nuke-unreal-1.2)

![_parallax(side) notInArticle](../nu_logo.svg)

Last time I wrote about Nuke.Unreal here was two years ago. In fact I'm not doing a great job at promoting it but that changes today! <span style="opacity: 0.66;">(and then probably it won't)</span>. In that two years a lot has changed for the better and it became much more user friendly. Just the fact that since it's available as a nuget package helps a lot, so you don't need submodules or a project template, just do

```Powershell
nuke :setup
nuke :addPackage md.Nuke.Unreal
```

in your fresh Unreal project. For the uninitiated I recommend reading the [Prelude/Reasoning](/c/log/nuke-unreal#prelude-reasoning) of the article from ~2 years ago. <span style="opacity: 0.66;">(The rest of the article might have old things or plain bad advice. Tread accordingly. README.md in the main repo is the single source of truth.)</span>

Introductions aside there are several bigger things changed since then:

* Renamed targets and parameters to be more comfortable / have better alignment with Unreal namings
* Android related targets.
* as mentioned above, distributed via [Nuget package](https://www.nuget.org/packages/md.Nuke.Unreal)
* Using Nuke Tool delegates for Unreal tools instead of custom tool wrappers
* UAT and UBT C# wrappers/configurators generated from Source code analysis
* Automatically discovered build plugins

In this article I will go through them but I will first start with the UAT/UBT wrappers because they are the beefiest feature in this update,

# UAT / UBT Configurators

## Motivation

Command line tools of Unreal are not designed for human consumption, nor for letting other programs argue about their inner workings. If I have to guess they're coded fast under a lot of management pressure and without any regard to staying architecturally sound and letting a graph of single responsibility components emerge complex behaviors. Or to put it in different perspective they do have a very characteristic architecture which is however too simplistic for the scale of what both UAT and UBT accomplishes. Combining simplistic architecture with the shear amount of tasks these tools need to perform will result in the stereotipical 6000 lines long classes containing 2000 lines long functions, where the actual features and the complexity of the tools are hidden forever for everyone not determined enough to read through that wall of source code. To add salt to injury this sort of hectic flat coding style actually discourages self-documenting discoverable code and requires the responsible developer to maintain a larger article of documentation somewhere else (of course the latter doesn't usually happen with Unreal source code at least not to the degree that the uninvolved could easily understand the reasoning behind a certain wall of source code)

Now this might seem I'm roasting the code quality of UAT/UBT, but I don't mean to disrespect the work went into these programs and the engineers who done it. I'm sure they're well aware of these problems but for any very valid reason they cannot have the effort to refactor these tools to be more pleasant to work with. And they improved a lot in Unreal 5 with splitting up `DotNETUtilities` into well organized, shared and externally mountable collection of libraries (e.g.: `Epic.Core` and co.). The reason however I'm writing my second paragraph about this phenomena is that when I embarked to implement a Nice™ wrapper around these tools, their "structure" made that goal so hard, it took me 2 years of on and (mostly) off side-project development to make it work properly.

This sort of hazy internals and their inconsistent behavior also makes it very hard for the broader community to conciously use and combine the features of these tools, rather than having a sort of cargo-cult spreading of Working™ combinations of command line arguments for individual purposes. I don't claim to have a solution to this but I did want to bring a method of interacting with Unreal Tools which are more pleasant to look at, discoverable and consistent in usage.

## More comments on individual tools

Let's start with **UBT** because it was an easier nut to crack open. Simply speaking UBT had a very nice set of attributes which could clearly indicate tool-modes and their arguments. In fact originally I was using regular C# reflection to generate the tool configurator for Nuke. I actually have no complaints there regarding source code discoverability of features, other than inconsistent type visibility of arguments but that could be easily overcome with AutoMapper. The only reason I switched to source code parsing was avoiding loading multiple versions of the same assembly when gathering and merging the different features of UBT between different engine versions.

UAT on the other hand left no room for automatically reflecting its