parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"cdEW":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function t(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var n=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!n)throw new ReferenceError("您的浏览器不支持indexeddb");var o=0,a=function(){return o+=1},i={databaseName:window.location.hostname,objectStoreName:"store"},u=function(e){if(!(e instanceof IDBRequest))throw new TypeError(e+"不是有效的IDBRequest");return new Promise(function(r,t){e.onsuccess=function(e){r(e.target.result)},e.onerror=function(e){t(e.target.error)}})},s=function(e,t){var n=void 0;if(e&&e instanceof Function||(n=t+" 参数callback不能是"+(void 0===e?"undefined":r(e))+"的"+e+",只接受Function类型callback"),n)throw new Error(n);return!0},c=function(){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(t(this,r),new.target!==r)throw new Error("必须使用 new 命令生成实例");var n={};return n.id=a(),n.databaseName=e.databaseName||i.databaseName,n.objectStoreName=e.objectStoreName||i.objectStoreName,n.id>1&&(n.databaseName=""+n.databaseName+n.id),this.databaseName=n.databaseName,this.objectStoreName=n.objectStoreName,this}return e(r,[{key:"pushPromise",value:function(e,r){var t=this;if(!(e instanceof Promise))throw new TypeError(e+"不是Promise实例对象");if(r&&"string"!=typeof r)throw new TypeError("Error message: "+r+" 不是字符串");return this.currentPromise=this.getCurrentPromise().then(function(){return e}).catch(function(e){throw console.error(r,e,t),e}),this.currentPromise}},{key:"openDB",value:function(){var e=this,r=new Promise(function(r,t){var o=n.open(e.databaseName,e.version);o.onupgradeneeded=function(r){var t=r.target.result,n=e.objectStoreName;t.objectStoreNames.contains(n)||t.createObjectStore(n,{keyPath:"primaryKey",autoIncrement:!0})},o.onsuccess=function(t){var n=t.target.result;n.onclose=function(){n.state="closed"},n.onabort=function(){n.close()},n.onversionchange=function(){e.database=n,e.version=n.version},n.state="open",e.database=n,r(e.database)},o.onerror=function(e){t(e.target.error)}});return r.catch(function(t){return console.error("Store.openDB "+t),e.version=e.database.version,e.database.objectStoreNames.contains(e.objectStoreName)||(e.version+=1),r})}},{key:"ready",value:function(){return(this.isPrepared()?Promise.resolve(this.database):this.openDB()).catch(function(e){throw console.error("Store.ready "+e),e})}},{key:"isPrepared",value:function(){return this.database instanceof IDBDatabase&&"open"===this.database.state&&this.database.objectStoreNames.contains(this.objectStoreName)}},{key:"getStore",value:function(){if(!this.isPrepared())throw new ReferenceError("Store.getStore 数据库未准备好");return this.database.transaction(["store"],"readwrite").objectStore("store")}},{key:"getCurrentPromise",value:function(){return this.currentPromise&&this.isPrepared()||(this.currentPromise=this.ready()),this.currentPromise}},{key:"clear",value:function(){var e=this,r=this.ready().then(function(){var r=e.getStore().clear();return u(r)});return this.pushPromise(r,"Store.clear")}},{key:"getAll",value:function(){var e=this,r=this.ready().then(function(){var r=e.getStore().getAll();return u(r)});return this.pushPromise(r,"Store.getAll")}},{key:"remove",value:function(e){var r=this,t=e instanceof Array?e:[e];t.forEach(function(e){if(!Number.isSafeInteger(e))throw new TypeError("Store.remove primaryKey只接受Integer，不能是"+e)});var n=this.ready();return t.forEach(function(e){n=n.then(function(){var t=r.getStore().delete(e);return u(t)})}),n=n.then(function(){return t}),this.pushPromise(n,"Store.remove")}},{key:"get",value:function(e){var r=this,t=e instanceof Array?e:[e],n=[];t.forEach(function(e){if(!Number.isSafeInteger(e))throw new TypeError("Store.get primaryKey只接受Integer，不能是"+e)});var o=this.ready();return t.forEach(function(e){o=o.then(function(){var t=r.getStore().get(e);return u(t)}).then(function(e){n.push(e)})}),o=o.then(function(){return n}),this.pushPromise(o,"Store.get")}},{key:"push",value:function(e){var r=this,t=e instanceof Array?e:[e],n=[];t.forEach(function(e){if(!(e instanceof Object))throw new TypeError("Store.push item只接受对象，不能是"+e);if(e.primaryKey)throw new TypeError("Store.push data.primaryKey只接受null或undefiend，不能是"+e.primaryKey)});var o=this.ready();return t.forEach(function(e){o=o.then(function(){var t=r.getStore().add(e);return u(t)}).then(function(e){n.push(e)})}),o=o.then(function(){return n}),this.pushPromise(o,"Store.push")}},{key:"update",value:function(e){var r=this,t=e instanceof Array?e:[e],n=[];t.forEach(function(e){if(!(e instanceof Object))throw new TypeError("Store.update data只接受对象，不能是"+e);if(!e.primaryKey||!Number.isSafeInteger(e.primaryKey))throw new TypeError("Store.update data.primaryKey只接受Integer，不能是"+e.primaryKey)});var o=this.ready();return t.forEach(function(e){o=o.then(function(){var t=r.getStore().put(e);return u(t)}).then(function(e){n.push(e)})}),o=o.then(function(){return n}),this.pushPromise(o,"Store.update")}},{key:"formatOpenCursorWithSuccessCallback",value:function(e){var r=this,t="Store.formatOpenCursorWithSuccessCallback";s(e,t);var n=this.ready().then(function(){var t=r.getStore().openCursor();return new Promise(function(r,n){t.onsuccess=function(t){var n=t.target.result,o=e(n);!o&&n||r(o)},t.onerror=function(e){n(e.target.error)}})});return this.pushPromise(n,t)}},{key:"find",value:function(e){s(e,"Store.find");var r=void 0,t=this.formatOpenCursorWithSuccessCallback(function(t){t&&(e(t.value,t.primaryKey)?r=t.value:t.continue());return r});return this.pushPromise(t,"Store.find")}},{key:"filter",value:function(e){s(e,"Store.filter");var r=[],t=this.formatOpenCursorWithSuccessCallback(function(t){t&&(!!e(t.value,t.primaryKey)&&r.push(t.value),t.continue())}).then(function(){return r});return this.pushPromise(t,"Store.filter")}},{key:"map",value:function(e){s(e,"Store.map");var r=[],t=this.formatOpenCursorWithSuccessCallback(function(t){if(t){var n=e(t.value,t.primaryKey);r.push(n),t.continue()}}).then(function(){return r});return this.pushPromise(t,"Store.map")}}]),r}();window.ArrayStorage=c,exports.default=c;
},{}],"Focm":[function(require,module,exports) {
"use strict";var e=require("./arraystorage"),n=r(e);function r(e){return e&&e.__esModule?e:{default:e}}var t=new n.default,o=document.querySelector("#name"),u=document.querySelector("#email"),a=document.querySelector("#primaryKey"),i=document.querySelector("#push"),c=document.querySelector("#update"),l=document.querySelector("#getAll"),m=document.querySelector("#get"),d=document.querySelector("#board"),y=d.querySelector("*[name=title]"),v=document.createElement("table"),f=function(e,n,r){return"<tr id='item"+e+"'><td>"+e+"</td><td>"+n+"</td><td>"+r+"</td><td><button name='remove' >删除</button></td></tr>"},p=function(e,n,r){var o=f(e,n,r);v.innerHTML=o;var u=v.querySelector("tr");u.querySelector("button[name=remove]").onclick=function(){return t.remove(e).then(function(){d.removeChild(u)})},d.appendChild(u)};i.onclick=function(){var e={name:o.value,email:u.value};t.push(e).then(function(n){e.primaryKey=n,p(e.primaryKey,e.name,e.email)})};var h=function(e,n,r){var o=f(e,n,r);v.innerHTML=o;var u=v.querySelector("tr");u.querySelector("button[name=remove]").onclick=function(){return t.remove(e).then(function(){d.removeChild(u)})};var a=document.querySelector("#item"+e);a?d.replaceChild(u,a):d.appendChild(u)};c.onclick=function(){var e=o.value,n=u.value,r=Number(a.value);if(!Number.isSafeInteger(r))return window.alert("更新需要primaryKey参数");var i={name:e,email:n,primaryKey:r};return t.update(i).then(function(){h(i.primaryKey,i.name,i.email)})};var S=function(){return t.getAll().then(function(e){d.innerHTML="",d.appendChild(y),e.forEach(function(e){p(e.primaryKey,e.name,e.email)})}).then(function(){console.log("数据库已经取出")})};l.onclick=function(){S()};var q=function(e){var n=Number(e);return Number.isSafeInteger(n)||window.alert("主键不可能是"+e),t.get(n).then(function(e){var n=e[0];n?(d.innerHTML="",d.appendChild(y),p(n.primaryKey,n.name,n.email)):window.alert("未查询到任何结果")}).then(function(){console.log("数据已取出")})};m.onclick=function(){var e=Number(a.value);q(e)},document.addEventListener("DOMContentLoaded",function(){S()});
},{"./arraystorage":"cdEW"}]},{},["Focm"], null)
//# sourceMappingURL=/index.map