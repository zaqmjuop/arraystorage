import Store from './arraydb';

const store = new Store();
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const primaryKeyInput = document.querySelector('#primaryKey');
const pushSubmit = document.querySelector('#push');
const updateSubmit = document.querySelector('#update');
const getAllSbumit = document.querySelector('#getAll');
const getSubmit = document.querySelector('#get');
const board = document.querySelector('#board');
const title = board.querySelector('*[name=title]');


const container = document.createElement('table');

const template = (primaryKey, name, email) => {
  // td模板
  return `<tr id='item${primaryKey}'><td>${primaryKey}</td><td>${name}</td><td>${email}</td><td><button name='remove' >删除</button></td></tr>`;
};

// Store.push
const push = (primaryKey, name, email) => {
  // 添加数据并绑定删除事件
  const inner = template(primaryKey, name, email);
  container.innerHTML = inner;
  const item = container.querySelector('tr');
  const removeSubmit = item.querySelector('button[name=remove]');
  removeSubmit.onclick = () => {
    // 删除数据
    // Store.remove
    const promise = store.remove(primaryKey).then(() => {
      board.removeChild(item);
    });
    // Store.remove
    return promise;
  };
  board.appendChild(item);
};

pushSubmit.onclick = () => {
  // 新增数据
  const name = nameInput.value;
  const email = emailInput.value;
  const data = { name, email };
  store.push(data)
    .then((primaryKey) => {
      data.primaryKey = primaryKey;
      push(data.primaryKey, data.name, data.email);
    });
};
// Store.push
// Store.update
const update = (primaryKey, name, email) => {
  // 更新数据并绑定删除事件
  const inner = template(primaryKey, name, email);
  container.innerHTML = inner;
  const item = container.querySelector('tr');
  const removeSubmit = item.querySelector('button[name=remove]');
  removeSubmit.onclick = () => {
    // 删除数据
    // Store.remove
    const promise = store.remove(primaryKey).then(() => {
      board.removeChild(item);
    });
    // Store.remove
    return promise;
  };
  const exist = document.querySelector(`#item${primaryKey}`);
  if (exist) {
    board.replaceChild(item, exist);
  } else {
    board.appendChild(item);
  }
};
updateSubmit.onclick = () => {
  // 更新数据
  const name = nameInput.value;
  const email = emailInput.value;
  const primaryKey = Number(primaryKeyInput.value);
  if (!Number.isSafeInteger(primaryKey)) {
    return window.alert('更新需要primaryKey参数');
  }
  const data = { name, email, primaryKey };
  const promise = store.update(data)
    .then(() => {
      update(data.primaryKey, data.name, data.email);
    });
  return promise;
};
// Store.update
// Store.getAll
const getAll = () => {
  // 取出全部数据库
  const promise = store.getAll()
    .then((datas) => {
      board.innerHTML = '';
      board.appendChild(title);
      datas.forEach((data) => {
        push(data.primaryKey, data.name, data.email);
      });
    }).then(() => {
      console.log('数据库已经取出');
    });
  return promise;
};
getAllSbumit.onclick = () => {
  getAll();
};
// Store.getAll
// Store.get
const get = (primaryKey) => {
  const key = Number(primaryKey);
  if (!Number.isSafeInteger(key)) {
    window.alert(`主键不可能是${primaryKey}`);
  }
  const promise = store.get(key)
    .then((datas) => {
      const data = datas[0];
      if (data) {
        board.innerHTML = '';
        board.appendChild(title);
        push(data.primaryKey, data.name, data.email);
      } else {
        window.alert('未查询到任何结果');
      }
    })
    .then(() => {
      console.log('数据已取出');
    });
  return promise;
};
getSubmit.onclick = () => {
  const primaryKey = Number(primaryKeyInput.value);
  get(primaryKey);
};
// Store.get

document.addEventListener('DOMContentLoaded', () => {
  // 页面加载
  getAll();
});

// 增 push(data) push([data1,data2]) √√√
// 删 remove(primaryKey) remove([key1, key2]) √√√
// 改 update(data) √√√
// 查找 直接主键获取 get(key) get([key1, key2]) √√√
// 查找 单数查找find(callback) √√ 复数查找filter(callback) √√ 全部取出getAll √√√
// 遍历数据库map(callback) √√

// 数组型共计8个api
