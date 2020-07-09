# UE4 UMG Widgets in design time

(08.07.2020)

UE4 UMG is in this weird superposition between being bare-bones simplistic and super versatile to work with. I meant this statement of-course only for UMG and the tools the Editor provides to design your widgets. Slate (the actual low level (and in my opinion awesome) UI framework in Unreal) is a completely different story.

I find it fascinating actually that you can apply materials (read pixel/vertex shaders) to everything capable having a Brush. Unfortunately though the sole reason you'd do that is to have dynamic parametrized visuals, sometimes controlled by the properties of your UMG widget. In that case however, with vanilla engine, you don't have a live preview about your changes in the widget designer. This can introduce some hard friction to design time, since in order to see your changes you need to at least start playing in the editor.