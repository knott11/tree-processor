# tree-processor

<div align="right">

[English](https://github.com/knott11/tree-processor/blob/main/README.en.md) | [中文](https://github.com/knott11/tree-processor/blob/main/README.md)

</div>

<div align="center">

![version](https://img.shields.io/npm/v/tree-processor?style=flat-square&label=version)
![npm downloads (2 months)](https://img.shields.io/badge/downloads-1.7K%2F2mo-brightgreen?style=flat-square)
![bundle size](https://img.shields.io/badge/bundle-15KB-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?style=flat-square)

一个轻量级的树结构数据处理工具库，使用 TypeScript 编写，提供50+ API，包括遍历、查找、修改、转换、查询、分析、验证等完整功能。


</div>

## 📋 目录

- [特性](#-特性)
  - [使用场景](#-使用场景)
- [安装](#-安装)
- [快速开始](#-快速开始)
- [API 文档](#-api-文档)
  - [遍历操作方法](#遍历操作方法)
  - [条件查找方法](#条件查找方法)
  - [索引访问方法](#索引访问方法)
  - [节点操作方法](#节点操作方法)
  - [格式转换方法](#格式转换方法)
  - [克隆复制方法](#克隆复制方法)
  - [关系查询方法](#关系查询方法)
  - [数据验证方法](#数据验证方法)
  - [聚合分析方法](#聚合分析方法)
- [自定义字段名](#自定义字段名)
- [测试](#测试)
- [开发](#开发)

## ✨ 特性

- **多格式支持** - 提供 ESM、CJS、UMD 格式，体积仅 14.9-15.2 KB，支持 Tree-shaking，按需导入
- **零依赖** - 无外部依赖，开箱即用
- **高性能** - 中等规模树（~120节点）平均执行时间 < 0.03ms
- **功能完整** - 50+ API，覆盖遍历、查找、修改、转换、查询、分析、验证等完整功能
- **测试完善** - 447 个测试用例，99%+ 覆盖率

### 💡 使用场景

- **导航系统** - 多级菜单、路由配置的展开、折叠、搜索、过滤
- **文件系统** - 文件目录的遍历、查找、移动、删除
- **权限系统** - 组织架构、角色权限的树形结构管理和验证
- **框架开发** - 组件树、路由树等树形结构的构建和管理
- **数据管理** - 分类管理、评论系统、树形选择器等数据操作

## 📦 安装

```bash
npm install tree-processor
# 或
yarn add tree-processor
# 或
pnpm add tree-processor
```

## 🚀 快速开始

```javascript
import { mapTree, findTree, filterTree } from 'tree-processor'

const treeData = [
  {
    id: 1,
    name: 'node1',
    children: [
      { id: 2, name: 'node2' },
      { id: 3, name: 'node3' },
    ],
  },
]

// 获取所有节点名称
const names = mapTree(treeData, (node) => node.name)
console.log(names) // ['node1', 'node2', 'node3']

// 查找节点
const node = findTree(treeData, (n) => n.id === 2)
console.log(node) // { id: 2, name: 'node2' }

// 过滤节点
const filtered = filterTree(treeData, (n) => n.id > 1)
console.log(filtered) // [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

## 📖 API 文档

### 引入方式

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

### 示例数据

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

---

## 遍历操作方法

遍历树结构数据并对每个节点执行操作的方法。

### mapTree

遍历树结构数据，对每个节点执行回调函数，返回映射后的数组。

```javascript
// 获取所有节点的名称
const nodeNames = t.mapTree(treeData, (node) => node.name)
console.log(nodeNames) // ['node1', 'node2', 'node4', 'node5', 'node3', 'node6']

// 获取所有节点的ID
const nodeIds = t.mapTree(treeData, (node) => node.id)
console.log(nodeIds) // [1, 2, 4, 5, 3, 6]

// 修改节点数据
const modifiedNodes = t.mapTree(treeData, (node) => ({
  ...node,
  label: node.name
}))
console.log(modifiedNodes) // 返回包含 label 字段的新数组
```

### forEachTree

遍历树结构数据，对每个节点执行回调函数。与 mapTree 的区别是不返回值，性能更好，适合只需要遍历而不需要返回结果的场景。

```javascript
// 遍历所有节点并打印
t.forEachTree(treeData, (node) => {
    console.log(node)
})

// 修改节点属性
t.forEachTree(treeData, (node) => {
    node.visited = true
    node.timestamp = Date.now()
})

// 统计节点数量
let nodeCount = 0
t.forEachTree(treeData, () => {
    nodeCount++
})
console.log(nodeCount) // 节点总数
```

---

## 条件查找方法

通过条件或谓词函数查找节点的方法。

### filterTree

过滤树结构数据，返回满足条件的节点。

```javascript
// 过滤出名称包含 'node' 的节点
const filteredNodes = t.filterTree(treeData, (node) => {
    return node.name.includes('node')
})
console.log(filteredNodes) // 返回满足条件的节点数组

// 过滤出ID大于2的节点
const nodesWithLargeId = t.filterTree(treeData, (node) => node.id > 2)
console.log(nodesWithLargeId) // 返回ID大于2的节点数组

// 过滤出没有子节点的节点（叶子节点）
const leafNodes = t.filterTree(treeData, (node) => {
    return !node.children || node.children.length === 0
})
console.log(leafNodes) // 返回所有叶子节点
```

### findTree

查找树结构数据中满足条件的第一个节点。如果未找到，返回 null。

```javascript
// 查找ID为2的节点
const foundNode = t.findTree(treeData, (node) => node.id === 2)
console.log(foundNode) // 返回找到的节点对象，未找到返回 null

// 查找名称为 'node3' 的节点
const node3 = t.findTree(treeData, (node) => node.name === 'node3')
console.log(node3) // { id: 3, name: 'node3', children: [...] }

// 查找不存在的节点
const nodeNotFound = t.findTree(treeData, (node) => node.id === 999)
console.log(nodeNotFound) // null
```

### includesTree

检查树结构数据中是否包含指定ID的节点。

```javascript
const nodeId = 2
const hasNode = t.includesTree(treeData, nodeId)

console.log(hasNode) // true 表示包含该节点，false 表示不包含
```

### someTree

检查树结构数据中是否存在满足条件的节点。只要有一个节点满足条件就返回 true。

```javascript
// 检查是否存在名称为 'node2' 的节点
const hasNode2 = t.someTree(treeData, node => node.name === 'node2')
console.log(hasNode2) // true

// 检查是否存在ID大于10的节点
const hasLargeId = t.someTree(treeData, node => node.id > 10)
console.log(hasLargeId) // false
```

### everyTree

检查树结构数据中是否所有节点都满足条件。只有所有节点都满足条件才返回 true。

```javascript
// 检查所有节点的ID是否都大于0
const allIdsPositive = t.everyTree(treeData, node => node.id > 0)
console.log(allIdsPositive) // true

// 检查所有节点是否都有 name 属性
const allHaveName = t.everyTree(treeData, node => node.name)
console.log(allHaveName) // 根据实际数据返回 true 或 false
```

---

## 索引访问方法

通过位置索引或索引路径访问节点的方法。

### atTree

根据父节点ID和子节点索引获取节点。支持负数索引，和数组的 at 方法一样。未找到返回 null。

```javascript
// 获取ID为1的节点的第一个子节点（索引0）
const firstChildNode = t.atTree(treeData, 1, 0)
console.log(firstChildNode) // 返回第一个子节点

// 获取最后一个子节点（负数索引）
const lastChildNode = t.atTree(treeData, 1, -1)
console.log(lastChildNode) // 返回最后一个子节点

// 索引超出范围返回 null
const nodeNotFound = t.atTree(treeData, 1, 10)
console.log(nodeNotFound) // null
```

### indexOfTree

返回一个数组，值为从根节点开始到 targetId 所在节点的索引路径。未找到返回 null。返回值可以传入 atIndexOfTree 的第二个参数进行取值。

```javascript
// 获取ID为4的节点的索引路径
const nodePath = t.indexOfTree(treeData, 4)
console.log(nodePath) // [0, 0, 0] 表示根节点 -> 第一个子节点 -> 第一个子节点

// 未找到节点返回 null
const pathNotFound = t.indexOfTree(treeData, 999)
console.log(pathNotFound) // null

// 结合 atIndexOfTree 使用
const indexPath = t.indexOfTree(treeData, 4)
const nodeByPath = t.atIndexOfTree(treeData, indexPath)
console.log(nodeByPath) // 获取到ID为4的节点
```

### atIndexOfTree

根据索引路径获取节点。路径无效或超出范围返回 null。

```javascript
// 根据索引路径获取节点
const nodeByIndexPath = t.atIndexOfTree(treeData, [0, 1, 0])
console.log(nodeByIndexPath) // 返回对应路径的节点对象

// 结合 indexOfTree 使用
const targetPath = t.indexOfTree(treeData, 4)
const targetNode = t.atIndexOfTree(treeData, targetPath)
console.log(targetNode) // 获取到ID为4的节点

// 路径无效返回 null
const invalidPath = t.atIndexOfTree(treeData, [999])
console.log(invalidPath) // null
```

---

## 节点操作方法

对树结构进行增删改操作的方法（添加、删除、移除节点等）。

### pushTree

在指定节点下添加子节点到末尾。返回 true 表示添加成功，false 表示未找到目标节点。

```javascript
// 在ID为1的节点下添加新子节点
const addSuccess = t.pushTree(treeData, 1, { id: 7, name: 'node7' })
console.log(addSuccess) // true
console.log(treeData) // 新节点已添加到 children 数组末尾

// 尝试在不存在的节点下添加
const addFailed = t.pushTree(treeData, 999, { id: 8, name: 'node8' })
console.log(addFailed) // false，未找到目标节点
```

### unshiftTree

在指定节点下添加子节点到开头。返回 true 表示添加成功，false 表示未找到目标节点。

```javascript
// 在ID为1的节点下添加新子节点到开头
const unshiftSuccess = t.unshiftTree(treeData, 1, { id: 7, name: 'node7' })
console.log(unshiftSuccess) // true
console.log(treeData) // 新节点已添加到 children 数组开头
```

### popTree

删除指定节点下的最后一个子节点。返回被删除的节点，如果节点不存在或没有子节点则返回 null。

```javascript
// 删除ID为1的节点下的最后一个子节点
const removedNode = t.popTree(treeData, 1)
console.log(removedNode) // 返回被删除的节点对象，或 null

// 尝试删除不存在的节点下的子节点
const popFailed = t.popTree(treeData, 999)
console.log(popFailed) // null
```

### shiftTree

删除指定节点下的第一个子节点。返回被删除的节点，如果节点不存在或没有子节点则返回 null。

```javascript
// 删除ID为1的节点下的第一个子节点
const shiftedNode = t.shiftTree(treeData, 1)
console.log(shiftedNode) // 返回被删除的节点对象，或 null

// 尝试删除不存在的节点下的子节点
const shiftFailed = t.shiftTree(treeData, 999)
console.log(shiftFailed) // null
```

### removeTree

删除树结构数据中指定ID的节点，包括根节点和子节点。

```javascript
const nodeIdToRemove = 2
const removeSuccess = t.removeTree(treeData, nodeIdToRemove)

console.log(removeSuccess) // true 表示删除成功，false 表示未找到节点
console.log(treeData) // 删除后的树结构
```

### concatTree

连接多个树结构数据，返回连接后的新树（深拷贝）。

```javascript
const tree1 = [
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' }
]
const tree2 = [
  { id: 3, name: 'node3' }
]

// 连接多个树
const result = t.concatTree(tree1, tree2)
console.log(result) // [{ id: 1, name: 'node1' }, { id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

**参数说明：**
- `...trees`: 多个树结构数据数组（可变参数）

**注意事项：**
- 所有树都会被深拷贝，不会修改原树
- 支持连接任意数量的树结构

### sortTree

对树结构数据进行排序，递归排序所有层级。

```javascript
const tree = [
  { id: 3, name: 'node3' },
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' }
]

// 按 id 排序
const sorted = t.sortTree(tree, (a, b) => a.id - b.id)
console.log(sorted) 
// [{ id: 1, name: 'node1' }, { id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

**参数说明：**
- `tree`: 树结构数据
- `compareFn`: 比较函数，与 `Array.sort` 的 `compareFn` 相同（可选）
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 递归排序所有层级的节点
- 返回排序后的新树（深拷贝），不修改原树
- 如果不提供 `compareFn`，将使用默认排序

### sliceTree

对树结构数据的根节点进行切片操作（类似数组的 `slice`）。

```javascript
const tree = [
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' },
  { id: 3, name: 'node3' }
]

// 切片：获取索引 1 到 3 的节点
const sliced = t.sliceTree(tree, 1, 3)
console.log(sliced) // [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }]

// 支持负数索引
const lastTwo = t.sliceTree(tree, -2)
console.log(lastTwo) // [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

**参数说明：**
- `tree`: 树结构数据
- `start`: 起始索引（包含），可选
- `end`: 结束索引（不包含），可选
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 仅对根节点进行切片，不递归处理子节点
- 返回切片后的新树（深拷贝），不修改原树
- 支持负数索引（从末尾开始计算）
- 子节点结构会被完整保留

### dedupTree

树结构对象数组去重方法，根据指定的键去除重复节点。保留第一次出现的节点。支持单字段、多字段联合去重和自定义函数。

**参数说明：**
- `tree`: 树结构数据
- `dedupKey`: 用于去重的键名，支持三种类型：
  - `string`: 单字段去重（如 `'id'`）
  - `string[]`: 多字段联合去重（如 `['id', 'type']`）
  - `(node: TreeNode) => any`: 自定义函数，返回用于去重的值
- `fieldNames`: 自定义字段名配置（可选）

```javascript
// 方式1：单字段去重（原有用法）
const uniqueTreeData = t.dedupTree(treeData, 'id')
console.log(uniqueTreeData) // 返回去重后的树结构数据

// 方式2：多字段联合去重（新功能）
const tree = [
  {
    id: 1,
    children: [
      { id: 2, type: 'A', name: 'node1' },
      { id: 2, type: 'B', name: 'node2' }, // 保留（id相同但type不同）
      { id: 2, type: 'A', name: 'node3' }, // 去重（id和type都相同）
    ]
  }
]
const uniqueByMultiFields = t.dedupTree(tree, ['id', 'type'])
// 结果：保留 node1 和 node2，node3 被去重

// 方式3：自定义函数去重
const uniqueByCustom = t.dedupTree(treeData, (node) => node.code)
// 或更复杂的逻辑
const uniqueByComplex = t.dedupTree(treeData, (node) => `${node.id}-${node.type}`)
```

**注意事项：**
- 如果 dedupKey 值为 `undefined` 或 `null`，节点不会被去重（会全部保留）
- 多字段联合去重使用字段值的组合来判断重复
- 递归处理所有层级的子节点
- **性能优化**：多字段联合去重已优化，使用高效的分隔符连接方式替代 JSON.stringify，提升性能

---

## 格式转换方法

在不同数据格式之间转换的方法（数组、Map、对象等格式转换）。

### convertToArrayTree

将树结构数据扁平化为数组。返回的数组中每个节点都不包含 `children` 字段。

```javascript
// 将树结构扁平化为数组
const array = t.convertToArrayTree(treeData)
console.log(array) 
// [
//   { id: 1, name: 'node1' },
//   { id: 2, name: 'node2' },
//   { id: 4, name: 'node4' },
//   { id: 5, name: 'node5' },
//   { id: 3, name: 'node3' },
//   { id: 6, name: 'node6' }
// ]

// 注意：返回的节点不包含 children 字段
array.forEach(node => {
  console.log(node.children) // undefined
})

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'node1',
    subNodes: [
      { nodeId: 2, name: 'node2' }
    ]
  }
]
const customArray = t.convertToArrayTree(customTree, {
  children: 'subNodes',
  id: 'nodeId'
})
console.log(customArray) // 扁平化后的数组，不包含 subNodes 字段
```

### convertToMapTree

将树结构数据转换为 Map，key 为节点 ID，value 为节点对象（不包含 children 字段）。适用于需要快速通过 ID 查找节点的场景。

```javascript
// 将树结构转换为 Map
const map = t.convertToMapTree(treeData)
console.log(map instanceof Map) // true
console.log(map.size) // 6

// 通过 ID 快速查找节点
const node = map.get(2)
console.log(node) // { id: 2, name: 'node2' }
console.log(node.children) // undefined（不包含 children 字段）

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'node1',
    subNodes: [
      { nodeId: 2, name: 'node2' }
    ]
  }
]
const customMap = t.convertToMapTree(customTree, {
  children: 'subNodes',
  id: 'nodeId'
})
console.log(customMap.get(1)) // { nodeId: 1, name: 'node1' }
```

### convertToLevelArrayTree

将树结构数据转换为层级数组（二维数组），按深度分组。外层数组按深度索引，内层数组包含该深度的所有节点。

```javascript
// 将树结构转换为层级数组
const levelArray = t.convertToLevelArrayTree(treeData)
console.log(levelArray)
// [
//   [{ id: 1, name: 'node1' }],           // 第 0 层
//   [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }],  // 第 1 层
//   [{ id: 4, name: 'node4' }, { id: 5, name: 'node5' }, { id: 6, name: 'node6' }]  // 第 2 层
// ]

// 遍历每一层
levelArray.forEach((level, depth) => {
  console.log(`深度 ${depth}:`, level)
})

// 注意：返回的节点不包含 children 字段
levelArray[0][0].children // undefined

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'node1',
    subNodes: [
      { nodeId: 2, name: 'node2' }
    ]
  }
]
const customLevelArray = t.convertToLevelArrayTree(customTree, {
  children: 'subNodes',
  id: 'nodeId'
})
console.log(customLevelArray) // 按层级分组的数组
```

### convertToObjectTree

将单根树结构数据转换为对象。如果树只有一个根节点，返回该节点对象；否则返回 `null`。

```javascript
// 单根树转换为对象
const singleRootTree = [
  {
    id: 1,
    name: 'node1',
    value: 100,
    children: [
      { id: 2, name: 'node2' }
    ]
  }
]
const rootNode = t.convertToObjectTree(singleRootTree)
console.log(rootNode) 
// {
//   id: 1,
//   name: 'node1',
//   value: 100,
//   children: [{ id: 2, name: 'node2' }]
// }

// 多个根节点返回 null
const multiRootTree = [
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' }
]
const result = t.convertToObjectTree(multiRootTree)
console.log(result) // null

// 空树返回 null
const emptyTree = []
const emptyResult = t.convertToObjectTree(emptyTree)
console.log(emptyResult) // null
```

### convertBackTree

将各种数据结构转换为树结构数据。支持数组、Map、Record（对象）等格式。数组中的每个元素需要包含 `id` 和 `parentId` 字段。

```javascript
// 将扁平数组转换为树结构
const array = [
  { id: 1, name: 'node1', parentId: null },
  { id: 2, name: 'node2', parentId: 1 },
  { id: 3, name: 'node3', parentId: 1 },
  { id: 4, name: 'node4', parentId: 2 },
  { id: 5, name: 'node5', parentId: 2 },
  { id: 6, name: 'node6', parentId: 3 }
]
const tree = t.convertBackTree(array)
console.log(tree)
// [
//   {
//     id: 1,
//     name: 'node1',
//     children: [
//       {
//         id: 2,
//         name: 'node2',
//         children: [
//           { id: 4, name: 'node4', children: [] },
//           { id: 5, name: 'node5', children: [] }
//         ]
//       },
//       {
//         id: 3,
//         name: 'node3',
//         children: [
//           { id: 6, name: 'node6', children: [] }
//         ]
//       }
//     ]
//   }
// ]

// 自定义根节点的 parentId 值
const arrayWithZero = [
  { id: 1, name: 'node1', parentId: 0 },
  { id: 2, name: 'node2', parentId: 1 }
]
const treeWithZero = t.convertBackTree(arrayWithZero, { rootParentId: 0 })
console.log(treeWithZero) // 正确转换

// 自定义 parentId 字段名
const arrayWithPid = [
  { id: 1, name: 'node1', pid: null },
  { id: 2, name: 'node2', pid: 1 }
]
const treeWithPid = t.convertBackTree(arrayWithPid, { parentIdField: 'pid' })
console.log(treeWithPid) // 正确转换

// 支持自定义字段名
const customArray = [
  { nodeId: 1, name: 'node1', parentId: null },
  { nodeId: 2, name: 'node2', parentId: 1 }
]
const customTree = t.convertBackTree(customArray, {
  fieldNames: { id: 'nodeId', children: 'subNodes' }
})
console.log(customTree)
// [
//   {
//     nodeId: 1,
//     name: 'node1',
//     subNodes: [
//       { nodeId: 2, name: 'node2', subNodes: [] }
//     ]
//   }
// ]

// 处理多个根节点
const multiRootArray = [
  { id: 1, name: 'root1', parentId: null },
  { id: 2, name: 'root2', parentId: null },
  { id: 3, name: 'child1', parentId: 1 }
]
const multiRootTree = t.convertBackTree(multiRootArray)
console.log(multiRootTree) // 包含两个根节点
```

**参数说明：**
- `data` - 支持多种数据格式：
  - 数组：扁平数组，每个元素需要包含 `id` 和 `parentId` 字段
  - Map：key 为节点 ID，value 为节点对象
  - Record（对象）：key 为节点 ID，value 为节点对象
  - 单个对象：单个树节点对象
- `options.rootParentId` - 根节点的 parentId 值，默认为 `null`
- `options.parentIdField` - 父节点ID字段名，默认为 `'parentId'`
- `options.fieldNames` - 自定义字段名配置，支持自定义 `id` 和 `children` 字段名

**注意事项：**
- 如果节点的 `parentId` 找不到对应的父节点，该节点会被作为根节点处理
- 没有 `id` 的节点会被跳过
- `parentId` 为 `null`、`undefined` 或等于 `rootParentId` 的节点会被视为根节点
- Map 和 Record 格式转换时，key 会被设置为节点的 `id`

**示例：支持 Map 和 Record 格式**

```javascript
// Map 格式
const map = new Map([
  [1, { name: 'node1', parentId: null }],
  [2, { name: 'node2', parentId: 1 }]
])
const treeFromMap = t.convertBackTree(map)
console.log(treeFromMap) // 正确转换为树结构

// Record 格式
const record = {
  1: { name: 'node1', parentId: null },
  2: { name: 'node2', parentId: 1 }
}
const treeFromRecord = t.convertBackTree(record)
console.log(treeFromRecord) // 正确转换为树结构
```

---

## 克隆复制方法

复制树结构数据的方法（深拷贝、浅拷贝、子树拷贝等）。

### cloneTree

深拷贝树结构数据，返回完全独立的副本，不修改原树。

```javascript
const original = [
  { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }
]

// 深拷贝
const cloned = t.cloneTree(original)

// 修改克隆的树不会影响原树
cloned[0].name = 'modified'
console.log(original[0].name) // 'node1'
console.log(cloned[0].name)   // 'modified'
```

**参数说明：**
- `tree`: 树结构数据
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 递归深拷贝所有层级的节点和子节点
- 返回的树与原树完全独立，修改不会相互影响
- 支持自定义字段名配置

### shallowCloneTree

浅拷贝树结构数据（只拷贝第一层，子节点共享引用）。性能比深拷贝更好，适合只需要拷贝顶层结构的场景。

```javascript
const original = [
  { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }
]

// 浅拷贝
const cloned = t.shallowCloneTree(original)

// 修改第一层不会影响原树
cloned[0].name = 'modified'
console.log(original[0].name) // 'node1'

// 但子节点共享引用，修改子节点会影响原树
cloned[0].children[0].name = 'changed'
console.log(original[0].children[0].name) // 'changed'
```

**参数说明：**
- `tree`: 树结构数据
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 只拷贝第一层节点，子节点保持引用共享
- 性能比深拷贝更好，适合只需要顶层独立的场景
- 修改子节点会影响原树

### cloneSubtree

从指定节点开始拷贝子树。返回包含目标节点及其所有子节点的深拷贝。支持按任意字段查找节点。

```javascript
const tree = [
  {
    id: 1,
    name: 'root',
    children: [
      { id: 2, name: 'sub1', children: [{ id: 4, name: 'sub1-1' }] },
      { id: 3, name: 'sub2' }
    ]
  }
]

// 按 id 字段查找
const subtree1 = t.cloneSubtree(tree, { id: 2 })
console.log(subtree1)
// [{ id: 2, name: 'sub1', children: [{ id: 4, name: 'sub1-1' }] }]

// 按 name 字段查找
const subtree2 = t.cloneSubtree(tree, { name: 'sub1' })
console.log(subtree2)
// [{ id: 2, name: 'sub1', children: [{ id: 4, name: 'sub1-1' }] }]

// 按其他字段查找（如 code）
const treeWithCode = [
  {
    id: 1,
    code: 'A001',
    children: [
      { id: 2, code: 'B001', children: [{ id: 4, code: 'C001' }] }
    ]
  }
]
const subtree3 = t.cloneSubtree(treeWithCode, { code: 'B001' })
console.log(subtree3)
// [{ id: 2, code: 'B001', children: [{ id: 4, code: 'C001' }] }]

// 支持自定义 children 字段名
const customTree = [
  { nodeId: 1, subNodes: [{ nodeId: 2 }] }
]
const subtree4 = t.cloneSubtree(customTree, { nodeId: 2 }, { children: 'subNodes', id: 'nodeId' })
console.log(subtree4)
// [{ nodeId: 2 }]

// 修改拷贝的子树不会影响原树
subtree1[0].name = 'modified'
console.log(tree[0].children[0].name) // 'sub1'
```

**参数说明：**
- `tree`: 树结构数据
- `target`: 目标节点对象，例如 `{ id: 1 }` 或 `{ name: 'sub1' }` 或 `{ code: 'B001' }`，对象只能包含一个字段
- `fieldNames`: 自定义字段名配置（可选，用于自定义 `children` 字段名，查找字段由 `target` 对象的键名决定）

**注意事项：**
- 返回包含目标节点的子树（深拷贝）
- 如果未找到目标节点，返回空数组
- 递归深拷贝所有子节点
- 必须传入对象形式，查找字段由对象的键名决定（如 `{ id: 1 }` 表示按 `id` 字段查找，`{ name: 'xxx' }` 表示按 `name` 字段查找）
- `fieldNames` 参数用于自定义 `children` 字段名，定义 `id` 不生效

### cloneWithTransform

拷贝树结构数据并对每个节点应用转换函数。适合在拷贝的同时修改节点数据。

```javascript
const tree = [
  { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }
]

// 拷贝并添加 label 字段
const cloned = t.cloneWithTransform(tree, (node) => ({
  ...node,
  label: node.name,
  processed: true
}))

console.log(cloned[0].label) // 'node1'
console.log(cloned[0].processed) // true
console.log(cloned[0].children[0].label) // 'node2'
console.log(tree[0].label) // undefined（原树未修改）
```

**参数说明：**
- `tree`: 树结构数据
- `transform`: 转换函数，接收节点并返回转换后的节点
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 递归转换所有层级的节点
- 返回转换后的树（深拷贝），不修改原树
- 转换函数应该返回新的节点对象

---

## 关系查询方法

获取节点之间关系信息的方法（父子关系、兄弟关系、深度等）。

### getParentTree

获取指定节点的父节点。如果节点是根节点或未找到，返回 null。

```javascript
// 获取ID为2的节点的父节点
const parentNode = t.getParentTree(treeData, 2)
console.log(parentNode) // 返回父节点对象 { id: 1, name: 'node1', ... }

// 根节点没有父节点，返回 null
const rootParentNode = t.getParentTree(treeData, 1)
console.log(rootParentNode) // null

// 未找到节点返回 null
const parentNotFound = t.getParentTree(treeData, 999)
console.log(parentNotFound) // null
```

### getChildrenTree

获取指定节点的所有直接子节点。如果未找到节点或没有子节点，返回空数组。

```javascript
// 获取ID为1的节点的所有子节点
const children = t.getChildrenTree(treeData, 1)
console.log(children) // 返回子节点数组 [{ id: 2, ... }, { id: 3, ... }]

// 节点没有子节点，返回空数组
const emptyChildren = t.getChildrenTree(treeData, 4)
console.log(emptyChildren) // []

// 未找到节点返回空数组
const notFound = t.getChildrenTree(treeData, 999)
console.log(notFound) // []

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'root',
    subNodes: [
      { nodeId: 2, name: 'child1' },
      { nodeId: 3, name: 'child2' },
    ],
  },
];
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const customChildren = t.getChildrenTree(customTree, 1, fieldNames)
console.log(customChildren) // 返回子节点数组
```

### getSiblingsTree

获取指定节点的所有兄弟节点（包括自己）。如果未找到节点，返回空数组。根节点的兄弟节点是其他根节点。

```javascript
// 获取ID为2的节点的所有兄弟节点（包括自己）
const siblings = t.getSiblingsTree(treeData, 2)
console.log(siblings) // 返回兄弟节点数组 [{ id: 2, ... }, { id: 3, ... }]

// 根节点的兄弟节点是其他根节点
const multiRoot = [
  { id: 1, children: [{ id: 2 }] },
  { id: 3, children: [{ id: 4 }] },
];
const rootSiblings = t.getSiblingsTree(multiRoot, 1)
console.log(rootSiblings) // 返回所有根节点 [{ id: 1, ... }, { id: 3, ... }]

// 未找到节点返回空数组
const notFound = t.getSiblingsTree(treeData, 999)
console.log(notFound) // []

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'root',
    subNodes: [
      { nodeId: 2, name: 'child1' },
      { nodeId: 3, name: 'child2' },
      { nodeId: 4, name: 'child3' },
    ],
  },
];
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const customSiblings = t.getSiblingsTree(customTree, 2, fieldNames)
console.log(customSiblings) // 返回兄弟节点数组（包括自己）
```

### getNodeDepthMap

返回一个字典，键代表节点的 id，值代表该节点在数据的第几层。深度从1开始，根节点深度为1。

```javascript
// 获取所有节点的深度映射
const nodeDepthMap = t.getNodeDepthMap(treeData)
console.log(nodeDepthMap) // { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3 }

// 获取特定节点的深度
const node2Depth = nodeDepthMap[2]
console.log(node2Depth) // 2

// 空树返回空对象
const emptyDepthMap = t.getNodeDepthMap([])
console.log(emptyDepthMap) // {}
```

### getNodeDepth

获取指定节点的深度。深度从1开始，根节点深度为1。

```javascript
// 获取根节点的深度
const rootDepth = t.getNodeDepth(treeData, 1)
console.log(rootDepth) // 1

// 获取子节点的深度
const childDepth = t.getNodeDepth(treeData, 2)
console.log(childDepth) // 2

// 获取深层节点的深度
const deepDepth = t.getNodeDepth(treeData, 4)
console.log(deepDepth) // 3

// 未找到节点返回 null
const notFound = t.getNodeDepth(treeData, 999)
console.log(notFound) // null

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'root',
    subNodes: [
      { nodeId: 2, name: 'child' },
    ],
  },
];
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const depth = t.getNodeDepth(customTree, 2, fieldNames)
console.log(depth) // 2
```

**与 getNodeDepthMap 的区别：**
- `getNodeDepthMap` - 批量获取所有节点的深度（一次性计算所有节点）
- `getNodeDepth` - 只获取单个节点的深度（只计算目标节点，效率更高）

---

## 数据验证方法

验证树结构数据有效性和节点类型的方法。

### isLeafNode

检查节点是否是叶子节点（没有子节点）。轻量级方法，只检查节点本身，不遍历树。

```javascript
// 没有 children 字段的节点是叶子节点
const leafNode1 = { id: 1, name: 'node1' };
console.log(t.isLeafNode(leafNode1)) // true

// children 为空数组的节点是叶子节点
const leafNode2 = { id: 2, name: 'node2', children: [] };
console.log(t.isLeafNode(leafNode2)) // true

// 有子节点的节点不是叶子节点
const parentNode = {
  id: 3,
  name: 'node3',
  children: [{ id: 4, name: 'node4' }],
};
console.log(t.isLeafNode(parentNode)) // false

// 在 filterTree 中使用（过滤出所有叶子节点）
const leafNodes = t.filterTree(treeData, (node) => t.isLeafNode(node))
console.log(leafNodes) // 返回所有叶子节点

// 在 forEachTree 中使用
t.forEachTree(treeData, (node) => {
  if (t.isLeafNode(node)) {
    console.log('叶子节点:', node.name)
  }
})

// 支持自定义字段名
const customNode = {
  nodeId: 1,
  name: 'node1',
  subNodes: [],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isLeafNode(customNode, fieldNames)) // true
```

**与现有方法的区别：**
- `isLeafNode` - 只检查单个节点，轻量级（O(1)），适合在遍历时使用
- `getChildrenTree` - 获取子节点数组，需要传入 tree 和 nodeId，需要查找节点（O(n)）

### isRootNode

检查节点是否是根节点（没有父节点）。根节点是树结构数据数组中的顶层节点。

**性能优化**：已优化为单次遍历，避免重复遍历树结构。

```javascript
// 检查根节点
const treeData = [
  {
    id: 1,
    name: 'root1',
    children: [{ id: 2, name: 'child1' }],
  },
];
console.log(t.isRootNode(treeData, 1)) // true
console.log(t.isRootNode(treeData, 2)) // false

// 多个根节点的情况
const multiRoot = [
  { id: 1, name: 'root1' },
  { id: 2, name: 'root2' },
  { id: 3, name: 'root3' },
];
console.log(t.isRootNode(multiRoot, 1)) // true
console.log(t.isRootNode(multiRoot, 2)) // true
console.log(t.isRootNode(multiRoot, 3)) // true

// 在遍历时使用
t.forEachTree(treeData, (node) => {
  if (t.isRootNode(treeData, node.id)) {
    console.log('根节点:', node.name)
  }
})

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    name: 'root1',
    subNodes: [{ nodeId: 2, name: 'child1' }],
  },
];
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isRootNode(customTree, 1, fieldNames)) // true
console.log(t.isRootNode(customTree, 2, fieldNames)) // false

// 节点不存在时返回 false
console.log(t.isRootNode(treeData, 999)) // false
```

**与现有方法的区别：**
- `isRootNode` - 语义化方法，直接返回布尔值
- `getParentTree` - 返回父节点对象，需要判断是否为 null
- `getNodeDepth` - 返回深度，需要判断是否等于 1

### isEmptyTreeData

检查树结构数据（数组）是否为空。空数组、null、undefined 都视为空。此函数支持 fieldNames 参数以保持 API 一致性，但该参数不生效（因为只检查数组是否为空，不访问 children 或 id 字段）。

```javascript
// 检查树结构数据是否为空
const isEmptyTree = t.isEmptyTreeData(treeData)
console.log(isEmptyTree) // false（有数据）

// 空数组返回 true
const isEmptyArray = t.isEmptyTreeData([])
console.log(isEmptyArray) // true

// null 或 undefined 返回 true
const isNullTree = t.isEmptyTreeData(null)
console.log(isNullTree) // true

// 支持 fieldNames 参数（保持 API 一致性，但不生效）
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const isEmptyWithFieldNames = t.isEmptyTreeData(treeData, fieldNames)
console.log(isEmptyWithFieldNames) // false（结果与不传 fieldNames 相同）
```

### isEmptySingleTreeData

检查单个树结构数据是否为空。如果数据不是有效的单个树结构数据、没有 children 字段，或者 children 是空数组，则视为空。如果有子节点（children 数组不为空），即使子节点本身是空的，树也不为空。

```javascript
// 没有 children 字段，视为空
const tree1 = { id: 1, name: 'node1' };
const isEmpty1 = t.isEmptySingleTreeData(tree1)
console.log(isEmpty1) // true

// children 是空数组，视为空
const tree2 = {
  id: 1,
  name: 'node1',
  children: [],
};
const isEmpty2 = t.isEmptySingleTreeData(tree2)
console.log(isEmpty2) // true

// 有子节点，不为空
const tree3 = {
  id: 1,
  name: 'node1',
  children: [
    { id: 2, name: 'node2' },
  ],
};
const isEmpty3 = t.isEmptySingleTreeData(tree3)
console.log(isEmpty3) // false

// 有子节点，即使子节点本身是空的，树也不为空
const tree4 = {
  id: 1,
  name: 'node1',
  children: [
    { id: 2, name: 'node2', children: [] },
    { id: 3, name: 'node3' }, // 没有children字段
  ],
};
const isEmpty4 = t.isEmptySingleTreeData(tree4)
console.log(isEmpty4) // false（因为有子节点，即使子节点是空的）

// 支持自定义字段名
const customTree = {
  nodeId: 1,
  name: 'node1',
  subNodes: [],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const isEmptyCustom = t.isEmptySingleTreeData(customTree, fieldNames)
console.log(isEmptyCustom) // true
```

### isTreeData

判断数据是否是树结构数据（数组）。树结构数据必须是一个数组，数组中的每个元素都必须是有效的单个树结构数据。

```javascript
// 有效的树结构数据（森林）
const forest = [
  {
    id: 1,
    name: 'node1',
    children: [{ id: 2, name: 'node2' }],
  },
  {
    id: 3,
    name: 'node3',
    children: [{ id: 4, name: 'node4' }],
  },
];
console.log(t.isTreeData(forest)) // true

// 空数组也是有效的树结构数据（空森林）
console.log(t.isTreeData([])) // true

// 单个对象不是树结构数据（应该用 isSingleTreeData）
console.log(t.isTreeData({ id: 1 })) // false

// 数组包含非树结构元素，返回 false
const invalidForest = [
  { id: 1, children: [{ id: 2 }] },
  'not a tree', // 无效元素
];
console.log(t.isTreeData(invalidForest)) // false

// null 或 undefined 不是有效的树结构数据
console.log(t.isTreeData(null)) // false
console.log(t.isTreeData(undefined)) // false

// 支持自定义字段名
const customForest = [
  {
    nodeId: 1,
    name: 'node1',
    subNodes: [{ nodeId: 2, name: 'node2' }],
  },
];
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isTreeData(customForest, fieldNames)) // true
```

### isSingleTreeData

判断数据是否是单个树结构数据（单个对象）。树结构数据必须是一个对象（不能是数组、null、undefined 或基本类型），如果存在 children 字段，必须是数组类型，并且会递归检查所有子节点。

```javascript
// 有效的单个树结构数据
const tree = {
  id: 1,
  name: 'node1',
  children: [
    { id: 2, name: 'node2' },
    { id: 3, name: 'node3' },
  ],
};
const isValid = t.isSingleTreeData(tree)
console.log(isValid) // true

// 没有 children 字段也是有效的（只有根节点）
const singleNode = { id: 1, name: 'node1' }
console.log(t.isSingleTreeData(singleNode)) // true

// 数组不是单个树结构数据
console.log(t.isSingleTreeData([])) // false

// null 或 undefined 不是有效的树结构数据
console.log(t.isSingleTreeData(null)) // false
console.log(t.isSingleTreeData(undefined)) // false

// children 不能是 null
const invalidTree = { id: 1, children: null }
console.log(t.isSingleTreeData(invalidTree)) // false

// 支持自定义字段名
const customTree = {
  nodeId: 1,
  name: 'node1',
  subNodes: [{ nodeId: 2, name: 'node2' }],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isSingleTreeData(customTree, fieldNames)) // true
```

### isValidTreeNode

检查单个节点是否是有效的树节点结构（轻量级，不递归检查子节点）。只检查节点本身的结构，不检查子节点。

```javascript
// 有效的树节点（有 children 数组）
const node1 = {
  id: 1,
  name: 'node1',
  children: [{ id: 2 }],
};
console.log(t.isValidTreeNode(node1)) // true

// 有效的树节点（没有 children 字段）
const node2 = { id: 1, name: 'node1' };
console.log(t.isValidTreeNode(node2)) // true

// 无效的树节点（children 不是数组）
const invalidNode = {
  id: 1,
  children: 'not an array',
};
console.log(t.isValidTreeNode(invalidNode)) // false

// 支持自定义字段名
const customNode = {
  nodeId: 1,
  subNodes: [{ nodeId: 2 }],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isValidTreeNode(customNode, fieldNames)) // true
```

**与 isSingleTreeData 的区别：**
- `isValidTreeNode` - 只检查单个节点的基本结构，不递归检查子节点（轻量级）
- `isSingleTreeData` - 递归检查整个树结构，确保所有子节点都是有效的树结构

### isTreeNodeWithCircularCheck

检查节点是否是有效的树节点结构，并检测循环引用。使用 WeakSet 跟踪已访问的节点，如果发现循环引用则返回 false。

```javascript
// 有效的树节点（无循环引用）
const validNode = {
  id: 1,
  children: [
    { id: 2, children: [{ id: 3 }] },
  ],
};
console.log(t.isTreeNodeWithCircularCheck(validNode)) // true

// 检测循环引用
const node1 = { id: 1, children: [] };
const node2 = { id: 2, children: [] };
node1.children.push(node2);
node2.children.push(node1); // 循环引用
console.log(t.isTreeNodeWithCircularCheck(node1)) // false

// 检测自引用
const selfRefNode = { id: 1, children: [] };
selfRefNode.children.push(selfRefNode); // 自引用
console.log(t.isTreeNodeWithCircularCheck(selfRefNode)) // false

// 支持自定义字段名
const customNode = {
  nodeId: 1,
  subNodes: [{ nodeId: 2 }],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isTreeNodeWithCircularCheck(customNode, fieldNames)) // true
```

**使用场景：**
- 在接收用户输入或外部数据时，检查是否有循环引用
- 数据验证，防止无限递归
- 调试时检查数据结构是否正确

### isSafeTreeDepth

检查树结构数据的深度是否安全（防止递归爆栈）。如果树的深度超过 `maxDepth`，返回 false。

```javascript
// 深度安全的树
const safeTree = [
  {
    id: 1,
    children: [
      { id: 2, children: [{ id: 3 }] },
    ],
  },
];
console.log(t.isSafeTreeDepth(safeTree, 10)) // true（深度为3，小于10）

// 深度超过最大深度
const deepTree = [
  {
    id: 1,
    children: [
      { id: 2, children: [{ id: 3 }] },
    ],
  },
];
console.log(t.isSafeTreeDepth(deepTree, 2)) // false（深度为3，超过2）

// 空树总是安全的
console.log(t.isSafeTreeDepth([], 10)) // true

// 单层树
const singleLayer = [{ id: 1 }, { id: 2 }];
console.log(t.isSafeTreeDepth(singleLayer, 1)) // true

// 支持自定义字段名
const customTree = [
  {
    nodeId: 1,
    subNodes: [
      { nodeId: 2, subNodes: [{ nodeId: 3 }] },
    ],
  },
];
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isSafeTreeDepth(customTree, 3, fieldNames)) // true
console.log(t.isSafeTreeDepth(customTree, 2, fieldNames)) // false
```

**使用场景：**
- 在处理大型树之前，先检查深度是否安全
- 防止递归调用栈溢出
- 性能优化，避免处理过深的树结构

---

## 聚合分析方法

对树结构数据进行聚合、统计和分析的方法。

### reduceTree

对树结构数据进行归约操作，遍历所有节点并累积结果。

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20, children: [{ id: 3, value: 30 }] }
]

// 计算所有节点值的总和
const sum = t.reduceTree(tree, (acc, node) => acc + (node.value || 0), 0)
console.log(sum) // 60

// 收集所有节点ID
const ids = t.reduceTree(tree, (ids, node) => {
  ids.push(node.id)
  return ids
}, [])
console.log(ids) // [1, 2, 3]
```

**参数说明：**
- `tree`: 树结构数据
- `reducer`: 归约函数，接收累加值和当前节点，返回新的累加值
- `initialValue`: 初始值
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 按深度优先顺序遍历所有节点
- 可以用于实现各种聚合操作

---

### aggregateTree

按分组聚合树结构数据，支持多种聚合操作（求和、平均值、最大值、最小值、计数）。

```javascript
const tree = [
  { id: 1, category: 'A', value: 10, score: 80 },
  { id: 2, category: 'A', value: 20, score: 90 },
  { id: 3, category: 'B', value: 30, score: 70, children: [{ id: 4, category: 'B', value: 40, score: 85 }] }
]

// 按 category 分组聚合
const result = t.aggregateTree(tree, {
  groupBy: node => node.category,
  aggregations: {
    totalValue: { operation: 'sum', field: 'value' },
    avgScore: { operation: 'avg', field: 'score' },
    maxValue: { operation: 'max', field: 'value' },
    count: { operation: 'count' }
  }
})

console.log(result)
// {
//   'A': { totalValue: 30, avgScore: 85, maxValue: 20, count: 2 },
//   'B': { totalValue: 70, avgScore: 77.5, maxValue: 40, count: 2 }
// }
```

**参数说明：**
- `tree`: 树结构数据
- `options`: 聚合选项
  - `groupBy`: 分组函数，接收节点并返回分组键
  - `aggregations`: 聚合配置对象，键为结果字段名，值为聚合配置
    - `operation`: 聚合操作类型（'sum' | 'avg' | 'max' | 'min' | 'count'）
    - `field`: 要聚合的字段名（count 操作不需要）
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 支持多种聚合操作同时进行
- 递归处理所有层级的节点
- count 操作统计节点数量，不需要 field 参数

---

### groupTree

按字段分组树结构数据，返回按字段值分组的节点数组。

```javascript
const tree = [
  { id: 1, category: 'A' },
  { id: 2, category: 'A' },
  { id: 3, category: 'B', children: [{ id: 4, category: 'B' }] }
]

// 按 category 字段分组
const grouped = t.groupTree(tree, 'category')
console.log(grouped)
// {
//   'A': [{ id: 1, category: 'A' }, { id: 2, category: 'A' }],
//   'B': [{ id: 3, category: 'B' }, { id: 4, category: 'B' }]
// }
```

**参数说明：**
- `tree`: 树结构数据
- `field`: 分组字段名
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 返回的节点是原节点的引用，不是深拷贝
- 递归处理所有层级的节点

---

### groupByTree

按条件分组树结构数据，使用自定义函数确定分组键。

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 10, children: [{ id: 4, value: 30 }] }
]

// 按 value 是否大于等于 20 分组
const grouped = t.groupByTree(tree, node => node.value >= 20 ? 'high' : 'low')
console.log(grouped)
// {
//   'low': [{ id: 1, value: 10 }, { id: 3, value: 10 }],
//   'high': [{ id: 2, value: 20 }, { id: 4, value: 30 }]
// }
```

**参数说明：**
- `tree`: 树结构数据
- `groupFn`: 分组函数，接收节点并返回分组键
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 分组键会被转换为字符串
- 返回的节点是原节点的引用，不是深拷贝

---

### sumTree

计算树结构数据中某个字段的总和。

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20, children: [{ id: 3, value: 30 }] }
]

// 计算 value 字段的总和
const total = t.sumTree(tree, 'value')
console.log(total) // 60
```

**参数说明：**
- `tree`: 树结构数据
- `field`: 字段名
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 缺失或 null/undefined 的值会被视为 0
- 递归处理所有层级的节点

---

### avgTree

计算树结构数据中某个字段的平均值。

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 }
]

// 计算 value 字段的平均值
const average = t.avgTree(tree, 'value')
console.log(average) // 20
```

**参数说明：**
- `tree`: 树结构数据
- `field`: 字段名
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 忽略 null 和 undefined 值
- 如果所有值都是 null/undefined，返回 0

---

### maxTree

获取树结构数据中某个字段的最大值。

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 30 },
  { id: 3, value: 20 }
]

// 获取 value 字段的最大值
const max = t.maxTree(tree, 'value')
console.log(max) // 30
```

**参数说明：**
- `tree`: 树结构数据
- `field`: 字段名
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 只处理数字类型的值
- 如果树为空或没有有效值，返回 null

---

### minTree

获取树结构数据中某个字段的最小值。

```javascript
const tree = [
  { id: 1, value: 30 },
  { id: 2, value: 10 },
  { id: 3, value: 20 }
]

// 获取 value 字段的最小值
const min = t.minTree(tree, 'value')
console.log(min) // 10
```

**参数说明：**
- `tree`: 树结构数据
- `field`: 字段名
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 只处理数字类型的值
- 如果树为空或没有有效值，返回 null

---

### countTree

统计树结构数据中满足条件的节点数量。

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 10, children: [{ id: 4, value: 30 }] }
]

// 统计所有节点
const total = t.countTree(tree)
console.log(total) // 4

// 统计满足条件的节点
const count = t.countTree(tree, node => node.value === 10)
console.log(count) // 2
```

**参数说明：**
- `tree`: 树结构数据
- `conditionFn`: 统计条件函数（可选），不传则统计所有节点
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 不传条件函数时统计所有节点
- 递归处理所有层级的节点

---

### getTreeStats

获取树结构数据的综合统计信息。

```javascript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }
]

// 获取统计信息
const stats = t.getTreeStats(tree)
console.log(stats)
// {
//   totalNodes: 4,      // 总节点数
//   leafNodes: 2,        // 叶子节点数
//   maxDepth: 3,        // 最大深度
//   minDepth: 1,        // 最小深度
//   avgDepth: 2,        // 平均深度
//   levels: 3            // 层级数（等于最大深度）
// }
```

**参数说明：**
- `tree`: 树结构数据
- `fieldNames`: 自定义字段名配置（可选）

**注意事项：**
- 返回完整的统计信息对象
- 空树返回所有值为 0 的统计信息

---

### analyzeTree

全面分析树结构数据，提供详细的统计信息、分布情况、平衡性分析等。

```javascript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }
]

// 全面分析树结构
const analysis = t.analyzeTree(tree)
console.log(analysis)
// {
//   // 基础统计
//   totalNodes: 4,           // 总节点数
//   leafNodes: 2,            // 叶子节点数
//   internalNodes: 2,        // 内部节点数
//   maxDepth: 3,             // 最大深度
//   minDepth: 1,             // 最小深度
//   avgDepth: 2,             // 平均深度
//   levels: 3,                // 层级数
//   
//   // 层级分析
//   byLevel: { 0: 1, 1: 2, 2: 1 },  // 按层级统计节点数
//   maxWidth: 2,              // 最大宽度（单层最多节点数）
//   avgWidth: 1.33,          // 平均宽度
//   widthByLevel: { 0: 1, 1: 2, 2: 1 },  // 每层宽度
//   
//   // 分支因子分析
//   avgBranchingFactor: 1.5,  // 平均分支因子（平均子节点数）
//   maxBranchingFactor: 2,      // 最大分支因子
//   minBranchingFactor: 1,      // 最小分支因子
//   branchingFactorDistribution: { 1: 1, 2: 1 },  // 分支因子分布
//   
//   // 深度分布
//   depthDistribution: { 1: 1, 2: 2, 3: 1 },  // 按深度统计节点数
//   
//   // 平衡性分析
//   depthVariance: 0.5,       // 深度方差（越小越平衡）
//   isBalanced: true,          // 是否平衡
//   balanceRatio: 0.33,        // 平衡比率（minDepth/maxDepth）
//   
//   // 路径分析
//   avgPathLength: 2.25,      // 平均路径长度
//   maxPathLength: 3,         // 最大路径长度
//   minPathLength: 1,         // 最小路径长度
//   
//   // 叶子节点分析
//   leafNodeRatio: 0.5,       // 叶子节点比例
//   leafNodesByLevel: { 2: 1, 3: 1 }  // 每层叶子节点数
// }
```

**参数说明：**
- `tree`: 树结构数据
- `options`: 分析选项（可选），可指定需要计算的统计项，默认计算所有统计项
  - `includeBasic`: 是否包含基础统计（totalNodes, leafNodes, internalNodes, maxDepth, minDepth, avgDepth, levels），默认 `true`
  - `includeLevelAnalysis`: 是否包含层级分析（byLevel, maxWidth, avgWidth, widthByLevel），默认 `true`
  - `includeBranchingFactor`: 是否包含分支因子分析（avgBranchingFactor, maxBranchingFactor, minBranchingFactor, branchingFactorDistribution），默认 `true`
  - `includeDepthDistribution`: 是否包含深度分布（depthDistribution），默认 `true`
  - `includeBalanceAnalysis`: 是否包含平衡性分析（depthVariance, isBalanced, balanceRatio），默认 `true`
  - `includePathAnalysis`: 是否包含路径分析（avgPathLength, maxPathLength, minPathLength），默认 `true`
  - `includeLeafAnalysis`: 是否包含叶子节点分析（leafNodeRatio, leafNodesByLevel），默认 `true`
- `fieldNames`: 自定义字段名配置（可选）

```javascript
// 只计算基础统计和分支因子（性能优化）
const quickAnalysis = t.analyzeTree(tree, {
  includeBasic: true,
  includeBranchingFactor: true,
  includeLevelAnalysis: false,
  includeDepthDistribution: false,
  includeBalanceAnalysis: false,
  includePathAnalysis: false,
  includeLeafAnalysis: false,
})
console.log(quickAnalysis.totalNodes) // 4
console.log(quickAnalysis.maxBranchingFactor) // 2
console.log(quickAnalysis.byLevel) // {} (未计算)

// 只计算平衡性分析
const balanceAnalysis = t.analyzeTree(tree, {
  includeBasic: true,
  includeBalanceAnalysis: true,
  includeLevelAnalysis: false,
  includeBranchingFactor: false,
  includeDepthDistribution: false,
  includePathAnalysis: false,
  includeLeafAnalysis: false,
})
console.log(balanceAnalysis.isBalanced) // true/false
console.log(balanceAnalysis.depthVariance) // 0.5
```

**返回的分析信息包括：**

1. **基础统计**：总节点数、叶子节点数、内部节点数、深度信息等
2. **层级分析**：每层节点数、最大宽度、平均宽度等
3. **分支因子分析**：平均/最大/最小分支因子、分支因子分布等
4. **深度分布**：每个深度的节点数量
5. **平衡性分析**：深度方差、是否平衡、平衡比率等
6. **路径分析**：平均/最大/最小路径长度
7. **叶子节点分析**：叶子节点比例、每层叶子节点数

**注意事项：**
- 提供全面的树结构分析，适合用于性能优化、结构评估等场景
- `isBalanced` 基于深度方差和深度范围判断，深度方差 < 2 且深度范围 ≤ 2 视为平衡
- `balanceRatio` 接近 1 表示树更平衡
- **性能优化**：通过 `options` 参数可以只计算需要的统计项，对于大型树结构可以显著提升性能

---

## 自定义字段名

所有方法都支持自定义 children 和 id 的属性名，通过最后一个参数传入配置对象：

```javascript
// 使用默认字段名
const foundNode1 = t.findTree(treeData, (node) => node.id === 2)

// 使用自定义字段名
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const foundNode2 = t.findTree(customTreeData, (node) => node.nodeId === 2, fieldNames);
```

**注意：** 所有 30 个函数都支持 `fieldNames` 参数，保持 API 一致性。即使某些函数（如 `isEmptyTreeData`）中该参数不生效，也可以传入以保持代码风格一致。

## 测试

### 运行测试

```bash
# 运行所有测试（自动打包后测试源码 + 打包文件，712 个测试用例）
npm test

# 运行所有测试（单次，不监听文件变化）
npm test -- --run

# 仅测试源代码（447 个测试用例）
npm run test:src

# 仅测试打包后的文件（447 个测试用例，需要先运行 npm run build）
npm run test:dist

# 运行测试并生成覆盖率报告
npm run test:coverage

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建项目（先删除 dist 目录，然后重新打包）
npm run build
```

<div align="center">

如果这个项目对你有帮助，请给它一个 ⭐️

Made with by [knott11]

</div>
