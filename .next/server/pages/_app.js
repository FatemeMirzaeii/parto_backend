module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MyApp; });
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/globals.css */ "./styles/globals.css");
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-redux-wrapper */ "next-redux-wrapper");
/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _redux_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../redux/store */ "./redux/store.js");
var _jsxFileName = "E:\\Parto\\Main\\partoBackend\\parto_backend\\pages\\_app.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }






function MyApp({
  Component,
  pageProps
}) {
  const store = Object(_redux_store__WEBPACK_IMPORTED_MODULE_4__["useStore"])(pageProps.initialReduxState);
  return __jsx(react_redux__WEBPACK_IMPORTED_MODULE_1__["Provider"], {
    store: store,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10,
      columnNumber: 5
    }
  }, __jsx(Component, _extends({}, pageProps, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 7
    }
  })), ";");
}

/***/ }),

/***/ "./redux/actions/SetToken.js":
/*!***********************************!*\
  !*** ./redux/actions/SetToken.js ***!
  \***********************************/
/*! exports provided: SET_TOKEN, SetToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_TOKEN", function() { return SET_TOKEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetToken", function() { return SetToken; });
const SET_TOKEN = "SET_TOKEN"; //Action Creator

const SetToken = tokenId => dispatch => dispatch({
  type: SET_TOKEN,
  payload: {
    tokenId: tokenId
  }
});

/***/ }),

/***/ "./redux/actions/SetUserId.js":
/*!************************************!*\
  !*** ./redux/actions/SetUserId.js ***!
  \************************************/
/*! exports provided: SET_USERID, SetUserId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_USERID", function() { return SET_USERID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetUserId", function() { return SetUserId; });
const SET_USERID = "SET_USERID"; //Action Creator

const SetUserId = userId => dispatch => dispatch({
  type: SET_USERID,
  payload: {
    userId: userId
  }
});

/***/ }),

/***/ "./redux/actions/userInformation.js":
/*!******************************************!*\
  !*** ./redux/actions/userInformation.js ***!
  \******************************************/
/*! exports provided: USER_SIGNUP, userSignup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_SIGNUP", function() { return USER_SIGNUP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userSignup", function() { return userSignup; });
const USER_SIGNUP = "USER_SIGNUP"; //Action Creator

const userSignup = (username, password, email, phone) => dispatch => dispatch({
  type: USER_SIGNUP,
  payload: {
    username: username,
    email: email,
    phone: phone,
    password: password
  }
});

/***/ }),

/***/ "./redux/reducers/userReducer.js":
/*!***************************************!*\
  !*** ./redux/reducers/userReducer.js ***!
  \***************************************/
/*! exports provided: userReducer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userReducer", function() { return userReducer; });
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_userInformation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/userInformation */ "./redux/actions/userInformation.js");
/* harmony import */ var _actions_SetToken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/SetToken */ "./redux/actions/SetToken.js");
/* harmony import */ var _actions_SetUserId__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/SetUserId */ "./redux/actions/SetUserId.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const initialUser = {
  birthdate: "",
  avg_cycle_length: 0,
  avg_period_length: 0,
  avg_sleeping_hour: 0,
  pms_length: 0,
  height: 0,
  weight: 0,
  pregnant: 0,
  pregnancy_try: 0,
  use_lock: 0,
  // email: { key: "email", value: "" },
  // phone: { key: "phone", value: "" },
  // password: { key: "password", value: "" },
  // username: { key: "username", value: "" },
  email: "",
  phone: "",
  username: "",
  password: "",
  tokenId: "",
  userId: ""
};
const userReducer = (state = initialUser, {
  type,
  payload
}) => {
  switch (type) {
    case _actions_userInformation__WEBPACK_IMPORTED_MODULE_1__["USER_SIGNUP"]:
      return _objectSpread(_objectSpread({}, state), {}, {
        email: payload.email,
        username: payload.username,
        phone: payload.phone,
        password: payload.password
      });

    case _actions_SetToken__WEBPACK_IMPORTED_MODULE_2__["SET_TOKEN"]:
      return _objectSpread(_objectSpread({}, state), {}, {
        tokenId: payload.tokenId
      });

    case _actions_SetUserId__WEBPACK_IMPORTED_MODULE_3__["SET_USERID"]:
      return _objectSpread(_objectSpread({}, state), {}, {
        userId: payload.userId
      });

    default:
      return state;
  } // return { ...state };

};
const reducers = {
  user: userReducer
};
/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])(reducers));

/***/ }),

/***/ "./redux/store.js":
/*!************************!*\
  !*** ./redux/store.js ***!
  \************************/
/*! exports provided: initializeStore, useStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initializeStore", function() { return initializeStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useStore", function() { return useStore; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! redux */ "redux");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redux-devtools-extension */ "redux-devtools-extension");
/* harmony import */ var redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redux-thunk */ "redux-thunk");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(redux_thunk__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _reducers_userReducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reducers/userReducer */ "./redux/reducers/userReducer.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






let store;

function initStore(initialState) {
  return Object(redux__WEBPACK_IMPORTED_MODULE_1__["createStore"])(_reducers_userReducer__WEBPACK_IMPORTED_MODULE_4__["default"], initialState, Object(redux_devtools_extension__WEBPACK_IMPORTED_MODULE_2__["composeWithDevTools"])(Object(redux__WEBPACK_IMPORTED_MODULE_1__["applyMiddleware"])(redux_thunk__WEBPACK_IMPORTED_MODULE_3___default.a)));
}

const initializeStore = preloadedState => {
  var _store2;

  let _store = (_store2 = store) !== null && _store2 !== void 0 ? _store2 : initStore(preloadedState); // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store


  if (preloadedState && store) {
    _store = initStore(_objectSpread(_objectSpread({}, store.getState()), preloadedState)); // Reset the current store

    store = undefined;
  } // For SSG and SSR always create a new store


  if (true) return _store; // Create the store once in the client

  if (!store) store = _store;
  return _store;
};
function useStore(initialState) {
  const store = Object(react__WEBPACK_IMPORTED_MODULE_0__["useMemo"])(() => initializeStore(initialState), [initialState]);
  return store;
}

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ 0:
/*!****************************************!*\
  !*** multi private-next-pages/_app.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! private-next-pages/_app.js */"./pages/_app.js");


/***/ }),

/***/ "next-redux-wrapper":
/*!*************************************!*\
  !*** external "next-redux-wrapper" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next-redux-wrapper");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "redux":
/*!************************!*\
  !*** external "redux" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-devtools-extension":
/*!*******************************************!*\
  !*** external "redux-devtools-extension" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-devtools-extension");

/***/ }),

/***/ "redux-thunk":
/*!******************************!*\
  !*** external "redux-thunk" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvX2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9yZWR1eC9hY3Rpb25zL1NldFRva2VuLmpzIiwid2VicGFjazovLy8uL3JlZHV4L2FjdGlvbnMvU2V0VXNlcklkLmpzIiwid2VicGFjazovLy8uL3JlZHV4L2FjdGlvbnMvdXNlckluZm9ybWF0aW9uLmpzIiwid2VicGFjazovLy8uL3JlZHV4L3JlZHVjZXJzL3VzZXJSZWR1Y2VyLmpzIiwid2VicGFjazovLy8uL3JlZHV4L3N0b3JlLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5leHQtcmVkdXgtd3JhcHBlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3QtcmVkdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWR1eFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlZHV4LWRldnRvb2xzLWV4dGVuc2lvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlZHV4LXRodW5rXCIiXSwibmFtZXMiOlsiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzdG9yZSIsInVzZVN0b3JlIiwiaW5pdGlhbFJlZHV4U3RhdGUiLCJTRVRfVE9LRU4iLCJTZXRUb2tlbiIsInRva2VuSWQiLCJkaXNwYXRjaCIsInR5cGUiLCJwYXlsb2FkIiwiU0VUX1VTRVJJRCIsIlNldFVzZXJJZCIsInVzZXJJZCIsIlVTRVJfU0lHTlVQIiwidXNlclNpZ251cCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlbWFpbCIsInBob25lIiwiaW5pdGlhbFVzZXIiLCJiaXJ0aGRhdGUiLCJhdmdfY3ljbGVfbGVuZ3RoIiwiYXZnX3BlcmlvZF9sZW5ndGgiLCJhdmdfc2xlZXBpbmdfaG91ciIsInBtc19sZW5ndGgiLCJoZWlnaHQiLCJ3ZWlnaHQiLCJwcmVnbmFudCIsInByZWduYW5jeV90cnkiLCJ1c2VfbG9jayIsInVzZXJSZWR1Y2VyIiwic3RhdGUiLCJyZWR1Y2VycyIsInVzZXIiLCJjb21iaW5lUmVkdWNlcnMiLCJpbml0U3RvcmUiLCJpbml0aWFsU3RhdGUiLCJjcmVhdGVTdG9yZSIsImNvbXBvc2VXaXRoRGV2VG9vbHMiLCJhcHBseU1pZGRsZXdhcmUiLCJ0aHVua01pZGRsZXdhcmUiLCJpbml0aWFsaXplU3RvcmUiLCJwcmVsb2FkZWRTdGF0ZSIsIl9zdG9yZSIsImdldFN0YXRlIiwidW5kZWZpbmVkIiwidXNlTWVtbyJdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVlLFNBQVNBLEtBQVQsQ0FBZTtBQUFFQyxXQUFGO0FBQWFDO0FBQWIsQ0FBZixFQUF5QztBQUN0RCxRQUFN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Qzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxxRDs7Ozs7Ozs7Ozs7QUNBQSx3QyIsImZpbGUiOiJwYWdlcy9fYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSByZXF1aXJlKCcuLi9zc3ItbW9kdWxlLWNhY2hlLmpzJyk7XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdHZhciB0aHJldyA9IHRydWU7XG4gXHRcdHRyeSB7XG4gXHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4gXHRcdFx0dGhyZXcgPSBmYWxzZTtcbiBcdFx0fSBmaW5hbGx5IHtcbiBcdFx0XHRpZih0aHJldykgZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHR9XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XHJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHdpdGhSZWR1eCBmcm9tIFwibmV4dC1yZWR1eC13cmFwcGVyXCI7XHJcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSBcIi4uL3JlZHV4L3N0b3JlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlKHBhZ2VQcm9wcy5pbml0aWFsUmVkdXhTdGF0ZSk7XHJcbiAgcmV0dXJuIChcclxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+O1xyXG4gICAgPC9Qcm92aWRlcj5cclxuICApO1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBTRVRfVE9LRU4gPSBcIlNFVF9UT0tFTlwiO1xyXG5cclxuLy9BY3Rpb24gQ3JlYXRvclxyXG5leHBvcnQgY29uc3QgU2V0VG9rZW4gPSAodG9rZW5JZCkgPT4gKGRpc3BhdGNoKSA9PlxyXG4gIGRpc3BhdGNoKHtcclxuICAgIHR5cGU6IFNFVF9UT0tFTixcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgdG9rZW5JZDogdG9rZW5JZCxcclxuICAgIH0sXHJcbiAgfSk7XHJcbiIsImV4cG9ydCBjb25zdCBTRVRfVVNFUklEID0gXCJTRVRfVVNFUklEXCI7XHJcblxyXG4vL0FjdGlvbiBDcmVhdG9yXHJcbmV4cG9ydCBjb25zdCBTZXRVc2VySWQgPSAodXNlcklkKSA9PiAoZGlzcGF0Y2gpID0+XHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogU0VUX1VTRVJJRCxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgdXNlcklkOiB1c2VySWQsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG4iLCJleHBvcnQgY29uc3QgVVNFUl9TSUdOVVAgPSBcIlVTRVJfU0lHTlVQXCI7XHJcblxyXG4vL0FjdGlvbiBDcmVhdG9yXHJcbmV4cG9ydCBjb25zdCB1c2VyU2lnbnVwID0gKHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwsIHBob25lKSA9PiAoZGlzcGF0Y2gpID0+XHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogVVNFUl9TSUdOVVAsXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICBwaG9uZTogcGhvbmUsXHJcbiAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgIH0sXHJcbiAgfSk7XHJcbiIsImltcG9ydCB7IGNvbWJpbmVSZWR1Y2VycyB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgeyBVU0VSX1NJR05VUCB9IGZyb20gXCIuLi9hY3Rpb25zL3VzZXJJbmZvcm1hdGlvblwiO1xyXG5pbXBvcnQgeyBTRVRfVE9LRU4gfSBmcm9tIFwiLi4vYWN0aW9ucy9TZXRUb2tlblwiO1xyXG5pbXBvcnQgeyBTRVRfVVNFUklEIH0gZnJvbSBcIi4uL2FjdGlvbnMvU2V0VXNlcklkXCI7XHJcblxyXG5jb25zdCBpbml0aWFsVXNlciA9IHtcclxuIFxyXG4gIGJpcnRoZGF0ZTogXCJcIixcclxuICBhdmdfY3ljbGVfbGVuZ3RoOiAwLFxyXG4gIGF2Z19wZXJpb2RfbGVuZ3RoOiAwLFxyXG4gIGF2Z19zbGVlcGluZ19ob3VyOiAwLFxyXG4gIHBtc19sZW5ndGg6IDAsXHJcbiAgaGVpZ2h0OiAwLFxyXG4gIHdlaWdodDowLFxyXG4gIHByZWduYW50OiAwLFxyXG4gIHByZWduYW5jeV90cnk6IDAsXHJcbiAgdXNlX2xvY2s6IDAsXHJcblxyXG4gIC8vIGVtYWlsOiB7IGtleTogXCJlbWFpbFwiLCB2YWx1ZTogXCJcIiB9LFxyXG4gIC8vIHBob25lOiB7IGtleTogXCJwaG9uZVwiLCB2YWx1ZTogXCJcIiB9LFxyXG4gIC8vIHBhc3N3b3JkOiB7IGtleTogXCJwYXNzd29yZFwiLCB2YWx1ZTogXCJcIiB9LFxyXG4gIC8vIHVzZXJuYW1lOiB7IGtleTogXCJ1c2VybmFtZVwiLCB2YWx1ZTogXCJcIiB9LFxyXG4gIGVtYWlsOiBcIlwiLFxyXG4gIHBob25lOiBcIlwiLFxyXG4gIHVzZXJuYW1lOiBcIlwiLFxyXG4gIHBhc3N3b3JkOiBcIlwiLFxyXG5cclxuICB0b2tlbklkOiBcIlwiLFxyXG4gIHVzZXJJZDpcIlwiLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZXJSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbFVzZXIsIHsgdHlwZSwgcGF5bG9hZCB9KSA9PiB7XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlIFVTRVJfU0lHTlVQOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGVtYWlsOiBwYXlsb2FkLmVtYWlsLFxyXG4gICAgICAgIHVzZXJuYW1lOiBwYXlsb2FkLnVzZXJuYW1lLFxyXG4gICAgICAgIHBob25lOiBwYXlsb2FkLnBob25lLFxyXG4gICAgICAgIHBhc3N3b3JkOiBwYXlsb2FkLnBhc3N3b3JkLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBTRVRfVE9LRU46XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdG9rZW5JZDogcGF5bG9hZC50b2tlbklkLFxyXG4gICAgICB9O1xyXG4gICAgY2FzZSBTRVRfVVNFUklEOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIHVzZXJJZDogcGF5bG9hZC51c2VySWQsXHJcbiAgICAgIH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG4gIC8vIHJldHVybiB7IC4uLnN0YXRlIH07XHJcbn07XHJcblxyXG5jb25zdCByZWR1Y2VycyA9IHtcclxuICB1c2VyOiB1c2VyUmVkdWNlcixcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycyk7XHJcbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gXCJyZWR1eFwiO1xyXG5pbXBvcnQgeyBjb21wb3NlV2l0aERldlRvb2xzIH0gZnJvbSBcInJlZHV4LWRldnRvb2xzLWV4dGVuc2lvblwiO1xyXG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gXCJyZWR1eC10aHVua1wiO1xyXG5pbXBvcnQgcmVkdWNlcnMgZnJvbSBcIi4vcmVkdWNlcnMvdXNlclJlZHVjZXJcIjtcclxuXHJcbmxldCBzdG9yZTtcclxuXHJcbmZ1bmN0aW9uIGluaXRTdG9yZShpbml0aWFsU3RhdGUpIHtcclxuICByZXR1cm4gY3JlYXRlU3RvcmUoXHJcbiAgICByZWR1Y2VycyxcclxuICAgIGluaXRpYWxTdGF0ZSxcclxuICAgIGNvbXBvc2VXaXRoRGV2VG9vbHMoYXBwbHlNaWRkbGV3YXJlKHRodW5rTWlkZGxld2FyZSkpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRpYWxpemVTdG9yZSA9IChwcmVsb2FkZWRTdGF0ZSkgPT4ge1xyXG4gIGxldCBfc3RvcmUgPSBzdG9yZSA/PyBpbml0U3RvcmUocHJlbG9hZGVkU3RhdGUpO1xyXG5cclxuICAvLyBBZnRlciBuYXZpZ2F0aW5nIHRvIGEgcGFnZSB3aXRoIGFuIGluaXRpYWwgUmVkdXggc3RhdGUsIG1lcmdlIHRoYXQgc3RhdGVcclxuICAvLyB3aXRoIHRoZSBjdXJyZW50IHN0YXRlIGluIHRoZSBzdG9yZSwgYW5kIGNyZWF0ZSBhIG5ldyBzdG9yZVxyXG4gIGlmIChwcmVsb2FkZWRTdGF0ZSAmJiBzdG9yZSkge1xyXG4gICAgX3N0b3JlID0gaW5pdFN0b3JlKHtcclxuICAgICAgLi4uc3RvcmUuZ2V0U3RhdGUoKSxcclxuICAgICAgLi4ucHJlbG9hZGVkU3RhdGUsXHJcbiAgICB9KTtcclxuICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IHN0b3JlXHJcbiAgICBzdG9yZSA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8vIEZvciBTU0cgYW5kIFNTUiBhbHdheXMgY3JlYXRlIGEgbmV3IHN0b3JlXHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBfc3RvcmU7XHJcbiAgLy8gQ3JlYXRlIHRoZSBzdG9yZSBvbmNlIGluIHRoZSBjbGllbnRcclxuICBpZiAoIXN0b3JlKSBzdG9yZSA9IF9zdG9yZTtcclxuXHJcbiAgcmV0dXJuIF9zdG9yZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2VTdG9yZShpbml0aWFsU3RhdGUpIHtcclxuICBjb25zdCBzdG9yZSA9IHVzZU1lbW8oKCkgPT4gaW5pdGlhbGl6ZVN0b3JlKGluaXRpYWxTdGF0ZSksIFtpbml0aWFsU3RhdGVdKTtcclxuICByZXR1cm4gc3RvcmU7XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC1yZWR1eC13cmFwcGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJlZHV4XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZHV4XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZHV4LWRldnRvb2xzLWV4dGVuc2lvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eC10aHVua1wiKTsiXSwic291cmNlUm9vdCI6IiJ9