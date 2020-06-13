Create your viewport class:

**MyGameVpClient.h**
```
#include "GameFramework/PlayerController.h"

...

/**
 * Custom viewport client to arrange player regions on screen
 */
UCLASS()
class MYPROJECT_API UMyGameVpClient : public UGameViewportClient
{
	GENERATED_BODY()
public:
	void LayoutPlayers() override;
};
```

**MyGameVpClient.cpp**
```

void UMyGameVpClient::LayoutPlayers()
{
	// Deliberately empty
}
```

Then in your player controller class somewhere

```
	if(!GetLocalPlayer()) return;
	GetLocalPlayer()->Size = /* FVector2D with 0..1 range */;
	GetLocalPlayer()->Origin = /* FVector2D with 0..1 range */;
```

then change `Game Viewport Client` class in your project settings from default to your class.
