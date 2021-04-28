## Useless knowledge: Put UE4 generated projects into CMake generated solutions

[(04.28.2021)](/c/log/cmake-your-ue-project)

Because god has abandoned us long ago.

This idea is actually useful when you need to debug your external service built outside of the unique snowflake UBT system for any perfectly valid reason, and test it simultaneously with your Unreal project.

Without further ado, the `CMakeLists.txt` carrying out this blasphemy:

```CMake
cmake_minimum_required(VERSION 3.17)

project(what_am_i_doing)

# other cmake shenanigans, targets, add_subdirectiories, etc ...

# include unreal test projects

set(UE4_PROJECT_PATH "${CMAKE_SOURCE_DIR}/MyUnrealProject/Intermediate/ProjectFiles")

include_external_msproject(
    BackgroundGpuShare
    ${UE4_PROJECT_PATH}/MyUnrealProject.vcxproj
)
set_target_properties(BackgroundGpuShare PROPERTIES
    MAP_IMPORTED_CONFIG_RELEASE         Development
    MAP_IMPORTED_CONFIG_DEBUG           DebugGame
    MAP_IMPORTED_CONFIG_RELWITHDEBINFO  Development
    MAP_IMPORTED_CONFIG_MINSIZEREL      Shipping
)
```

Of course, stating the obvious: generate your Unreal projects first.

For these amazing ideas CMake people were kind enough to unironically have the `include_external_msproject` function which makes this endeavor Super Easy™. As you can see you need to map the CMake conventional configurations to the UBT conventional configurations with `set_target_properties` and `MAP_IMPORTED_CONFIG_<CONFIG>`.

Now about that Super Easy™ part: if you eventually want to build your project as well from that solution of yours, unfortunately UBT will only cooperate when that said solution is sitting next to the respective `.uproject` file. You can achieve this if you run `cmake -G` from your Unreal project folder. Downside is tho, CMake will pollute your tidy Unreal project.

You will not need to include the UE4.vcxproj, but even if you want to, you might not able to do so. The reason is that UE4.vcxproj only has one architecture-config combo: `BuiltWithUnrealBuildTool|Win32` and if you're generating your CMake project for x64 only, Visual Studio will not be able to load the project. As for reference including it would look like this:

```CMake
include_external_msproject(
    UE4
    ${UE4_PROJECT_PATH}/UE4.vcxproj
)
set_target_properties(UE4 PROPERTIES
    MAP_IMPORTED_CONFIG_RELEASE         BuiltWithUnrealBuildTool
    MAP_IMPORTED_CONFIG_DEBUG           BuiltWithUnrealBuildTool
    MAP_IMPORTED_CONFIG_RELWITHDEBINFO  BuiltWithUnrealBuildTool
    MAP_IMPORTED_CONFIG_MINSIZEREL      BuiltWithUnrealBuildTool
)
```

Also be prepared that VS intellisense will get even more confused about the UE4 code than it regularly is. Basically it will not recognize anything and will act completely retarded.

![md.expand](ue4-in-cmake-intellisense.png)

Alright now go and save the world!