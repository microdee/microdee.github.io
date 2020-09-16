# boost::graph + UE4

We work for [HERE](/c/works/here2020/insights) [again](/c/works/here2019/insights), and this year I'm attempting to make our presentations slightly smarter than what we've done for [CES 20](/c/works/here2020/insights) especially the immersive 3D narrative entities. For that I've set the objective to make an automated routing system, so our artists can avoid animating 16 stories each with 2 or more possible path states (at least according to initial drafts).

I could convince managers to spend a week on a more automated solution, rather than crying blood during crunchtime. I'm sure we will never regret this decision and everything will work out A. O. K. ...

Anyway, we have a stylized view of some roads probably of a city, and we tell stories about how much life is better with the HERE products and how we could even live without those in less fortunate times. Most if not all of them is about getting from place A to place B with less surprises or less trouble.

### The gist of it

It's a classic problem, can be solved with graphs and once we have that we can start having meaningful discussions about our roads. The start/end points and the intersections are the vertices, and the roads inbetween are the edges of our graph. For Dijkstra path finding we can specify weights for our edges, or in our case the cost of traversing that road. Cost here is a cumulative phrase, inclusive of the length and arbitrary modifiers (like weather conditions, constructions, accidents, etc, which you wouldn't know about during route planning without the products).

## BlueGraph

For simplicity I'm creating a separate plugin dealing with the graph operations under the hood. This is dubbed **BlueGraph**. It provides interfaces and usage patterns to work with **BGL** from the UE4 facade.

One graph is managed by an actor component `UGraphRootComponent`. All other actors representing edges and vertices are attached actors to this component's parent actor so artists can maintain their freedom.

`IGraphEntity` is the base interface providing some common functionality for both edges and vertices. Its members are only accessible to C++ code, as it's kinda violating the interface pattern for having a simple change notifications system.

```C++
DECLARE_MULTICAST_DELEGATE_OneParam(FGraphEntityChangedDel, TScriptInterface<IGraphEntity>);

class IGraphEntity
{
public:
    FGraphEntityChangedDel OnChanged;
};

UCLASS(...)
class UGraphFunctionLib : UBlueprintFunctionLibrary
{
public:
    static void InvokeOnChanged(TScriptInterface<IGraphEntity> Entity)
    {
        Entity.GetObject()->OnChanged.Broadcast(Entity);
    }
};
```

**Vertices** are represented by components inheriting from `IGraphVertex`. For convenience there's a simple implementation of that, `UGraphVertexComponent` which basically doesn't do anything, other than providing a reference to be used by edges, and because it's inheriting from `USceneComponent`, it can provide a place in the world.

```C++
class IGraphVertex
{
    // Empty class
};
```

**Edges** are represented by components inheriting from `IGraphEdge`. For now BlueGraph graphs are only supporting directional graphs, so there can be any number of edges between vertices each with its own direction and weight. `IGraphEdge` exposes the following functions:

```C++
class IGraphEdge
{
public:
    UFUNCTION(...)
    virtual TScriptInterface<IGraphVertex> GetStartVertex();

    UFUNCTION(...)
    virtual TScriptInterface<IGraphVertex> GetEndVertex();

    UFUNCTION(...)
    virtual float GetWeight();
};
```

There are two convinience components virtually implementing these for you: `UGraphEdgeComponent` and `UGraphSplineEdgeComponent`. The former just connects two vertices with 0 weight, the latter can handle an arbitrary spline path between 1 or 2 vecrtices. `UGraphSplineEdgeComponent` calculates the weight depending on the length of the spline. Optionally it can take into account the scale of the spline points while calculating the weight. It can only work with `UGraphVertexComponent`, to stitch the first and the last points in the spline to the associated vertices.

### Interacting with algorithms

`UGraphRootComponent` exposes some algorithms available in BGL. Most importantly finding the shortest/cheapest path between two arbitrary vertices, or more accurately calculating the weighted distances of all the vertices from one vertex. Algorithms are invoked with just regular function calls and they return result objects through latent actions.

All algorithm functions return an `FGraphAlgorithmResult` structure and it's up to the caller how they want to treat it.

```C++
USTRUCT(...)
struct FGraphAlgorithmResult
{
    UPROPERTY(...)
    UGraphRootComponent* Origin;

    UPROPERTY(...)
    bool bSuccessful;
}
```

Here's an example output for path finding algorithms:

```C++
USTRUCT(...)
struct FVertexDistanceData
{
    UPROPERTY(...)
    TScriptInterface<IGraphVertex> Vertex;

    UPROPERTY(...)
    TArray<TScriptInterface<IGraphEdge>> Path;
    
    UPROPERTY(...)
    int Steps;
    
    UPROPERTY(...)
    float Cost;
};

USTRUCT(...)
struct FGetVertexDistanceResult : FGraphAlgorithmResult
{
    UPROPERTY(...)
    TArray<FVertexDistanceData> Distances;

    UPROPERTY(...)
    bool bOnlyKeptForTarget;
}
```

And finally if we'd want to construct a route consisting of splines, we can write a helper function joining together the splines of involved `UGraphSplineEdgeComponent`'s.

```C++
UCLASS(...)
class UGetVertexDistanceResult : UBlueprintFunctionLibrary
{
public:
    static USplineComponent* GetSplineFromPath(const FGetVertexDistanceResult& AlgResult, USceneComponent* Parent);
}
```

Because the function generates a new spline component, it needs a parent USceneComponent to be provided by the developer.