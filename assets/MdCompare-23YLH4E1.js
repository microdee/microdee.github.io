import { r as reactExports, R as React, j as jsxRuntimeExports, M as MdFullParallaxWrap } from "./index-czLPu_nJ.js";
const ContainerClip = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    willChange: "clip",
    userSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none"
  };
  return React.createElement("div", Object.assign({}, props, {
    style,
    "data-rcs": "clip-item",
    ref
  }));
});
ContainerClip.displayName = "ContainerClip";
const ContainerHandle = /* @__PURE__ */ reactExports.forwardRef(({
  children,
  portrait
}, ref) => {
  const style = {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  };
  const innerStyle = {
    position: "absolute",
    width: portrait ? "100%" : void 0,
    height: portrait ? void 0 : "100%",
    transform: portrait ? "translateY(-50%)" : "translateX(-50%)",
    pointerEvents: "all"
  };
  return React.createElement("div", {
    style,
    "data-rcs": "handle-container",
    ref
  }, React.createElement("div", {
    style: innerStyle
  }, children));
});
ContainerHandle.displayName = "ThisHandleContainer";
const ThisArrow = ({
  flip
}) => {
  const style = {
    width: 0,
    height: 0,
    borderTop: "8px solid transparent",
    borderRight: "10px solid",
    borderBottom: "8px solid transparent",
    transform: flip ? "rotate(180deg)" : void 0
  };
  return React.createElement("div", {
    style
  });
};
const ReactCompareSliderHandle = ({
  portrait,
  buttonStyle,
  linesStyle,
  style,
  ...props
}) => {
  const _style = {
    display: "flex",
    flexDirection: portrait ? "row" : "column",
    placeItems: "center",
    height: "100%",
    cursor: portrait ? "ns-resize" : "ew-resize",
    pointerEvents: "none",
    color: "#fff",
    ...style
  };
  const _linesStyle = {
    flexGrow: 1,
    height: portrait ? 2 : "100%",
    width: portrait ? "100%" : 2,
    backgroundColor: "currentColor",
    pointerEvents: "auto",
    boxShadow: "0 0 7px rgba(0,0,0,.35)",
    ...linesStyle
  };
  const _buttonStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gap: 8,
    placeContent: "center",
    flexShrink: 0,
    width: 56,
    height: 56,
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: 2,
    pointerEvents: "auto",
    backdropFilter: "blur(7px)",
    WebkitBackdropFilter: "blur(7px)",
    boxShadow: "0 0 7px rgba(0,0,0,.35)",
    transform: portrait ? "rotate(90deg)" : void 0,
    ...buttonStyle
  };
  return React.createElement("div", Object.assign({
    className: "__rcs-handle-root"
  }, props, {
    style: _style
  }), React.createElement("div", {
    className: "__rcs-handle-line",
    style: _linesStyle
  }), React.createElement("div", {
    className: "__rcs-handle-button",
    style: _buttonStyle
  }, React.createElement(ThisArrow, null), React.createElement(ThisArrow, {
    flip: true
  })), React.createElement("div", {
    className: "__rcs-handle-line",
    style: _linesStyle
  }));
};
const styleFitContainer = ({
  boxSizing = "border-box",
  objectFit = "cover",
  objectPosition = "center",
  ...props
} = {}) => ({
  display: "block",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  boxSizing,
  objectFit,
  objectPosition,
  ...props
});
const usePrevious = (value) => {
  const ref = reactExports.useRef(value);
  reactExports.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
const useEventListener = (eventName, handler, element, handlerOptions) => {
  const savedHandler = reactExports.useRef();
  reactExports.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  reactExports.useEffect(() => {
    if (!(element && element.addEventListener))
      return;
    const eventListener = (event) => savedHandler.current && savedHandler.current(event);
    element.addEventListener(eventName, eventListener, handlerOptions);
    return () => {
      element.removeEventListener(eventName, eventListener, handlerOptions);
    };
  }, [eventName, element, handlerOptions]);
};
const useIsomorphicLayoutEffect = typeof window !== "undefined" && window.document && window.document.createElement ? reactExports.useLayoutEffect : reactExports.useEffect;
const useResizeObserver = (ref, handler) => {
  const observer = reactExports.useRef();
  const observe = reactExports.useCallback(() => {
    if (ref.current && observer.current)
      observer.current.observe(ref.current);
  }, [ref]);
  useIsomorphicLayoutEffect(() => {
    observer.current = new ResizeObserver(([entry]) => handler(entry.contentRect));
    observe();
    return () => {
      if (observer.current)
        observer.current.disconnect();
    };
  }, [handler, observe]);
};
const EVENT_PASSIVE_PARAMS = {
  passive: true
};
const EVENT_CAPTURE_PARAMS = {
  capture: true,
  passive: false
};
const ReactCompareSlider = ({
  handle,
  itemOne,
  itemTwo,
  onlyHandleDraggable = false,
  onPositionChange,
  portrait = false,
  position = 50,
  boundsPadding = 0,
  changePositionOnHover = false,
  style,
  ...props
}) => {
  const rootContainerRef = reactExports.useRef(null);
  const clipContainerRef = reactExports.useRef(null);
  const handleContainerRef = reactExports.useRef(null);
  const internalPositionPc = reactExports.useRef(position);
  const prevPropPosition = usePrevious(position);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const hasWindowBinding = reactExports.useRef(false);
  const [interactiveTarget, setInteractiveTarget] = reactExports.useState();
  const [didSyncBounds, setDidSyncBounds] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setInteractiveTarget(onlyHandleDraggable ? handleContainerRef.current : rootContainerRef.current);
  }, [onlyHandleDraggable]);
  const updateInternalPosition = reactExports.useCallback(function updateInternalCall({
    x,
    y,
    isOffset,
    portrait: _portrait,
    boundsPadding: _boundsPadding
  }) {
    const {
      top,
      left,
      width,
      height
    } = rootContainerRef.current.getBoundingClientRect();
    if (width === 0 || height === 0)
      return;
    const positionPx = Math.min(
      Math.max(
        // Determine bounds based on orientation
        _portrait ? isOffset ? y - top - window.pageYOffset : y : isOffset ? x - left - window.pageXOffset : x,
        // Min value
        0
      ),
      // Max value
      _portrait ? height : width
    );
    const zoomScale = _portrait ? height / (rootContainerRef.current.offsetHeight || 1) : width / (rootContainerRef.current.offsetWidth || 1);
    const adjustedPosition = positionPx / zoomScale;
    const adjustedWidth = width / zoomScale;
    const adjustedHeight = height / zoomScale;
    const nextInternalPositionPc = adjustedPosition / (_portrait ? adjustedHeight : adjustedWidth) * 100;
    const positionMeetsBounds = _portrait ? adjustedPosition === 0 || adjustedPosition === adjustedHeight : adjustedPosition === 0 || adjustedPosition === adjustedWidth;
    const canSkipPositionPc = nextInternalPositionPc === internalPositionPc.current && (internalPositionPc.current === 0 || internalPositionPc.current === 100);
    if (didSyncBounds && canSkipPositionPc && positionMeetsBounds) {
      return;
    } else {
      setDidSyncBounds(true);
    }
    internalPositionPc.current = nextInternalPositionPc;
    const clampedPx = Math.min(
      // Get largest from pixel position *or* bounds padding.
      Math.max(adjustedPosition, 0 + _boundsPadding),
      // Use height *or* width based on orientation.
      (_portrait ? adjustedHeight : adjustedWidth) - _boundsPadding
    );
    clipContainerRef.current.style.clip = _portrait ? `rect(auto,auto,${clampedPx}px,auto)` : `rect(auto,${clampedPx}px,auto,auto)`;
    handleContainerRef.current.style.transform = _portrait ? `translate3d(0,${clampedPx}px,0)` : `translate3d(${clampedPx}px,0,0)`;
    if (onPositionChange)
      onPositionChange(internalPositionPc.current);
  }, [didSyncBounds, onPositionChange]);
  reactExports.useEffect(() => {
    const {
      width,
      height
    } = rootContainerRef.current.getBoundingClientRect();
    const nextPosition = position === prevPropPosition ? internalPositionPc.current : position;
    updateInternalPosition({
      portrait,
      boundsPadding,
      x: width / 100 * nextPosition,
      y: height / 100 * nextPosition
    });
  }, [portrait, position, prevPropPosition, boundsPadding, updateInternalPosition]);
  const handlePointerDown = reactExports.useCallback((ev) => {
    ev.preventDefault();
    updateInternalPosition({
      portrait,
      boundsPadding,
      isOffset: true,
      x: ev instanceof MouseEvent ? ev.pageX : ev.touches[0].pageX,
      y: ev instanceof MouseEvent ? ev.pageY : ev.touches[0].pageY
    });
    setIsDragging(true);
  }, [portrait, boundsPadding, updateInternalPosition]);
  const handlePointerMove = reactExports.useCallback(function moveCall(ev) {
    updateInternalPosition({
      portrait,
      boundsPadding,
      isOffset: true,
      x: ev instanceof MouseEvent ? ev.pageX : ev.touches[0].pageX,
      y: ev instanceof MouseEvent ? ev.pageY : ev.touches[0].pageY
    });
  }, [portrait, boundsPadding, updateInternalPosition]);
  const handlePointerUp = reactExports.useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleResize = reactExports.useCallback(({
    width,
    height
  }) => {
    const {
      width: scaledWidth,
      height: scaledHeight
    } = rootContainerRef.current.getBoundingClientRect();
    updateInternalPosition({
      portrait,
      boundsPadding,
      x: width / 100 * internalPositionPc.current * scaledWidth / width,
      y: height / 100 * internalPositionPc.current * scaledHeight / height
    });
  }, [portrait, boundsPadding, updateInternalPosition]);
  reactExports.useEffect(() => {
    if (isDragging && !hasWindowBinding.current) {
      window.addEventListener("mousemove", handlePointerMove, EVENT_PASSIVE_PARAMS);
      window.addEventListener("mouseup", handlePointerUp, EVENT_PASSIVE_PARAMS);
      window.addEventListener("touchmove", handlePointerMove, EVENT_PASSIVE_PARAMS);
      window.addEventListener("touchend", handlePointerUp, EVENT_PASSIVE_PARAMS);
      hasWindowBinding.current = true;
    }
    return () => {
      if (hasWindowBinding.current) {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("mouseup", handlePointerUp);
        window.removeEventListener("touchmove", handlePointerMove);
        window.removeEventListener("touchend", handlePointerUp);
        hasWindowBinding.current = false;
      }
    };
  }, [handlePointerMove, handlePointerUp, isDragging]);
  useResizeObserver(rootContainerRef, handleResize);
  reactExports.useEffect(() => {
    const containerRef = rootContainerRef.current;
    const handleMouseLeave = () => {
      if (isDragging)
        return;
      handlePointerUp();
    };
    if (changePositionOnHover) {
      containerRef.addEventListener("mousemove", handlePointerMove, EVENT_PASSIVE_PARAMS);
      containerRef.addEventListener("mouseleave", handleMouseLeave, EVENT_PASSIVE_PARAMS);
    }
    return () => {
      containerRef.removeEventListener("mousemove", handlePointerMove);
      containerRef.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [changePositionOnHover, handlePointerMove, handlePointerUp, isDragging]);
  useEventListener("mousedown", handlePointerDown, interactiveTarget, EVENT_CAPTURE_PARAMS);
  useEventListener("touchstart", handlePointerDown, interactiveTarget, EVENT_CAPTURE_PARAMS);
  const Handle = handle || React.createElement(ReactCompareSliderHandle, {
    portrait
  });
  const rootStyle = {
    position: "relative",
    overflow: "hidden",
    cursor: isDragging ? portrait ? "ns-resize" : "ew-resize" : void 0,
    userSelect: "none",
    KhtmlUserSelect: "none",
    msUserSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    ...style
  };
  return React.createElement("div", Object.assign({}, props, {
    ref: rootContainerRef,
    style: rootStyle,
    "data-rcs": "root"
  }), itemTwo, React.createElement(ContainerClip, {
    ref: clipContainerRef
  }, itemOne), React.createElement(ContainerHandle, {
    portrait,
    ref: handleContainerRef
  }, Handle));
};
const ReactCompareSliderImage = ({
  style,
  ...props
}) => {
  const rootStyle = styleFitContainer(style);
  return React.createElement("img", Object.assign({}, props, {
    style: rootStyle,
    "data-rcs": "image"
  }));
};
class MdCompare extends React.Component {
  constructor(props) {
    super(props);
  }
  renderSlider() {
    let extraProps = { ...this.props };
    delete extraProps.ls;
    delete extraProps.rs;
    delete extraProps.full;
    delete extraProps.children;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReactCompareSlider,
      {
        className: "md-expand",
        itemOne: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactCompareSliderImage, { src: this.props.ls, ...extraProps }),
        itemTwo: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactCompareSliderImage, { src: this.props.rs, ...extraProps })
      }
    );
  }
  render() {
    if ("full" in this.props && this.props.full) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MdFullParallaxWrap, { children: this.renderSlider() });
    } else {
      return this.renderSlider();
    }
  }
}
export {
  MdCompare as default
};
//# sourceMappingURL=MdCompare-23YLH4E1.js.map
