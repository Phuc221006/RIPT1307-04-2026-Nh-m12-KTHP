(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[@utoo/pack-runtime]/hmr/bootstrap.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$hmr$2f$client$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[@utoo/pack-runtime]/hmr/client.ts [client] (ecmascript)");
;
(0, __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$hmr$2f$client$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["initHMR"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[@utoo/pack-runtime]/hmr/client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initHMR",
    ()=>initHMR
]);
// @ts-ignore
var __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$hmr$2d$client$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$hmr$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[@utoo/pack-runtime]/hmr/websocket.ts [client] (ecmascript)");
;
;
function initHMR() {
    (0, __TURBOPACK__imported__module__$5b$turbopack$5d2f$browser$2f$dev$2f$hmr$2d$client$2f$hmr$2d$client$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["connect"])({
        addMessageListener: __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$hmr$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["addMessageListener"],
        sendMessage: __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$hmr$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["sendMessage"],
        onUpdateError: console.error
    });
    (0, __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$hmr$2f$websocket$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["connectHMR"])({
        path: "/turbopack-hmr"
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[@utoo/pack-runtime]/hmr/websocket.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Adapted from https://github.com/vercel/next.js/blob/canary/packages/next/src/client/dev/error-overlay/websocket.ts
__turbopack_context__.s([
    "addMessageListener",
    ()=>addMessageListener,
    "connectHMR",
    ()=>connectHMR,
    "sendMessage",
    ()=>sendMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$process$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/process/browser.js [client] (ecmascript)");
let source = null;
let eventCallbacks = [];
// Helper function to dispatch messages to all event callbacks
function dispatchMessage(message) {
    for (const eventCallback of eventCallbacks){
        eventCallback(message);
    }
}
function addMessageListener(callback) {
    eventCallbacks.push(callback);
}
function sendMessage(data) {
    if (source && source.readyState === source.OPEN) {
        const message = typeof data === "string" ? data : JSON.stringify(data);
        source.send(message);
    }
}
function getSocketProtocol() {
    return typeof location !== "undefined" && location.protocol === "https:" ? "wss" : "ws";
}
function getSocketUrl() {
    const socketServer = ("TURBOPACK compile-time value", undefined);
    if (socketServer) {
        try {
            const parsed = new URL(socketServer);
            const protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
            if (protocol === "ws:" || protocol === "wss:") {
                const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
                return `${protocol}//${parsed.host}${pathname}`;
            }
        } catch  {}
    }
    const { hostname, port } = location;
    const protocol = getSocketProtocol();
    return `${protocol}://${hostname}${port ? `:${port}` : ""}`;
}
let reconnections = 0;
let reloading = false;
let serverSessionId = null;
function connectHMR(options) {
    function init() {
        if (source) source.close();
        console.log("[HMR] connecting...");
        function handleOnline() {
            reconnections = 0;
            window.console.log("[HMR] connected");
            // Send the turbopack-connected message to trigger handleSocketConnected
            const connected = {
                type: "turbopack-connected"
            };
            dispatchMessage(connected);
        }
        function handleMessage(event) {
            if (reloading) {
                return;
            }
            try {
                const msg = JSON.parse(event.data);
                // Handle the different message formats from different servers
                if (msg.action === "turbopack-connected") {
                    if (serverSessionId !== null && serverSessionId !== msg.data.sessionId) {
                        window.location.reload();
                        reloading = true;
                        return;
                    }
                    serverSessionId = msg.data.sessionId;
                    // Convert to turbopack format and trigger handleSocketConnected
                    const connected = {
                        type: "turbopack-connected"
                    };
                    dispatchMessage(connected);
                    return;
                }
                if (msg.action === "reload") {
                    window.location.reload();
                    reloading = true;
                    return;
                }
                if (msg.action === "turbopack-message") {
                    const turbopackMessage = {
                        type: "turbopack-message",
                        data: msg.data
                    };
                    dispatchMessage(turbopackMessage);
                    return;
                }
                // Handle direct turbopack-dev-server messages
                if (msg.type && [
                    "partial",
                    "restart",
                    "notFound",
                    "issues"
                ].includes(msg.type)) {
                    const turbopackMessage = {
                        type: "turbopack-message",
                        data: msg
                    };
                    dispatchMessage(turbopackMessage);
                    return;
                }
            // TODO: handle rest msg.actions
            } catch (e) {
                console.error("[HMR] Failed to parse message:", e);
            }
        }
        let timer;
        function handleDisconnect() {
            source.onerror = null;
            source.onclose = null;
            source.close();
            reconnections++;
            // After 25 reconnects we'll want to reload the page as it indicates the dev server is no longer running.
            if (reconnections > 25) {
                reloading = true;
                window.location.reload();
                return;
            }
            clearTimeout(timer);
            // Try again after 5 seconds
            timer = setTimeout(init, reconnections > 5 ? 5000 : 1000);
        }
        source = new WebSocket(`${getSocketUrl()}${options.path}`);
        source.onopen = handleOnline;
        source.onerror = handleDisconnect;
        source.onmessage = handleMessage;
    }
    init();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[@utoo/pack-runtime]/react-refresh/internal/helpers.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * MIT License
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */ // This file is copied from the Metro JavaScript bundler, with minor tweaks for
// webpack 4 compatibility.
//
// https://github.com/facebook/metro/blob/d6b9685c730d0d63577db40f41369157f28dfa3a/packages/metro/src/lib/polyfills/require.js
var __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[@utoo/pack-runtime]/react-refresh/internal/react-refresh-runtime.development.js [client] (ecmascript)");
;
const { m: turbopackModule } = __turbopack_context__;
function isSafeExport(key) {
    return key === "__esModule" || key === "__N_SSG" || key === "__N_SSP" || // TODO: remove this key from page config instead of allow listing it
    key === "config";
}
function registerExportsForReactRefresh(moduleExports, moduleID) {
    __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].register(moduleExports, moduleID + " %exports%");
    if (moduleExports == null || typeof moduleExports !== "object") {
        // Exit if we can't iterate over exports.
        // (This is important for legacy environments.)
        return;
    }
    for(var key in moduleExports){
        if (isSafeExport(key)) {
            continue;
        }
        try {
            var exportValue = moduleExports[key];
        } catch  {
            continue;
        }
        var typeID = moduleID + " %exports% " + key;
        __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].register(exportValue, typeID);
    }
}
function getRefreshBoundarySignature(moduleExports) {
    var signature = [];
    signature.push(__TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getFamilyByType(moduleExports));
    if (moduleExports == null || typeof moduleExports !== "object") {
        // Exit if we can't iterate over exports.
        // (This is important for legacy environments.)
        return signature;
    }
    for(var key in moduleExports){
        if (isSafeExport(key)) {
            continue;
        }
        try {
            var exportValue = moduleExports[key];
        } catch  {
            continue;
        }
        signature.push(key);
        signature.push(__TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getFamilyByType(exportValue));
    }
    return signature;
}
function isReactRefreshBoundary(moduleExports) {
    if (__TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].isLikelyComponentType(moduleExports)) {
        return true;
    }
    if (moduleExports == null || typeof moduleExports !== "object") {
        // Exit if we can't iterate over exports.
        return false;
    }
    var hasExports = false;
    var areAllExportsComponents = true;
    for(var key in moduleExports){
        hasExports = true;
        if (isSafeExport(key)) {
            continue;
        }
        try {
            var exportValue = moduleExports[key];
        } catch  {
            // This might fail due to circular dependencies
            return false;
        }
        if (!__TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].isLikelyComponentType(exportValue)) {
            areAllExportsComponents = false;
        }
    }
    return hasExports && areAllExportsComponents;
}
function shouldInvalidateReactRefreshBoundary(prevSignature, nextSignature) {
    if (prevSignature.length !== nextSignature.length) {
        return true;
    }
    for(var i = 0; i < nextSignature.length; i++){
        if (prevSignature[i] !== nextSignature[i]) {
            return true;
        }
    }
    return false;
}
var isUpdateScheduled = false;
// This function aggregates updates from multiple modules into a single React Refresh call.
function scheduleUpdate() {
    if (isUpdateScheduled) {
        return;
    }
    isUpdateScheduled = true;
    function canApplyUpdate(status) {
        return status === "idle";
    }
    function applyUpdate() {
        isUpdateScheduled = false;
        try {
            __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].performReactRefresh();
        } catch (err) {
            console.warn("Warning: Failed to re-render. We will retry on the next Fast Refresh event.\n" + err);
        }
    }
    if (canApplyUpdate(turbopackModule.hot.status())) {
        // Apply update on the next tick.
        Promise.resolve().then(()=>{
            applyUpdate();
        });
        return;
    }
    const statusHandler = (status)=>{
        if (canApplyUpdate(status)) {
            turbopackModule.hot.removeStatusHandler(statusHandler);
            applyUpdate();
        }
    };
    // Apply update once the HMR runtime's status is idle.
    turbopackModule.hot.addStatusHandler(statusHandler);
}
var __TURBOPACK__default__export__ = {
    registerExportsForReactRefresh: registerExportsForReactRefresh,
    isReactRefreshBoundary: isReactRefreshBoundary,
    shouldInvalidateReactRefreshBoundary: shouldInvalidateReactRefreshBoundary,
    getRefreshBoundarySignature: getRefreshBoundarySignature,
    scheduleUpdate: scheduleUpdate
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[@utoo/pack-runtime]/react-refresh/internal/react-refresh-runtime.development.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$process$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/process/browser.js [client] (ecmascript)");
// react@0.18.0: https://unpkg.com/react-refresh@0.18.0/cjs/react-refresh-runtime.development.js
/**
 * @license React
 * react-refresh-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function computeFullKey(signature) {
        if (null !== signature.fullKey) return signature.fullKey;
        var fullKey = signature.ownKey;
        try {
            var hooks = signature.getCustomHooks();
        } catch (err) {
            return signature.forceReset = !0, signature.fullKey = fullKey;
        }
        for(var i = 0; i < hooks.length; i++){
            var hook = hooks[i];
            if ("function" !== typeof hook) return signature.forceReset = !0, signature.fullKey = fullKey;
            hook = allSignaturesByType.get(hook);
            if (void 0 !== hook) {
                var nestedHookKey = computeFullKey(hook);
                hook.forceReset && (signature.forceReset = !0);
                fullKey += "\n---\n" + nestedHookKey;
            }
        }
        return signature.fullKey = fullKey;
    }
    function resolveFamily(type) {
        return updatedFamiliesByType.get(type);
    }
    function cloneMap(map) {
        var clone = new Map();
        map.forEach(function(value, key) {
            clone.set(key, value);
        });
        return clone;
    }
    function cloneSet(set) {
        var clone = new Set();
        set.forEach(function(value) {
            clone.add(value);
        });
        return clone;
    }
    function getProperty(object, property) {
        try {
            return object[property];
        } catch (err) {}
    }
    function register(type, id) {
        if (!(null === type || "function" !== typeof type && "object" !== typeof type || allFamiliesByType.has(type))) {
            var family = allFamiliesByID.get(id);
            void 0 === family ? (family = {
                current: type
            }, allFamiliesByID.set(id, family)) : pendingUpdates.push([
                family,
                type
            ]);
            allFamiliesByType.set(type, family);
            if ("object" === typeof type && null !== type) switch(getProperty(type, "$$typeof")){
                case REACT_FORWARD_REF_TYPE:
                    register(type.render, id + "$render");
                    break;
                case REACT_MEMO_TYPE:
                    register(type.type, id + "$type");
            }
        }
    }
    function setSignature(type, key) {
        var forceReset = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : !1, getCustomHooks = 3 < arguments.length ? arguments[3] : void 0;
        allSignaturesByType.has(type) || allSignaturesByType.set(type, {
            forceReset: forceReset,
            ownKey: key,
            fullKey: null,
            getCustomHooks: getCustomHooks || function() {
                return [];
            }
        });
        if ("object" === typeof type && null !== type) switch(getProperty(type, "$$typeof")){
            case REACT_FORWARD_REF_TYPE:
                setSignature(type.render, key, forceReset, getCustomHooks);
                break;
            case REACT_MEMO_TYPE:
                setSignature(type.type, key, forceReset, getCustomHooks);
        }
    }
    function collectCustomHooksForSignature(type) {
        type = allSignaturesByType.get(type);
        void 0 !== type && computeFullKey(type);
    }
    var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_MEMO_TYPE = Symbol.for("react.memo"), PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, allFamiliesByID = new Map(), allFamiliesByType = new PossiblyWeakMap(), allSignaturesByType = new PossiblyWeakMap(), updatedFamiliesByType = new PossiblyWeakMap(), pendingUpdates = [], helpersByRendererID = new Map(), helpersByRoot = new Map(), mountedRoots = new Set(), failedRoots = new Set(), rootElements = "function" === typeof WeakMap ? new WeakMap() : null, isPerformingRefresh = !1;
    exports._getMountedRootCount = function() {
        return mountedRoots.size;
    };
    exports.collectCustomHooksForSignature = collectCustomHooksForSignature;
    exports.createSignatureFunctionForTransform = function() {
        var savedType, hasCustomHooks, didCollectHooks = !1;
        return function(type, key, forceReset, getCustomHooks) {
            if ("string" === typeof key) return savedType || (savedType = type, hasCustomHooks = "function" === typeof getCustomHooks), null == type || "function" !== typeof type && "object" !== typeof type || setSignature(type, key, forceReset, getCustomHooks), type;
            !didCollectHooks && hasCustomHooks && (didCollectHooks = !0, collectCustomHooksForSignature(savedType));
        };
    };
    exports.getFamilyByID = function(id) {
        return allFamiliesByID.get(id);
    };
    exports.getFamilyByType = function(type) {
        return allFamiliesByType.get(type);
    };
    exports.hasUnrecoverableErrors = function() {
        return !1;
    };
    exports.injectIntoGlobalHook = function(globalObject) {
        var hook = globalObject.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (void 0 === hook) {
            var nextID = 0;
            globalObject.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook = {
                renderers: new Map(),
                supportsFiber: !0,
                inject: function() {
                    return nextID++;
                },
                onScheduleFiberRoot: function() {},
                onCommitFiberRoot: function() {},
                onCommitFiberUnmount: function() {}
            };
        }
        if (hook.isDisabled) console.warn("Something has shimmed the React DevTools global hook (__REACT_DEVTOOLS_GLOBAL_HOOK__). Fast Refresh is not compatible with this shim and will be disabled.");
        else {
            var oldInject = hook.inject;
            hook.inject = function(injected) {
                var id = oldInject.apply(this, arguments);
                "function" === typeof injected.scheduleRefresh && "function" === typeof injected.setRefreshHandler && helpersByRendererID.set(id, injected);
                return id;
            };
            hook.renderers.forEach(function(injected, id) {
                "function" === typeof injected.scheduleRefresh && "function" === typeof injected.setRefreshHandler && helpersByRendererID.set(id, injected);
            });
            var oldOnCommitFiberRoot = hook.onCommitFiberRoot, oldOnScheduleFiberRoot = hook.onScheduleFiberRoot || function() {};
            hook.onScheduleFiberRoot = function(id, root, children) {
                isPerformingRefresh || (failedRoots.delete(root), null !== rootElements && rootElements.set(root, children));
                return oldOnScheduleFiberRoot.apply(this, arguments);
            };
            hook.onCommitFiberRoot = function(id, root, maybePriorityLevel, didError) {
                var helpers = helpersByRendererID.get(id);
                if (void 0 !== helpers) {
                    helpersByRoot.set(root, helpers);
                    helpers = root.current;
                    var alternate = helpers.alternate;
                    null !== alternate ? (alternate = null != alternate.memoizedState && null != alternate.memoizedState.element && mountedRoots.has(root), helpers = null != helpers.memoizedState && null != helpers.memoizedState.element, !alternate && helpers ? (mountedRoots.add(root), failedRoots.delete(root)) : alternate && helpers || (alternate && !helpers ? (mountedRoots.delete(root), didError ? failedRoots.add(root) : helpersByRoot.delete(root)) : alternate || helpers || didError && failedRoots.add(root))) : mountedRoots.add(root);
                }
                return oldOnCommitFiberRoot.apply(this, arguments);
            };
        }
    };
    exports.isLikelyComponentType = function(type) {
        switch(typeof type){
            case "function":
                if (null != type.prototype) {
                    if (type.prototype.isReactComponent) return !0;
                    var ownNames = Object.getOwnPropertyNames(type.prototype);
                    if (1 < ownNames.length || "constructor" !== ownNames[0] || type.prototype.__proto__ !== Object.prototype) return !1;
                }
                type = type.name || type.displayName;
                return "string" === typeof type && /^[A-Z]/.test(type);
            case "object":
                if (null != type) switch(getProperty(type, "$$typeof")){
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_MEMO_TYPE:
                        return !0;
                }
                return !1;
            default:
                return !1;
        }
    };
    exports.performReactRefresh = function() {
        if (0 === pendingUpdates.length || isPerformingRefresh) return null;
        isPerformingRefresh = !0;
        try {
            var staleFamilies = new Set(), updatedFamilies = new Set(), updates = pendingUpdates;
            pendingUpdates = [];
            updates.forEach(function(_ref) {
                var family = _ref[0];
                _ref = _ref[1];
                var prevType = family.current;
                updatedFamiliesByType.set(prevType, family);
                updatedFamiliesByType.set(_ref, family);
                family.current = _ref;
                prevType.prototype && prevType.prototype.isReactComponent || _ref.prototype && _ref.prototype.isReactComponent ? _ref = !1 : (prevType = allSignaturesByType.get(prevType), _ref = allSignaturesByType.get(_ref), _ref = void 0 === prevType && void 0 === _ref || void 0 !== prevType && void 0 !== _ref && computeFullKey(prevType) === computeFullKey(_ref) && !_ref.forceReset ? !0 : !1);
                _ref ? updatedFamilies.add(family) : staleFamilies.add(family);
            });
            var update = {
                updatedFamilies: updatedFamilies,
                staleFamilies: staleFamilies
            };
            helpersByRendererID.forEach(function(helpers) {
                helpers.setRefreshHandler(resolveFamily);
            });
            var didError = !1, firstError = null, failedRootsSnapshot = cloneSet(failedRoots), mountedRootsSnapshot = cloneSet(mountedRoots), helpersByRootSnapshot = cloneMap(helpersByRoot);
            failedRootsSnapshot.forEach(function(root) {
                var helpers = helpersByRootSnapshot.get(root);
                if (void 0 === helpers) throw Error("Could not find helpers for a root. This is a bug in React Refresh.");
                failedRoots.has(root);
                if (null !== rootElements && rootElements.has(root)) {
                    var element = rootElements.get(root);
                    try {
                        helpers.scheduleRoot(root, element);
                    } catch (err) {
                        didError || (didError = !0, firstError = err);
                    }
                }
            });
            mountedRootsSnapshot.forEach(function(root) {
                var helpers = helpersByRootSnapshot.get(root);
                if (void 0 === helpers) throw Error("Could not find helpers for a root. This is a bug in React Refresh.");
                mountedRoots.has(root);
                try {
                    helpers.scheduleRefresh(root, update);
                } catch (err) {
                    didError || (didError = !0, firstError = err);
                }
            });
            if (didError) throw firstError;
            return update;
        } finally{
            isPerformingRefresh = !1;
        }
    };
    exports.register = register;
    exports.setSignature = setSignature;
}();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[@utoo/pack-runtime]/react-refresh/runtime.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$helpers$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[@utoo/pack-runtime]/react-refresh/internal/helpers.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[@utoo/pack-runtime]/react-refresh/internal/react-refresh-runtime.development.js [client] (ecmascript)");
;
;
// Hook into ReactDOM initialization
__TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].injectIntoGlobalHook(self);
// Register global helpers
self.$RefreshHelpers$ = __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$helpers$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["default"];
// Register a helper for module execution interception
self.$RefreshInterceptModuleExecution$ = function(webpackModuleId) {
    var prevRefreshReg = self.$RefreshReg$;
    var prevRefreshSig = self.$RefreshSig$;
    self.$RefreshReg$ = function(type, id) {
        __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].register(type, webpackModuleId + " " + id);
    };
    self.$RefreshSig$ = __TURBOPACK__imported__module__$5b40$utoo$2f$pack$2d$runtime$5d2f$react$2d$refresh$2f$internal$2f$react$2d$refresh$2d$runtime$2e$development$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createSignatureFunctionForTransform;
    // Modeled after `useEffect` cleanup pattern:
    // https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
    return function() {
        self.$RefreshReg$ = prevRefreshReg;
        self.$RefreshSig$ = prevRefreshSig;
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/defineApp.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
__turbopack_context__.s([
    "defineApp",
    ()=>defineApp
]);
function defineApp(config) {
    return config;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/helmet.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "innerProvider",
    ()=>innerProvider
]);
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$helmet$2d$async$2f$lib$2f$index$2e$module$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-helmet-async/lib/index.module.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$helmetContext$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/helmetContext.ts [client] (ecmascript)");
;
;
;
const innerProvider = (container)=>{
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$helmet$2d$async$2f$lib$2f$index$2e$module$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HelmetProvider"], {
        context: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$helmetContext$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["context"]
    }, container);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/helmetContext.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
__turbopack_context__.s([
    "context",
    ()=>context
]);
const context = {};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/history.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHistory",
    ()=>createHistory,
    "history",
    ()=>history,
    "setHistory",
    ()=>setHistory
]);
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/history/index.js [client] (ecmascript)");
;
let history;
let basename = '/';
function createHistory(opts) {
    let h;
    if (opts.type === 'hash') {
        h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createHashHistory"])();
    } else if (opts.type === 'memory') {
        h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createMemoryHistory"])(opts);
    } else {
        h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createBrowserHistory"])();
    }
    if (opts.basename) {
        basename = opts.basename;
    }
    history = {
        ...h,
        push (to, state) {
            h.push(patchTo(to, h), state);
        },
        replace (to, state) {
            h.replace(patchTo(to, h), state);
        },
        get location () {
            return h.location;
        },
        get action () {
            return h.action;
        }
    };
    return h;
}
function setHistory(h) {
    if (h) {
        history = h;
    }
}
// Patch `to` to support basename
// Refs:
// https://github.com/remix-run/history/blob/3e9dab4/packages/history/index.ts#L484
// https://github.com/remix-run/history/blob/dev/docs/api-reference.md#to
function patchTo(to, h) {
    if (typeof to === 'string') {
        return `${stripLastSlash(basename)}${to}`;
    } else if (typeof to === 'object') {
        const currentPathname = h.location.pathname;
        return {
            ...to,
            pathname: to.pathname ? `${stripLastSlash(basename)}${to.pathname}` : currentPathname
        };
    } else {
        throw new Error(`Unexpected to: ${to}`);
    }
}
function stripLastSlash(path) {
    return path.slice(-1) === '/' ? path.slice(0, -1) : path;
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/plugin.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPluginManager",
    ()=>createPluginManager,
    "getPluginManager",
    ()=>getPluginManager,
    "getPlugins",
    ()=>getPlugins,
    "getValidKeys",
    ()=>getValidKeys
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$process$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/process/browser.js [client] (ecmascript)");
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$helmet$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/helmet.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/exports.ts [client] (ecmascript)");
;
;
function __defaultExport(obj) {
    if (obj.default) {
        return typeof obj.default === 'function' ? obj.default() : obj.default;
    }
    return obj;
}
function getPlugins() {
    return [
        {
            apply: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$helmet$2e$ts__$5b$client$5d$__$28$ecmascript$29$__,
            path: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '@@/core/helmet.ts'
        }
    ];
}
function getValidKeys() {
    return [
        'patchRoutes',
        'patchClientRoutes',
        'modifyContextOpts',
        'modifyClientRenderOpts',
        'rootContainer',
        'innerProvider',
        'i18nProvider',
        'accessProvider',
        'dataflowProvider',
        'outerProvider',
        'render',
        'onRouteChange'
    ];
}
let pluginManager = null;
function createPluginManager() {
    pluginManager = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["PluginManager"].create({
        plugins: getPlugins(),
        validKeys: getValidKeys()
    });
    return pluginManager;
}
function getPluginManager() {
    return pluginManager;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/polyfill.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$error$2e$cause$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.error.cause.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$aggregate$2d$error$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.aggregate-error.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$aggregate$2d$error$2e$cause$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.aggregate-error.cause.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$at$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.at.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$find$2d$last$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.find-last.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$find$2d$last$2d$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.find-last-index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$push$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.push.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$reduce$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.reduce.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$reduce$2d$right$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.reduce-right.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$to$2d$reversed$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.to-reversed.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$to$2d$sorted$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.to-sorted.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$to$2d$spliced$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.to-spliced.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$array$2e$with$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.array.with.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$map$2e$group$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.map.group-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$object$2e$group$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.object.group-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$object$2e$has$2d$own$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.object.has-own.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$promise$2e$any$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.promise.any.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$promise$2e$with$2d$resolvers$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.promise.with-resolvers.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$reflect$2e$to$2d$string$2d$tag$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.reflect.to-string-tag.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$regexp$2e$flags$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.regexp.flags.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$string$2e$at$2d$alternative$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.string.at-alternative.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$string$2e$is$2d$well$2d$formed$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.string.is-well-formed.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$string$2e$replace$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.string.replace-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$string$2e$to$2d$well$2d$formed$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.string.to-well-formed.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$at$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.at.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$find$2d$last$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.find-last.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$find$2d$last$2d$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.find-last-index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$set$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.set.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$to$2d$reversed$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.to-reversed.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$to$2d$sorted$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.to-sorted.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$es$2e$typed$2d$array$2e$with$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/es.typed-array.with.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$suppressed$2d$error$2e$constructor$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.suppressed-error.constructor.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$from$2d$async$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.from-async.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$filter$2d$out$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.filter-out.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$filter$2d$reject$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.filter-reject.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$group$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.group.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$group$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.group-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$group$2d$by$2d$to$2d$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.group-by-to-map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$group$2d$to$2d$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.group-to-map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$is$2d$template$2d$object$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.is-template-object.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$last$2d$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.last-index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$last$2d$item$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.last-item.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2e$unique$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array.unique-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2d$buffer$2e$detached$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array-buffer.detached.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2d$buffer$2e$transfer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array-buffer.transfer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$array$2d$buffer$2e$transfer$2d$to$2d$fixed$2d$length$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.array-buffer.transfer-to-fixed-length.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$disposable$2d$stack$2e$constructor$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-disposable-stack.constructor.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$constructor$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.constructor.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$as$2d$indexed$2d$pairs$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.as-indexed-pairs.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$async$2d$dispose$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.async-dispose.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$drop$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.drop.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$every$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.every.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$filter$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.filter.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$find$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.find.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$flat$2d$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.flat-map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$for$2d$each$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.for-each.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$indexed$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.indexed.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$reduce$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.reduce.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$some$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.some.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$take$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.take.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$async$2d$iterator$2e$to$2d$array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.async-iterator.to-array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$bigint$2e$range$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.bigint.range.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$composite$2d$key$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.composite-key.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$composite$2d$symbol$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.composite-symbol.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$data$2d$view$2e$get$2d$float16$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.data-view.get-float16.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$data$2d$view$2e$get$2d$uint8$2d$clamped$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.data-view.get-uint8-clamped.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$data$2d$view$2e$set$2d$float16$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.data-view.set-float16.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$data$2d$view$2e$set$2d$uint8$2d$clamped$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.data-view.set-uint8-clamped.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$disposable$2d$stack$2e$constructor$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.disposable-stack.constructor.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$function$2e$demethodize$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.function.demethodize.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$function$2e$is$2d$callable$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.function.is-callable.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$function$2e$is$2d$constructor$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.function.is-constructor.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$function$2e$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.function.metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$function$2e$un$2d$this$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.function.un-this.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$constructor$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.constructor.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$as$2d$indexed$2d$pairs$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.as-indexed-pairs.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$dispose$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.dispose.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$drop$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.drop.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$every$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.every.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$filter$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.filter.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$find$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.find.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$flat$2d$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.flat-map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$for$2d$each$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.for-each.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$indexed$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.indexed.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$range$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.range.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$reduce$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.reduce.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$some$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.some.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$take$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.take.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$to$2d$array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.to-array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$iterator$2e$to$2d$async$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.iterator.to-async.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$json$2e$is$2d$raw$2d$json$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.json.is-raw-json.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$json$2e$parse$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.json.parse.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$json$2e$raw$2d$json$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.json.raw-json.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$delete$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.delete-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$emplace$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.emplace.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$every$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.every.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$filter$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.filter.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$find$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.find.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$find$2d$key$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.find-key.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$includes$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.includes.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$key$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.key-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$key$2d$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.key-of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$map$2d$keys$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.map-keys.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$map$2d$values$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.map-values.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$merge$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.merge.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$reduce$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.reduce.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$some$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.some.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$update$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.update.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$update$2d$or$2d$insert$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.update-or-insert.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$map$2e$upsert$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.map.upsert.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$clamp$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.clamp.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$deg$2d$per$2d$rad$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.deg-per-rad.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$degrees$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.degrees.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$fscale$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.fscale.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$f16round$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.f16round.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$iaddh$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.iaddh.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$imulh$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.imulh.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$isubh$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.isubh.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$rad$2d$per$2d$deg$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.rad-per-deg.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$radians$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.radians.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$scale$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.scale.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$seeded$2d$prng$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.seeded-prng.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$signbit$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.signbit.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$math$2e$umulh$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.math.umulh.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$number$2e$from$2d$string$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.number.from-string.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$number$2e$range$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.number.range.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$object$2e$iterate$2d$entries$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.object.iterate-entries.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$object$2e$iterate$2d$keys$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.object.iterate-keys.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$object$2e$iterate$2d$values$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.object.iterate-values.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$observable$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.observable.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$promise$2e$try$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.promise.try.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$define$2d$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.define-metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$delete$2d$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.delete-metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$get$2d$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.get-metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$get$2d$metadata$2d$keys$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.get-metadata-keys.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$get$2d$own$2d$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.get-own-metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$get$2d$own$2d$metadata$2d$keys$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.get-own-metadata-keys.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$has$2d$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.has-metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$has$2d$own$2d$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.has-own-metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$reflect$2e$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.reflect.metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$regexp$2e$escape$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.regexp.escape.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$add$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.add-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$delete$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.delete-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$difference$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.difference.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$difference$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.difference.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$every$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.every.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$filter$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.filter.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$find$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.find.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$intersection$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.intersection.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$intersection$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.intersection.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$is$2d$disjoint$2d$from$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.is-disjoint-from.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$is$2d$disjoint$2d$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.is-disjoint-from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$is$2d$subset$2d$of$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.is-subset-of.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$is$2d$subset$2d$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.is-subset-of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$is$2d$superset$2d$of$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.is-superset-of.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$is$2d$superset$2d$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.is-superset-of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$join$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.join.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$map$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.map.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$reduce$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.reduce.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$some$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.some.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$symmetric$2d$difference$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.symmetric-difference.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$symmetric$2d$difference$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.symmetric-difference.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$union$2e$v2$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.union.v2.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$set$2e$union$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.set.union.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$string$2e$at$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.string.at.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$string$2e$cooked$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.string.cooked.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$string$2e$code$2d$points$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.string.code-points.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$string$2e$dedent$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.string.dedent.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$async$2d$dispose$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.async-dispose.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$dispose$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.dispose.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$is$2d$registered$2d$symbol$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.is-registered-symbol.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$is$2d$registered$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.is-registered.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$is$2d$well$2d$known$2d$symbol$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.is-well-known-symbol.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$is$2d$well$2d$known$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.is-well-known.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$matcher$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.matcher.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$metadata$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.metadata.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$metadata$2d$key$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.metadata-key.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$observable$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.observable.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$pattern$2d$match$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.pattern-match.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$symbol$2e$replace$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.symbol.replace-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$typed$2d$array$2e$from$2d$async$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.typed-array.from-async.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$typed$2d$array$2e$filter$2d$out$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.typed-array.filter-out.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$typed$2d$array$2e$filter$2d$reject$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.typed-array.filter-reject.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$typed$2d$array$2e$group$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.typed-array.group-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$typed$2d$array$2e$to$2d$spliced$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.typed-array.to-spliced.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$typed$2d$array$2e$unique$2d$by$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.typed-array.unique-by.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$uint8$2d$array$2e$from$2d$base64$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.uint8-array.from-base64.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$uint8$2d$array$2e$from$2d$hex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.uint8-array.from-hex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$uint8$2d$array$2e$to$2d$base64$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.uint8-array.to-base64.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$uint8$2d$array$2e$to$2d$hex$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.uint8-array.to-hex.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$map$2e$delete$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-map.delete-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$map$2e$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-map.from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$map$2e$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-map.of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$map$2e$emplace$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-map.emplace.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$map$2e$upsert$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-map.upsert.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$set$2e$add$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-set.add-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$set$2e$delete$2d$all$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-set.delete-all.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$set$2e$from$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-set.from.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$esnext$2e$weak$2d$set$2e$of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/esnext.weak-set.of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$dom$2d$exception$2e$stack$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.dom-exception.stack.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$immediate$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.immediate.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$self$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.self.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$structured$2d$clone$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.structured-clone.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$url$2e$can$2d$parse$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.url.can-parse.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$url$2d$search$2d$params$2e$delete$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.url-search-params.delete.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$url$2d$search$2d$params$2e$has$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.url-search-params.has.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$core$2d$js$2f$modules$2f$web$2e$url$2d$search$2d$params$2e$size$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/core-js/modules/web.url-search-params.size.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$preset$2d$umi$2f$node_modules$2f$regenerator$2d$runtime$2f$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/preset-umi/node_modules/regenerator-runtime/runtime.js [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/route.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRoutes",
    ()=>getRoutes
]);
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
async function getRoutes() {
    const routes = {
        "1": {
            "path": "/",
            "parentId": "@@/global-layout",
            "id": "1"
        },
        "2": {
            "path": "/docs",
            "parentId": "@@/global-layout",
            "id": "2"
        },
        "@@/global-layout": {
            "id": "@@/global-layout",
            "path": "/",
            "isLayout": true
        }
    };
    return {
        routes,
        routeComponents: {
            '1': /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].lazy(()=>__turbopack_context__.A("[project]/src/pages/index.tsx [client] (ecmascript, async loader)")),
            '2': /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].lazy(()=>__turbopack_context__.A("[project]/src/pages/docs.tsx [client] (ecmascript, async loader)")),
            '@@/global-layout': /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].lazy(()=>__turbopack_context__.A("[project]/src/layouts/index.tsx [client] (ecmascript, async loader)"))
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/core/terminal.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "terminal",
    ()=>terminal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$process$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/process/browser.js [client] (ecmascript)");
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
let count = 0;
let groupLevel = 0;
function send(type, message) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        const encodedMessage = message ? `&m=${encodeURI(message)}` : '';
        fetch(`/__umi/api/terminal?type=${type}&t=${Date.now()}&c=${count++}&g=${groupLevel}${encodedMessage}`, {
            mode: 'no-cors'
        });
    }
}
function prettyPrint(obj) {
    return JSON.stringify(obj, null, 2);
}
function stringifyObjs(objs) {
    const obj = objs.length > 1 ? objs.map(stringify).join(' ') : objs[0];
    return typeof obj === 'object' ? `${prettyPrint(obj)}` : obj.toString();
}
function stringify(obj) {
    return typeof obj === 'object' ? `${JSON.stringify(obj)}` : obj.toString();
}
const terminal = {
    log (...objs) {
        send('log', stringifyObjs(objs));
    },
    info (...objs) {
        send('info', stringifyObjs(objs));
    },
    warn (...objs) {
        send('warn', stringifyObjs(objs));
    },
    error (...objs) {
        send('error', stringifyObjs(objs));
    },
    group () {
        groupLevel++;
    },
    groupCollapsed () {
        groupLevel++;
    },
    groupEnd () {
        groupLevel && --groupLevel;
    },
    clear () {
        send('clear');
    },
    trace (...args) {
        console.trace(...args);
    },
    profile (...args) {
        console.profile(...args);
    },
    profileEnd (...args) {
        console.profileEnd(...args);
    }
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/exports.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApplyPluginsType",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$umi$2f$client$2f$client$2f$plugin$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"],
    "Helmet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$helmet$2d$async$2f$lib$2f$index$2e$module$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Helmet"],
    "HelmetProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$helmet$2d$async$2f$lib$2f$index$2e$module$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HelmetProvider"],
    "Link",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__LinkWithPrefetch__as__Link$3e$__["Link"],
    "NavLink",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NavLink"],
    "Navigate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Navigate"],
    "Outlet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Outlet"],
    "PluginManager",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$umi$2f$client$2f$client$2f$plugin$2e$js__$5b$client$5d$__$28$ecmascript$29$__["PluginManager"],
    "TestBrowser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$testBrowser$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["TestBrowser"],
    "__getRoot",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__["__getRoot"],
    "__useFetcher",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$useFetcher$2e$js__$5b$client$5d$__$28$ecmascript$29$__["__useFetcher"],
    "createBrowserHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createBrowserHistory"],
    "createHashHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createHashHistory"],
    "createHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createHistory"],
    "createMemoryHistory",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createMemoryHistory"],
    "createSearchParams",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSearchParams"],
    "defineApp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$defineApp$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["defineApp"],
    "generatePath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generatePath"],
    "history",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["history"],
    "matchPath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["matchPath"],
    "matchRoutes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["matchRoutes"],
    "renderClient",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__["renderClient"],
    "resolvePath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resolvePath"],
    "terminal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$terminal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["terminal"],
    "useAppData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useAppData"],
    "useClientLoaderData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useClientLoaderData"],
    "useLoaderData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useLoaderData"],
    "useLocation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"],
    "useMatch",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useMatch"],
    "useNavigate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"],
    "useOutlet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useOutlet"],
    "useOutletContext",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useOutletContext"],
    "useParams",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useParams"],
    "useResolvedPath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useResolvedPath"],
    "useRouteData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$routeContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouteData"],
    "useRouteProps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouteProps"],
    "useRoutes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useRoutes"],
    "useSearchParams",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useSearchParams"],
    "useSelectedRoutes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSelectedRoutes"],
    "useServerInsertedHTML",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useServerInsertedHTML"],
    "useServerLoaderData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useServerLoaderData"],
    "withRouter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$withRouter$2e$js__$5b$client$5d$__$28$ecmascript$29$__["withRouter"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/.umi/exports.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$defineApp$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/defineApp.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$history$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/history/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$helmet$2d$async$2f$lib$2f$index$2e$module$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-helmet-async/lib/index.module.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-router-dom/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$router$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-router/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$appContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/appContext.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/browser.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__LinkWithPrefetch__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/link.js [client] (ecmascript) <export LinkWithPrefetch as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$routeContext$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/routeContext.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$useFetcher$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/useFetcher.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$withRouter$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/withRouter.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$umi$2f$client$2f$client$2f$plugin$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/umi/client/client/plugin.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/history.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$terminal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/terminal.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$testBrowser$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/testBrowser.tsx [client] (ecmascript)");
}),
"[project]/src/.umi/exports.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useServerInsertedHTML",
    ()=>useServerInsertedHTML
]);
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
// defineApp
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$defineApp$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/defineApp.ts [client] (ecmascript)");
// umi/client/client/plugin
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$umi$2f$client$2f$client$2f$plugin$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/umi/client/client/plugin.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/history.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$terminal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/terminal.ts [client] (ecmascript)");
// test
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$testBrowser$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/testBrowser.tsx [client] (ecmascript)");
;
;
;
;
;
const useServerInsertedHTML = ()=>{};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/testBrowser.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TestBrowser",
    ()=>TestBrowser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/exports.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/browser.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/history.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$plugin$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/plugin.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$route$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/route.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const publicPath = '/';
const runtimePublicPath = false;
function TestBrowser(props) {
    _s();
    const pluginManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$plugin$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createPluginManager"])();
    const [context, setContext] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const genContext = async ()=>{
            const { routes, routeComponents } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$route$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["getRoutes"])(pluginManager);
            // allow user to extend routes
            await pluginManager.applyPlugins({
                key: 'patchRoutes',
                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].event,
                args: {
                    routes,
                    routeComponents
                }
            });
            const contextOpts = pluginManager.applyPlugins({
                key: 'modifyContextOpts',
                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].modify,
                initialValue: {}
            });
            const basename = contextOpts.basename || '/';
            const history = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createHistory"])({
                type: 'memory',
                basename
            });
            const context = {
                routes,
                routeComponents,
                pluginManager,
                rootElement: contextOpts.rootElement || document.getElementById('root'),
                publicPath,
                runtimePublicPath,
                history,
                basename,
                components: true
            };
            const modifiedContext = pluginManager.applyPlugins({
                key: 'modifyClientRenderOpts',
                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].modify,
                initialValue: context
            });
            return modifiedContext;
        };
        genContext().then((context)=>{
            setContext(context);
            if (props.location) {
                context?.history?.push(props.location);
            }
            if (props.historyRef) {
                props.historyRef.current = context?.history;
            }
        });
    }, []);
    if (context === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            id: "loading"
        }, void 0, false, {
            fileName: "[project]/src/.umi/testBrowser.tsx",
            lineNumber: 79,
            columnNumber: 12
        }, this);
    }
    const Children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__["renderClient"])(context);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Children, {}, void 0, false, {
            fileName: "[project]/src/.umi/testBrowser.tsx",
            lineNumber: 85,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/.umi/testBrowser.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(TestBrowser, "S8AcziJo4E68+dGQNrzdtsygB4I=");
_c = TestBrowser;
var _c;
__turbopack_context__.k.register(_c, "TestBrowser");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/.umi/umi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$polyfill$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/polyfill.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@umijs/renderer-react/dist/browser.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$route$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/route.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$plugin$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/plugin.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/core/history.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/.umi/exports.ts [client] (ecmascript)");
;
;
;
;
;
;
const publicPath = "/";
const runtimePublicPath = false;
async function render() {
    const pluginManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$plugin$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createPluginManager"])();
    const { routes, routeComponents } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$route$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["getRoutes"])(pluginManager);
    // allow user to extend routes
    await pluginManager.applyPlugins({
        key: 'patchRoutes',
        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].event,
        args: {
            routes,
            routeComponents
        }
    });
    const contextOpts = pluginManager.applyPlugins({
        key: 'modifyContextOpts',
        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].modify,
        initialValue: {}
    });
    const basename = contextOpts.basename || '/';
    const historyType = contextOpts.historyType || 'browser';
    const history = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$core$2f$history$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createHistory"])({
        type: historyType,
        basename,
        ...contextOpts.historyOpts
    });
    return pluginManager.applyPlugins({
        key: 'render',
        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].compose,
        initialValue () {
            const context = {
                useStream: true,
                routes,
                routeComponents,
                pluginManager,
                mountElementId: 'root',
                rootElement: contextOpts.rootElement || document.getElementById('root'),
                publicPath,
                runtimePublicPath,
                history,
                historyType,
                basename,
                __INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
                    "pureApp": false,
                    "pureHtml": false
                },
                callback: contextOpts.callback
            };
            const modifiedContext = pluginManager.applyPlugins({
                key: 'modifyClientRenderOpts',
                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f2e$umi$2f$exports$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ApplyPluginsType"].modify,
                initialValue: context
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$umijs$2f$renderer$2d$react$2f$dist$2f$browser$2e$js__$5b$client$5d$__$28$ecmascript$29$__["renderClient"])(modifiedContext);
        }
    })();
}
render();
if ("TURBOPACK compile-time truthy", 1) {
    window.g_umi = {
        version: '4.6.54'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime/runtime-types.d.ts" />
/// <reference path="../../../shared/runtime/dev-globals.d.ts" />
/// <reference path="../../../shared/runtime/dev-protocol.d.ts" />
/// <reference path="../../../shared/runtime/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateB.type === 'total') {
        // A total update replaces the entire chunk, so it supersedes any prior update.
        return updateB;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
]);

//# sourceMappingURL=_root-of-the-server___ba8a7a4b.js.map