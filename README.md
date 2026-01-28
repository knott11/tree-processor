# tree-processor

一个轻量级的树结构数据处理工具库，使用 TypeScript 编写，支持 tree-shaking，每个格式打包体积约 **3-4 KB**（ESM: 3.25 KB，CJS: 3.42 KB，UMD: 3.56 KB）。

目前已支持 mapTree、forEachTree、filterTree、findTree、pushTree、unshiftTree、popTree、shiftTree、someTree、everyTree、includesTree、atTree、indexOfTree、atIndexOfTree、getParentTree、nodeDepthMap、dedupTree、removeTree、isEmptyTree、isSingleTree 和 isMultipleTrees。每个方法的最后一个参数可以自定义 children 和 id 的属性名。

## ✨ 特性

- 🚀 **轻量级** - 每个格式约 3-4 KB（ESM: 3.25 KB，CJS: 3.42 KB，UMD: 3.56 KB）
- 📦 **支持 Tree-shaking** - 按需导入，只打包使用的代码
- 🔧 **TypeScript 支持** - 完整的类型定义和类型提示
- 🎯 **类似数组 API** - 提供 map、filter、find 等熟悉的数组方法
- ⚙️ **自定义字段名** - 支持自定义 children 和 id 字段名
- ✅ **零依赖** - 无外部依赖，开箱即用
- 🧪 **完善的测试覆盖** - 包含 160 个测试用例，覆盖基础功能、边界情况、异常处理、复杂场景、npm 包导入等

## 📦 安装

```bash
yarn add tree-processor
# 或
npm i tree-processor
```

## 使用说明

### 引入

#### 默认导入（推荐用于需要多个方法的场景）

```javascript
// ES Module
import t from 'tree-processor'

// CommonJS
const t = require('tree-processor')
```

#### 按需导入（推荐用于只需要少量方法的场景，支持 tree-shaking）

```javascript
// ES Module - 按需导入单个方法
import { mapTree, filterTree, findTree } from 'tree-processor'

// ES Module - 按需导入类型
import type { TreeNode, TreeData, FieldNames } from 'tree-processor'

// CommonJS - 按需导入
const { mapTree, filterTree } = require('tree-processor')
```

**按需导入的优势：**
- ✅ 支持 tree-shaking，只打包使用的代码，减小打包体积
- ✅ 更好的代码提示和类型检查
- ✅ 更清晰的依赖关系

### 示例树结构数据

以下示例数据将用于后续所有方法的演示：

```javascript
const treeData = [
  {
    id: 1,
    name: 'node1',
    children: [
      {
        id: 2,
        name: 'node2',
        children: [
          { id: 4, name: 'node4' },
          { id: 5, name: 'node5' },
        ],
      },
      {
        id: 3,
        name: 'node3',
        children: [{ id: 6, name: 'node6' }],
      },
    ],
  },
];
```

### mapTree（遍历树结构数据的方法）

遍历树结构数据，对每个节点执行回调函数。

```javascript
t.mapTree(treeData, (item) => {
    console.log(item)
})
```

### forEachTree（遍历树结构数据的方法，不返回值）

遍历树结构数据，对每个节点执行回调函数。与 mapTree 的区别是不返回值，性能更好，适合只需要遍历而不需要返回结果的场景。

```javascript
t.forEachTree(treeData, (item) => {
    console.log(item)
    // 可以在这里修改节点
    item.visited = true
})
```

### filterTree（树结构数据的filter方法）

过滤树结构数据，返回满足条件的节点。

```javascript
const values = ['node1', 'node2', 'node3'];
const result = t.filterTree(treeData, (item) => {
    return values.includes(item.name)
})

console.log(result)
```

### findTree（树结构数据的find方法）

查找树结构数据中满足条件的第一个节点。

```javascript
const result = t.findTree(treeData, (item) => {
    return item.hasOwnProperty('children')
})

console.log(result)
```

### pushTree（在指定节点下添加子节点到末尾）

targetParentId 为目标节点的 id，newNode 为往该节点添加的数据。

```javascript
t.pushTree(treeData, targetParentId, newNode);

console.log(treeData)
```

### unshiftTree（在指定节点下添加子节点到开头）

targetParentId 为目标节点的 id，newNode 为往该节点添加的数据。

```javascript
t.unshiftTree(treeData, targetParentId, newNode);

console.log(treeData)
```

### popTree（删除指定节点下的最后一个子节点）

rootId 为目标节点的 id，此方法可删除 rootId 下的最后一个子节点。

```javascript
t.popTree(treeData, rootId);

console.log(treeData)
```

### shiftTree（删除指定节点下的第一个子节点）

rootId 为目标节点的 id，此方法可删除 rootId 下的第一个子节点。

```javascript
t.shiftTree(treeData, rootId);

console.log(treeData)
```

### someTree（树结构数据的some方法）

检查树结构数据中是否存在满足条件的节点。

```javascript
const result = t.someTree(treeData, item => item.name === 'jack')

console.log(result)
```

### everyTree（树结构数据的every方法）

检查树结构数据中是否所有节点都满足条件。

```javascript
const result = t.everyTree(treeData, item => item.age >= 18)

console.log(result)
```

### includesTree（检查树中是否包含指定节点）

检查树结构数据中是否包含指定ID的节点。

```javascript
const hasNode = t.includesTree(treeData, targetId)

console.log(hasNode) // true 表示包含该节点，false 表示不包含
```

### atTree（根据父节点ID和子节点索引获取节点）

parentId 为指定父节点的 id，nodeIndex 为子节点的索引，可传负数，和数组的 at 方法一样。

```javascript
const result = t.atTree(treeData, parentId, nodeIndex)

console.log(result)
```

### indexOfTree（返回从根节点到目标节点的索引路径）

返回一个数组，值为从根节点开始到 targetId 所在节点的索引，返回值可以传入 atIndexOfTree 的第二个参数进行取值。

```javascript
const result = t.indexOfTree(treeData, targetId)

console.log(result)
```

### atIndexOfTree（根据索引路径获取节点）

传入节点数据的下标数组，返回节点数据。

```javascript
const result = t.atIndexOfTree(treeData, [0, 1, 0])

console.log(result)
```

### getParentTree（获取节点的父节点）

获取指定节点的父节点。如果节点是根节点，返回 null。

```javascript
const parent = t.getParentTree(treeData, targetId)

console.log(parent) // 返回父节点对象，如果未找到或节点是根节点则返回 null
```

### nodeDepthMap（返回节点ID到深度的映射）

返回一个字典，键代表节点的 id，值代表该节点在数据的第几层。

```javascript
const result = t.nodeDepthMap(treeData)

console.log(result)
```

### dedupTree（树结构对象数组去重方法）

树结构对象数组去重方法，第一个参数为需要去重的数据，第二个参数为以哪个键去重。

```javascript
const result = t.dedupTree(treeData, 'id')

console.log(result)
```

### removeTree（删除指定节点）

删除树结构数据中指定ID的节点，包括根节点和子节点。

```javascript
const success = t.removeTree(treeData, targetId)

console.log(success) // true 表示删除成功，false 表示未找到节点
console.log(treeData) // 删除后的树结构
```

### isEmptyTree（检查树是否为空）

检查树结构数据是否为空。

```javascript
const isEmpty = t.isEmptyTree(treeData)

console.log(isEmpty) // true 表示树为空，false 表示树不为空
```

### isSingleTree（判断数据是否是单个树结构）

判断数据是否是单个树结构（单个对象）。树结构必须是一个对象（不能是数组、null、undefined 或基本类型），如果存在 children 字段，必须是数组类型，并且会递归检查所有子节点。

```javascript
// 有效的单个树结构
const tree = {
  id: 1,
  name: 'node1',
  children: [
    { id: 2, name: 'node2' },
    { id: 3, name: 'node3' },
  ],
};

const isValid = t.isSingleTree(tree)
console.log(isValid) // true

// 无效的树结构
const invalidTree = {
  id: 1,
  children: null, // children 不能是 null
};

const isInvalid = t.isSingleTree(invalidTree)
console.log(isInvalid) // false

// 支持自定义字段名
const customTree = {
  nodeId: 1,
  name: 'node1',
  subNodes: [
    { nodeId: 2, name: 'node2' },
  ],
};

const fieldNames = { children: 'subNodes', id: 'nodeId' };
const isValidCustom = t.isSingleTree(customTree, fieldNames)
console.log(isValidCustom) // true
```

### isMultipleTrees（判断数据是否是多个树结构）

判断数据是否是多个树结构（数组）。多个树结构必须是一个数组，数组中的每个元素都必须是有效的单个树结构。

```javascript
// 有效的多个树结构
const forest = [
  {
    id: 1,
    name: 'node1',
    children: [
      { id: 2, name: 'node2' },
    ],
  },
  {
    id: 3,
    name: 'node3',
    children: [{ id: 4, name: 'node4' }],
  },
];

const isValid = t.isMultipleTrees(forest)
console.log(isValid) // true

// 空数组也是有效的多个树结构
const emptyForest = []
const isEmptyValid = t.isMultipleTrees(emptyForest)
console.log(isEmptyValid) // true

// 无效的多个树结构
const invalidForest = [
  { id: 1, children: [{ id: 2 }] },
  'not a tree', // 数组元素必须是树结构
];

const isInvalid = t.isMultipleTrees(invalidForest)
console.log(isInvalid) // false

// 支持自定义字段名
const customForest = [
  {
    nodeId: 1,
    name: 'node1',
    subNodes: [
      { nodeId: 2, name: 'node2' },
    ],
  },
];

const fieldNames = { children: 'subNodes', id: 'nodeId' };
const isValidCustom = t.isMultipleTrees(customForest, fieldNames)
console.log(isValidCustom) // true
```

## 自定义字段名

所有方法都支持自定义 children 和 id 的属性名，通过最后一个参数传入配置对象：

```javascript
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const result = t.findTree(treeData, (item) => item.nodeId === 2, fieldNames);
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试（单次，不监听文件变化）
npm test -- --run
```

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build
```

## 技术栈

- **Rollup** - 模块打包工具
- **Vitest** - 单元测试框架
- **Terser** - JavaScript 压缩工具
- **TypeScript** - 类型支持

## License

MIT
