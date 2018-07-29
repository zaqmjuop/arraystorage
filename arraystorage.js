
const indexedDB = window.indexedDB
  || window.mozIndexedDB
  || window.webkitIndexedDB
  || window.msIndexedDB;

if (!indexedDB) {
  throw new ReferenceError('您的浏览器不支持indexeddb');
}

// 计数器
let count = 0;
const counter = () => {
  count += 1;
  return count;
};

const defaultConfig = {
  databaseName: window.location.hostname,
  objectStoreName: 'store',
};

const formatRequest = (request) => {
  if (!(request instanceof IDBRequest)) { throw new TypeError(`${request}不是有效的IDBRequest`); }
  const promise = new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
  return promise;
};

const validateCallback = (callback, msg) => {
  let log;
  if (!callback || !(callback instanceof Function)) {
    log = `${msg} 参数callback不能是${typeof callback}的${callback},只接受Function类型callback`;
  }
  if (log) { throw new Error(log); }
  return true;
};

class Store {
  // indexeddb模仿Array的api 主键为primaryKey
  constructor(option = {}) {
    // 接受一个配置对象
    // databaseName数据库名 默认window.location.hostname
    // objectStoreName 数据库表名的 默认 `store${counter()}`
    // currentPromise 执行链
    const config = {};
    config.id = counter();
    config.databaseName = option.databaseName || defaultConfig.databaseName;
    config.objectStoreName = option.objectStoreName || defaultConfig.objectStoreName;
    if (config.id > 1) { config.databaseName = `${config.databaseName}${config.id}`; }
    this.databaseName = config.databaseName;
    this.objectStoreName = config.objectStoreName;
    this.currentPromise = new Promise(resolve => resolve(1));
    return this;
  }

  catchPromise(promise, msg) {
    // 给Promise添加catch
    if (!(promise instanceof Promise)) { throw new TypeError(`${promise}不是Promise实例对象`); }
    if (msg && typeof msg !== 'string') { throw new TypeError(`Error message: ${msg} 不是字符串`); }
    const result = promise.catch((error) => {
      console.error(msg, this, error);
      throw error;
    });
    // this.currentPormise // 执行链
    // 返回currentPromise的ready在每个方法开头 结尾又被catchPromise抓取
    this.currentPromise = result;
    return result;
  }

  openDB() {
    // 打开数据库 并为数据库绑定事件
    const open = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, this.version);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = this.objectStoreName;
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'primaryKey', autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        const database = event.target.result;
        database.onclose = () => {
          database.state = 'closed';
        };
        database.onabort = () => {
          database.close();
        };
        database.onversionchange = () => {
          this.database = database;
          this.version = database.version;
        };
        database.state = 'open';
        this.database = database;
        resolve(this.database);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
    const solve = open.catch((error) => {
      console.error(error);
      this.version = this.database.version;
      if (!this.database.objectStoreNames.contains(this.objectStoreName)) {
        this.version += 1;
      }
      return open;
    });
    return this.catchPromise(solve, 'Store.openDB');
  }

  ready() {
    // 返回promise resolve已经准备好的数据库
    const isPrepared = this.database instanceof IDBDatabase
      && this.database.state === 'open'
      && this.database.objectStoreNames.contains(this.objectStoreName);
    const promise = (isPrepared)
      ? this.currentPromise.then(() => this.database)
      : this.openDB();
    return this.catchPromise(promise, 'Store.ready');
  }

  objectStore() {
    // 返回objectStore
    const promise = this.ready()
      .then((db) => {
        const store = this.objectStoreName;
        const transaction = db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        return objectStore;
      });
    return this.catchPromise(promise, 'Store.objectStore');
  }

  clear() {
    // 清空数据库
    const promise = this.objectStore()
      .then((objectStore) => {
        const request = objectStore.clear();
        return formatRequest(request);
      });
    const catched = this.catchPromise(promise, 'Store.clear');
    return catched;
  }

  getAll() {
    // 获取整个数据库
    // 返回promise resolve(datas) datas是整个数据库组成的数组
    const promise = this.objectStore()
      .then((objectStore) => {
        const request = objectStore.getAll();
        return formatRequest(request);
      });
    const catched = this.catchPromise(promise, 'Store.getAll');
    return catched;
  }

  remove(primaryKey) {
    // 删除数据 remove(primaryKey) 和 remove([primaryKey1, primaryKey2])
    // 返回promise resolve() primaryKeys是删除的数据的主键组成的数组
    const primaryKeys = (primaryKey instanceof Array) ? primaryKey : [primaryKey];
    let errorMsg;
    const position = 'Store.remove';
    primaryKeys.forEach((key) => {
      if (!Number.isSafeInteger(key)) { errorMsg = `${position} primaryKey只接受Integer，不能是${key}`; }
      if (errorMsg) { throw new Error(errorMsg); }
    });
    let store;
    let promise = this.objectStore()
      .then((objectStore) => {
        store = objectStore;
      });
    primaryKeys.forEach((key) => {
      promise = promise.then(() => {
        const request = store.delete(key);
        return formatRequest(request);
      });
    });
    promise = promise.then(() => primaryKeys);
    return this.catchPromise(promise, position);
  }

  get(primaryKey) {
    // 取出指定id位置的数据 primaryKeyGet(primaryKey) 或 primaryKeyGet(primaryKeys)
    // 返回promise resolve(datas) datas是结果组成的数组
    const primaryKeys = (primaryKey instanceof Array) ? primaryKey : [primaryKey];
    const datas = [];
    let errorMsg;
    const position = 'Store.get';
    primaryKeys.forEach((key) => {
      if (!Number.isSafeInteger(key)) { errorMsg = `${position} primaryKey只接受Integer，不能是${key}`; }
      if (errorMsg) { throw new Error(errorMsg); }
    });
    let store;
    let promise = this.objectStore()
      .then((objectStore) => {
        store = objectStore;
      });
    primaryKeys.forEach((key) => {
      promise = promise.then(() => {
        const request = store.get(key);
        return formatRequest(request);
      }).then((data) => {
        datas.push(data);
      });
    });
    promise = promise.then(() => datas);
    return this.catchPromise(promise, position);
  }

  push(data) {
    // 新增数据 push(data) 和 push([data1, data2])
    // 返回promise resolve(primaryKeys) primaryKeys是添加的数据的主键组成的数组
    let errorMsg;
    const position = 'Store.push';
    const datas = (data instanceof Array) ? data : [data];
    const primaryKeys = [];
    datas.forEach((item) => {
      if (!(item instanceof Object)) { errorMsg = `${position} item只接受对象，不能是${item}`; }
      if (item.primaryKey) {
        errorMsg = `${position} data.primaryKey只接受null或undefiend，不能是${item.primaryKey}`;
      }
      if (errorMsg) { throw new Error(errorMsg); }
    });
    let store;
    let promise = this.objectStore()
      .then((objectStore) => {
        store = objectStore;
      });
    datas.forEach((item) => {
      promise = promise
        .then(() => {
          const request = store.add(item);
          return formatRequest(request);
        }).then((primaryKey) => {
          primaryKeys.push(primaryKey);
        });
    });
    promise = promise.then(() => primaryKeys);
    return this.catchPromise(promise, position);
  }

  update(data) {
    // 在指定位置新建或插入数据
    // update(data) 或 update([data1, data2])
    // 返回promise resolve(primaryKeys) primaryKeys是更新后的主键
    // data应该有Integer类型的data.primaryKey
    let errorMsg;
    const position = 'Store.update';
    const datas = (data instanceof Array) ? data : [data];
    const primaryKeys = [];
    datas.forEach((item) => {
      if (!(item instanceof Object)) { errorMsg = `${position} data只接受对象，不能是${item}`; }
      if (!item.primaryKey || !Number.isSafeInteger(item.primaryKey)) {
        errorMsg = `${position} data.primaryKey只接受Integer，不能是${item.primaryKey}`;
      }
      if (errorMsg) { throw new Error(errorMsg); }
    });
    let store;
    let promise = this.objectStore()
      .then((objectStore) => {
        store = objectStore;
      });
    datas.forEach((item) => {
      promise = promise
        .then(() => {
          const request = store.put(item);
          return formatRequest(request);
        }).then((primaryKey) => {
          primaryKeys.push(primaryKey);
        });
    });
    promise = promise.then(() => primaryKeys);
    return this.catchPromise(promise, position);
  }

  formatOpenCursorWithSuccessCallback(successCallback) {
    // 标准化遍历数据库
    // 返回promise
    // 接受一个successCallback 若successCallback有除了undefined以外的返回值 则resolve
    const position = 'Store.formatOpenCursorWithSuccessCallback';
    validateCallback(successCallback, position);
    const promise = this.objectStore()
      .then((objectStore) => {
        const request = objectStore.openCursor();
        const bindRequestEvents = new Promise((resolve, reject) => {
          // success callback
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            const result = successCallback(cursor);
            if (result || !cursor) { resolve(result); }
          };
          request.onerror = (event) => {
            reject(event.target.error);
          };
        });
        return bindRequestEvents;
      });
    return this.catchPromise(promise, position);
  }

  find(callback) {
    // 遍历数据库 返回数据库中满足提供的测试函数的第一个元素的值
    // 返回promise resolve(data)
    // 接受回调函数callback(value, primaryKey) => {}
    // value是数据值，primaryKey是主键 若callback return ture 则返回value
    const position = 'Store.find';
    validateCallback(callback, position);
    let result;
    const successCallback = (cursor) => {
      if (cursor) {
        const isMatch = callback(cursor.value, cursor.primaryKey);
        if (isMatch) {
          result = cursor.value;
        } else {
          cursor.continue();
        }
      }
      return result;
    };
    const promise = this.formatOpenCursorWithSuccessCallback(successCallback);
    return this.catchPromise(promise, position);
  }

  filter(callback) {
    // 遍历数据库 接受callback对数据库中所有数据进行筛选 返回符合条件的数据的数组
    // 返回promise resolve(data)
    // 接受回调函数callback(value, primaryKey) => {}
    // value是数据值，primaryKey是主键
    const position = 'Store.filter';
    validateCallback(callback, position);
    const result = [];
    const successCallback = (cursor) => {
      if (cursor) {
        const isMatch = !!callback(cursor.value, cursor.primaryKey);
        if (isMatch) { result.push(cursor.value); }
        cursor.continue();
      }
    };
    const promise = this.formatOpenCursorWithSuccessCallback(successCallback)
      .then(() => result);
    return this.catchPromise(promise, position);
  }

  map(callback) {
    // 遍历数据库 对每条数据进行callback 返回结果的数组
    // 返回promise resolve(data)
    // 接受回调函数callback(value, primaryKey) => {}
    // value是数据值，primaryKey是主键
    const position = 'Store.map';
    validateCallback(callback, position);
    const result = [];
    const successCallback = (cursor) => {
      if (cursor) {
        const item = callback(cursor.value, cursor.primaryKey);
        result.push(item);
        cursor.continue();
      }
    };
    const promise = this.formatOpenCursorWithSuccessCallback(successCallback)
      .then(() => result);
    return this.catchPromise(promise, position);
  }
}

window.ArrayStorage = Store;
export default Store;
