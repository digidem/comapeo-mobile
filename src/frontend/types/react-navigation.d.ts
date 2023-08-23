import {$Shape, $PropertyType, $ElementType, $Diff} from 'utility-types';

declare module 'react-navigation' {
  /**
   * First, a bunch of things we would love to import but instead must
   * reconstruct (mostly copy-pasted).
   */
  // This is a bastardization of the true StyleObj type located in
  // react-native/Libraries/StyleSheet/StyleSheetTypes. We unfortunately can't
  // import that here, and it's too lengthy (and consequently too brittle) to
  // copy-paste here either.
  declare type StyleObj =
    | null
    | void
    | number
    | false
    | ''
    | ReadonlyArray<StyleObj>
    | Record<string, any>;

  declare type ViewStyleProp = StyleObj;

  declare type TextStyleProp = StyleObj;

  declare type AnimatedViewStyleProp = StyleObj;

  declare type AnimatedTextStyleProp = StyleObj; // This is copied from the Layout type in
  // react-native-tab-view/src/TabViewTypeDefinitions

  declare type TabViewLayout = {
    height: number;
    width: number;
  }; // This is copied from react-native/Libraries/Image/ImageSource.js

  declare type ImageURISource = {
    uri?: string;
    bundle?: string;
    method?: string;
    headers?: Record<string, any>;
    body?: string;
    cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
    width?: number;
    height?: number;
    scale?: number;
  };

  declare type ImageSource = ImageURISource | number | Array<ImageURISource>; // This is copied from
  // react-native/Libraries/Animated/src/nodes/AnimatedInterpolation.js

  declare type ExtrapolateType = 'extend' | 'identity' | 'clamp';
  declare type InterpolationConfigType = {
    inputRange: Array<number>;
    outputRange: Array<number> | Array<string>;
    easing?: (input: number) => number;
    extrapolate?: ExtrapolateType;
    extrapolateLeft?: ExtrapolateType;
    extrapolateRight?: ExtrapolateType;
  };

  declare class AnimatedInterpolation {
    interpolate(config: InterpolationConfigType): AnimatedInterpolation;
  } // This is copied from
  // react-native/Libraries/Animated/src/animations/Animation.js

  declare type EndResult = {
    finished: boolean;
  };

  declare type EndCallback = (result: EndResult) => void;

  declare class Animation {
    start(
      fromValue: number,
      onUpdate: (value: number) => void,
      onEnd: EndCallback | null | undefined,
      previousAnimation: Animation | null | undefined,
      animatedValue: AnimatedValue,
    ): void;
    stop(): void;
  }

  // This is vaguely copied from
  // react-native/Libraries/Animated/src/nodes/AnimatedTracking.js
  declare class AnimatedTracking {
    constructor(
      value: AnimatedValue,
      parent: any,
      animationClass: any,
      animationConfig: Record<string, any>,
      callback?: EndCallback | null | undefined,
    ): void;
    update(): void;
  } // This is vaguely copied from
  // react-native/Libraries/Animated/src/nodes/AnimatedValue.js

  declare type ValueListenerCallback = (state: {value: number}) => void;

  declare class AnimatedValue {
    constructor(value: number): void;
    setValue(value: number): void;
    setOffset(offset: number): void;
    flattenOffset(): void;
    extractOffset(): void;
    addListener(callback: ValueListenerCallback): string;
    removeListener(id: string): void;
    removeAllListeners(): void;
    stopAnimation(
      callback?: ((value: number) => void) | null | undefined,
    ): void;
    resetAnimation(
      callback?: ((value: number) => void) | null | undefined,
    ): void;
    interpolate(config: InterpolationConfigType): AnimatedInterpolation;
    animate(
      animation: Animation,
      callback: EndCallback | null | undefined,
    ): void;
    stopTracking(): void;
    track(tracking: AnimatedTracking): void;
  }

  /**
   * Next, all the type declarations
   */

  /**
   * Navigation State + Action
   */

  export type NavigationParams = Record<string, unknown>;

  export type NavigationBackAction = {
    type: 'Navigation/BACK';
    key?: string | null | undefined;
  };

  export type NavigationInitAction = {
    type: 'Navigation/INIT';
    params?: NavigationParams;
  };

  export type NavigationNavigateAction = {
    type: 'Navigation/NAVIGATE';
    routeName: string;
    params?: NavigationParams;
    // The action to run inside the sub-router
    action?: NavigationNavigateAction;
    key?: string;
  };

  export type NavigationSetParamsAction = {
    type: 'Navigation/SET_PARAMS';
    // The key of the route where the params should be set
    key: string;
    // The new params to merge into the existing route params
    params: NavigationParams;
  };

  export type NavigationPopAction = {
    readonly type: 'Navigation/POP';
    readonly n?: number;
    readonly immediate?: boolean;
  };

  export type NavigationPopToTopAction = {
    readonly type: 'Navigation/POP_TO_TOP';
    readonly immediate?: boolean;
  };

  export type NavigationPushAction = {
    readonly type: 'Navigation/PUSH';
    readonly routeName: string;
    readonly params?: NavigationParams;
    readonly action?: NavigationNavigateAction;
    readonly key?: string;
  };

  export type NavigationResetAction = {
    type: 'Navigation/RESET';
    index: number;
    key?: string | null | undefined;
    actions: Array<NavigationNavigateAction>;
  };

  export type NavigationReplaceAction = {
    readonly type: 'Navigation/REPLACE';
    readonly key: string;
    readonly routeName: string;
    readonly params?: NavigationParams;
    readonly action?: NavigationNavigateAction;
  };

  export type NavigationCompleteTransitionAction = {
    readonly type: 'Navigation/COMPLETE_TRANSITION';
    readonly key?: string;
  };

  export type NavigationOpenDrawerAction = {
    readonly type: 'Navigation/OPEN_DRAWER';
    readonly key?: string;
  };

  export type NavigationCloseDrawerAction = {
    readonly type: 'Navigation/CLOSE_DRAWER';
    readonly key?: string;
  };

  export type NavigationToggleDrawerAction = {
    readonly type: 'Navigation/TOGGLE_DRAWER';
    readonly key?: string;
  };

  export type NavigationDrawerOpenedAction = {
    readonly type: 'Navigation/DRAWER_OPENED';
    readonly key?: string;
  };

  export type NavigationDrawerClosedAction = {
    readonly type: 'Navigation/DRAWER_CLOSED';
    readonly key?: string;
  };

  export type NavigationAction =
    | NavigationBackAction
    | NavigationInitAction
    | NavigationNavigateAction
    | NavigationSetParamsAction
    | NavigationPopAction
    | NavigationPopToTopAction
    | NavigationPushAction
    | NavigationResetAction
    | NavigationReplaceAction
    | NavigationCompleteTransitionAction
    | NavigationOpenDrawerAction
    | NavigationCloseDrawerAction
    | NavigationToggleDrawerAction
    | NavigationDrawerOpenedAction
    | NavigationDrawerClosedAction;

  /**
   * NavigationState is a tree of routes for a single navigator, where each
   * child route may either be a NavigationScreenRoute or a
   * NavigationRouterRoute. NavigationScreenRoute represents a leaf screen,
   * while the NavigationRouterRoute represents the state of a child navigator.
   *
   * NOTE: NavigationState is a state tree local to a single navigator and
   * its child navigators (via the routes field).
   * If we're in navigator nested deep inside the app, the state will only be
   * the state for that navigator.
   * The state for the root navigator of our app represents the whole navigation
   * state for the whole app.
   */
  export type NavigationState = {
    /**
     * Index refers to the active child route in the routes array.
     */
    index: number;
    routes: Array<NavigationRoute>;
    isTransitioning?: boolean;
  };

  export type NavigationRoute = NavigationLeafRoute | NavigationStateRoute;

  export type NavigationLeafRoute = {
    /**
     * React's key used by some navigators. No need to specify these manually,
     * they will be defined by the router.
     */
    key: string;

    /**
     * For example 'Home'.
     * This is used as a key in a route config when creating a navigator.
     */
    routeName: string;

    /**
     * Path is an advanced feature used for deep linking and on the web.
     */
    path?: string;

    /**
     * Params passed to this route when navigating to it,
     * e.g. `{ car_id: 123 }` in a route that displays a car.
     */
    params?: NavigationParams;
  };

  export type NavigationStateRoute = NavigationLeafRoute & NavigationState;

  /**
   * Router
   */
  export type NavigationScreenOptionsGetter<Options extends {}> = (
    navigation: NavigationScreenProp<NavigationRoute>,
    screenProps?: {},
  ) => Options;

  export type NavigationRouter<
    State extends NavigationState,
    Options extends {},
  > = {
    /**
     * The reducer that outputs the new navigation state for a given action,
     * with an optional previous state. When the action is considered handled
     * but the state is unchanged, the output state is null.
     */
    getStateForAction: (
      action: NavigationAction,
      lastState: State | null | undefined,
    ) => State | null | undefined;

    /**
     * Maps a URI-like string to an action. This can be mapped to a state
     * using `getStateForAction`.
     */
    getActionForPathAndParams: (
      path: string,
      params?: NavigationParams,
    ) => NavigationAction | null | undefined;
    getPathAndParamsForState: (state: State) => {
      path: string;
      params?: NavigationParams;
    };
    getComponentForRouteName: (routeName: string) => NavigationComponent;
    getComponentForState: (state: State) => NavigationComponent;

    /**
     * Gets the screen navigation options for a given screen.
     *
     * For example, we could get the config for the 'Foo' screen when the
     * `navigation.state` is:
     *
     *  {routeName: 'Foo', key: '123'}
     */
    getScreenOptions: NavigationScreenOptionsGetter<Options>;
  };

  export type NavigationScreenDetails<T> = {
    options: T;
    state: NavigationRoute;
    navigation: NavigationScreenProp<NavigationRoute>;
  };

  export type NavigationScreenOptions = {
    title?: string;
  };

  export type NavigationScreenConfigProps = $Shape<{
    navigation: NavigationScreenProp<NavigationRoute>;
    screenProps: {};
  }>;

  export type NavigationScreenConfig<Options> =
    | Options
    | ((
        arg0: NavigationScreenConfigProps & {
          navigationOptions: Options;
        },
      ) => Options);

  export type NavigationComponent =
    | NavigationScreenComponent<NavigationRoute, any, any>
    | NavigationNavigator<any, any, any>;

  declare interface withOptionalNavigationOptions<Options> {
    navigationOptions?: NavigationScreenConfig<Options>;
  }

  export type NavigationScreenComponent<
    Route extends NavigationRoute,
    Options extends {},
    Props extends NavigationNavigatorProps<Options, Route>,
  > = React.ComponentType<Props> & withOptionalNavigationOptions<Options>;

  declare interface withRouter<State, Options> {
    router: NavigationRouter<State, Options>;
  }

  export type NavigationNavigator<
    State extends NavigationState,
    Options extends {},
    Props extends NavigationNavigatorProps<Options, State>,
  > = React.ComponentType<Props> &
    withRouter<State, Options> &
    withOptionalNavigationOptions<Options>;

  export type NavigationRouteConfig =
    | NavigationComponent
    | ({
        navigationOptions?: NavigationScreenConfig<any>;
        path?: string;
      } & NavigationScreenRouteConfig);

  export type NavigationScreenRouteConfig =
    | {
        screen: NavigationComponent;
      }
    | {
        getScreen: () => NavigationComponent;
      };

  export type NavigationPathsConfig = Record<string, string>;

  export type NavigationRouteConfigMap = Record<string, NavigationRouteConfig>;

  /**
   * Header
   */
  export type HeaderMode = 'float' | 'screen' | 'none';

  export type HeaderProps = $Shape<
    NavigationSceneRendererProps & {
      mode: HeaderMode;
      router: NavigationRouter<NavigationState, NavigationStackScreenOptions>;
      getScreenDetails: (
        arg0: NavigationScene,
      ) => NavigationScreenDetails<NavigationStackScreenOptions>;
      leftInterpolator: (props: NavigationSceneRendererProps) => {};
      titleInterpolator: (props: NavigationSceneRendererProps) => {};
      rightInterpolator: (props: NavigationSceneRendererProps) => {};
    }
  >;

  /**
   * Stack Navigator
   */
  export type NavigationStackScreenOptions = NavigationScreenOptions & {
    header?:
      | (React.ReactNode | ((arg0: HeaderProps) => React.ReactNode))
      | null
      | undefined;
    headerTransparent?: boolean;
    headerTitle?: string | React.ReactNode | React.ElementType;
    headerTitleStyle?: AnimatedTextStyleProp;
    headerTitleAllowFontScaling?: boolean;
    headerTintColor?: string;
    headerLeft?: React.ReactNode | React.ElementType;
    headerBackTitle?: string;
    headerBackImage?: React.ReactNode | React.ElementType;
    headerTruncatedBackTitle?: string;
    headerBackTitleStyle?: TextStyleProp;
    headerPressColorAndroid?: string;
    headerRight?: React.ReactNode;
    headerStyle?: ViewStyleProp;
    headerForceInset?: _SafeAreaViewInsets;
    headerBackground?: React.ReactNode | React.ElementType;
    gesturesEnabled?: boolean;
    gestureResponseDistance?: {
      vertical?: number;
      horizontal?: number;
    };
    gestureDirection?: 'default' | 'inverted';
  };

  export type NavigationStackRouterConfig = {
    initialRouteName?: string;
    initialRouteParams?: NavigationParams;
    paths?: NavigationPathsConfig;
    defaultNavigationOptions?: NavigationScreenConfig<any>;
    initialRouteKey?: string;
  };

  export type NavigationStackViewConfig = {
    mode?: 'card' | 'modal';
    headerMode?: HeaderMode;
    headerTransitionPreset?: 'fade-in-place' | 'uikit';
    headerLayoutPreset?: 'left' | 'center';
    headerBackTitleVisible?: boolean;
    cardShadowEnabled?: boolean;
    cardOverlayEnabled?: boolean;
    cardStyle?: ViewStyleProp;
    transitionConfig?: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: NavigationTransitionProps | null | undefined,
      isModal: boolean,
    ) => TransitionConfig;
    onTransitionStart?: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: NavigationTransitionProps | null | undefined,
    ) => void;
    onTransitionEnd?: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: NavigationTransitionProps | null | undefined,
    ) => void;
    transparentCard?: boolean;
    disableKeyboardHandling?: boolean;
  };

  export type StackNavigatorConfig = $Shape<
    NavigationStackViewConfig & NavigationStackRouterConfig
  >;

  /**
   * Switch Navigator
   */
  export type NavigationSwitchRouterConfig = {
    initialRouteName?: string;
    initialRouteParams?: NavigationParams;
    paths?: NavigationPathsConfig;
    defaultNavigationOptions?: NavigationScreenConfig<any>;
    order?: Array<string>;
    backBehavior?: 'none' | 'initialRoute';
    // defaults to `'none'`
    resetOnBlur?: boolean; // defaults to `true`
  };

  /**
   * Tab Navigator
   */
  export type NavigationTabRouterConfig = {
    initialRouteName?: string;
    initialRouteParams?: NavigationParams;
    paths?: NavigationPathsConfig;
    defaultNavigationOptions?: NavigationScreenConfig<any>;
    // todo: type these as the real route names rather than 'string'
    order?: Array<string>;
    // Does the back button cause the router to switch to the initial tab
    backBehavior?: 'none' | 'initialRoute'; // defaults `initialRoute`
  };

  declare type TabScene = {
    route: NavigationRoute;
    focused: boolean;
    index: number;
    tintColor?: string | null | undefined;
  };

  export type NavigationTabScreenOptions = NavigationScreenOptions & {
    tabBarIcon?:
      | React.ReactNode
      | ((options: {
          tintColor: string | null | undefined;
          focused: boolean;
        }) => React.ReactNode | null | undefined);
    tabBarLabel?:
      | string
      | React.ReactNode
      | ((options: {
          tintColor: string | null | undefined;
          focused: boolean;
        }) => React.ReactNode | null | undefined);
    tabBarVisible?: boolean;
    tabBarTestIDProps?: {
      testID?: string;
      accessibilityLabel?: string;
    };
    tabBarOnPress?: (arg0: {
      navigation: NavigationScreenProp<NavigationRoute>;
      defaultHandler: () => void;
    }) => void;
  };

  /**
   * Drawer
   */
  export type NavigationDrawerScreenOptions = NavigationScreenOptions & {
    drawerIcon?:
      | React.ReactNode
      | ((options: {
          tintColor: string | null | undefined;
          focused: boolean;
        }) => React.ReactNode | null | undefined);
    drawerLabel?:
      | React.ReactNode
      | ((options: {
          tintColor: string | null | undefined;
          focused: boolean;
        }) => React.ReactNode | null | undefined);
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
  };

  /**
   * Navigator Prop
   */
  export type NavigationDispatch = (action: NavigationAction) => boolean;

  export type NavigationProp<S> = {
    readonly state: S;
    dispatch: NavigationDispatch;
  };

  export type EventType =
    | 'willFocus'
    | 'didFocus'
    | 'willBlur'
    | 'didBlur'
    | 'action';

  export type NavigationEventPayload = {
    type: EventType;
    action: NavigationAction;
    state: NavigationState;
    lastState: NavigationState | null | undefined;
  };

  export type NavigationEventCallback = (
    payload: NavigationEventPayload,
  ) => void;

  export type NavigationEventSubscription = {
    remove: () => void;
  };

  export type NavigationScreenProp<S> = {
    readonly state: S;
    dispatch: NavigationDispatch;
    addListener: (
      eventName: string,
      callback: NavigationEventCallback,
    ) => NavigationEventSubscription;
    getParam: <ParamName extends string>(
      paramName: ParamName,
      fallback?: $ElementType<
        $PropertyType<
          {
            params: {};
          } & S,
          'params'
        >,
        ParamName
      >,
    ) => $ElementType<
      $PropertyType<
        {
          params: {};
        } & S,
        'params'
      >,
      ParamName
    >;
    dangerouslyGetParent: () =>
      | NavigationScreenProp<NavigationState>
      | null
      | undefined;
    isFocused: () => boolean;
    // Shared action creators that exist for all routers
    goBack: (routeKey?: string | null | undefined) => boolean;
    navigate: (
      routeName:
        | string
        | {
            routeName: string;
            params?: NavigationParams;
            action?: NavigationNavigateAction;
            key?: string;
          },
      params?: NavigationParams,
      action?: NavigationNavigateAction,
    ) => boolean;
    setParams: (newParams: NavigationParams) => boolean;
    // StackRouter action creators
    pop?: (
      n?: number,
      params?: {
        immediate?: boolean;
      },
    ) => boolean;
    popToTop?: (params?: {immediate?: boolean}) => boolean;
    push?: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction,
    ) => boolean;
    replace?: (
      routeName: string,
      params?: NavigationParams,
      action?: NavigationNavigateAction,
    ) => boolean;
    reset?: (actions: NavigationAction[], index: number) => boolean;
    dismiss?: () => boolean;
    // DrawerRouter action creators
    openDrawer?: () => boolean;
    closeDrawer?: () => boolean;
    toggleDrawer?: () => boolean;
  };

  export type NavigationNavigatorProps<O extends {}, S extends {}> = $Shape<{
    navigation: NavigationScreenProp<S>;
    screenProps?: {};
    navigationOptions?: O;
  }>;
  /**
   * NavigationEvents component
   */

  declare type _NavigationEventsProps = {
    navigation?: NavigationScreenProp<NavigationState>;
    onWillFocus?: NavigationEventCallback;
    onDidFocus?: NavigationEventCallback;
    onWillBlur?: NavigationEventCallback;
    onDidBlur?: NavigationEventCallback;
  };

  export declare var NavigationEvents: React.ComponentType<_NavigationEventsProps>;

  /**
   * Navigation container
   */
  export type NavigationContainer<
    State extends NavigationState,
    Options extends {},
    Props extends NavigationContainerProps<Options, State>,
  > = React.ComponentType<Props> &
    withRouter<State, Options> &
    withOptionalNavigationOptions<Options>;

  export type NavigationContainerProps<S extends {}, O extends {}> = $Shape<{
    uriPrefix?: string | RegExp;
    onNavigationStateChange?:
      | ((
          arg0: NavigationState,
          arg1: NavigationState,
          arg2: NavigationAction,
        ) => void)
      | null
      | undefined;
    navigation?: NavigationScreenProp<S>;
    persistenceKey?: string | null | undefined;
    renderLoadingExperimental?: React.ComponentType<{}>;
    screenProps?: any;
    navigationOptions?: O;
  }>;

  /**
   * Gestures, Animations, and Interpolators
   */
  export type NavigationGestureDirection = 'horizontal' | 'vertical';

  export type NavigationLayout = {
    height: AnimatedValue;
    initHeight: number;
    initWidth: number;
    isMeasured: boolean;
    width: AnimatedValue;
  };

  export type NavigationScene = {
    index: number;
    isActive: boolean;
    isStale: boolean;
    key: string;
    route: NavigationRoute;
    descriptor: NavigationDescriptor | null | undefined;
  };
  export type NavigationTransitionProps = $Shape<{
    // The layout of the screen container
    layout: NavigationLayout;
    // The destination navigation state of the transition
    navigation: NavigationScreenProp<NavigationState>;
    // The progressive index of the transitioner's navigation state.
    position: AnimatedValue;
    // The value that represents the progress of the transition when navigation
    // state changes from one to another. Its numeric value will range from 0
    // to 1.
    //  progress.__getAnimatedValue() < 1 : transition is happening.
    //  progress.__getAnimatedValue() == 1 : transition completes.
    progress: AnimatedValue;
    // All the scenes of the transitioner.
    scenes: Array<NavigationScene>;
    // The active scene, corresponding to the route at
    // `navigation.state.routes[navigation.state.index]`. When rendering
    // NavigationSceneRendererPropsIndex, the scene does not refer to the active
    // scene, but instead the scene that is being rendered. The index always
    // is the index of the scene
    scene: NavigationScene;
    index: number;
    screenProps?: {};
  }>;

  // The scene renderer props are nearly identical to the props used for
  // rendering a transition. The exception is that the passed scene is not the
  // active scene but is instead the scene that the renderer should render
  // content for.
  export type NavigationSceneRendererProps = NavigationTransitionProps;

  export type NavigationTransitionSpec = {
    duration?: number;
    // An easing function from `Easing`.
    easing?: (t: number) => number;
    // A timing function such as `Animated.timing`.
    timing?: (value: AnimatedValue, config: any) => any;
  };

  /**
   * Describes a visual transition from one screen to another.
   */
  export type TransitionConfig = {
    // The basics properties of the animation, such as duration and easing
    transitionSpec?: NavigationTransitionSpec;
    // How to animate position and opacity of the screen
    // based on the value generated by the transitionSpec
    screenInterpolator?: (props: NavigationSceneRendererProps) => {};
    // How to animate position and opacity of the header componetns
    // based on the value generated by the transitionSpec
    headerLeftInterpolator?: (props: NavigationSceneRendererProps) => {};
    headerTitleInterpolator?: (props: NavigationSceneRendererProps) => {};
    headerRightInterpolator?: (props: NavigationSceneRendererProps) => {};
    // The style of the container. Useful when a scene doesn't have
    // 100% opacity and the underlying container is visible.
    containerStyle?: ViewStyleProp;
  };

  export type NavigationAnimationSetter = (
    position: AnimatedValue,
    newState: NavigationState,
    lastState: NavigationState,
  ) => void;

  export type NavigationSceneRenderer = () => React.ReactNode;

  export type NavigationStyleInterpolator = (
    props: NavigationSceneRendererProps,
  ) => AnimatedViewStyleProp;

  export type LayoutEvent = {
    nativeEvent: {
      layout: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    };
  };

  export type SceneIndicesForInterpolationInputRange = {
    first: number;
    last: number;
  };

  /**
   * Now we type the actual exported module
   */
  export function createAppContainer<S extends NavigationState, O extends {}>(
    Component: NavigationNavigator<S, O, any>,
  ): NavigationContainer<S, O, any>;

  export function createNavigationContainer<
    S extends NavigationState,
    O extends {},
  >(Component: NavigationNavigator<S, O, any>): NavigationContainer<S, O, any>;

  export declare var StateUtils: {
    get: (
      state: NavigationState,
      key: string,
    ) => NavigationRoute | null | undefined;
    indexOf: (state: NavigationState, key: string) => number;
    has: (state: NavigationState, key: string) => boolean;
    push: (state: NavigationState, route: NavigationRoute) => NavigationState;
    pop: (state: NavigationState) => NavigationState;
    jumpToIndex: (state: NavigationState, index: number) => NavigationState;
    jumpTo: (state: NavigationState, key: string) => NavigationState;
    back: (state: NavigationState) => NavigationState;
    forward: (state: NavigationState) => NavigationState;
    replaceAt: (
      state: NavigationState,
      key: string,
      route: NavigationRoute,
    ) => NavigationState;
    replaceAtIndex: (
      state: NavigationState,
      index: number,
      route: NavigationRoute,
    ) => NavigationState;
    reset: (
      state: NavigationState,
      routes: Array<NavigationRoute>,
      index?: number,
    ) => NavigationState;
  };

  export declare var NavigationActions: {
    BACK: 'Navigation/BACK';
    INIT: 'Navigation/INIT';
    NAVIGATE: 'Navigation/NAVIGATE';
    SET_PARAMS: 'Navigation/SET_PARAMS';
    back: (payload?: {key?: string | null | undefined}) => NavigationBackAction;
    init: (payload?: {params?: NavigationParams}) => NavigationInitAction;
    navigate: (payload: {
      routeName: string;
      params?: NavigationParams | null | undefined;
      action?: NavigationNavigateAction | null | undefined;
      key?: string;
    }) => NavigationNavigateAction;
    setParams: (payload: {
      key: string;
      params: NavigationParams;
    }) => NavigationSetParamsAction;
  };

  export declare var StackActions: {
    POP: 'Navigation/POP';
    POP_TO_TOP: 'Navigation/POP_TO_TOP';
    PUSH: 'Navigation/PUSH';
    RESET: 'Navigation/RESET';
    REPLACE: 'Navigation/REPLACE';
    COMPLETE_TRANSITION: 'Navigation/COMPLETE_TRANSITION';
    pop: (payload: {n?: number; immediate?: boolean}) => NavigationPopAction;
    popToTop: (payload: {immediate?: boolean}) => NavigationPopToTopAction;
    push: (payload: {
      routeName: string;
      params?: NavigationParams;
      action?: NavigationNavigateAction;
      key?: string;
    }) => NavigationPushAction;
    reset: (payload: {
      index: number;
      key?: string | null | undefined;
      actions: Array<NavigationNavigateAction>;
    }) => NavigationResetAction;
    replace: (payload: {
      key?: string;
      routeName: string;
      params?: NavigationParams;
      action?: NavigationNavigateAction;
    }) => NavigationReplaceAction;
    completeTransition: (payload: {
      key?: string;
    }) => NavigationCompleteTransitionAction;
  };

  export declare var DrawerActions: {
    OPEN_DRAWER: 'Navigation/OPEN_DRAWER';
    CLOSE_DRAWER: 'Navigation/CLOSE_DRAWER';
    TOGGLE_DRAWER: 'Navigation/TOGGLE_DRAWER';
    DRAWER_OPENED: 'Navigation/DRAWER_OPENED';
    DRAWER_CLOSED: 'Navigation/DRAWER_CLOSED';
    openDrawer: (payload: {key?: string}) => NavigationOpenDrawerAction;
    closeDrawer: (payload: {key?: string}) => NavigationCloseDrawerAction;
    toggleDrawer: (payload: {key?: string}) => NavigationToggleDrawerAction;
  };

  declare type _RouterProp<S extends NavigationState, O extends {}> = {
    router: NavigationRouter<S, O>;
  };

  export type NavigationDescriptor = {
    key: string;
    state: NavigationRoute;
    navigation: NavigationScreenProp<any>;
    getComponent: () => React.ComponentType<{}>;
  };

  declare type NavigationView<O, S> = React.ComponentType<{
    descriptors: Record<string, NavigationDescriptor>;
    navigation: NavigationScreenProp<S>;
    navigationConfig: any;
  }>;

  export function createNavigator<
    O extends any,
    S extends any,
    NavigatorConfig extends any,
  >(
    view: NavigationView<O, S>,
    router: NavigationRouter<S, O>,
    navigatorConfig?: NavigatorConfig,
  ): NavigationNavigator<S, O, any>;

  export function createStackNavigator(
    routeConfigMap: NavigationRouteConfigMap,
    stackConfig?: StackNavigatorConfig,
  ): NavigationNavigator<any, any, any>;

  declare type _TabViewConfig = {
    tabBarComponent?: React.ElementType;
    tabBarPosition?: 'top' | 'bottom';
    tabBarOptions?: {};
    swipeEnabled?: boolean;
    animationEnabled?: boolean;
    configureTransition?: (
      currentTransitionProps: Record<string, any>,
      nextTransitionProps: Record<string, any>,
    ) => Record<string, any>;
    initialLayout?: TabViewLayout;
  };

  declare type _TabNavigatorConfig = NavigationTabRouterConfig &
    _TabViewConfig & {
      lazy?: boolean;
      removeClippedSubviews?: boolean;
      containerOptions?: void;
    };
  /* TODO: fix the config for each of these tab navigator types */

  export function createBottomTabNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _TabNavigatorConfig,
  ): NavigationNavigator<any, any, any>;

  export function createMaterialTopTabNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _TabNavigatorConfig,
  ): NavigationNavigator<any, any, any>;

  declare type _SwitchNavigatorConfig = NavigationSwitchRouterConfig;

  export function createSwitchNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _SwitchNavigatorConfig,
  ): NavigationNavigator<any, any, any>;

  declare type _DrawerViewConfig = {
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
    drawerWidth?: number | (() => number);
    drawerPosition?: 'left' | 'right';
    contentComponent?: React.ElementType;
    contentOptions?: {};
    style?: ViewStyleProp;
    useNativeAnimations?: boolean;
    drawerBackgroundColor?: string;
    screenProps?: {};
  };

  declare type _DrawerNavigatorConfig = NavigationTabRouterConfig &
    _DrawerViewConfig & {
      containerConfig?: void;
    };

  export function createDrawerNavigator(
    routeConfigs: NavigationRouteConfigMap,
    config?: _DrawerNavigatorConfig,
  ): NavigationNavigator<any, any, any>;

  export function StackRouter(
    routeConfigs: NavigationRouteConfigMap,
    stackConfig?: NavigationStackRouterConfig,
  ): NavigationRouter<any, NavigationStackScreenOptions>;

  export function TabRouter(
    routeConfigs: NavigationRouteConfigMap,
    config?: NavigationTabRouterConfig,
  ): NavigationRouter<any, any>;

  declare type _TransitionerProps = {
    configureTransition: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: NavigationTransitionProps | null | undefined,
    ) => NavigationTransitionSpec;
    navigation: NavigationScreenProp<NavigationState>;
    onTransitionEnd?: (...args: Array<unknown>) => void;
    onTransitionStart?: (...args: Array<unknown>) => void;
    render: (
      transitionProps: NavigationTransitionProps,
      prevTransitionProps: NavigationTransitionProps | null | undefined,
    ) => React.ReactNode;
  };

  export declare var Transitioner: React.ComponentType<_TransitionerProps>;

  declare type _CardStackTransitionerProps = {
    headerMode: HeaderMode;
    mode: 'card' | 'modal';
    router: NavigationRouter<NavigationState, NavigationStackScreenOptions>;
    cardStyle?: ViewStyleProp;
    onTransitionStart?: () => void;
    onTransitionEnd?: () => void;

    /**
     * Optional custom animation when transitioning between screens.
     */
    transitionConfig?: () => TransitionConfig;
  } & NavigationNavigatorProps<NavigationStackScreenOptions, NavigationState>;

  export declare var CardStackTransitioner: React.ComponentType<_CardStackTransitionerProps>;

  declare type _CardStackProps = {
    screenProps?: {};
    headerMode: HeaderMode;
    headerComponent?: React.ElementType;
    mode: 'card' | 'modal';
    router: NavigationRouter<NavigationState, NavigationStackScreenOptions>;
    cardStyle?: ViewStyleProp;
    onTransitionStart?: () => void;
    onTransitionEnd?: () => void;

    /**
     * Optional custom animation when transitioning between screens.
     */
    transitionConfig?: () => TransitionConfig;
    // NavigationTransitionProps:
    layout: NavigationLayout;
    navigation: NavigationScreenProp<NavigationState>;
    position: AnimatedValue;
    progress: AnimatedValue;
    scenes: Array<NavigationScene>;
    scene: NavigationScene;
    index: number;
  };

  export declare var CardStack: React.ComponentType<_CardStackProps>;

  declare type _CardProps = NavigationSceneRendererProps & {
    children: React.ReactNode;
    onComponentRef: React.Ref<any>;
    pointerEvents: string;
    style: any;
  };

  export declare var Card: React.ComponentType<_CardProps>;

  declare type _SafeAreaViewForceInsetValue = 'always' | 'never' | number;

  declare type _SafeAreaViewInsets = $Shape<{
    top: _SafeAreaViewForceInsetValue;
    bottom: _SafeAreaViewForceInsetValue;
    left: _SafeAreaViewForceInsetValue;
    right: _SafeAreaViewForceInsetValue;
    vertical: _SafeAreaViewForceInsetValue;
    horizontal: _SafeAreaViewForceInsetValue;
  }>;

  declare type _SafeAreaViewProps = {
    forceInset?: _SafeAreaViewInsets;
    children?: React.ReactNode;
    style?: AnimatedViewStyleProp;
  };

  export declare var SafeAreaView: React.ComponentType<_SafeAreaViewProps>;

  export declare var Header: React.ComponentType<HeaderProps> & {
    HEIGHT: number;
  };

  declare type _HeaderTitleProps = {
    children: React.ReactNode;
    selectionColor?: string | number;
    style?: AnimatedTextStyleProp;
  };

  export declare var HeaderTitle: React.ComponentType<_HeaderTitleProps>;

  declare type _HeaderBackButtonProps = {
    onPress?: () => void;
    pressColorAndroid?: string;
    title?: string | null | undefined;
    titleStyle?: TextStyleProp | null | undefined;
    tintColor?: string | null | undefined;
    truncatedTitle?: string | null | undefined;
    width?: number | null | undefined;
  };

  export declare var HeaderBackButton: React.ComponentType<_HeaderBackButtonProps>;

  declare type _DrawerViewProps = {
    drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open';
    drawerWidth: number | (() => number);
    drawerPosition: 'left' | 'right';
    contentComponent: React.ElementType;
    contentOptions?: {};
    style?: ViewStyleProp;
    useNativeAnimations: boolean;
    drawerBackgroundColor: string;
    screenProps?: {};
    navigation: NavigationScreenProp<NavigationState>;
    router: NavigationRouter<NavigationState, NavigationDrawerScreenOptions>;
  };

  export declare var DrawerView: React.ComponentType<_DrawerViewProps>;

  declare type _DrawerScene = {
    route: NavigationRoute;
    focused: boolean;
    index: number;
    tintColor?: string;
  };

  declare type _DrawerItem = {
    route: NavigationRoute;
    focused: boolean;
  };

  declare type _DrawerItemsProps = {
    navigation: NavigationScreenProp<NavigationState>;
    items: Array<NavigationRoute>;
    activeItemKey?: string | null | undefined;
    activeTintColor?: string;
    activeBackgroundColor?: string;
    inactiveTintColor?: string;
    inactiveBackgroundColor?: string;
    getLabel: (
      scene: _DrawerScene,
    ) => (React.ReactNode | string) | null | undefined;
    renderIcon: (scene: _DrawerScene) => React.ReactNode | null | undefined;
    onItemPress: (info: _DrawerItem) => void;
    itemsContainerForceInset?: Record<string, any>;
    itemsContainerStyle?: ViewStyleProp;
    itemStyle?: ViewStyleProp;
    labelStyle?: TextStyleProp;
    activeLabelStyle?: TextStyleProp;
    inactiveLabelStyle?: TextStyleProp;
    iconContainerStyle?: ViewStyleProp;
    drawerPosition: 'left' | 'right';
  };

  export declare var DrawerItems: React.ComponentType<_DrawerItemsProps>;

  declare type _TabViewProps = {
    tabBarComponent?: React.ElementType;
    tabBarPosition?: 'top' | 'bottom';
    tabBarOptions?: {};
    swipeEnabled?: boolean;
    animationEnabled?: boolean;
    configureTransition?: (
      currentTransitionProps: Record<string, any>,
      nextTransitionProps: Record<string, any>,
    ) => Record<string, any>;
    initialLayout: TabViewLayout;
    screenProps?: {};
    navigation: NavigationScreenProp<NavigationState>;
    router: NavigationRouter<NavigationState, NavigationTabScreenOptions>;
  };

  export declare var TabView: React.ComponentType<_TabViewProps>;

  declare type _MaterialTopTabBarProps = {
    activeTintColor: string;
    inactiveTintColor: string;
    showIcon: boolean;
    showLabel: boolean;
    upperCaseLabel: boolean;
    allowFontScaling: boolean;
    position: AnimatedValue;
    tabBarPosition: string;
    navigation: NavigationScreenProp<NavigationState>;
    jumpToIndex: (index: number) => void;
    getLabel: (
      scene: TabScene,
    ) => (React.ReactNode | string) | null | undefined;
    getOnPress: (
      previousScene: NavigationRoute,
      scene: TabScene,
    ) => (arg0: {
      previousScene: NavigationRoute;
      scene: TabScene;
      jumpToIndex: (index: number) => void;
    }) => void;
    renderIcon: (
      scene: TabScene,
    ) => React.ReactElement<React.ComponentProps<any>, any>;
    labelStyle?: TextStyleProp;
    iconStyle?: ViewStyleProp;
  };

  export declare var MaterialTopTabBar: React.ComponentType<_MaterialTopTabBarProps>;

  declare type _BottomTabBarButtonComponentProps = {
    onPress: () => void;
    onLongPress: () => void;
    testID: string;
    accessibilityLabel: string;
    style: ViewStyleProp;
  };

  declare type _BottomTabBarProps = {
    activeTintColor: string;
    activeBackgroundColor: string;
    adaptive?: boolean;
    inactiveTintColor: string;
    inactiveBackgroundColor: string;
    showLabel: boolean;
    showIcon: boolean;
    allowFontScaling: boolean;
    position: AnimatedValue;
    navigation: NavigationScreenProp<NavigationState>;
    jumpToIndex: (index: number) => void;
    getLabel: (
      scene: TabScene,
    ) => (React.ReactNode | string) | null | undefined;
    getOnPress: (
      previousScene: NavigationRoute,
      scene: TabScene,
    ) => (arg0: {
      previousScene: NavigationRoute;
      scene: TabScene;
      jumpToIndex: (index: number) => void;
    }) => void;
    getTestIDProps: (scene: TabScene) => (scene: TabScene) => any;
    renderIcon: (scene: TabScene) => React.ReactNode;
    getButtonComponent: (
      scene: TabScene,
    ) => React.ComponentType<_BottomTabBarButtonComponentProps>;
    style?: ViewStyleProp;
    animateStyle?: ViewStyleProp;
    labelStyle?: TextStyleProp;
    tabStyle?: ViewStyleProp;
    showIcon?: boolean;
  };

  export declare var BottomTabBar: React.ComponentType<_BottomTabBarProps>;

  export function withNavigation<
    Props extends {},
    ComponentType extends React.ComponentType<Props>,
  >(
    Component: ComponentType,
  ): React.ComponentType<
    $Diff<
      React$ElementConfig<ComponentType>,
      {
        navigation: NavigationScreenProp<NavigationStateRoute> | void;
      }
    >
  >;

  export function withNavigationFocus<
    Props extends {},
    ComponentType extends React.ComponentType<Props>,
  >(
    Component: ComponentType,
  ): React.ComponentType<
    $Diff<
      React$ElementConfig<ComponentType>,
      {
        isFocused: boolean | void;
      }
    >
  >;

  export function getNavigation<
    State extends NavigationState,
    Options extends {},
  >(
    router: NavigationRouter<State, Options>,
    state: State,
    dispatch: NavigationDispatch,
    actionSubscribers: Set<NavigationEventCallback>,
    getScreenProps: () => {},
    getCurrentNavigation: () => NavigationScreenProp<State> | null | undefined,
  ): NavigationScreenProp<State>;

  export function getActiveChildNavigationOptions<
    State extends NavigationState,
    Options extends {},
  >(navigation: NavigationScreenProp<State>, screenProps?: {}): Options;
}
