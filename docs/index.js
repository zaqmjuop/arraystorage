parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"cdEW":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!n)throw new ReferenceError("您的浏览器不支持indexeddb");var o=0,a=function(){return o+=1},i={databaseName:window.location.hostname,objectStoreName:"store"},c=function(e){if(!(e instanceof IDBRequest))throw new TypeError(e+"不是有效的IDBRequest");return new Promise(function(t,r){e.onsuccess=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)}})},u=function(e,r){var n=void 0;if(e&&e instanceof Function||(n=r+" 参数callback不能是"+(void 0===e?"undefined":t(e))+"的"+e+",只接受Function类型callback"),n)throw new Error(n);return!0},s=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};r(this,t);var n={};return n.id=a(),n.databaseName=e.databaseName||i.databaseName,n.objectStoreName=e.objectStoreName||i.objectStoreName,n.id>1&&(n.databaseName=""+n.databaseName+n.id),this.databaseName=n.databaseName,this.objectStoreName=n.objectStoreName,this.currentPromise=new Promise(function(e){return e(1)}),this}return e(t,[{key:"catchPromise",value:function(e,t){var r=this;if(!(e instanceof Promise))throw new TypeError(e+"不是Promise实例对象");if(t&&"string"!=typeof t)throw new TypeError("Error message: "+t+" 不是字符串");var n=e.catch(function(e){throw console.error(t,r,e),e});return this.currentPromise=n,n}},{key:"openDB",value:function(){var e=this,t=void 0;return t=this.database&&"open"===this.database.state&&this.database.version===this.version?new Promise(function(){return e.database}):new Promise(function(t,r){var o=n.open(e.databaseName,e.version);o.onupgradeneeded=function(t){var r=t.target.result,n=e.objectStoreName;r.objectStoreNames.contains(n)||r.createObjectStore(n,{keyPath:"primaryKey",autoIncrement:!0})},o.onsuccess=function(r){var n=r.target.result;n.onclose=function(){n.state="closed"},n.onabort=function(){n.close()},n.onversionchange=function(){e.database=n,e.version=n.version},n.state="open",e.database=n,t(e.database)},o.onerror=function(e){r(e.target.error)}}),this.catchPromise(t,"Store.openDB")}},{key:"prepare",value:function(){var e=this,t=this.openDB().then(function(t){var r=t;return"closed"===t.state&&(r=e.openDB()),r}).then(function(t){var r=t,n=e.objectStoreName;return t.objectStoreNames.contains(n)||(e.version+=1,r=e.openDB()),r}).then(function(){return e.database});return this.catchPromise(t,"Store.prepare")}},{key:"ready",value:function(){var e=this,t=this.database instanceof IDBDatabase&&"open"===this.database.state&&this.database.objectStoreNames.contains(this.objectStoreName)?this.currentPromise.then(function(){return e.database}):this.prepare();return this.catchPromise(t,"Store.ready")}},{key:"objectStore",value:function(){var e=this,t=this.ready().then(function(t){var r=e.objectStoreName;return t.transaction([r],"readwrite").objectStore(r)});return this.catchPromise(t,"Store.objectStore")}},{key:"clear",value:function(){var e=this.objectStore().then(function(e){var t=e.clear();return c(t)});return this.catchPromise(e,"Store.clear")}},{key:"getAll",value:function(){var e=this.objectStore().then(function(e){var t=e.getAll();return c(t)});return this.catchPromise(e,"Store.getAll")}},{key:"remove",value:function(e){var t=e instanceof Array?e:[e],r=void 0;t.forEach(function(e){if(Number.isSafeInteger(e)||(r="Store.remove primaryKey只接受Integer，不能是"+e),r)throw new Error(r)});var n=void 0,o=this.objectStore().then(function(e){n=e});return t.forEach(function(e){o=o.then(function(){var t=n.delete(e);return c(t)})}),o=o.then(function(){return t}),this.catchPromise(o,"Store.remove")}},{key:"get",value:function(e){var t=e instanceof Array?e:[e],r=[],n=void 0;t.forEach(function(e){if(Number.isSafeInteger(e)||(n="Store.get primaryKey只接受Integer，不能是"+e),n)throw new Error(n)});var o=void 0,a=this.objectStore().then(function(e){o=e});return t.forEach(function(e){a=a.then(function(){var t=o.get(e);return c(t)}).then(function(e){r.push(e)})}),a=a.then(function(){return r}),this.catchPromise(a,"Store.get")}},{key:"push",value:function(e){var t=void 0,r=e instanceof Array?e:[e],n=[];r.forEach(function(e){if(e instanceof Object||(t="Store.push item只接受对象，不能是"+e),e.primaryKey&&(t="Store.push data.primaryKey只接受null或undefiend，不能是"+e.primaryKey),t)throw new Error(t)});var o=void 0,a=this.objectStore().then(function(e){o=e});return r.forEach(function(e){a=a.then(function(){var t=o.add(e);return c(t)}).then(function(e){n.push(e)})}),a=a.then(function(){return n}),this.catchPromise(a,"Store.push")}},{key:"update",value:function(e){var t=void 0,r=e instanceof Array?e:[e],n=[];r.forEach(function(e){if(e instanceof Object||(t="Store.update data只接受对象，不能是"+e),e.primaryKey&&Number.isSafeInteger(e.primaryKey)||(t="Store.update data.primaryKey只接受Integer，不能是"+e.primaryKey),t)throw new Error(t)});var o=void 0,a=this.objectStore().then(function(e){o=e});return r.forEach(function(e){a=a.then(function(){var t=o.put(e);return c(t)}).then(function(e){n.push(e)})}),a=a.then(function(){return n}),this.catchPromise(a,"Store.update")}},{key:"formatOpenCursorWithSuccessCallback",value:function(e){var t="Store.formatOpenCursorWithSuccessCallback";u(e,t);var r=this.objectStore().then(function(t){var r=t.openCursor();return new Promise(function(t,n){r.onsuccess=function(r){var n=r.target.result,o=e(n);!o&&n||t(o)},r.onerror=function(e){n(e.target.error)}})});return this.catchPromise(r,t)}},{key:"find",value:function(e){u(e,"Store.find");var t=void 0,r=this.formatOpenCursorWithSuccessCallback(function(r){r&&(e(r.value,r.primaryKey)?t=r.value:r.continue());return t});return this.catchPromise(r,"Store.find")}},{key:"filter",value:function(e){u(e,"Store.filter");var t=[],r=this.formatOpenCursorWithSuccessCallback(function(r){r&&(!!e(r.value,r.primaryKey)&&t.push(r.value),r.continue())}).then(function(){return t});return this.catchPromise(r,"Store.filter")}},{key:"map",value:function(e){u(e,"Store.map");var t=[],r=this.formatOpenCursorWithSuccessCallback(function(r){if(r){var n=e(r.value,r.primaryKey);t.push(n),r.continue()}}).then(function(){return t});return this.catchPromise(r,"Store.map")}}]),t}();exports.default=s;
},{}],"Focm":[function(require,module,exports) {
"use strict";var e=require("./arraystorage"),n=r(e);function r(e){return e&&e.__esModule?e:{default:e}}var t=new n.default,o=document.querySelector("#name"),u=document.querySelector("#email"),a=document.querySelector("#primaryKey"),i=document.querySelector("#push"),c=document.querySelector("#update"),l=document.querySelector("#getAll"),m=document.querySelector("#get"),d=document.querySelector("#board"),y=d.querySelector("*[name=title]"),v=document.createElement("table"),f=function(e,n,r){return"<tr id='item"+e+"'><td>"+e+"</td><td>"+n+"</td><td>"+r+"</td><td><button name='remove' >删除</button></td></tr>"},p=function(e,n,r){var o=f(e,n,r);v.innerHTML=o;var u=v.querySelector("tr");u.querySelector("button[name=remove]").onclick=function(){return t.remove(e).then(function(){d.removeChild(u)})},d.appendChild(u)};i.onclick=function(){var e={name:o.value,email:u.value};t.push(e).then(function(n){e.primaryKey=n,p(e.primaryKey,e.name,e.email)})};var h=function(e,n,r){var o=f(e,n,r);v.innerHTML=o;var u=v.querySelector("tr");u.querySelector("button[name=remove]").onclick=function(){return t.remove(e).then(function(){d.removeChild(u)})};var a=document.querySelector("#item"+e);a?d.replaceChild(u,a):d.appendChild(u)};c.onclick=function(){var e=o.value,n=u.value,r=Number(a.value);if(!Number.isSafeInteger(r))return window.alert("更新需要primaryKey参数");var i={name:e,email:n,primaryKey:r};return t.update(i).then(function(){h(i.primaryKey,i.name,i.email)})};var S=function(){return t.getAll().then(function(e){d.innerHTML="",d.appendChild(y),e.forEach(function(e){p(e.primaryKey,e.name,e.email)})}).then(function(){console.log("数据库已经取出")})};l.onclick=function(){S()};var q=function(e){var n=Number(e);return Number.isSafeInteger(n)||window.alert("主键不可能是"+e),t.get(n).then(function(e){var n=e[0];n?(d.innerHTML="",d.appendChild(y),p(n.primaryKey,n.name,n.email)):window.alert("未查询到任何结果")}).then(function(){console.log("数据已取出")})};m.onclick=function(){var e=Number(a.value);q(e)},document.addEventListener("DOMContentLoaded",function(){S()});
},{"./arraystorage":"cdEW"}]},{},["Focm"], null)
//# sourceMappingURL=/index.map