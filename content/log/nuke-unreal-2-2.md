<!-- {
    "title": "Nuke.Unreal 2.2",
    "desc": "Automate the tasks involved in creating Fab complaint plugins and other useful scripts"
} -->

# Nuke.Unreal 2.2
[(15.08.2025)](/c/log/nuke-unreal-2-2)

![_parallax(side) notInArticle](../nu_logo.svg)

<tocmd>

- [Nuke.Unreal 2.2](#nukeunreal-22)
- [New Features!](#new-features)
  - [Setting up for plugin development](#setting-up-for-plugin-development)
  - [Passing command line arguments to Unreal tools](#passing-command-line-arguments-to-unreal-tools)
    - [Custom UBT or UAT arguments](#custom-ubt-or-uat-arguments)
  - [Semi-auto Runtime Dependencies](#semi-auto-runtime-dependencies)

</tocmd>

Nuke.Unreal 2.2 is released:

* Unreal Engine 4 support is in legacy only. No new features will explicitly target it. Switch to 5 already.
* `--unreal-version` became `--unreal` and can accept engine path as well.
* Revamped plugin distribution workflow to be a library instead of predefined targets
  * This means `IPluginTargets` is removed.
  * Have a semi-automated workflow for working with runtime dependencies.
    * Including maintaining Fab compatibility
  * Automatically generate `FilterPlugin.ini`.
  * Create distributable plugin source packages which doesn't rely on Nuke.
  * Better compliance with Fab.
* Switching engine versions are a lot easier now with `switch` target
* Directly run Unreal executables.
  * Explicit target for UAT, UBT
  * Run editor commandlet
  * Enter Unreal shell
* Passing command line arguments to Unreal tools have no extra jank now
* Project and Plugin descriptors are mirrored in C# from UBT

Install to your project with:
```
Set-ExecutionPolicy Unrestricted -Scope Process -Force; iex (iwr 'https://raw.githubusercontent.com/microdee/Nuke.Unreal/refs/heads/main/install/install.ps1').ToString()
```

# New Features!

## Setting up for plugin development

A little bit of theory: Unreal plugins are simple on the surface but easily can get very complicated to handle especially when they need to interact with the non-unreal world. For this reason it is recommended to break up development and distribution of Unreal plugins into multiple stages:

![_expand](PluginStages.drawio.svg)

Nuke.Unreal lives in the "**True Plugin Source**" stage *(whatever that may look like in your software architecture)* and helps to deliver it to further distribution stages.

Plugins can be managed by creating your own targets to handle them. You can do that inside either your main build class, or glue that logic to your Unreal plugin in its folder structure via [Nuke.Cola build plugins](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#build-plugins). The simplest method of which is [standalone `*.nuke.cs` files](https://github.com/microdee/md.Nuke.Cola?tab=readme-ov-file#implicitbuildinterface-plugins) which are compiled with the build project.

Let's have this scaffolding as an example:

```
<project root>
│   MyUnrealProject.uproject
├── .nuke
├── Content, Build, etc...
├── Nuke.Targets
│       Build.cs
│       Nuke.Targets.csproj (main build script)
└── Plugins
    └── MyPlugin
        │   MyPlugin.nuke.cs
        ├── Source
        │   └── MyModule
        │       │   MyModule.nuke.cs
        │       └── <source files>
        └── <regular plugin files>
```

Build interfaces (or in Nuke vocabulary "[Build Components](https://nuke.build/docs/sharing/build-components/)") decorated with `[ImplicitBuildInterface]` inside these `*.nuke.cs` files will automatically contribute to the build graph without further boilerplate.

```CSharp

// MyModule.nuke.cs
using Nuke.Common;
using Nuke.Cola;
using Nuke.Cola.BuildPlugins;
using Nuke.Unreal;

namespace Nuke.MyModule;

[ImplicitBuildInterface]
public interface IMyModuleTargets : INukeBuild
{
    Target PrepareMyModule => _ => _
        .Executes(() =>
        {
            var self = (UnrealBuild)this;

            // This will automatically fetch the plugin which owns this particular script.
            // These plugin objects are shared among all targets and they can all manipulate their aspects
            var thisPlugin = UnrealPlugin.Get(this.ScriptFolder());

            // This module has some runtime dependencies which it needs to sort out
            // This function gets the plugin in itself, no need to use thisPlugin here
            // See exact usage of this in section "Semi-auto Runtime Dependencies"
            self.PrepareRuntimeDependencies(this.ScriptFolder(), /* ... */);
        });
}

// MyPlugin.nuke.cs
using Nuke.Common;
using Nuke.Cola;
using Nuke.Cola.BuildPlugins;
using Nuke.Unreal;
namespace Nuke.MyPlugin;

[ImplicitBuildInterface]
public interface IMyPluginTargets : INukeBuild
{
    Target PrepareMyPlugin => _ => _
        .DependentFor<UnrealBuild>(u => u.Prepare)
        .DependsOn<IMyModuleTargets>()
        .Executes(() =>
        {
            // This will automatically fetch the plugin which owns this particular script.
            // These plugin objects are shared among all targets and they can all manipulate their aspects
            var thisPlugin = UnrealPlugin.Get(this.ScriptFolder());

            // Do extra logic scoped for the plugin...
        });
    
    Target DistributeMyPlugin => _ => _
        .DependsOn(PrepareMyPlugin)
        .Executes(() =>
        {
            // Create a copy of this plugin which can be distributed to other developers or other tools
            // who shouldn't require extra non-unreal related steps to work with it.
            // You can upload the result of this to Fab.
            var (files, outputDir) = UnrealPlugin.Get(this.ScriptFolder()).DistributeSource();

            // Do something with the affected files or in the output directory...
        });
    
    Target BuildMyPlugin => _ => _
        .DependsOn(PrepareMyPlugin)
        .Executes(() =>
        {
            // Build this plugin with UAT for binary distribution
            var outputDir = UnrealPlugin.Get(this.ScriptFolder()).BuildPlugin();

            // Do something in the output directory...
        });
}
```

And call them later with

```
> nuke prepare-my-plugin
> nuke distribute-my-plugin
> nuke build-my-plugin
```

You have absolute freedom to organize the task-dependency graph around handling your plugins. For example one target may manipulate multiple plugins even, from a dynamic set of folders. The above example is just a simple use-case.

## Passing command line arguments to Unreal tools

In some targets Nuke.Unreal allows to pass custom command line arguments for Unreal tools. This is only necessary for advanced use cases, and for prototyping. In almost all cases once a workflow is developed with these custom arguments it is recommended to solidify them into a custom target, or use the plathera of customization and modularization points Nuke.Unreal offers.

Command line arguments are passed with the `-->` sequence, anything after such sequence will be passed directly to tools. This is dubbed as "argument blocks". The precise usage of them depends on the specific target being used. Multiple argument blocks can be named and used by targets. A block ends when another one starts or when it's the end of the command line input.

In all cases Nuke.Unreal provides some variables so the user don't need to repeat long paths. These variables are replaced at any position of the text of any argument. These variables are:

```
   ~p - Absolute path of the .uproject file
~pdir - Absolute folder containing the .uproject file
  ~ue - Absolute path to the engine root
```

For example

```
> nuke run --tool editor-cmd --> ~p -run=MyCommandlet
UnrealEditor-Cmd.exe C:\Projects\Personal\MyProject\MyProject.uproject -run=MyCommandlet
```

### Custom UBT or UAT arguments

When invoking common tasks Nuke.Unreal supports passing extra custom arguments to UBT or UAT via `-->ubt` or `-->uat`. Anything passed behaind these or in-between these will be passed to their respective tool.

This is especially useful for doing temporary debugging with UBT and the compiler: (not an actual usecase)
```
> nuke build ... -->ubt -CompilerArguments="/diagnostics:caret /P /C" -DisableUnity
> nuke build ... -->ubt -LinkerArguments=/VERBOSE
> nuke build ... -->ubt -Preprocess
```
## Semi-auto Runtime Dependencies

Some third-party libraries or solutions may come with a lot of binary dependencies, which needs to be organized neatly into specific folders when distributing the project. Module rules provide a mechanism for managing arbitrary runtime dependencies, and UAT will distribute them when packaging. However when there's a lot of files in elaborate folder structure it is quite a chore to list them all in module rules.

Nuke.Unreal comes with a feature dubbed "Auto Runtime Dependencies" which can generate partial module rules sorting them out for each platform and configuration. This is only meant to be used for large, prebuilt libraries ususally downloaded or pre-installed for a project. Libraries fetched in other ways like the XRepo workflow, doesn't need this feature, as the same problem is solved there in a different way.

Here's the overview of the usage of `PrepareRuntimeDependencies` function:

1. Provide a source folder for the runtime dependencies
2. Provide a set of locations in runtime, relative to the destination folder serving as runtime library paths (ideally one for each supported platforms). This may be used as base folders to load DLL's from.
3. If applicable provide pattern matching functions to determine the platform and configuration for individual files
4. To control the destination folder structure `PrepareRuntimeDependencies` may pick up a folder composition manifest file called "RuntimeDeps.yml" (by default this can be also overridden)
5. If no such manifest is available one can be passed directly in C#

The module rule will copy output files on building the project to `<plugin-directory>/Binaries/<binariesSubfolder>/<moduleName>`. Where `binariesSubfolder` is "ThirdParty" by default.

For example have the following file structure of a module representing a third-party library:

```
TpModule
├── ...
├── LibraryFiles
│   ├── includes ...
│   └── lib
│       ├── win_amd64
│       │   ├── rel
│       │   │   ├── libtp.lib
│       │   │   └── *.dll
│       │   └── debug
│       │       ├── libtp.lib
│       │       └── *.dll
│       └── linux_x86_64
│           ├── rel
│           │   ├── libtp.lib
│           │   └── *.so
│           └── debug
│               ├── libtp.lib
│               └── *.so
├── RuntimeDeps.yml
├── TpModule.Build.cs
└── TpModule.nuke.cs
```

```yaml
# RuntimeDeps.yml
copy:
  - file: LibraryFiles/win_amd64/rel/*.dll
    as: Win64/Release/$1.dll
  - file: LibraryFiles/win_amd64/debug/*.dll
    as: Win64/Debug/$1.dll
  - file: LibraryFiles/linux_x86_64/rel/*.so
    as: Linux/Release/$1.so
  - file: LibraryFiles/linux_x86_64/debug/*.so
    as: Linux/Debug/$1.so
```

```CSharp
// TpModule.Build.cs

using System;
using UnrealBuildTool;

public partial class TpModule : ModuleRules
{
    public TpModule(ReadOnlyTargetRules target) : base(target)
    {
		Type = ModuleType.External;
        SetupRuntimeDependencies(target);
    }
    partial void SetupRuntimeDependencies(ReadOnlyTargetRules target);
}
```

```CSharp
// TpModule.nuke.cs

using Nuke.Common;
using Nuke.Cola;
using Nuke.Cola.BuildPlugins;
using Nuke.Unreal;

[ImplicitBuildInterface]
public interface IMyPluginTargets : INukeBuild
{
    Target PrepareMyPlugin => _ => _
        .Executes(() =>
        {
            this.PrepareRuntimeDependencies(
                this.ScriptFolder(),
                [
                    new() {
                        Path = (RelativePath)"Win64/Release",
                        Config = RuntimeDependencyConfig.Release,
                        Platform = UnrealPlatform.Win64
                    },
                    new() {
                        Path = (RelativePath)"Win64/Debug",
                        Config = RuntimeDependencyConfig.Debug,
                        Platform = UnrealPlatform.Win64
                    },
                    new() {
                        Path = (RelativePath)"Linux/Release",
                        Config = RuntimeDependencyConfig.Release,
                        Platform = UnrealPlatform.Linux
                    },
                    new() {
                        Path = (RelativePath)"Linux/Debug",
                        Config = RuntimeDependencyConfig.Debug,
                        Platform = UnrealPlatform.Linux
                    },
                ],
                determineConfig: f =>
                    f.ToString().Contains("rel")
                    ? RuntimeDependencyConfig.Release
                    : f.ToString().Contains("debug")
                    ? RuntimeDependencyConfig.Debug
                    : RuntimeDependencyConfig.All
                ,
                determinePlatform: f =>
                    f.ToString().Contains("win_amd64")
                    ? UnrealPlatform.Win64
                    : f.ToString().Contains("linux_x86_64")
                    ? UnrealPlatform.Linux
                    : UnrealPlatform.Independent
            );
        });
}
```

<details>
<summary>Will generate a partial module rule file:</summary>

```CSharp

// TpModule.Rtd.Build.cs
// This is an automatically generated file, do not modify

using System;
using UnrealBuildTool;

public partial class TpModule : ModuleRules
{
	void HandleRuntimeLibraryPath(string path)
	{
		PublicRuntimeLibraryPaths.Add($"{PluginDirectory}/{path}");
		PublicDefinitions.Add($"TPMODULE_DLL_PATH=TEXT(\"{path}\")");
	}

	void HandleRuntimeDependency(string from, string to) =>
		RuntimeDependencies.Add(
			$"{PluginDirectory}/{from}", $"{PluginDirectory}/{to}",
			StagedFileType.SystemNonUFS
		);

	partial void SetupRuntimeDependencies(ReadOnlyTargetRules target)
	{
		var Win64 =       target.Platform == UnrealTargetPlatform.Win64;
		var Mac =         target.Platform == UnrealTargetPlatform.Mac;
		var Linux =       target.Platform == UnrealTargetPlatform.Linux;
		var LinuxArm64 =  target.Platform == UnrealTargetPlatform.LinuxArm64;
		var Android =     target.Platform == UnrealTargetPlatform.Android;
		var IOS =         target.Platform == UnrealTargetPlatform.IOS;
		var TVOS =        target.Platform == UnrealTargetPlatform.TVOS;
		var VisionOS =    target.Platform == UnrealTargetPlatform.VisionOS;
		var Independent = true;

		var Debug = target is
		{
			Configuration: UnrealTargetConfiguration.Debug,
			bDebugBuildsActuallyUseDebugCRT: true
		};
		var Release = !Debug;
		var All = true;

		if (Release && Win64) HandleRuntimeLibraryPath("Binaries/ThirdParty/TpModule/Win64/Release");
		if (Debug && Win64) HandleRuntimeLibraryPath("Binaries/ThirdParty/TpModule/Win64/Debug");
		if (Release && Linux) HandleRuntimeLibraryPath("Binaries/ThirdParty/TpModule/Linux/Release");
		if (Debug && Linux) HandleRuntimeLibraryPath("Binaries/ThirdParty/TpModule/Linux/Debug");

		if (Release && Win64) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/win_amd64/rel/foo.dll", "Binaries/ThirdParty/TpModule/Win64/Release/foo.dll");
		if (Release && Win64) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/win_amd64/rel/bar.dll", "Binaries/ThirdParty/TpModule/Win64/Release/bar.dll");
		if (Release && Win64) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/win_amd64/rel/etc.dll", "Binaries/ThirdParty/TpModule/Win64/Release/etc.dll");
		if (Debug && Win64) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/win_amd64/debug/foo.dll", "Binaries/ThirdParty/TpModule/Win64/Debug/foo.dll");
		if (Debug && Win64) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/win_amd64/debug/bar.dll", "Binaries/ThirdParty/TpModule/Win64/Debug/bar.dll");
		if (Debug && Win64) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/win_amd64/debug/etc.dll", "Binaries/ThirdParty/TpModule/Win64/Debug/etc.dll");
		if (Release && Linux) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/linux_x86_64/rel/foo.so", "Binaries/ThirdParty/TpModule/Linux/Release/foo.so");
		if (Release && Linux) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/linux_x86_64/rel/bar.so", "Binaries/ThirdParty/TpModule/Linux/Release/bar.so");
		if (Release && Linux) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/linux_x86_64/rel/etc.so", "Binaries/ThirdParty/TpModule/Linux/Release/etc.so");
		if (Debug && Linux) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/linux_x86_64/debug/foo.so", "Binaries/ThirdParty/TpModule/Linux/Debug/foo.so");
		if (Debug && Linux) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/linux_x86_64/debug/bar.so", "Binaries/ThirdParty/TpModule/Linux/Debug/bar.so");
		if (Debug && Linux) HandleRuntimeDependency("Source/ThirdParty/TpModule/LibraryFiles/lib/linux_x86_64/debug/etc.so", "Binaries/ThirdParty/TpModule/Linux/Debug/etc.so");

		if (Release && Win64) PublicDelayLoadDLLs.Add("foo.dll");
		if (Release && Win64) PublicDelayLoadDLLs.Add("bar.dll");
		if (Release && Win64) PublicDelayLoadDLLs.Add("etc.dll");
		if (Debug && Win64) PublicDelayLoadDLLs.Add("foo.dll");
		if (Debug && Win64) PublicDelayLoadDLLs.Add("bar.dll");
		if (Debug && Win64) PublicDelayLoadDLLs.Add("etc.dll");
		if (Release && Linux) PublicDelayLoadDLLs.Add("foo.so");
		if (Release && Linux) PublicDelayLoadDLLs.Add("bar.so");
		if (Release && Linux) PublicDelayLoadDLLs.Add("etc.so");
		if (Debug && Linux) PublicDelayLoadDLLs.Add("foo.so");
		if (Debug && Linux) PublicDelayLoadDLLs.Add("bar.so");
		if (Debug && Linux) PublicDelayLoadDLLs.Add("etc.so");
		
		var dllList = string.Join(',', PublicDelayLoadDLLs.Select(d => $"TEXT(\"{d}\")"));
		PublicDefinitions.Add($"TPMODULE_DLL_FILES={dllList}");
	}
}
```

</details>

This is of course a toy example. As you can see though this may end up with quite a lot of boilerplate code, so again this is only recommended for libraries which needs a non-trivial folder structure of files and DLL's for its runtime.

<mdcomment></mdcomment>