let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    // Imports
    const dart2wasm = {

_1: (x0,x1,x2) => x0.set(x1,x2),
_2: (x0,x1,x2) => x0.set(x1,x2),
_6: f => finalizeWrapper(f,x0 => dartInstance.exports._6(f,x0)),
_7: x0 => new window.FinalizationRegistry(x0),
_8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
_9: (x0,x1) => x0.unregister(x1),
_10: (x0,x1,x2) => x0.slice(x1,x2),
_11: (x0,x1) => x0.decode(x1),
_12: (x0,x1) => x0.segment(x1),
_13: () => new TextDecoder(),
_14: x0 => x0.buffer,
_15: x0 => x0.wasmMemory,
_16: () => globalThis.window._flutter_skwasmInstance,
_17: x0 => x0.rasterStartMilliseconds,
_18: x0 => x0.rasterEndMilliseconds,
_19: x0 => x0.imageBitmaps,
_164: x0 => x0.focus(),
_165: x0 => x0.select(),
_166: (x0,x1) => x0.append(x1),
_167: x0 => x0.remove(),
_170: x0 => x0.unlock(),
_175: x0 => x0.getReader(),
_185: x0 => new MutationObserver(x0),
_204: (x0,x1,x2) => x0.addEventListener(x1,x2),
_205: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_208: x0 => new ResizeObserver(x0),
_211: (x0,x1) => new Intl.Segmenter(x0,x1),
_212: x0 => x0.next(),
_213: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
_290: x0 => x0.close(),
_291: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
_292: x0 => new window.ImageDecoder(x0),
_293: x0 => x0.close(),
_294: x0 => ({frameIndex: x0}),
_295: (x0,x1) => x0.decode(x1),
_298: f => finalizeWrapper(f,x0 => dartInstance.exports._298(f,x0)),
_299: f => finalizeWrapper(f,x0 => dartInstance.exports._299(f,x0)),
_300: (x0,x1) => ({addView: x0,removeView: x1}),
_301: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._301(f,arguments.length,x0) }),
_302: f => finalizeWrapper(f,() => dartInstance.exports._302(f)),
_303: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
_304: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._304(f,arguments.length,x0) }),
_305: x0 => ({runApp: x0}),
_306: x0 => new Uint8Array(x0),
_308: x0 => x0.preventDefault(),
_309: x0 => x0.stopPropagation(),
_310: (x0,x1) => x0.addListener(x1),
_311: (x0,x1) => x0.removeListener(x1),
_312: (x0,x1) => x0.prepend(x1),
_313: x0 => x0.remove(),
_314: x0 => x0.disconnect(),
_315: (x0,x1) => x0.addListener(x1),
_316: (x0,x1) => x0.removeListener(x1),
_319: (x0,x1) => x0.append(x1),
_320: x0 => x0.remove(),
_321: x0 => x0.stopPropagation(),
_325: x0 => x0.preventDefault(),
_326: (x0,x1) => x0.append(x1),
_327: x0 => x0.remove(),
_332: (x0,x1) => x0.appendChild(x1),
_333: (x0,x1,x2) => x0.insertBefore(x1,x2),
_334: (x0,x1) => x0.removeChild(x1),
_335: (x0,x1) => x0.appendChild(x1),
_336: (x0,x1) => x0.transferFromImageBitmap(x1),
_337: (x0,x1) => x0.append(x1),
_338: (x0,x1) => x0.append(x1),
_339: (x0,x1) => x0.append(x1),
_340: x0 => x0.remove(),
_341: x0 => x0.focus(),
_342: x0 => x0.focus(),
_343: x0 => x0.remove(),
_344: x0 => x0.focus(),
_345: x0 => x0.remove(),
_346: (x0,x1) => x0.appendChild(x1),
_347: (x0,x1) => x0.append(x1),
_348: x0 => x0.focus(),
_349: (x0,x1) => x0.append(x1),
_350: x0 => x0.remove(),
_351: (x0,x1) => x0.append(x1),
_352: (x0,x1) => x0.append(x1),
_353: (x0,x1,x2) => x0.insertBefore(x1,x2),
_354: (x0,x1) => x0.append(x1),
_355: (x0,x1,x2) => x0.insertBefore(x1,x2),
_356: x0 => x0.remove(),
_357: x0 => x0.remove(),
_358: x0 => x0.remove(),
_359: (x0,x1) => x0.append(x1),
_360: x0 => x0.remove(),
_361: x0 => x0.remove(),
_362: x0 => x0.getBoundingClientRect(),
_363: x0 => x0.remove(),
_364: x0 => x0.blur(),
_366: x0 => x0.focus(),
_367: x0 => x0.focus(),
_368: x0 => x0.remove(),
_369: x0 => x0.focus(),
_370: x0 => x0.focus(),
_371: x0 => x0.blur(),
_372: x0 => x0.remove(),
_385: (x0,x1) => x0.append(x1),
_386: x0 => x0.remove(),
_387: (x0,x1) => x0.append(x1),
_388: (x0,x1,x2) => x0.insertBefore(x1,x2),
_389: (x0,x1) => x0.append(x1),
_390: x0 => x0.focus(),
_391: x0 => x0.focus(),
_392: x0 => x0.focus(),
_393: x0 => x0.focus(),
_394: x0 => x0.focus(),
_395: (x0,x1) => x0.append(x1),
_396: x0 => x0.focus(),
_397: x0 => x0.blur(),
_398: x0 => x0.remove(),
_400: x0 => x0.preventDefault(),
_401: x0 => x0.focus(),
_402: x0 => x0.preventDefault(),
_403: x0 => x0.preventDefault(),
_404: x0 => x0.preventDefault(),
_405: x0 => x0.focus(),
_406: x0 => x0.focus(),
_407: (x0,x1) => x0.append(x1),
_408: x0 => x0.focus(),
_409: x0 => x0.focus(),
_410: x0 => x0.focus(),
_411: x0 => x0.focus(),
_412: (x0,x1) => x0.observe(x1),
_413: x0 => x0.disconnect(),
_414: (x0,x1) => x0.appendChild(x1),
_415: (x0,x1) => x0.appendChild(x1),
_416: (x0,x1) => x0.appendChild(x1),
_417: (x0,x1) => x0.append(x1),
_418: (x0,x1) => x0.append(x1),
_419: x0 => x0.remove(),
_420: (x0,x1) => x0.append(x1),
_422: (x0,x1) => x0.appendChild(x1),
_423: (x0,x1) => x0.append(x1),
_424: x0 => x0.remove(),
_425: (x0,x1) => x0.append(x1),
_429: (x0,x1) => x0.appendChild(x1),
_430: x0 => x0.remove(),
_985: () => globalThis.window.flutterConfiguration,
_986: x0 => x0.assetBase,
_990: x0 => x0.debugShowSemanticsNodes,
_991: x0 => x0.hostElement,
_992: x0 => x0.multiViewEnabled,
_993: x0 => x0.nonce,
_995: x0 => x0.fontFallbackBaseUrl,
_996: x0 => x0.useColorEmoji,
_1000: x0 => x0.console,
_1001: x0 => x0.devicePixelRatio,
_1002: x0 => x0.document,
_1003: x0 => x0.history,
_1004: x0 => x0.innerHeight,
_1005: x0 => x0.innerWidth,
_1006: x0 => x0.location,
_1007: x0 => x0.navigator,
_1008: x0 => x0.visualViewport,
_1009: x0 => x0.performance,
_1010: (x0,x1) => x0.fetch(x1),
_1013: (x0,x1) => x0.dispatchEvent(x1),
_1014: (x0,x1) => x0.matchMedia(x1),
_1015: (x0,x1) => x0.getComputedStyle(x1),
_1017: x0 => x0.screen,
_1018: (x0,x1) => x0.requestAnimationFrame(x1),
_1019: f => finalizeWrapper(f,x0 => dartInstance.exports._1019(f,x0)),
_1024: (x0,x1) => x0.warn(x1),
_1027: () => globalThis.window,
_1028: () => globalThis.Intl,
_1029: () => globalThis.Symbol,
_1032: x0 => x0.clipboard,
_1033: x0 => x0.maxTouchPoints,
_1034: x0 => x0.vendor,
_1035: x0 => x0.language,
_1036: x0 => x0.platform,
_1037: x0 => x0.userAgent,
_1038: x0 => x0.languages,
_1039: x0 => x0.documentElement,
_1040: (x0,x1) => x0.querySelector(x1),
_1043: (x0,x1) => x0.createElement(x1),
_1045: (x0,x1) => x0.execCommand(x1),
_1048: (x0,x1) => x0.createTextNode(x1),
_1049: (x0,x1) => x0.createEvent(x1),
_1054: x0 => x0.head,
_1055: x0 => x0.body,
_1056: (x0,x1) => x0.title = x1,
_1059: x0 => x0.activeElement,
_1061: x0 => x0.visibilityState,
_1062: () => globalThis.document,
_1063: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1064: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1066: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1067: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_1070: f => finalizeWrapper(f,x0 => dartInstance.exports._1070(f,x0)),
_1071: x0 => x0.target,
_1073: x0 => x0.timeStamp,
_1074: x0 => x0.type,
_1075: x0 => x0.preventDefault(),
_1079: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
_1084: x0 => x0.firstChild,
_1090: x0 => x0.parentElement,
_1092: x0 => x0.parentNode,
_1095: (x0,x1) => x0.removeChild(x1),
_1096: (x0,x1) => x0.removeChild(x1),
_1098: (x0,x1) => x0.textContent = x1,
_1101: (x0,x1) => x0.contains(x1),
_1106: x0 => x0.firstElementChild,
_1108: x0 => x0.nextElementSibling,
_1109: x0 => x0.clientHeight,
_1110: x0 => x0.clientWidth,
_1111: x0 => x0.id,
_1112: (x0,x1) => x0.id = x1,
_1115: (x0,x1) => x0.spellcheck = x1,
_1116: x0 => x0.tagName,
_1117: x0 => x0.style,
_1118: (x0,x1) => x0.append(x1),
_1120: x0 => x0.getBoundingClientRect(),
_1123: (x0,x1) => x0.closest(x1),
_1126: (x0,x1) => x0.querySelectorAll(x1),
_1127: x0 => x0.remove(),
_1128: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1129: (x0,x1) => x0.removeAttribute(x1),
_1130: (x0,x1) => x0.tabIndex = x1,
_1133: x0 => x0.scrollTop,
_1134: (x0,x1) => x0.scrollTop = x1,
_1135: x0 => x0.scrollLeft,
_1136: (x0,x1) => x0.scrollLeft = x1,
_1137: x0 => x0.classList,
_1138: (x0,x1) => x0.className = x1,
_1144: (x0,x1) => x0.getElementsByClassName(x1),
_1145: x0 => x0.click(),
_1147: (x0,x1) => x0.hasAttribute(x1),
_1149: (x0,x1) => x0.attachShadow(x1),
_1152: (x0,x1) => x0.getPropertyValue(x1),
_1154: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
_1156: (x0,x1) => x0.removeProperty(x1),
_1158: x0 => x0.offsetLeft,
_1159: x0 => x0.offsetTop,
_1160: x0 => x0.offsetParent,
_1162: (x0,x1) => x0.name = x1,
_1163: x0 => x0.content,
_1164: (x0,x1) => x0.content = x1,
_1177: (x0,x1) => x0.nonce = x1,
_1182: x0 => x0.now(),
_1184: (x0,x1) => x0.width = x1,
_1186: (x0,x1) => x0.height = x1,
_1189: (x0,x1) => x0.getContext(x1),
_1264: x0 => x0.status,
_1266: x0 => x0.body,
_1267: x0 => x0.arrayBuffer(),
_1272: x0 => x0.read(),
_1273: x0 => x0.value,
_1274: x0 => x0.done,
_1276: x0 => x0.name,
_1277: x0 => x0.x,
_1278: x0 => x0.y,
_1281: x0 => x0.top,
_1282: x0 => x0.right,
_1283: x0 => x0.bottom,
_1284: x0 => x0.left,
_1295: x0 => x0.height,
_1296: x0 => x0.width,
_1297: (x0,x1) => x0.value = x1,
_1300: (x0,x1) => x0.placeholder = x1,
_1301: (x0,x1) => x0.name = x1,
_1302: x0 => x0.selectionDirection,
_1303: x0 => x0.selectionStart,
_1304: x0 => x0.selectionEnd,
_1307: x0 => x0.value,
_1308: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1312: x0 => x0.readText(),
_1314: (x0,x1) => x0.writeText(x1),
_1315: x0 => x0.altKey,
_1316: x0 => x0.code,
_1317: x0 => x0.ctrlKey,
_1318: x0 => x0.key,
_1319: x0 => x0.keyCode,
_1320: x0 => x0.location,
_1321: x0 => x0.metaKey,
_1322: x0 => x0.repeat,
_1323: x0 => x0.shiftKey,
_1324: x0 => x0.isComposing,
_1325: (x0,x1) => x0.getModifierState(x1),
_1326: x0 => x0.state,
_1329: (x0,x1) => x0.go(x1),
_1330: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
_1331: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
_1332: x0 => x0.pathname,
_1333: x0 => x0.search,
_1334: x0 => x0.hash,
_1337: x0 => x0.state,
_1342: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1342(f,x0,x1)),
_1344: (x0,x1,x2) => x0.observe(x1,x2),
_1347: x0 => x0.attributeName,
_1348: x0 => x0.type,
_1349: x0 => x0.matches,
_1352: x0 => x0.matches,
_1353: x0 => x0.relatedTarget,
_1354: x0 => x0.clientX,
_1355: x0 => x0.clientY,
_1356: x0 => x0.offsetX,
_1357: x0 => x0.offsetY,
_1360: x0 => x0.button,
_1361: x0 => x0.buttons,
_1362: x0 => x0.ctrlKey,
_1363: (x0,x1) => x0.getModifierState(x1),
_1364: x0 => x0.pointerId,
_1365: x0 => x0.pointerType,
_1366: x0 => x0.pressure,
_1367: x0 => x0.tiltX,
_1368: x0 => x0.tiltY,
_1369: x0 => x0.getCoalescedEvents(),
_1370: x0 => x0.deltaX,
_1371: x0 => x0.deltaY,
_1372: x0 => x0.wheelDeltaX,
_1373: x0 => x0.wheelDeltaY,
_1374: x0 => x0.deltaMode,
_1379: x0 => x0.changedTouches,
_1381: x0 => x0.clientX,
_1382: x0 => x0.clientY,
_1383: x0 => x0.data,
_1384: (x0,x1) => x0.type = x1,
_1385: (x0,x1) => x0.max = x1,
_1386: (x0,x1) => x0.min = x1,
_1387: (x0,x1) => x0.value = x1,
_1388: x0 => x0.value,
_1389: x0 => x0.disabled,
_1390: (x0,x1) => x0.disabled = x1,
_1391: (x0,x1) => x0.placeholder = x1,
_1392: (x0,x1) => x0.name = x1,
_1393: (x0,x1) => x0.autocomplete = x1,
_1394: x0 => x0.selectionDirection,
_1395: x0 => x0.selectionStart,
_1396: x0 => x0.selectionEnd,
_1399: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1406: (x0,x1) => x0.add(x1),
_1409: (x0,x1) => x0.noValidate = x1,
_1410: (x0,x1) => x0.method = x1,
_1411: (x0,x1) => x0.action = x1,
_1439: x0 => x0.orientation,
_1440: x0 => x0.width,
_1441: x0 => x0.height,
_1442: (x0,x1) => x0.lock(x1),
_1459: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1459(f,x0,x1)),
_1469: x0 => x0.length,
_1471: (x0,x1) => x0.item(x1),
_1472: x0 => x0.length,
_1473: (x0,x1) => x0.item(x1),
_1474: x0 => x0.iterator,
_1475: x0 => x0.Segmenter,
_1476: x0 => x0.v8BreakIterator,
_1479: x0 => x0.done,
_1480: x0 => x0.value,
_1481: x0 => x0.index,
_1485: (x0,x1) => x0.adoptText(x1),
_1486: x0 => x0.first(),
_1488: x0 => x0.next(),
_1489: x0 => x0.current(),
_1501: x0 => x0.hostElement,
_1502: x0 => x0.viewConstraints,
_1504: x0 => x0.maxHeight,
_1505: x0 => x0.maxWidth,
_1506: x0 => x0.minHeight,
_1507: x0 => x0.minWidth,
_1508: x0 => x0.loader,
_1509: () => globalThis._flutter,
_1510: (x0,x1) => x0.didCreateEngineInitializer(x1),
_1511: (x0,x1,x2) => x0.call(x1,x2),
_1512: () => globalThis.Promise,
_1513: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1513(f,x0,x1)),
_1518: x0 => x0.length,
_1521: x0 => x0.tracks,
_1525: x0 => x0.image,
_1530: x0 => x0.codedWidth,
_1531: x0 => x0.codedHeight,
_1534: x0 => x0.duration,
_1538: x0 => x0.ready,
_1539: x0 => x0.selectedTrack,
_1540: x0 => x0.repetitionCount,
_1541: x0 => x0.frameCount,
_1594: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
_1595: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
_1596: x0 => globalThis.firebase_core.getApp(x0),
_1597: () => globalThis.firebase_core.getApp(),
_1600: () => globalThis.firebase_core.SDK_VERSION,
_1607: x0 => x0.apiKey,
_1609: x0 => x0.authDomain,
_1611: x0 => x0.databaseURL,
_1613: x0 => x0.projectId,
_1615: x0 => x0.storageBucket,
_1617: x0 => x0.messagingSenderId,
_1619: x0 => x0.measurementId,
_1621: x0 => x0.appId,
_1623: x0 => x0.name,
_1624: x0 => x0.options,
_1626: (x0,x1) => globalThis.firebase_analytics.initializeAnalytics(x0,x1),
_1628: (x0,x1,x2,x3) => globalThis.firebase_analytics.logEvent(x0,x1,x2,x3),
_1635: (x0,x1) => x0.createElement(x1),
_1636: (x0,x1) => x0.debug(x1),
_1637: f => finalizeWrapper(f,x0 => dartInstance.exports._1637(f,x0)),
_1638: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1638(f,x0,x1)),
_1639: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
_1640: (x0,x1,x2) => x0.createPolicy(x1,x2),
_1641: (x0,x1) => x0.createScriptURL(x1),
_1642: (x0,x1,x2) => x0.createScript(x1,x2),
_1643: (x0,x1) => x0.appendChild(x1),
_1644: (x0,x1) => x0.appendChild(x1),
_1645: f => finalizeWrapper(f,x0 => dartInstance.exports._1645(f,x0)),
_1646: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1655: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
_1658: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1662: (x0,x1) => ({text: x0,title: x1}),
_1663: x0 => ({text: x0}),
_1664: (x0,x1) => x0.canShare(x1),
_1665: (x0,x1) => x0.share(x1),
_1697: (x0,x1) => x0.getItem(x1),
_1699: (x0,x1,x2) => x0.setItem(x1,x2),
_1706: (x0,x1) => x0.matchMedia(x1),
_1717: x0 => new Array(x0),
_1724: f => finalizeWrapper(f,x0 => dartInstance.exports._1724(f,x0)),
_1725: f => finalizeWrapper(f,x0 => dartInstance.exports._1725(f,x0)),
_1750: (decoder, codeUnits) => decoder.decode(codeUnits),
_1751: () => new TextDecoder("utf-8", {fatal: true}),
_1752: () => new TextDecoder("utf-8", {fatal: false}),
_1753: v => stringToDartString(v.toString()),
_1754: (d, digits) => stringToDartString(d.toFixed(digits)),
_1758: o => new WeakRef(o),
_1759: r => r.deref(),
_1764: Date.now,
_1766: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_1767: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_1768: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_1769: () => typeof dartUseDateNowForTicks !== "undefined",
_1770: () => 1000 * performance.now(),
_1771: () => Date.now(),
_1772: () => {
      // On browsers return `globalThis.location.href`
      if (globalThis.location != null) {
        return stringToDartString(globalThis.location.href);
      }
      return null;
    },
_1773: () => {
        return typeof process != undefined &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
_1774: () => new WeakMap(),
_1775: (map, o) => map.get(o),
_1776: (map, o, v) => map.set(o, v),
_1777: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_1778: s => printToConsole(stringFromDartString(s)),
_1787: (o, t) => o instanceof t,
_1789: f => finalizeWrapper(f,x0 => dartInstance.exports._1789(f,x0)),
_1790: f => finalizeWrapper(f,x0 => dartInstance.exports._1790(f,x0)),
_1791: o => Object.keys(o),
_1792: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_1793: (handle) => clearTimeout(handle),
_1794: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_1795: (handle) => clearInterval(handle),
_1796: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_1797: () => Date.now(),
_1798: () => new XMLHttpRequest(),
_1799: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1800: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_1801: (x0,x1) => x0.send(x1),
_1802: x0 => x0.abort(),
_1803: x0 => x0.getAllResponseHeaders(),
_1820: f => finalizeWrapper(f,x0 => dartInstance.exports._1820(f,x0)),
_1821: f => finalizeWrapper(f,x0 => dartInstance.exports._1821(f,x0)),
_1843: (x0,x1) => x0.key(x1),
_1844: x0 => x0.trustedTypes,
_1846: (x0,x1) => x0.text = x1,
_1847: (a, i) => a.push(i),
_1851: a => a.pop(),
_1852: (a, i) => a.splice(i, 1),
_1854: (a, s) => a.join(s),
_1857: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
_1858: a => a.length,
_1860: (a, i) => a[i],
_1861: (a, i, v) => a[i] = v,
_1863: a => a.join(''),
_1864: (o, a, b) => o.replace(a, b),
_1866: (s, t) => s.split(t),
_1867: s => s.toLowerCase(),
_1868: s => s.toUpperCase(),
_1869: s => s.trim(),
_1870: s => s.trimLeft(),
_1871: s => s.trimRight(),
_1873: (s, p, i) => s.indexOf(p, i),
_1874: (s, p, i) => s.lastIndexOf(p, i),
_1876: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_1877: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_1878: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_1879: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_1880: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_1881: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_1882: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_1884: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_1885: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_1886: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_1887: Object.is,
_1888: (t, s) => t.set(s),
_1890: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_1892: o => o.buffer,
_1893: o => o.byteOffset,
_1894: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_1895: (b, o) => new DataView(b, o),
_1896: (b, o, l) => new DataView(b, o, l),
_1897: Function.prototype.call.bind(DataView.prototype.getUint8),
_1898: Function.prototype.call.bind(DataView.prototype.setUint8),
_1899: Function.prototype.call.bind(DataView.prototype.getInt8),
_1900: Function.prototype.call.bind(DataView.prototype.setInt8),
_1901: Function.prototype.call.bind(DataView.prototype.getUint16),
_1902: Function.prototype.call.bind(DataView.prototype.setUint16),
_1903: Function.prototype.call.bind(DataView.prototype.getInt16),
_1904: Function.prototype.call.bind(DataView.prototype.setInt16),
_1905: Function.prototype.call.bind(DataView.prototype.getUint32),
_1906: Function.prototype.call.bind(DataView.prototype.setUint32),
_1907: Function.prototype.call.bind(DataView.prototype.getInt32),
_1908: Function.prototype.call.bind(DataView.prototype.setInt32),
_1911: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_1912: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_1913: Function.prototype.call.bind(DataView.prototype.getFloat32),
_1914: Function.prototype.call.bind(DataView.prototype.setFloat32),
_1915: Function.prototype.call.bind(DataView.prototype.getFloat64),
_1916: Function.prototype.call.bind(DataView.prototype.setFloat64),
_1922: s => stringToDartString(stringFromDartString(s).toUpperCase()),
_1923: s => stringToDartString(stringFromDartString(s).toLowerCase()),
_1925: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_1926: (x0,x1) => x0.exec(x1),
_1927: (x0,x1) => x0.test(x1),
_1928: (x0,x1) => x0.exec(x1),
_1929: (x0,x1) => x0.exec(x1),
_1930: x0 => x0.pop(),
_1934: (x0,x1,x2) => x0[x1] = x2,
_1936: o => o === undefined,
_1937: o => typeof o === 'boolean',
_1938: o => typeof o === 'number',
_1940: o => typeof o === 'string',
_1943: o => o instanceof Int8Array,
_1944: o => o instanceof Uint8Array,
_1945: o => o instanceof Uint8ClampedArray,
_1946: o => o instanceof Int16Array,
_1947: o => o instanceof Uint16Array,
_1948: o => o instanceof Int32Array,
_1949: o => o instanceof Uint32Array,
_1950: o => o instanceof Float32Array,
_1951: o => o instanceof Float64Array,
_1952: o => o instanceof ArrayBuffer,
_1953: o => o instanceof DataView,
_1954: o => o instanceof Array,
_1955: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_1957: o => {
            const proto = Object.getPrototypeOf(o);
            return proto === Object.prototype || proto === null;
          },
_1958: o => o instanceof RegExp,
_1959: (l, r) => l === r,
_1960: o => o,
_1961: o => o,
_1962: o => o,
_1963: b => !!b,
_1964: o => o.length,
_1967: (o, i) => o[i],
_1968: f => f.dartFunction,
_1969: l => arrayFromDartList(Int8Array, l),
_1970: l => arrayFromDartList(Uint8Array, l),
_1971: l => arrayFromDartList(Uint8ClampedArray, l),
_1972: l => arrayFromDartList(Int16Array, l),
_1973: l => arrayFromDartList(Uint16Array, l),
_1974: l => arrayFromDartList(Int32Array, l),
_1975: l => arrayFromDartList(Uint32Array, l),
_1976: l => arrayFromDartList(Float32Array, l),
_1977: l => arrayFromDartList(Float64Array, l),
_1978: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_1979: l => arrayFromDartList(Array, l),
_1980: stringFromDartString,
_1981: stringToDartString,
_1982: () => ({}),
_1983: () => [],
_1984: l => new Array(l),
_1985: () => globalThis,
_1986: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_1987: (o, p) => p in o,
_1988: (o, p) => o[p],
_1989: (o, p, v) => o[p] = v,
_1990: (o, m, a) => o[m].apply(o, a),
_1992: o => String(o),
_1993: (p, s, f) => p.then(s, f),
_1994: s => {
      let jsString = stringFromDartString(s);
      if (/[[\]{}()*+?.\\^$|]/.test(jsString)) {
          jsString = jsString.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
      }
      return stringToDartString(jsString);
    },
_1997: x0 => x0.index,
_1998: x0 => x0.groups,
_1999: x0 => x0.length,
_2001: (x0,x1) => x0[x1],
_2005: x0 => x0.flags,
_2006: x0 => x0.multiline,
_2007: x0 => x0.ignoreCase,
_2008: x0 => x0.unicode,
_2009: x0 => x0.dotAll,
_2010: (x0,x1) => x0.lastIndex = x1,
_2012: (o, p) => o[p],
_2013: (o, p, v) => o[p] = v,
_2014: (o, p) => delete o[p],
_2067: (x0,x1) => x0.withCredentials = x1,
_2070: x0 => x0.responseURL,
_2071: x0 => x0.status,
_2072: x0 => x0.statusText,
_2073: (x0,x1) => x0.responseType = x1,
_2075: x0 => x0.response,
_3413: (x0,x1) => x0.type = x1,
_3421: (x0,x1) => x0.crossOrigin = x1,
_3423: (x0,x1) => x0.text = x1,
_3832: () => globalThis.window,
_3912: x0 => x0.navigator,
_4168: x0 => x0.trustedTypes,
_4170: x0 => x0.localStorage,
_4393: x0 => x0.userAgent,
_4611: x0 => x0.length,
_8807: () => globalThis.document,
_8898: x0 => x0.head,
_13897: x0 => x0.name,
_13898: x0 => x0.message,
_14648: () => globalThis.console,
_14670: () => globalThis.window,
_14691: x0 => x0.matches,
_14695: x0 => x0.platform,
_14700: x0 => x0.navigator,
_14715: x0 => x0.name,
_14716: x0 => x0.message,
_14717: x0 => x0.code
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

