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
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./component/backend/InterviewCheck.js":
/*!*********************************************!*\
  !*** ./component/backend/InterviewCheck.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return InterviewCheck; });
async function InterviewCheck(userId, tokenId) {
  const options = {
    method: "Get",
    headers: {
      "x-auth-token": tokenId
    }
  };
  console.log("check " + userId + " " + tokenId);
  const url = "https://api.partobanoo.com/profile/" + userId + "/fa";
  var response;

  try {
    response = await fetch(url, options);
  } catch {
    return {
      status: 500
    };
  }

  var status = response.status;
  var interviewFlag = false;

  if (status === 200) {
    var json = await response.json();
    console.log(json.data);
    if (json.data.birthdate === "") interviewFlag = false;
    interviewFlag = true;
  }

  return {
    status: status,
    interviewFlag: interviewFlag
  };
}

/***/ }),

/***/ "./component/backend/SigninFetch.js":
/*!******************************************!*\
  !*** ./component/backend/SigninFetch.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SigninFetch; });
async function SigninFetch(email, phone, pass) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      phone: phone,
      password: pass
    })
  };
  const url = "https://api.partobanoo.com/auth/signIn/fa";
  var response;

  try {
    response = await fetch(url, options);
  } catch {
    return {
      status: 500
    };
  }

  var status = response.status;
  var tokenId;
  var userId;

  if (status === 200) {
    tokenId = response.headers.get("x-auth-token");
    var json = await response.json();
    userId = json.data.id; // console.log(userId + " " +tokenId)
  }

  return {
    status: status,
    tokenId: tokenId,
    userId: userId
  };
}

/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Home; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ "next/head");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ "next/router");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Home.module.css */ "./styles/Home.module.css");
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _component_backend_SigninFetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../component/backend/SigninFetch */ "./component/backend/SigninFetch.js");
/* harmony import */ var _component_backend_InterviewCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../component/backend/InterviewCheck */ "./component/backend/InterviewCheck.js");
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! swr */ "swr");
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(swr__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _redux_actions_SetToken__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../redux/actions/SetToken */ "./redux/actions/SetToken.js");
/* harmony import */ var _redux_actions_SetUserId__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../redux/actions/SetUserId */ "./redux/actions/SetUserId.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_9__);
var _jsxFileName = "E:\\Parto\\Main\\partoBackend\\parto_backend\\pages\\index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;










function Home() {
  const router = Object(next_router__WEBPACK_IMPORTED_MODULE_2__["useRouter"])();
  const {
    0: status,
    1: setStatus
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(0);
  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_9__["useDispatch"])();
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker.register("../serviceWorker.js");
      } catch (err) {
        console.error("Service worker registration failed", err);
      }
    } else console.log("Service worker not supported");
    /* connect to indexedDB
      if there is id
        if interview has value
          if pregnant
            redirect to pregnancy weeks
          else
            redirect to period calender
        else
          redirect to interview
        
       */
    // router.push("/interview/mobile/welcom");

  });
  const {
    0: email,
    1: setEmail
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const {
    0: phone,
    1: setPhone
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const {
    0: pass,
    1: setPass
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");

  async function handleSignin() {
    event.preventDefault();
    const response = await Object(_component_backend_SigninFetch__WEBPACK_IMPORTED_MODULE_4__["default"])(email, phone, pass); // sigin is ok

    if (response.status === 200) {
      dispatch(Object(_redux_actions_SetToken__WEBPACK_IMPORTED_MODULE_7__["SetToken"])(response.tokenId));
      dispatch(Object(_redux_actions_SetUserId__WEBPACK_IMPORTED_MODULE_8__["SetUserId"])(response.userId));
      const res = await Object(_component_backend_InterviewCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(response.userId, response.tokenId); //user has pass interview

      if (res.status === 200) {
        router.push({
          pathname: "/main/main-page"
        });
      } //user does not pass interview


      if (res.status === 404) router.push({
        pathname: "/interview/welcome"
      }); //userId or tokenId for interview checkis not correct

      if (res.status === 400) setStatus(401); //interview check lost in network

      if (res.status === 500) setStatus(500);
    } //user or pass is not correct


    if (response.status === 404) setStatus(400); //signin lost in network

    if (response.status === 500) setStatus(500);
  }

  return __jsx("div", {
    className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default.a.container,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74,
      columnNumber: 5
    }
  }, __jsx(next_head__WEBPACK_IMPORTED_MODULE_1___default.a, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75,
      columnNumber: 7
    }
  }, __jsx("title", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76,
      columnNumber: 9
    }
  }, "\u067E\u0631\u062A\u0648 \u0645\u0646"), __jsx("link", {
    rel: "icon",
    href: "/logo.jpeg",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77,
      columnNumber: 9
    }
  }), __jsx("link", {
    rel: "manifest",
    href: "/manifest.json",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78,
      columnNumber: 9
    }
  }), __jsx("meta", {
    name: "theme-color",
    content: "#317EFB",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 9
    }
  }), __jsx("link", {
    rel: "apple-touch-icon",
    href: "/logo.jpeg",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 80,
      columnNumber: 9
    }
  })), __jsx("div", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 87,
      columnNumber: 7
    }
  }, "\u0633\u0644\u0627\u0645"), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88,
      columnNumber: 7
    }
  }), __jsx("form", {
    onSubmit: () => {
      handleSignin();
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91,
      columnNumber: 7
    }
  }, "\u0627\u06CC\u0645\u06CC\u0644", __jsx("input", {
    type: "text",
    value: email,
    onChange: e => setEmail(e.target.value),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 97,
      columnNumber: 9
    }
  }), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 102,
      columnNumber: 9
    }
  }), "\u0634\u0645\u0627\u0631\u0647 \u0647\u0645\u0631\u0627\u0647", __jsx("input", {
    type: "text",
    value: phone,
    onChange: e => setPhone(e.target.value),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104,
      columnNumber: 9
    }
  }), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109,
      columnNumber: 9
    }
  }), "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631", __jsx("input", {
    type: "text",
    value: pass,
    onChange: e => setPass(e.target.value),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 111,
      columnNumber: 9
    }
  }), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 116,
      columnNumber: 9
    }
  }), "\u0648\u0631\u0648\u062F", __jsx("input", {
    type: "submit",
    value: "\u0648\u0631\u0648\u062F",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118,
      columnNumber: 9
    }
  })), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 120,
      columnNumber: 7
    }
  }), __jsx("button", {
    onClick: () => {
      router.push("/signup/forget-pass");
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 121,
      columnNumber: 7
    }
  }, "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0631\u0627 \u0641\u0631\u0627\u0645\u0648\u0634 \u06A9\u0631\u062F\u0647 \u0627\u0645"), __jsx("button", {
    onClick: () => {
      router.push("/signup/signup");
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 128,
      columnNumber: 7
    }
  }, "\u062B\u0628\u062A \u0646\u0627\u0645"), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 135,
      columnNumber: 7
    }
  }), __jsx("br", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 136,
      columnNumber: 7
    }
  }), status === 100 && __jsx("div", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 137,
      columnNumber: 26
    }
  }, "\u0686\u0646\u062F \u0644\u062D\u0638\u0647 \u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F ... "), status === 400 && __jsx("div", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 138,
      columnNumber: 26
    }
  }, "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0635\u062D\u06CC\u062D \u0646\u06CC\u0633\u062A."), status === 401 && __jsx("div", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139,
      columnNumber: 26
    }
  }, "\u062E\u0637\u0627\u06CC \u062F\u0631\u0648\u0646 \u0628\u0631\u0646\u0627\u0645\u0647 \u0627\u06CC"), status === 500 && __jsx("div", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 140,
      columnNumber: 26
    }
  }, "\u062E\u0637\u0627 \u062F\u0631 \u0634\u0628\u06A9\u0647\u060C \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F."));
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

/***/ "./styles/Home.module.css":
/*!********************************!*\
  !*** ./styles/Home.module.css ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Exports
module.exports = {
	"container": "Home_container__1EcsU",
	"main": "Home_main__1x8gC",
	"footer": "Home_footer__1WdhD",
	"title": "Home_title__3DjR7",
	"description": "Home_description__17Z4F",
	"code": "Home_code__axx2Y",
	"grid": "Home_grid__2Ei2F",
	"card": "Home_card__2SdtB",
	"logo": "Home_logo__1YbrH"
};


/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next/router");

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

/***/ "swr":
/*!**********************!*\
  !*** external "swr" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("swr");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50L2JhY2tlbmQvSW50ZXJ2aWV3Q2hlY2suanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50L2JhY2tlbmQvU2lnbmluRmV0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vcmVkdXgvYWN0aW9ucy9TZXRUb2tlbi5qcyIsIndlYnBhY2s6Ly8vLi9yZWR1eC9hY3Rpb25zL1NldFVzZXJJZC5qcyIsIndlYnBhY2s6Ly8vLi9zdHlsZXMvSG9tZS5tb2R1bGUuY3NzIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5leHQvaGVhZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5leHQvcm91dGVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1yZWR1eFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInN3clwiIl0sIm5hbWVzIjpbIkludGVydmlld0NoZWNrIiwidXNlcklkIiwidG9rZW5JZCIsIm9wdGlvbnMiLCJtZXRob2QiLCJoZWFkZXJzIiwiY29uc29sZSIsImxvZyIsInVybCIsInJlc3BvbnNlIiwiZmV0Y2giLCJzdGF0dXMiLCJpbnRlcnZpZXdGbGFnIiwianNvbiIsImRhdGEiLCJiaXJ0aGRhdGUiLCJTaWduaW5GZXRjaCIsImVtYWlsIiwicGhvbmUiLCJwYXNzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXNzd29yZCIsImdldCIsImlkIiwiSG9tZSIsInJvdXRlciIsInVzZVJvdXRlciIsInNldFN0YXR1cyIsInVzZVN0YXRlIiwiZGlzcGF0Y2giLCJ1c2VEaXNwYXRjaCIsInVzZUVmZmVjdCIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsImVyciIsImVycm9yIiwic2V0RW1haWwiLCJzZXRQaG9uZSIsInNldFBhc3MiLCJoYW5kbGVTaWduaW4iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiU2V0VG9rZW4iLCJTZXRVc2VySWQiLCJyZXMiLCJwdXNoIiwicGF0aG5hbWUiLCJzdHlsZXMiLCJjb250YWluZXIiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJTRVRfVE9LRU4iLCJ0eXBlIiwicGF5bG9hZCIsIlNFVF9VU0VSSUQiXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN4RkE7QUFBQTtBQUFlLGVBQWVBLGNBQWYsQ0FBOEJDLE1BQTlCLEVBQXNDQyxPQUF0QyxFQUErQztBQUM1RCxRQUFNQyxPQUFPLEdBQUc7QUFDZEMsVUFBTSxFQUFFLEtBRE07QUFFZEMsV0FBTyxFQUFFO0FBQ1Asc0JBQWdCSDtBQURUO0FBRkssR0FBaEI7QUFNQUksU0FBTyxDQUFDQyxHQUFSLENBQVksV0FBU04sTUFBVCxH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Ozs7OztBQ0hQO0FBQUE7QUFBQTtBQUFPLE1BQU13RCxVQUFVLEdBQUcsWUFBbkIsQyxDQUVQOztBQUNPLE1BQU1aLFNBQVMsR0FBSTdDLE1BQUQsSUFBYThCLFFBQUQsSUFDbkNBLFFBQVEsQ0FBQztBQUNQeUIsTUFBSSxFQUFFRSxVQURDO0FBRVBELFNBQU8sRUFBRTtBQUNQeEQsVUFBTSxFQUFFQTtBQUREO0FBRkYsQ0FBRCxDQURILEM7Ozs7Ozs7Ozs7O0FDSFA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNYQSxzQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxnQyIsImZpbGUiOiJwYWdlcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0gcmVxdWlyZSgnLi4vc3NyLW1vZHVsZS1jYWNoZS5qcycpO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vcGFnZXMvaW5kZXguanNcIik7XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBJbnRlcnZpZXdDaGVjayh1c2VySWQsIHRva2VuSWQpIHtcclxuICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgbWV0aG9kOiBcIkdldFwiLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIngtYXV0aC10b2tlblwiOiB0b2tlbklkLFxyXG4gICAgfSxcclxuICB9O1xyXG4gIGNvbnNvbGUubG9nKFwiY2hlY2sgXCIrdXNlcklkICsgXCIgXCIgK3Rva2VuSWQpXHJcbiAgY29uc3QgdXJsID0gXCJodHRwczovL2FwaS5wYXJ0b2Jhbm9vLmNvbS9wcm9maWxlL1wiICsgdXNlcklkICsgXCIvZmFcIjtcclxuICB2YXIgcmVzcG9uc2U7XHJcbiAgdHJ5IHtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb25zKTtcclxuICB9IGNhdGNoIHtcclxuICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XHJcbiAgfVxyXG5cclxuICB2YXIgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gIHZhciBpbnRlcnZpZXdGbGFnID1mYWxzZTtcclxuICBpZiAoc3RhdHVzID09PSAyMDApIHtcclxuICAgIHZhciBqc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgY29uc29sZS5sb2coanNvbi5kYXRhKVxyXG4gICAgaWYgKGpzb24uZGF0YS5iaXJ0aGRhdGUgPT09IFwiXCIpIGludGVydmlld0ZsYWcgPSBmYWxzZTtcclxuICAgIGludGVydmlld0ZsYWcgPSB0cnVlO1xyXG4gICAgXHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMsIGludGVydmlld0ZsYWc6aW50ZXJ2aWV3RmxhZyAgfTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBTaWduaW5GZXRjaChlbWFpbCwgcGhvbmUsIHBhc3MpIHtcclxuICBcclxuICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICB9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgIHBob25lOiBwaG9uZSxcclxuICAgICAgcGFzc3dvcmQ6IHBhc3MsXHJcbiAgICB9KSxcclxuICB9O1xyXG4gIGNvbnN0IHVybCA9IFwiaHR0cHM6Ly9hcGkucGFydG9iYW5vby5jb20vYXV0aC9zaWduSW4vZmFcIjtcclxuICB2YXIgcmVzcG9uc2U7XHJcbiAgdHJ5IHtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb25zKTtcclxuICB9IGNhdGNoIHtcclxuICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XHJcbiAgfVxyXG5cclxuICB2YXIgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xyXG4gIHZhciB0b2tlbklkO1xyXG4gIHZhciB1c2VySWQ7XHJcbiAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICB0b2tlbklkID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJ4LWF1dGgtdG9rZW5cIik7XHJcbiAgICB2YXIganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIHVzZXJJZCA9IGpzb24uZGF0YS5pZFxyXG4gICAgLy8gY29uc29sZS5sb2codXNlcklkICsgXCIgXCIgK3Rva2VuSWQpXHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cywgdG9rZW5JZDogdG9rZW5JZCwgdXNlcklkOiB1c2VySWQgfTtcclxufVxyXG4iLCJpbXBvcnQgSGVhZCBmcm9tIFwibmV4dC9oZWFkXCI7XHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSBcIm5leHQvcm91dGVyXCI7XHJcbmltcG9ydCBzdHlsZXMgZnJvbSBcIi4uL3N0eWxlcy9Ib21lLm1vZHVsZS5jc3NcIjtcclxuaW1wb3J0IFNpZ25pbkZldGNoIGZyb20gXCIuLi9jb21wb25lbnQvYmFja2VuZC9TaWduaW5GZXRjaFwiO1xyXG5pbXBvcnQgSW50ZXJ2aWV3Q2hlY2sgZnJvbSBcIi4uL2NvbXBvbmVudC9iYWNrZW5kL0ludGVydmlld0NoZWNrXCI7XHJcbmltcG9ydCB1c2VTV1IgZnJvbSBcInN3clwiO1xyXG5pbXBvcnQgeyBTZXRUb2tlbiB9IGZyb20gXCIuLi9yZWR1eC9hY3Rpb25zL1NldFRva2VuXCI7XHJcbmltcG9ydCB7IFNldFVzZXJJZCB9IGZyb20gXCIuLi9yZWR1eC9hY3Rpb25zL1NldFVzZXJJZFwiO1xyXG5pbXBvcnQgeyB1c2VEaXNwYXRjaCwgdXNlU2VsZWN0b3IgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhvbWUoKSB7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcbiAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlKDApO1xyXG5cclxuICBjb25zdCBkaXNwYXRjaCA9IHVzZURpc3BhdGNoKCk7XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChcInNlcnZpY2VXb3JrZXJcIiBpbiBuYXZpZ2F0b3IpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihcIi4uL3NlcnZpY2VXb3JrZXIuanNcIik7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkXCIsIGVycik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBjb25zb2xlLmxvZyhcIlNlcnZpY2Ugd29ya2VyIG5vdCBzdXBwb3J0ZWRcIik7XHJcbiAgICAvKiBjb25uZWN0IHRvIGluZGV4ZWREQlxyXG4gICAgICBpZiB0aGVyZSBpcyBpZFxyXG4gICAgICAgIGlmIGludGVydmlldyBoYXMgdmFsdWVcclxuICAgICAgICAgIGlmIHByZWduYW50XHJcbiAgICAgICAgICAgIHJlZGlyZWN0IHRvIHByZWduYW5jeSB3ZWVrc1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZWRpcmVjdCB0byBwZXJpb2QgY2FsZW5kZXJcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZWRpcmVjdCB0byBpbnRlcnZpZXdcclxuXHJcbiAgICAgIFxyXG4gICAgICAgKi9cclxuICAgIC8vIHJvdXRlci5wdXNoKFwiL2ludGVydmlldy9tb2JpbGUvd2VsY29tXCIpO1xyXG4gIH0pO1xyXG4gIGNvbnN0IFtlbWFpbCwgc2V0RW1haWxdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW3Bob25lLCBzZXRQaG9uZV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbcGFzcywgc2V0UGFzc10gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlU2lnbmluKCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IFNpZ25pbkZldGNoKGVtYWlsLCBwaG9uZSwgcGFzcyk7XHJcbiAgICAvLyBzaWdpbiBpcyBva1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIGRpc3BhdGNoKFNldFRva2VuKHJlc3BvbnNlLnRva2VuSWQpKTtcclxuICAgICAgZGlzcGF0Y2goU2V0VXNlcklkKHJlc3BvbnNlLnVzZXJJZCkpO1xyXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBJbnRlcnZpZXdDaGVjayhyZXNwb25zZS51c2VySWQsIHJlc3BvbnNlLnRva2VuSWQpO1xyXG4gICAgICAvL3VzZXIgaGFzIHBhc3MgaW50ZXJ2aWV3XHJcbiAgICAgIGlmIChyZXMuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICByb3V0ZXIucHVzaCh7XHJcbiAgICAgICAgICBwYXRobmFtZTogXCIvbWFpbi9tYWluLXBhZ2VcIixcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICAvL3VzZXIgZG9lcyBub3QgcGFzcyBpbnRlcnZpZXdcclxuICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwNClcclxuICAgICAgICByb3V0ZXIucHVzaCh7XHJcbiAgICAgICAgICBwYXRobmFtZTogXCIvaW50ZXJ2aWV3L3dlbGNvbWVcIixcclxuICAgICAgICB9KTtcclxuICAgICAgLy91c2VySWQgb3IgdG9rZW5JZCBmb3IgaW50ZXJ2aWV3IGNoZWNraXMgbm90IGNvcnJlY3RcclxuICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMCkgc2V0U3RhdHVzKDQwMSk7XHJcbiAgICAgIC8vaW50ZXJ2aWV3IGNoZWNrIGxvc3QgaW4gbmV0d29ya1xyXG4gICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNTAwKSBzZXRTdGF0dXMoNTAwKTtcclxuICAgIH1cclxuICAgIC8vdXNlciBvciBwYXNzIGlzIG5vdCBjb3JyZWN0XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHNldFN0YXR1cyg0MDApO1xyXG4gICAgLy9zaWduaW4gbG9zdCBpbiBuZXR3b3JrXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA1MDApIHNldFN0YXR1cyg1MDApO1xyXG4gIH1cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5jb250YWluZXJ9PlxyXG4gICAgICA8SGVhZD5cclxuICAgICAgICA8dGl0bGU+2b7Ysdiq2Ygg2YXZhjwvdGl0bGU+XHJcbiAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvbG9nby5qcGVnXCIgLz5cclxuICAgICAgICA8bGluayByZWw9XCJtYW5pZmVzdFwiIGhyZWY9XCIvbWFuaWZlc3QuanNvblwiIC8+XHJcbiAgICAgICAgPG1ldGEgbmFtZT1cInRoZW1lLWNvbG9yXCIgY29udGVudD1cIiMzMTdFRkJcIiAvPlxyXG4gICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiL2xvZ28uanBlZ1wiPjwvbGluaz5cclxuICAgICAgPC9IZWFkPlxyXG5cclxuICAgICAgey8qIFxyXG4gICAgICAgINmI2LHZiNivXHJcbiAgICAgICAg2KvYqNiqINmG2KfZhVxyXG4gICAgICAgKi99XHJcbiAgICAgIDxkaXY+2LPZhNin2YU8L2Rpdj5cclxuICAgICAgPGJyIC8+XHJcbiAgICAgIHsvKiB0byBkb1xyXG4gICAgICBhZnRlciBsb2dpbiByZW5kZXIgaW50ZXJ2aWV3IG9yIHBlcmlvZCBjYWxlbmRlciBvciBwcmVnbmFuY3kgd2Vla3MgYWNjb3JkaW5nIHRvIHVzZXIgc3RhdGUgKi99XHJcbiAgICAgIDxmb3JtXHJcbiAgICAgICAgb25TdWJtaXQ9eygpID0+IHtcclxuICAgICAgICAgIGhhbmRsZVNpZ25pbigpO1xyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICDYp9uM2YXbjNmEXHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICB2YWx1ZT17ZW1haWx9XHJcbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEVtYWlsKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxiciAvPlxyXG4gICAgICAgINi02YXYp9ix2Ycg2YfZhdix2KfZh1xyXG4gICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgdmFsdWU9e3Bob25lfVxyXG4gICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRQaG9uZShlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8YnIgLz5cclxuICAgICAgICDYsdmF2LIg2LnYqNmI2LFcclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgIHZhbHVlPXtwYXNzfVxyXG4gICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRQYXNzKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxicj48L2JyPlxyXG4gICAgICAgINmI2LHZiNivXHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cItmI2LHZiNivXCIgLz5cclxuICAgICAgPC9mb3JtPlxyXG4gICAgICA8YnIgLz5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgIHJvdXRlci5wdXNoKFwiL3NpZ251cC9mb3JnZXQtcGFzc1wiKTtcclxuICAgICAgICB9fVxyXG4gICAgICA+XHJcbiAgICAgICAg2LHZhdiyINi52KjZiNixINix2Kcg2YHYsdin2YXZiNi0INqp2LHYr9mHINin2YVcclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICByb3V0ZXIucHVzaChcIi9zaWdudXAvc2lnbnVwXCIpO1xyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICDYq9io2Kog2YbYp9mFXHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8YnIgLz5cclxuICAgICAgPGJyIC8+XHJcbiAgICAgIHtzdGF0dXMgPT09IDEwMCAmJiA8ZGl2PtqG2YbYryDZhNit2LjZhyDYtdio2LEg2qnZhtuM2K8gLi4uIDwvZGl2Pn1cclxuICAgICAge3N0YXR1cyA9PT0gNDAwICYmIDxkaXY+2KfYt9mE2KfYudin2Kog2YjYp9ix2K8g2LTYr9mHINi12K3bjNitINmG24zYs9iqLjwvZGl2Pn1cclxuICAgICAge3N0YXR1cyA9PT0gNDAxICYmIDxkaXY+2K7Yt9in24wg2K/YsdmI2YYg2KjYsdmG2KfZhdmHINin24w8L2Rpdj59XHJcbiAgICAgIHtzdGF0dXMgPT09IDUwMCAmJiA8ZGl2Ptiu2LfYpyDYr9ixINi02KjaqdmH2Iwg2K/ZiNio2KfYsdmHINiq2YTYp9i0INqp2YbbjNivLjwvZGl2Pn1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IFNFVF9UT0tFTiA9IFwiU0VUX1RPS0VOXCI7XHJcblxyXG4vL0FjdGlvbiBDcmVhdG9yXHJcbmV4cG9ydCBjb25zdCBTZXRUb2tlbiA9ICh0b2tlbklkKSA9PiAoZGlzcGF0Y2gpID0+XHJcbiAgZGlzcGF0Y2goe1xyXG4gICAgdHlwZTogU0VUX1RPS0VOLFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICB0b2tlbklkOiB0b2tlbklkLFxyXG4gICAgfSxcclxuICB9KTtcclxuIiwiZXhwb3J0IGNvbnN0IFNFVF9VU0VSSUQgPSBcIlNFVF9VU0VSSURcIjtcclxuXHJcbi8vQWN0aW9uIENyZWF0b3JcclxuZXhwb3J0IGNvbnN0IFNldFVzZXJJZCA9ICh1c2VySWQpID0+IChkaXNwYXRjaCkgPT5cclxuICBkaXNwYXRjaCh7XHJcbiAgICB0eXBlOiBTRVRfVVNFUklELFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICB1c2VySWQ6IHVzZXJJZCxcclxuICAgIH0sXHJcbiAgfSk7XHJcbiIsIi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0ge1xuXHRcImNvbnRhaW5lclwiOiBcIkhvbWVfY29udGFpbmVyX18xRWNzVVwiLFxuXHRcIm1haW5cIjogXCJIb21lX21haW5fXzF4OGdDXCIsXG5cdFwiZm9vdGVyXCI6IFwiSG9tZV9mb290ZXJfXzFXZGhEXCIsXG5cdFwidGl0bGVcIjogXCJIb21lX3RpdGxlX18zRGpSN1wiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiSG9tZV9kZXNjcmlwdGlvbl9fMTdaNEZcIixcblx0XCJjb2RlXCI6IFwiSG9tZV9jb2RlX19heHgyWVwiLFxuXHRcImdyaWRcIjogXCJIb21lX2dyaWRfXzJFaTJGXCIsXG5cdFwiY2FyZFwiOiBcIkhvbWVfY2FyZF9fMlNkdEJcIixcblx0XCJsb2dvXCI6IFwiSG9tZV9sb2dvX18xWWJySFwiXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9oZWFkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvcm91dGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJlZHV4XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN3clwiKTsiXSwic291cmNlUm9vdCI6IiJ9