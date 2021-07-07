## Elegant™ vector swizzling in C++

[(07.07.2021)](/c/log/swizzle)

![md.parallax md.not-in-article](swizzle-sticks.jpg)

[Vector swizzling](https://en.wikipedia.org/wiki/Swizzling_(computer_graphics)) is when you can get / assign the components of your vector in any order at once. In HLSL or GLSL it looks like this:

```HLSL
    float4 A = {1, 2, 3, 4};
    float2 B = {5, 6};

    A.xyz = B.xyx;
    // A == {5, 6, 5, 4}
```

Which is really handy and concise even if sometimes it can hide important structural decisions of your program. There are of course couple of libraries which enable you swizzling, but most of the time they rely on generated code, catering for each combination of component setters/getters for all dimensions.

Recently I've been brewing a templated version where one can do this: (equivalent for the above HLSL code)

```Cpp
    FVector4 A{ 1, 2, 3, 4 };
    FVector2D B{ 5, 6 };

    sw<'xyz'>(A) = sw<'xyx'>(B);
    // A == {5, 6, 5, 4}
```

[For the impatient check out the full code](https://gist.github.com/microdee/1b865d71af9568329a91fe6de547edc7)

Not as natural as simple `.xyz` syntax but this is the closest I could get. This method doesn't use macro magic, doesn't rely on code generation, almost 0 copy (we do need to copy on getters), no external library, and type-safe.

Now notice the template argument for our component selection text `<'xyz'>`. That's right, it's a multi-character constant with single quotes! The template argument for it is actually an `int`, which gives us 4 characters. I hope that 99% of times 4 dimensions are enough for your vectors of your game or whatever non scientific.

The method relies on `constexpr` functions and some bit-shifting.

First our stupid vector types:

```Cpp
// Define our stupid vector types
// for example the big-brain genius Unreal Engine vector types
struct FVector2D
{
    float X; float Y;
};
struct FVector
{
    float X; float Y; float Z;
};
struct FVector4
{
    float X; float Y; float Z; float W;
};
```

Notice this method only works when XYZW components are in a continuous region of memory (such as these structs). You will see why later.

Then we associate our vectors with their dimension (because our vectors are stupid, remember?)

```Cpp
// and fail everywhere else
template<int Dim> struct vec { /* fail when unknown */ };

template<> struct vec<1> { using type = float; };
template<> struct vec<2> { using type = FVector2D; };
template<> struct vec<3> { using type = FVector; };
template<> struct vec<4> { using type = FVector4; };

template<int Dim> using vec_t = vec<Dim>::type;
```

One can also specify maybe a scalar type as a template argument, but that's outside of the scope of this idea. Treat that as a homework. We will just rely on floats here now.

First we get the number of dimensions we have. Because our use-case is limited to 4 dimensions we can do this:

```Cpp
// get the total output dimensions of our swizzle text
// so 'x' will return 1 or 'xxx' will return 3
template<typename T>
constexpr int dimension(T inp)
{
    int s = inp > 0;
    if(inp > 0xFF) ++s;
    if(inp > 0xFFFF) ++s;
    if(inp > 0xFFFFFF) ++s;
    return s;
}
```

Now we get the bytes. Here's a slight problem though: this expression must be executed inside template arguments. In this case using an union is not very stable and using pointer arithmetics are not allowed at all. So we're forced to use bit-shifting. With that tho comes another problem: bit-wise operations happens on binary number form, not on the bytes in storage (thank god). This means `'xy'` is `0x00007879`. We want our `get_byte` function to return 'x' on `i=0`, not 'y'. So we have to flip the order in our `get_byte` function before we can use it:

```Cpp
// we do bitshifting shenanigans to get our component characters
// but we reverse the index first so the multichar constants
// can be queried as a regular array
template<typename T>
constexpr int get_byte(T storage, int i)
{
    int dims = dimension(storage);
    
    // protect the index to not go out of bounds
    int id = i >= dims ? dims-1 : i;
    return (storage >> ((dims - 1 - id) * 8)) & 0xFF;
}
```

Then we map the axis/component characters to their `0..3` indexer.

```Cpp
// we map our component characters to component indices
constexpr int map_comp_char(int c, int index = 'xyzw')
{
    for(int i=0; i<sizeof(index); i++)
    {
        if(c == get_byte(index, i))
            return i;
    }
    return 0x7FFFFFFF;
}
```

Notice that we can introduce here our index map. In our case it's 'xyzw' but HLSL for example also allows `rgba`.

We can bake that variant in like this:

```Cpp
constexpr int map_comp_char_impl(int c, int index = 'xyzw') { /* defined above */ }

constexpr int map_comp_char(int c)
{
    if(auto res = map_comp_char_impl(c, 'xyzw') != 0x7FFFFFFF) return res;
    if(auto res = map_comp_char_impl(c, 'rgba') != 0x7FFFFFFF) return res;
    // rest of the individually unique set of allowed dimension characters
    return 0x7FFFFFFF;
}
```

In order to check input requirements we also need to detect what is the smallest vector our swizzle text indicate. For example 'xxx' might yield a 3D vector, but it only needs to read from a scalar (1D vector). Another example would be 'xyxy' yields 4D vector, but it only needs the input to be a 2D vector.

```Cpp
// get the minimum input dimensions required by a swizzle text
template<typename T>
constexpr int get_min_dims(T storage, int index = 'xyzw')
{
    int s=0;
    for(int i=0; i<sizeof(T); ++i)
    {
        int currChar = get_byte(storage, i);
        if(currChar == 0) continue;
        int curr_c = map_comp_char(currChar, index);
        if(s < curr_c) s = curr_c;
    }
    return s + 1;
}
```

Then finally get the value of a vector's component:

```Cpp
// get (a reference to) an individual component of a vector
template<typename InVecT, typename OutCompT = float>
OutCompT& get_comp(InVecT& in_vec, int d)
{
    // Maybe implement your own failure, skipping this check can be unsecure
    if(d >= (sizeof(InVecT) / sizeof(OutCompT)))
        d = 0;

    OutCompT* addr = const_cast<OutCompT*>(
        reinterpret_cast<const OutCompT*>(&in_vec)
    );
    return *(addr + d);
}

// we specialize for float/scalars
template<>
float& get_comp<float, float>(float& in_vec, int d)
{
    return in_vec;
}
```

This is no longer a `constexpr` function so we can use reinterpret_cast and pointer arithmetic. This comes handy because we're not returning a copy of the component, we're returning a reference to it, so we can use this for assignment too. Because of that pointer shifting we assume that components are sequentially aligned in memory. (for the sake of keeping it simple)

Next some extra bit of flare: I originally wanted this to work the same way as HLSL vectors. So `A.xz = float2(1, 2)` would correctly set the first and the third axis of vector A from the 2 axes of the input 2D vector. For this kind of operation we will need an intermediary struct in C++, which handles creating an output vector when getting, and correctly assigning axes from an input vector when setting.

```Cpp
// We create an assigner struct which is returned by sw()
// and allows to assign right hand side vectors or scalars
// to any component with a natural syntax.
// We will also use inheritence to slightly reduce code repetition
// when specializing for scalar right hand side assignment input.
// If we wouldn't specialize there can be cases where our assignment
// overload would be defined twice
template<int SwizzText, typename LeftVecT, typename RightVecT>
struct assigner_base
{
    // we hold the assignee as a reference
    LeftVecT& left;

    // this is basically our getter for our swizzling
    operator vec_t<dimension(SwizzText)> ()
    {
        vec_t<dimension(SwizzText)> Output;
        for(int i=0; i<dimension(SwizzText); i++)
        {
            auto curr_c = map_comp_char(get_byte(SwizzText, i));
            get_comp(Output, i) = get_comp(left, curr_c);
        }
        return Output;
    }
    
    // per-component operation where T is float(int c, int i)
    template<typename T>
    void operation_base(T op)
    {
        for(int i=0; i<dimension(SwizzText); i++)
        {
            auto curr_c = map_comp_char(get_byte(SwizzText, i));
            get_comp(left, curr_c) = op(i);
        }
    }

    // assign a right hand side vector components to the
    // components of the left vector specified by SwizzText
    // and for the heck of it I've added incremental operators
    void operator = (const RightVecT& right)
    {
        operation_base([&](int, int i) { return get_comp(right, i); });
    }

    void operator *= (const RightVecT& right)
    {
        operation_base([&](int c, int i) { return get_comp(left, c) * get_comp(right, i); });
    };

    void operator /= (const RightVecT& right)
    {
        operation_base([&](int c, int i) { return get_comp(left, c) / get_comp(right, i); });
    };

    void operator += (const RightVecT& right)
    {
        operation_base([&](int c, int i) { return get_comp(left, c) + get_comp(right, i); });
    };

    void operator -= (const RightVecT& right)
    {
        operation_base([&](int c, int i) { return get_comp(left, c) - get_comp(right, i); });
    };

    void operator --()
    {
        operation_base([&](int c, int) { return get_comp(left, c) - 1.0f; });
    };

    void operator ++()
    {
        operation_base([&](int c, int) { return get_comp(left, c) + 1.0f; });
    };
};
```

HLSL also allows this: `A.xyz = 1.0f`, in other words, assign all components to a single input scalar. With templated swizzling it would look like this: `sw<'xyz'>(A) = 1.0f` So we create a second overload operator for scalar assignment:

```Cpp
// Assigner for more than one target components
template<int SwizzText, typename LeftVecT, typename RightVecT>
struct assigner : public assigner_base<SwizzText, LeftVecT, RightVecT>
{
    using super_t = assigner_base<SwizzText, LeftVecT, RightVecT>;
    
    // allow scalars to be assigned to multiple components
    void operator = (const float& right)
    {
        super_t::operation_base([&](int, int) { return right; });
    }

    void operator *= (const float& right)
    {
        super_t::operation_base([&](int c, int) { return get_comp(super_t::left, c) * right; });
    };

    void operator /= (const float& right)
    {
        super_t::operation_base([&](int c, int) { return get_comp(super_t::left, c) / right; });
    };

    void operator += (const float& right)
    {
        super_t::operation_base([&](int c, int) { return get_comp(super_t::left, c) + right; });
    };

    void operator -= (const float& right)
    {
        super_t::operation_base([&](int c, int) { return get_comp(super_t::left, c) - right; });
    };
    
    // use parent class operators
    // for some reason operator overloads of parent class didn't carry over
    void operator = (const RightVecT& right) { super_t::operator=(right); }
    void operator *= (const RightVecT& right) { super_t::operator*=(right); }
    void operator /= (const RightVecT& right) { super_t::operator/=(right); }
    void operator += (const RightVecT& right) { super_t::operator+=(right); }
    void operator -= (const RightVecT& right) { super_t::operator-=(right); }
    void operator ++ () { super_t::operator++(); }
    void operator -- () { super_t::operator--(); }
};
```

And to avoid redefinitions of operator overloads we define a special case for single component assignment (`sw<'y'>(A) = 1.0f`):

```Cpp
// Assigner for only one target component
template<int SwizzText, typename LeftVecT>
struct assigner<SwizzText, LeftVecT, float> : public assigner_base<SwizzText, LeftVecT, float>
{
    using super_t = assigner_base<SwizzText, LeftVecT, float>;
    
    // use parent class operator and omit the scalar equivalent (as that would be the same)
    // for some reason operator overloads of parent class didn't carry over
    void operator = (const float& right) { super_t::operator=(right); }
    void operator *= (const float& right) { super_t::operator*=(right); }
    void operator /= (const float& right) { super_t::operator/=(right); }
    void operator += (const float& right) { super_t::operator+=(right); }
    void operator -= (const float& right) { super_t::operator-=(right); }
};
```

Then finally we add the main attraction the function we can use in our code:

```Cpp
// This is where the magic happens
template<int SwizzText, typename InVecT>
assigner<SwizzText, InVecT, vec_t<dimension(SwizzText)>> sw(InVecT& in_vec)
{
    static_assert(
        sizeof(InVecT) >= (get_min_dims(SwizzText) * sizeof(float)),
        "Input vector type is not large enough for one indicated dimension there "
    );

    return {in_vec};
}
```

Now the problem with this though is that we cannot really write

```Cpp
auto B = sw<'xyxy'>(A); // B -> assigner, not a vector
FVector4 C = sw<'xyxy'>(A); // it works but tedious.
```

and expect B to be a vector. For situations like this we can have a little wrapper function:

```Cpp
// Make a separate getter function so we can use `auto`, or other type inference
template<int SwizzText, typename InVecT>
vec_t<dimension(SwizzText)> swg(InVecT& in_vec)
{
    return sw<SwizzText>(in_vec);
}
```

So we can do

```Cpp
auto B = swg<'xyxy'>(A); // B -> FVector4
```

and use B directly as a vector.

Other nice things with it:

```Cpp
// get a 3D vector out of a float
auto A = swg<'xxx'>(1.0f);

// modify
sw<'yz'>(A)++;
sw<'xy'>(A) += 0.5;
sw<'xz'>(A) *= 0.5;

// packing
FVector4 rect; // xy center, zw size
sw<'xy'>(rect) = pos;
sw<'zw'>(rect) = 100;

// unpacking
auto pos = swg<'xy'>(rect);
auto size = swg<'zw'>(rect);

// etc...
```

That's it! I'm sure it can be improved and it can be more modular, but it's good enough for me. Now I go and leave Earth, byeee!

(photo of swizzle sticks by [Lizzie Munro](http://www.lizziemunro.com/))