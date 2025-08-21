<!-- {
    "title": "Nuke.Unreal 2.1",
    "desc": "Automate the tasks involved in creating Marketplace complaint plugins and other useful scripts"
} -->

# Nuke.Unreal 2.1
[(29.10.2024)](/c/log/nuke-unreal-2-1)

![_parallax(side) notInArticle](../nu_logo.svg)

<tocmd>

- [Nuke.Unreal 2.1](#nukeunreal-21)
- [New Features!](#new-features)
  - [Using third-party C++ libraries](#using-third-party-c-libraries)
    - [Use library from xrepo](#use-library-from-xrepo)
    - [Use library via CMake](#use-library-via-cmake)
    - [Use header only library](#use-header-only-library)
  - [ImplicitBuildInterface plugins](#implicitbuildinterface-plugins)

</tocmd>

Nuke.Unreal 2.1 is released with a lot's of new goodies. Probably [1.2](/c/log/nuke-unreal-1-2) should have been 2.0, but well here we are.

* Now you can install Nuke.Unreal into your project with the appropriate build class already set up for you with a remote powershell script:
  ```
  Set-ExecutionPolicy Unrestricted -Scope Process -Force; iex (iwr 'https://raw.githubusercontent.com/microdee/Nuke.Unreal/refs/heads/main/install/install.ps1').ToString()
  ```
* Install third-party C++ libraries via [xrepo](https://xrepo.xmake.io) [(details)](https://github.com/microdee/Nuke.Unreal?tab=readme-ov-file#use-library-from-xrepo)
* Nuke.Cola brings in
  * [Standalone C# file build plugins](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins)
  * [Folder Composition](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins)
  * [Fluent API error tolerance](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins)

# New Features!

## Using third-party C++ libraries

Nuke.Unreal allows you to set up boilerplate for C++ libraries, or fetch them via a package manager. In all cases the artifacts it generates are placed in the working directory (the current location of your terminal). In all cases they're managed in their own preparation targets which are generated for you.

There are three methods available:

### Use library from [xrepo](https://xrepo.xmake.io)

Tt can be as simple as

```
> nuke use-xrepo --spec "zlib"
```

or fully specified with version and library options

```
> nuke use-xrepo --spec "imgui 1.91.1 freetype=true,dx11=true,dx12=true,vulkan=true"
```

and multiple libraries can be set up in one go

```
nuke use-xrepo --spec "imgui 1.91.1 freetype=true" "conan::zlib/1.2.11" "vcpkg::spdlog[wchar]" <etc...>
```

As you can see xrepo also can act like a meta-package-manager for libraries which may not yet been added to the xrepo repository. However their support is more limited than xrepo "native" packages.

`use-xrepo` will not fetch the specified libraries immediately but rather generate build plugins for them, which define `Prepare-<library>` targets. These are all dependent for `Prepare` target of `UnrealBuild` which is then dependent for `Generate`. So after `nuke use-xrepo` running `nuke prepare` or `nuke generate` will fetch and install properly all libraries used in this way. Having an extra build plugin allows the developer to further customize how the library is used, or add extra necessary operations.

`--spec` follows this syntax:

```
provider::name[comma,separated,features] 1.2.3 comma='separated',options=true
```

The `Prepare` and the individual `Prepare-<library>` targets will generate partial module rule classes for the platforms they were invoked for. This is done because libraries may have different requirements based on which platform they're used on / compiled on. The main `MyLibrary.Build.cs` module rule is the place for the developer to add custom logic if that's necessary for the library. Individual `MyLibrary.Platform.Build.cs` partial rules set up includes and libs.

During installation only one platform is considered, and only one platform worth of module rule class will be generated. This means the library should be prepared with all supported platforms or cross-compiled to be able to deploy in a truly cross-platform fashion.

The main benefit of this design is that libraries prepared this way can be further distributed with source but without the need for Nuke.Unreal, or without the need to execute complex behavior from the module rule files. This ensures for example ~~Marketplace~~/Fab compliance of plugins.

### Use library via CMake

```
nuke use-cmake --spec MyLibrary
```

This generates build plugins allowing the developer to prepare libraries via CMake. Fetching and storing the library is the responsibility of the developer. The build plugin is prepared for the most trivial use case when compiling a library via CMake but one may need to modify that depending on the design decisions of the library being used.

### Use header only library

```
nuke use-header-only --spec MyLibrary
```

This will directly generate only the module rule file without the need for extra preparations like with the xrepo or the CMake methods.

## ImplicitBuildInterface plugins

This is simply an interface defined in your main build project. It may not seem very useful until one factors in the following addition to your build csproj:

```XML
  <ItemGroup>
    <Compile Include="../**/*.nuke.cs" />
  </ItemGroup>
```

This means that without any further configuration one can put `.nuke.cs` files anywhere in their project and write scripts in the context of their placement. This is the easiest to configure method requiring the least bboilerplate but obviously it doesn't work on pre-built nuke build-tools.

<details><summary>except...</summary>

if one creates a `csproj` based build plugin which sole purpose is to include source files that way. In that case the prebuilt build tool can discover `.nuke.cs` files provided when compiling the `csproj` plugin.

</details>

Example:

```CSharp
using Nuke.Common;
using Nuke.Unreal;
using Nuke.Cola;
using Serilog;

[ImplicitBuildInterface]
public interface IExtraTargets : INukeBuild
{
    Target TestPlugin => _ => _
        .DependentFor<UnrealBuild>(b => b.Generate)
        .Executes(() =>
        {
            Log.Information($"Hello from folder {this.ScriptFolder()}");
        });
}
```

<details><summary>Open for detailed explanation:</summary>

```CSharp
using Nuke.Common;
using Nuke.Unreal;
using Nuke.Cola;
using Serilog;

// This attribute is necessary so other optional build components wouldn't get used unexpectedly
[ImplicitBuildInterface]
// The build component interface should only declare members with default implementations
// as there's no manual way to provide those in the implementing intermediate build class.
public interface IExtraTargets : INukeBuild
{
    // Define your targets or parameters freely and connect them with the build graph
    // OR the developer can explicitly call them with `nuke test-plugin` in this case
    Target TestPlugin => _ => _

        // Automatically run this target before the Generate target is invoked.
        // `UnrealBuild` is a base build class providing common Unreal related targets and
        // parameters, including `Generate`.
        .DependentFor<UnrealBuild>(b => b.Generate)

        // Finally declare what this target should actually do when invoked
        .Executes(() =>
        {
            // Use this.ScriptFolder() to work with this file's location
            Log.Information($"Hello from folder {this.ScriptFolder()}");
        });
}
```

[Read more about target definitions in NUKE.](https://nuke.build/docs/fundamentals/targets/)

</details>

<mdcomment></mdcomment>