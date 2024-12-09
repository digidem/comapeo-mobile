# Table of Contents

- [Best Practices for Making Components Testable and Maintainable](#best-practices-for-making-components-testable-and-maintainable)
  - [What is a testable component and why is it important?](#what-is-a-testable-component-and-why-is-it-important)
  - [What is a maintainable component and why is it important?](#what-is-a-maintainable-component-and-why-is-it-important)
- [Guidelines for Code](#guidelines-for-code)
  - [A Component State Should Be Limited and It Should Only Manage That Limited State](#a-component-state-should-be-limited-and-it-should-only-manage-that-limited-state)
    - [Example of component with too many states](#Example-of-component-with-too-many-states)
    - [Problems](#problems)
    - [Updated Example](#updated-example)
  - [Props and Hooks Should Be Limited to a Component's State and They Should Be Agnostic](#props-and-hooks-should-be-limited-to-a-components-state-and-they-should-be-agnostic)
    - [Example of unnecessary props](#Example-of-unnecessary-props)
  - [Logic Should Be Encapsulated Into Hooks and Pure Functions](#logic-should-be-encapsulated-into-hooks-and-pure-functions)
    - [Example of component handling too much logic](#Example-of-component-handling-too-much-logic) - [Example of encapsulated logic](#Example-of-encapsulated-logic)
- [Things to watch out for](#Things-to-watch-out-for)

# Best Practices for Making components testable and maintainable.

The focus of components should be testabiliy and maintainability. This will make the code less susceptible to bugs,robust, and easier scale and update.

**What is a testable component and why is it important?**

A testable component is one that can demonstrate its expected behavior under various conditions within a controlled testing environment. This environment may include manual testing, end-to-end (e2e) testing, or unit testing. A well-designed testing environment should be able to simulate all relevant conditions that lead to the desired states. If the component consistently produces the expected states under these conditions, it can be considered to be functioning correctly.

If we are in the practice of testing our component we can catch bugs sooner, which will lead to a faster time to productions, and less bug fixing in the future.

**What is a maintainable component and why is it importnant?**
A maintainable component is one that can be easily understood. A component should either be well documented or structered in a way that makes it obvious why the code is the way that it is. There should be very little to no implicit "developer knowledge", that is knowledge that is not obvious in the code but is held by the developer that informs how the code is structured.

A maintainable component can be modified, and extended without introducing new issues or requiring a lot of time and effort. It is flexible enough that when changed, only a minimal amount of code needs to be changes while still producing the expected results. It also should be resilient enough that unrelated external changes do no effect the code.

Maintainable code is important for code bases that are constantly changes, whether it is because of changing requirements or new features. It also helps with longevity of code as new developers can easily pick up the code and fix any bugs or add new components that interacet seemlessly with exisiting components.

# Guidlines for code:

## A Component state should be limited and it should only manage that limited state

A components should have a limited number of states and avoid excessive nesting. Fewer states reduce the complexity of testing, and fewer nested components minimize the overall testing scope.

Futhermore a component should only manage the state that directly affects its behavior or rendered output. For example, a toggle list component should manage whether it is open or closed, but not the contents of its list.

Generally this can be achieved by:

- Breaking components into smaller, more focused parts.
- Identifying the state that is truly relevant to the component.
- Structuring data and isolating interactions with props and hooks to ensure the component is scoped appropriately.

### Example of component with too many states:

```ts

const PhotoParentComponent = () =>{
    const {photo} = useGetPhoto()

    return (
        <PhotoThumbnail photo={photo} />
    )
}

const PhotoThumbnail=({photo:SavedPhoto|UnsavedPhoto})=>{
    return(
        isSavedPhoto(photo) ?
            (<SavedPhotoThumbnail uri={photo.uri}>) :
            (<UnsavedPhotoThumbnail photo={photo} >)
    )
}

const SavedPhotoThumbnail = ({uri}) => {
   return (<PhotoThumbnailImage uri={uri} isLoading={false} />)
}

const UnsavedPhotoThumbnail = ({photo}) => {
    const {uri, isLoading} = useGetUri(photo.id)
    return (<PhotoThumbnailImage uri={uri} isLoading={isLoading} />)
}

const PhotoThumbnailImage = ({uri, isLoading}) => {
    const {navigate} = useNavigator()
    function handlePress(){
        navigate({photoViewer, {id:attchemnt.id}})
    }
    return (
        <PhotoThumbnailImage disabled={!!isLoading} onPress={handlePress}>
            {isLoading ?
                <LoadingIndicator/> :
                <Image uri={uri}/ >
            }
        </PhotoThumbnailImage>
    )
}

```

Having `PhotoThumbnail` as its own component is a common pattern in React because the parent component does not need to manage its internal state. Instead, the `PhotoThumbnail` encapsulates its logic and simply receives a `photo` prop. While this can simplify the `ParentComponent`'s code, it introduces significant testing challenges.

### Problems

1. **Complex States:**

   - The `PhotoThumbnail` determines whether to render `SavedPhotoThumbnail` or `UnsavedPhotoThumbnail` based on the type of `photo`.
   - `UnsavedPhotoThumbnail` introduces a hook (`useGetUri`) that affects its state.
   - Both `SavedPhotoThumbnail` and `UnsavedPhotoThumbnail` eventually render `PhotoThumbnailImage`, which has its own states (`isLoading` or `uri`).

2. **Increased Testing Complexity:**

   - The `PhotoThumbnail` now has multiple states based on its props (`SavedPhoto` or `UnsavedPhoto`).
   - If the `photo` is an `UnsavedPhoto`, the component introduces a hook that alters the state further, adding layers of logic to test.
   - The rendered output can vary significantly based on the props and hook outputs, such as showing a loader or an image with an `onPress` action.

3. **Unclear Responsibility:**
   - The `PhotoThumbnail` component handles both the logic for determining how to process `photo` and the rendering of child components. This combines concerns, making the component harder to test and maintain.

---

To address these issues, simplify the component by scoping its states and moving the logic outside the component. Instead of having a component that both processes the logic and renders based on it, let the parent component handle the logic and pass the necessary data as props. This approach allows child components to remain simple, predictable, and easier to test.

### Updated Example

```tsx

const PhotoParentComponent = ({navigate}) =>{
    const {photo} = useGetPhoto()
    function handlePress(){
        navigate({photoViewer, {id:photo.id}})
    }
    return (
        isSavedPhoto(attachment) ?
        (<PhotoThumbnailImage onPress={onPress}>
            <Image uri={uri} />
        </PhotoThumbnailImage>) :
        (<UnsavedPhoto photoId={photo.id} onPress={handlePress}/>)
    )
}

// this needs to be its own component as it uses a hook. If there was no hook, we could simply do the ternary, which determins the loading state, at the parent level.
const UnsavedPhoto = ({photoId, onPress}) => {
    const {uri, isLoading} = useGetUri(photoId)
    return (
        <PhotoThumbnailImage disabled={!!isLoading} onPress={onPress}>
            {isLoading ?
                (<LoadingIndicator/>) :
                (<Image uri={uri} />)
            }
        </PhotoThumbnailImage>

    )
}

const PhotoThumbnailImage = ({children, handlePress, disabled?}) => {
    return (
        <TouchableOpacity disabled={!!disabled} onPress={handlePress}>
            {children}
        </TouchableOpacity>
    )
}


```

With this new approach we reduces the testing complexity by:

1. Having fewer components to test: only `UnsavedPhoto` and `PhotoThumbnailImage`.
2. Limiting the concerns of each component. `PhotoThumbnailImage` is only concerned with whether it is `disabled` and whether it has an `onPress`. It does not need to worry about the contents of its children. `UnsavedPhoto` is now the only component worried about a loading state, and that loading state is easily derived from its hook.

Adittionally we removed the navigation logic away from the `PhotoThumbnailImage`. It simply accepts an `onPress` so when testing we do not need to incorporate the navigation, and can be tested in isolation. It also makes the component more maintainable as changes to the navigation structure does not mean that this component will have to be refactored (this is further explained in the next section).

By refactoring in this way, the logic becomes clearer, testing becomes simpler, and the component is more maintainable.

## Props and Hooks Should be Limited to a Component's State and they should be Agnostic

A component's props and hooks should be directly correlated with its state. If there are unnecessary props (or prop properties) that do not affect the component’s state or behavior, they should be removed.

When a component props (and hooks) are intentionally related its state, it becomes easier to reason about what needs to be tested. The developer can directly map out how the props and hooks affect the state and create tests based on those relationships. If there are props not related to a component's state, testing is not as straight forward.

To ensure maintainability, components should also remain agnostic to the props and hooks they receive. This means the component should not have to process or transform props internally to manage its state. By limiting components to only the necessary data for their state, they become more resilient to changes in external data structures. If the structure of external data evolves, components will not need to be modified or restructured, as they are only concerned with the data they actually need.

### Example of unnecessary props:

```tsx

type attachment={
   uri:string,
   type: string
   loadingState:boolean
   ...rest
}

const MediaScrollView = ({listOfAttachments}}) =>{

    const sizeOfThumbnail:number

    function isScrollEnabled(){
        return (sizeOfThumbnail * listOfAttachments.length > windowWidth)
    }

    return (
        <ScrollView
            scrollEnabled={isScrollEnabled()}
        >
            {listOfAttachments.map(attachment=>{
                return(
                    <Thumbnail uri={attachment.uri} type={attachment.type}>
                )
            })}
        </ScrollView>
    )
}

const MediaScrollViewTestable = ({numberOfAttachments, children}) =>{

    const sizeOfThumbnail:number

    function isScrollEnabled(){
        return (sizeOfThumbnail * numberOfAttachments > windowWidth)
    }

    return (
        <ScrollView
            scrollEnabled={isScrollEnabled()}
        >
            {/*the parent should render the thumbnails*/}
         {children}
        </ScrollView>
    )
}

```

Here we have 2 seemingly simlar components, both disable/enable the scrollview based on the number of attachments, and both render a list of thumbnails.

The `MediaScrollView` disables the ScrollView based on the `attachments.length`. And it renders the thumbnails, which have their own internal state. But the rendered thumbnails keep track of their own state, and do not effect the state of its component. The rendered thubmnails might effect the styling (eg flex sizing), but not whether the scrollView is disabled/enabled. The `MediaScrollView` is taking the entire attachments object, only using `attachments.length` and forwarding the other props to its children.

On the other hand `MediaScrollViewTestable` there is a direct correlation between the props and the state. The number of attachment simply correlate to whether the scrollView is disabled/enabled.There is no ambiguity about what affects the state of the component. As well, it does not need to forward its props as it simply takes `children` and allows the parent to handle what is rendered. The props are limited to what is needed for its own state.

When testing the 2 components, `MediaScrollViewTestable` has a direct correlation between state and props. While we can justify that `MediaScrollView` really only needs `attachments.length` for its state, that requires an implicit knowledge of knowing that the other props are simply for forwarding, and its children do not effect its state.

As well, `MediaScrollViewTestable` is more maintainable. If the shape of an attachment changes in the future, `MediaScrollViewTestable` will not need to be updated, as it only cares about the number of attachments, not the details of each attachment. This reduces the need for refactoring in response to unrelated changes in external data, making the component more robust and easier to scale.

By following this pattern, components become more reusable, easier to test, and less dependent on external data structures, leading to better maintainability and reduced risk of breaking when data structures evolve.

## Logic should be encapsulated into hooks and pure functions

When possible, take any logic processed inside a component and encapsulate it into a hook or a pure function. Hooks and pure function are easier to test than react components and will make the react code easier to read.

This practice will also expose how our hooks should be structured and futhermore how the the data returned from the back end should be structured.

### Example of component handling too much logic:

```tsx
const GpsPill = ({locationState}) => {
  const permissions = getPermissions();
  const isError = !!locationState.error || !permissions;
  const status = isError
    ? 'error'
    : getLocationStatus({
        location: locationState.location,
        providerStatus: locationProviderStatus,
      });

  const statusText = () => {
    if (status === 'error') {
      return 'No GPS';
    } else if (
      status === 'searching' ||
      typeof locationState.accuracy === 'undefined'
    ) {
      return '...Searching';
    } else {
      return locationState.accuracy;
    }
  };

  return <Text>{statusText()}</Text>;
};
```

In the example above, the `status` is derived from `getLocationStatus()` and `error`. `error` is derived from `locationState` and `permissions`. Therofore, in order to test the `status` we need to test the `getLocationStatus()`,`locationState`, and `permissions`. Since `locationState` and `permissions` are derived inside the component, testing becomes quite convoluted as we now need to test the results of a function and the states of a component in order to determine the `status`.

An better alternative would be to move all the logic into one pure function.

### Example of encapsulated logic:

```tsx
const GpsPill = ({locationState}) => {
  const permissions = getPermissions()
  const status = getLocationStatus({
        locationState
        locationProviderStatus,
        permissions
        precision
      });

  const statusText = () => {
    if (status === 'error') {
        return 'No GPS';
    }
    else if (status === 'searching') {
      return '...Searching';
    } else {
        return locationState.location.coords.accuracy;
    }
  };

  return <Text>{statusText()}</Text>;
};
```

By isolating the logic into a separate function, you can more easily test the behavior of `getLocationStatus`. You no longer need to mock or depend on the component’s internal state (like locationState or permissions). Instead, you can directly pass in these values to the function, making it easier to write unit tests for the logic. Testing becomes simpler because the function is decoupled from React's component lifecycle, and you only need to focus on the behavior of `getLocationStatus` itself.

# Things to watch out for

> **Prop forwarding:** Passing props to a child, simply for that child to pass it to its children.
> This is often a symptom of component handling too many states which are nested in its children components. Instead expose the children as `ReactNodes`, and let the parent component pass the props directly allowing for a seperation of concerns and easier testing in isolation.

> **Components with several props or several hooks.**
> With several props, testing become quite difficult as there are either many states, unused props, or prop forwarding. Determine if the component can be broken down into smaller components, each with a seperation of concerns. Also determine if the component is using the props agnostically, or processing the props inside the component. Can that processing be done outside of the component and allow of a simpler prop to be passed?
> Adding multiple props is a common pattern when trying to make a component reusable, where more props are added so it can accomodate the many states needed by the different parent components; The parent is able to manipulate the component by simply changing the props. While this is convenient when a component is used in many places, try to determine what actually being shared between the different components. Is is simply a shared style? Then pass a reusable wrapper contianer that allows the parents to determine the children. Are there smaller pieces inside the shared component that can be shared?

> **Deeply nested components.**
> If the component layers are really deep, this makes testing difficult. To test the parent component, we need to test all its children component. By having smaller component exposed at the highest level possible, there are less components to test. It also promotes a seperation of concerns as each component is not required to know the state of its parent or child component.
