/**
 * The shared module every sibling bundle imports React from, vendored as
 * `react.js` beside them and imported by the relative URL `./react.js`. The
 * module map is keyed by resolved URL, so one React per document follows from
 * that URL.
 *
 * Every name the siblings use is written out: React's packages are CommonJS, so
 * `export *` compiles to a runtime re-export whose names no ESM importer can
 * bind to. `Fragment` comes from `react` alone — `react/jsx-runtime` exports
 * the same value, and re-exporting both would make the name ambiguous and
 * therefore absent.
 */
export { Activity, Children, Component, cloneElement, createContext, createElement, createRef, default, Fragment, forwardRef, isValidElement, lazy, memo, Profiler, PureComponent, StrictMode, Suspense, startTransition, use, useActionState, useCallback, useContext, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useOptimistic, useReducer, useRef, useState, useSyncExternalStore, useTransition, version, } from "react";
export { jsx, jsxs } from "react/jsx-runtime";
export { createPortal, flushSync, preconnect, prefetchDNS, preinit, preinitModule, preload, preloadModule, requestFormReset, unstable_batchedUpdates, useFormStatus, } from "react-dom";
export { createRoot, hydrateRoot } from "react-dom/client";
