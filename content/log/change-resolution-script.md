## Change Windows screen resolution via scripts
[(10.07.2020)](/c/log/change-resolution-script)

I have an annoying situation that my laptop has a gorgeous 4K OLED screen (oh the suffering), but it doesn't exactly have the graphics power to drive games on that resolution. "It's fine just set the resolution in your game and your non-problem is solved" I hear you say. But there's a slight problem with that. Many games actually use fake borderless fullscreen, which has 2 possible problems:

1. The swapchain is still created at native desktop resolution and ReShade would still render at 4K while the output image should be only 1080p (like Unity games for example)
2. Many programs (including Source games for example) are not handling DPI scaling of windows properly because it's a legacy-compatibility riddled clusterfuck (I've been there, still gives me tremors). As a result the borderless "fullscreen" window is not exactly covering the entire screen, or overshoots a bit.

So to avoid these issues I've been just switching resolutions via the Display Properties, but that's too many clicks, and cumbersome/lame. So I've gone googling for a Powershell solution. Via stack Overflow I found [Andy Schneider's solution](https://gallery.technet.microsoft.com/scriptcenter/2a631d72-206d-4036-a3f2-2e150f297515). Then I realized: hold on a second, this is not Powershell, this is C# with a Power-shell *(badumtsss)*. Although this script is 10 years old and C# back then wasn't exactly that instant to use so I guess that's why.

But it doesn't stop me to slap it on [dotnet-script](https://github.com/filipw/dotnet-script) and run them from a folder I also add to `PATH`. So this is my setup:

```
- folder
  - SetResolution.csx
  - Set1080p.csx
  - Set4K.csx
```

First initialize the folder with dotnet-script so VS Code can do useful auto-completition

```
dotnet script init
```

Then make the `SetResolution.csx` (slightly modified to work with dotnet script)

``` CSharp
using System; 
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential)] 
public struct DEVMODE1 
{ 
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)] 
    public string dmDeviceName; 
    public short dmSpecVersion; 
    public short dmDriverVersion; 
    public short dmSize; 
    public short dmDriverExtra; 
    public int dmFields; 

    public short dmOrientation; 
    public short dmPaperSize; 
    public short dmPaperLength; 
    public short dmPaperWidth; 

    public short dmScale; 
    public short dmCopies; 
    public short dmDefaultSource; 
    public short dmPrintQuality; 
    public short dmColor; 
    public short dmDuplex; 
    public short dmYResolution; 
    public short dmTTOption; 
    public short dmCollate; 
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)] 
    public string dmFormName; 
    public short dmLogPixels; 
    public short dmBitsPerPel; 
    public int dmPelsWidth; 
    public int dmPelsHeight; 

    public int dmDisplayFlags; 
    public int dmDisplayFrequency; 

    public int dmICMMethod; 
    public int dmICMIntent; 
    public int dmMediaType; 
    public int dmDitherType; 
    public int dmReserved1; 
    public int dmReserved2; 

    public int dmPanningWidth; 
    public int dmPanningHeight; 
}; 



class User_32 
{ 
    [DllImport("user32.dll")] 
    public static extern int EnumDisplaySettings(string deviceName, int modeNum, ref DEVMODE1 devMode); 
    [DllImport("user32.dll")] 
    public static extern int ChangeDisplaySettings(ref DEVMODE1 devMode, int flags); 

    public const int ENUM_CURRENT_SETTINGS = -1; 
    public const int CDS_UPDATEREGISTRY = 0x01; 
    public const int CDS_TEST = 0x02; 
    public const int DISP_CHANGE_SUCCESSFUL = 0; 
    public const int DISP_CHANGE_RESTART = 1; 
    public const int DISP_CHANGE_FAILED = -1; 
} 



public class PrimaryScreenResolution 
{ 
    static public string ChangeResolution(int width, int height) 
    { 

        DEVMODE1 dm = GetDevMode1(); 

        if (0 != User_32.EnumDisplaySettings(null, User_32.ENUM_CURRENT_SETTINGS, ref dm)) 
        { 

            dm.dmPelsWidth = width; 
            dm.dmPelsHeight = height; 

            int iRet = User_32.ChangeDisplaySettings(ref dm, User_32.CDS_TEST); 

            if (iRet == User_32.DISP_CHANGE_FAILED) 
            { 
                return "Unable To Process Your Request. Sorry For This Inconvenience."; 
            } 
            else 
            { 
                iRet = User_32.ChangeDisplaySettings(ref dm, User_32.CDS_UPDATEREGISTRY); 
                switch (iRet) 
                { 
                    case User_32.DISP_CHANGE_SUCCESSFUL: 
                        { 
                            return "Success"; 
                        } 
                    case User_32.DISP_CHANGE_RESTART: 
                        { 
                            return "You Need To Reboot For The Change To Happen.\n If You Feel Any Problem After Rebooting Your Machine\nThen Try To Change Resolution In Safe Mode."; 
                        } 
                    default: 
                        { 
                            return "Failed To Change The Resolution"; 
                        } 
                } 

            } 


        } 
        else 
        { 
            return "Failed To Change The Resolution."; 
        } 
    } 

    private static DEVMODE1 GetDevMode1() 
    { 
        DEVMODE1 dm = new DEVMODE1(); 
        dm.dmDeviceName = new String(new char[32]); 
        dm.dmFormName = new String(new char[32]); 
        dm.dmSize = (short)Marshal.SizeOf(dm); 
        return dm; 
    } 
}
```

And finally the `Set*.csx` scripts:

``` CSharp
// Set1080p.csx
#load "SetResolution.csx"

PrimaryScreenResolution.ChangeResolution(1920, 1080);
```

Then just run those scripts from anywhere (assuming you've added the main folder to PATH) if you've associated CSX files with dotnet script properly. If you still need powershell you can do this:

``` powershell
# Set1080p.ps1
dotnet script "$PSScriptRoot\Set1080p.csx"
```

dotnet-script also gives you the ability to compile DLL's from CSX files in which case the PS script would look something like this:

``` powershell
# Set1080p.ps1
Add-Type -Path "$PSScriptRoot\SetResolution.dll"
[PrimaryScreenResolution]::ChangeResolution(1920, 1080)
```

Well that was a sudden brain-fart, I've spent some 20 minutes on, bye!