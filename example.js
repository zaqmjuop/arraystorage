import Store from './arraystorage';

// 计数器
let count = 0;
const counter = () => {
  count += 1;
  return count;
};

// 备用数据
const data1 = { name: `name${counter()}` };
const data2 = { name: `name${counter()}` };
const data3 = { name: `name${counter()}` };

// 新建一个数据库对象 主键为primaryKey
const store = new Store();

// 添加数据 push(data) push([data])
// 返回promise resolve(primaryKeys) primaryKeys是新增数据的主键组成的数组
store.push(data1).then(res => console.log(res));
store.push([data2, data3]).then(res => console.log(res));

// 删除数据 remove(primaryKey) remove([primaryKey])
// 返回promise resolve(primaryKeys) primaryKeys是删除数据的主键组成的数组
store.remove(1).then(res => console.log(res));
store.remove([2, 3]).then(res => console.log(res));

// 修改数据 update(data) update([data])
// 返回promise resolve(primaryKeys) primaryKeys是修改数据的主键组成的数组
const data1rep = Object.assign({ primaryKey: 4 }, data1);
const data2rep = Object.assign({ primaryKey: 5 }, data2);
const data3rep = Object.assign({ primaryKey: 6 }, data3);
store.update(data1rep).then(res => console.log(res));
store.update([data2rep, data3rep]).then(res => console.log(res));

// 根据主键查找 get(primaryKey) get([primaryKey])
// 返回promise resolve(datas) datas是查询结果组成的数组
store.get(4).then(res => console.log(res));
store.get([5, 6]).then(res => console.log(res));

// 取出全部数据 getAll()
// 返回promise resolve(datas) datas是查询结果组成的数组
store.getAll().then(res => console.log(res));

// 单数数据查询 find(callback)
// 返回promise resolve(data) data是第一条callback返回值truly的查询结果
store.find(data => data.primaryKey > 4).then(res => console.log('find', res));

// 复数数据查询 filter(callback)
// 返回promise resolve(datas) datas是callback返回值truly的查询结结果组成的数组
store.filter(data => data.primaryKey > 4).then(res => console.log(res));

// 遍历数据库并对每条数据进行callback操作并保存结果 map(callback)、
// 返回promise resolve(datas) datas是callback返回值组成的数组
store.map(data => data.primaryKey * 2).then(res => console.log(res));
