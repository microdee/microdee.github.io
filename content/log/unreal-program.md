## Useless knowledge: Make programs with UE

[(05.07.2021)](/c/log/unreal-program)

![md.parallax md.not-in-article](wiity.jpg)

What if I told you, Unreal Engine is a C++ framework, and as such you can make arbitrary programs with it, without all the Game-engine related bloat. Now there are not too many reasons to make such applications but here are couple really persuasive ones:

* Slate, and its inline-declarative C++ syntax is a pretty damn cool cross-platform UI framework
* Need to work with Unreal assets
* Need to use something Unreal already solved
* Stockholm-syndrome

Now this is not news for anyone who worked with UE source before. There are a wide-range of program targets in there which is compiled to its own executable or DLL, such as the Unreal Build Tool (UBT) itself. But these programs suggested a very tight and local relationship with the engine source itself, you cannot just plop a target file anywhere else and expect UBT to just pick it up and build it...

*Or can you???*

To my great surprise when I created the bare minimum of a `.uproject` file, and I had a single target in its Source folder with `Type = TargetType.Program;` set, Unreal Engine did pick it up without a problem and I could compile an arbitrary executable in its Binaries folder without any game-code. [Check out this simple command line tool](https://github.com/microdee/UnrealLocator) to demonstrate this. (Nuke.Unreal also uses this tool to find UE installations)

Now about that *"without a problem"* part. You will still need the UE repository cloned and built, and that `.uproject` file needs to associate themselves with that engine repo:

```  
{
    "FileVersion": 3,
    "EngineAssociation": "C:/programs/UnrealEngine",
    "Category": "",
    "Description": "",
    "Modules": [
        {
            "Name": "UnrealLocator",
            "Type": "Runtime",
            "LoadingPhase": "Default"
        }
    ],
    "TargetPlatforms": [
        "WindowsNoEditor"
    ]
}
```

And only then the "Generate Visual Studio project files" will work from the right-click context menu. The generated VS solution will include all the other programs from the engine sources as well as your own, but you can ignore the others completely. Before you click "Build Solution" make sure to exclude those vanilla programs from the build, OR just build your program exclusively, **OR** use [Nuke.Unreal](/c/log/nuke-unreal).

If you don't want to fiddle with Visual Studio or Rider or other heavy weight IDE for that matter, you can also work with [Nuke.Unreal](/c/log/nuke-unreal) and build your program fully from the console/terminal.

```Powershell
nuke build --config debug
```

or if you have multiple UProjects, you can specify your program

```Powershell
nuke build --program MyProgram --config debug
```

*(may I add for each word there (including the name of the program) TAB autocomplete will work, if Nuke global tool is set up correctly)*

Nuke.Unreal provides now a new target base class `ProgramTargets<>` which can also work with multiple `.uproject` files. Not to misunderstand, you can put as many Program Targets in your single UProject as you'd like, I just didn't want to limit freedom of scaffolding there.

This is what the Nuke build targets class looks like for UnrealLocator: [Build.cs](https://github.com/microdee/UnrealLocator/blob/main/Nuke.Targets/Build.cs)

Don't take it yet as 100% committed way of listing your `.uproject`'s like that, I can see it feeling like somewhat too much C# boilerplate, but in exchange you get type safety and compile time / development time errors in case you misspell or forget something. I might even make a simpler base class for Unreal programs with only a single `.uproject`

I haven't tested Unreal plugins and to be fair I give them like 45% chance of working, as this is already flakey territory in regards of Officially Supported Use-cases™. I can totally imagine that you need to load them yourself in runtime, but who knows, it might as well just work.

Now go and eat your vegetables!

<mdcomment />