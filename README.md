# tree-processor

<div align="right">

[English](https://github.com/knott11/tree-processor/blob/main/README.en.md) | [中文](https://github.com/knott11/tree-processor/blob/main/README.md)

</div>

<div align="center">

![npm version](https://img.shields.io/npm/v/tree-processor?style=flat-square)
![npm downloads (2 months)](https://img.shields.io/badge/downloads-1.3K%2F2mo-brightgreen?style=flat-square)
![bundle size](https://img.shields.io/badge/bundle-8.4KB-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?style=flat-square)

一个轻量级的树结构数据处理工具库，使用 TypeScript 编写，支持 tree-shaking，每个格式打包体积约 **8.2-8.5 KB**（ESM: 8.24 KB，CJS: 8.51 KB，UMD: 8.52 KB）。


</div>

## 📋 目录

- [特性](#-特性)
  - [使用场景](#-使用场景)
- [安装](#-安装)
- [快速开始](#-快速开始)
- [API 文档](#-api-文档)
  - [遍历方法](#遍历方法)
  - [查找方法](#查找方法)
  - [访问方法](#访问方法)
  - [修改方法](#修改方法)
  - [转换方法](#转换方法)
  - [查询方法](#查询方法)
  - [验证方法](#验证方法)
- [自定义字段名](#自定义字段名)
- [测试](#测试)
- [开发](#开发)

## ✨ 特性

- **轻量级** - 每个格式打包体积仅 8.2-8.5 KB（ESM: 8.24 KB，CJS: 8.51 KB，UMD: 8.52 KB），对项目体积影响极小
- **支持 Tree-shaking** - 支持按需导入，只打包实际使用的代码，进一步减小打包体积
- **完整的 TypeScript 支持** - 提供完整的类型定义和智能提示，提升开发体验
- **灵活的自定义字段名** - 支持自定义 children 和 id 字段名，适配各种数据结构
- **零依赖** - 无任何外部依赖，开箱即用，无需担心依赖冲突
- **完善的测试覆盖** - 包含 328 个测试用例，测试覆盖率达到 99%+（语句覆盖率 99%，分支覆盖率 98.41%，函数覆盖率 100%，行覆盖率 98.99%），覆盖基础功能、边界情况、异常处理、复杂场景等
- **丰富的 API** - 提供 32+ 个方法，包含类似数组的 API（map、filter、find、some、every等），以及树结构特有的操作（获取父子节点、深度计算、数据验证、格式转换等），涵盖遍历、查找、修改、转换、判断等完整场景

**已支持的方法：** mapTree、forEachTree、filterTree、findTree、pushTree、unshiftTree、popTree、shiftTree、someTree、everyTree、includesTree、atTree、indexOfTree、atIndexOfTree、dedupTree、removeTree、getParentTree、getChildrenTree、getSiblingsTree、getNodeDepthMap、getNodeDepth、isLeafNode、isRootNode、isEmptyTreeData、isEmptySingleTreeData、isTreeData、isSingleTreeData、isValidTreeNode、isTreeNodeWithCircularCheck、isSafeTreeDepth、convertToArrayTree、convertBackTree、convertToMapTree、convertToLevelArrayTree、convertToObjectTree。每个方法的最后一个参数可以自定义 children 和 id 的属性名。

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

## 遍历方法

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

## 查找方法

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

## 访问方法

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

## 修改方法

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

删除指定节点下的最后一个子节点。返回被删除的节点，如果节点不存在或没有子节点则返回 false。

```javascript
// 删除ID为1的节点下的最后一个子节点
const removedNode = t.popTree(treeData, 1)
console.log(removedNode) // 返回被删除的节点对象，或 false

// 尝试删除不存在的节点下的子节点
const popFailed = t.popTree(treeData, 999)
console.log(popFailed) // false
```

### shiftTree

删除指定节点下的第一个子节点。返回被删除的节点，如果节点不存在或没有子节点则返回 false。

```javascript
// 删除ID为1的节点下的第一个子节点
const shiftedNode = t.shiftTree(treeData, 1)
console.log(shiftedNode) // 返回被删除的节点对象，或 false
```

### removeTree

删除树结构数据中指定ID的节点，包括根节点和子节点。

```javascript
const nodeIdToRemove = 2
const removeSuccess = t.removeTree(treeData, nodeIdToRemove)

console.log(removeSuccess) // true 表示删除成功，false 表示未找到节点
console.log(treeData) // 删除后的树结构
```

### dedupTree

树结构对象数组去重方法，根据指定的键去除重复节点。保留第一次出现的节点。

```javascript
// 根据 id 字段去重
const uniqueTreeData = t.dedupTree(treeData, 'id')
console.log(uniqueTreeData) // 返回去重后的树结构数据

// 根据 name 字段去重
const uniqueByNameTree = t.dedupTree(treeData, 'name')
console.log(uniqueByNameTree) // 返回根据 name 去重后的数据
```

---

## 转换方法

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

## 查询方法

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

## 验证方法

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
# 运行所有测试（自动打包后测试源码 + 打包文件，656 个测试用例）
npm test

# 运行所有测试（单次，不监听文件变化）
npm test -- --run

# 仅测试源代码（328 个测试用例）
npm run test:src

# 仅测试打包后的文件（328 个测试用例，需要先运行 npm run build）
npm run test:dist

# 运行测试并生成覆盖率报告
npm run test:coverage
```

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
