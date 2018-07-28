# ArrayStorage
### ArrayStorage 是一个基于ES6 Promise的对 indexeddb 封装的使用非常简单的库
### ArrayStorage 使用精简的API，就像 JavaScript 的 Array 
***
### 预览： [crud在线demo](https://zaqmjuop.github.io/arraystorage/) 
***
### 获取：
#### 方式一： 使用NPM
```bash
$ npm i arraystorage
```
```JavaScript
import ArrayStorage from 'arraystorage';

const store = new ArrayStorage();
store.getAll().then(() => console.log('数据库已加载'))
```
#### 方式二： 直接使用 html 标签
```html
<script src="https://github.com/zaqmjuop/arraystorage/blob/master/docs/arraystorage.js"></script>
<script>
  const store = new ArrayStorage();
  store.getAll().then(() => console.log('数据库已加载'))
</script>
```
***
### API
**创建对象**
```JavaScript
import ArrayStorage from 'arraystorage';

const store = new ArrayStorage();
```
**新增数据**
> push(data)

> push([data])
```JavaScript
store.push({name: 'name1'}).then(primaryKeys => primaryKeys) // [1]
store.push([{name: 'name2'}, {name: 'name3'}]).then(primaryKeys => primaryKeys) // [2, 3]
// primaryKeys 是新增数据的主键属性 primaryKey 的集合
// primaryKey 是Integer主键，新增数据自动分配一个主键，可以使用主键对数据进行查询，修改，或删除
```
**使用 primaryKey 查询数据**
> get(primaryKey)

> get([primaryKey])
```JavaScript
store.get(1).then(primaryKeys => primaryKeys) 
// {name: 'name1', primaryKey: 1}
store.get([2, 3]).then(primaryKeys => primaryKeys) 
// [{name: 'name2', primaryKey: 2}, {name: 'name3', primaryKey: 3}]
```
**条件查询数据**
> find(callback) // 单数查询

> filter(callback) // 复数查询

> getAll() // 获取全部数据
```JavaScript
store.find(item => item.primaryKey > 1).then(data => data) 
// {name: 'name2', primaryKey: 2}
store.filter(item => item.primaryKey > 1).then(datas => datas) 
// [{name: 'name2', primaryKey: 2}, {name: 'name3', primaryKey: 3}]
store.getAll().then(datas => datas) 
// [{name: 'name1', primaryKey: 1}, {name: 'name2', primaryKey: 2}, {name: 'name3', primaryKey: 3}]
```
**遍历数据并获取副本**
> map(callback)
```JavaScript
store.map(item => (item.primaryKey * 2)).then(datas => datas)
// [2, 4, 6]
```
**更新数据**
> update(data)

> update([data])
```JavaScript
store.update({primaryKey: 1, name: 'name11'}).then(primaryKeys => primaryKeys) // [1]
store.update([{primaryKey: 2, name: 'name22'}, {primaryKey: 3, name: 'name33'}])
  .then(primaryKeys => primaryKeys) // [2, 3]
```
**删除数据**
> remove(primaryKey)

> remove([primaryKey])
```JavaScript
store.remove(1).then(primaryKeys => primaryKeys) // [1]
store.remove([2, 3]).then(primaryKeys => primaryKeys) // [2, 3]
```
