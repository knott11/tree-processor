# tree-processor

<div align="right">

[English](https://github.com/knott11/tree-processor/blob/main/README.en.md) | [中文](https://github.com/knott11/tree-processor/blob/main/README.md)

</div>

<div align="center">

![version](https://img.shields.io/npm/v/tree-processor?style=flat-square&label=version)
![npm downloads (2 months)](https://img.shields.io/badge/downloads-1.8K%2F2mo-brightgreen?style=flat-square)
![bundle size](https://img.shields.io/badge/bundle-15KB-blue?style=flat-square)
![performance](https://img.shields.io/badge/performance-%3C%200.03ms-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![coverage](https://img.shields.io/badge/coverage-97%25-green?style=flat-square)

A lightweight tree-structured data processing utility library written in TypeScript, providing 50+ APIs including traversal, search, modification, conversion, query, analysis, and validation.


</div>

## 📋 Table of Contents

- [Features](#-features)
  - [Use Cases](#-use-cases)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
  - [Traversal Operation Methods](#traversal-operation-methods)
  - [Conditional Search Methods](#conditional-search-methods)
  - [Index Access Methods](#index-access-methods)
  - [Node Operation Methods](#node-operation-methods)
  - [Format Conversion Methods](#format-conversion-methods)
  - [Clone and Copy Methods](#clone-and-copy-methods)
  - [Relationship Query Methods](#relationship-query-methods)
  - [Data Validation Methods](#data-validation-methods)
  - [Statistical Analysis Methods](#statistical-analysis-methods)
- [Custom Field Names](#custom-field-names)
- [Testing](#testing)
- [Development](#development)

## ✨ Features

- **Multiple Format Support** - Provides ESM, CJS, UMD formats, bundle size only 14.9-15.2 KB, supports Tree-shaking, on-demand imports
- **Zero Dependencies** - No external dependencies, ready to use
- **High Performance** - Average execution time < 0.03ms on medium-sized trees (~120 nodes)
- **Complete Functionality** - 50+ APIs covering traversal, search, modification, conversion, query, analysis, and validation
- **Comprehensive Testing** - 447 test cases with 99%+ coverage

### 💡 Use Cases

- **Navigation Systems** - Multi-level menus, route configuration expansion, collapse, search, and filtering
- **File Systems** - File directory traversal, search, move, and delete
- **Permission Systems** - Organizational structure, role permission tree structure management and validation
- **Framework Development** - Component trees, route trees, and other tree structure construction and management
- **Data Management** - Category management, comment systems, tree selectors, and other data operations

## 📦 Installation

```bash
npm install tree-processor
# or
yarn add tree-processor
# or
pnpm add tree-processor
```

## 🚀 Quick Start

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

// Get all node names
const names = mapTree(treeData, (node) => node.name)
console.log(names) // ['node1', 'node2', 'node3']

// Find a node
const node = findTree(treeData, (n) => n.id === 2)
console.log(node) // { id: 2, name: 'node2' }

// Filter nodes
const filtered = filterTree(treeData, (n) => n.id > 1)
console.log(filtered) // [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

## 📖 API Documentation

### Import Methods

#### Default Import (Recommended for scenarios requiring multiple methods)

```javascript
// ES Module
import t from 'tree-processor'

// CommonJS
const t = require('tree-processor')
```

#### Named Import (Recommended for scenarios requiring only a few methods, supports tree-shaking)

```javascript
// ES Module - Named import of individual methods
import { mapTree, filterTree, findTree } from 'tree-processor'

// ES Module - Import types
import type { TreeNode, TreeData, FieldNames } from 'tree-processor'

// CommonJS - Named import
const { mapTree, filterTree } = require('tree-processor')
```

### Sample Data

The following sample data will be used for demonstrations of all subsequent methods:

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

## Traversal Operation Methods

Methods for traversing tree-structured data and performing operations on each node.

### mapTree

Traverse tree-structured data and execute a callback function for each node, returning a mapped array.

```javascript
// Get all node names
const nodeNames = t.mapTree(treeData, (node) => node.name)
console.log(nodeNames) // ['node1', 'node2', 'node4', 'node5', 'node3', 'node6']

// Get all node IDs
const nodeIds = t.mapTree(treeData, (node) => node.id)
console.log(nodeIds) // [1, 2, 4, 5, 3, 6]

// Modify node data
const modifiedNodes = t.mapTree(treeData, (node) => ({
  ...node,
  label: node.name
}))
console.log(modifiedNodes) // Returns a new array containing the label field
```

### forEachTree

Traverse tree-structured data and execute a callback function for each node. Unlike mapTree, this doesn't return a value and has better performance, suitable for scenarios where you only need to traverse without returning results.

```javascript
// Traverse all nodes and print
t.forEachTree(treeData, (node) => {
    console.log(node)
})

// Modify node properties
t.forEachTree(treeData, (node) => {
    node.visited = true
    node.timestamp = Date.now()
})

// Count nodes
let nodeCount = 0
t.forEachTree(treeData, () => {
    nodeCount++
})
console.log(nodeCount) // Total number of nodes
```

---

## Conditional Search Methods

Methods for finding nodes by conditions or predicate functions.

### filterTree

Filter tree-structured data and return nodes that meet the conditions.

```javascript
// Filter nodes whose names contain 'node'
const filteredNodes = t.filterTree(treeData, (node) => {
    return node.name.includes('node')
})
console.log(filteredNodes) // Returns an array of nodes that meet the conditions

// Filter nodes with ID greater than 2
const nodesWithLargeId = t.filterTree(treeData, (node) => node.id > 2)
console.log(nodesWithLargeId) // Returns an array of nodes with ID greater than 2

// Filter nodes without children (leaf nodes)
const leafNodes = t.filterTree(treeData, (node) => {
    return !node.children || node.children.length === 0
})
console.log(leafNodes) // Returns all leaf nodes
```

### findTree

Find the first node in tree-structured data that meets the condition. Returns null if not found.

```javascript
// Find node with ID 2
const foundNode = t.findTree(treeData, (node) => node.id === 2)
console.log(foundNode) // Returns the found node object, or null if not found

// Find node with name 'node3'
const node3 = t.findTree(treeData, (node) => node.name === 'node3')
console.log(node3) // { id: 3, name: 'node3', children: [...] }

// Find a non-existent node
const nodeNotFound = t.findTree(treeData, (node) => node.id === 999)
console.log(nodeNotFound) // null
```

### includesTree

Check if tree-structured data contains a node with the specified ID.

```javascript
const nodeId = 2
const hasNode = t.includesTree(treeData, nodeId)

console.log(hasNode) // true means it contains the node, false means it doesn't
```

### someTree

Check if there exists a node in tree-structured data that meets the condition. Returns true if at least one node meets the condition.

```javascript
// Check if there exists a node with name 'node2'
const hasNode2 = t.someTree(treeData, node => node.name === 'node2')
console.log(hasNode2) // true

// Check if there exists a node with ID greater than 10
const hasLargeId = t.someTree(treeData, node => node.id > 10)
console.log(hasLargeId) // false
```

### everyTree

Check if all nodes in tree-structured data meet the condition. Returns true only if all nodes meet the condition.

```javascript
// Check if all node IDs are greater than 0
const allIdsPositive = t.everyTree(treeData, node => node.id > 0)
console.log(allIdsPositive) // true

// Check if all nodes have a name property
const allHaveName = t.everyTree(treeData, node => node.name)
console.log(allHaveName) // Returns true or false based on actual data
```

---

## Index Access Methods

Methods for accessing nodes by position index or index path.

### atTree

Get a node by parent node ID and child node index. Supports negative indices, same as the array at method. Returns null if not found.

```javascript
// Get the first child node (index 0) of the node with ID 1
const firstChildNode = t.atTree(treeData, 1, 0)
console.log(firstChildNode) // Returns the first child node

// Get the last child node (negative index)
const lastChildNode = t.atTree(treeData, 1, -1)
console.log(lastChildNode) // Returns the last child node

// Index out of range returns null
const nodeNotFound = t.atTree(treeData, 1, 10)
console.log(nodeNotFound) // null
```

### indexOfTree

Returns an array representing the index path from the root node to the node with the targetId. Returns null if not found. The return value can be passed to the second parameter of atIndexOfTree for value retrieval.

```javascript
// Get the index path of the node with ID 4
const nodePath = t.indexOfTree(treeData, 4)
console.log(nodePath) // [0, 0, 0] means root node -> first child -> first child

// Node not found returns null
const pathNotFound = t.indexOfTree(treeData, 999)
console.log(pathNotFound) // null

// Use with atIndexOfTree
const indexPath = t.indexOfTree(treeData, 4)
const nodeByPath = t.atIndexOfTree(treeData, indexPath)
console.log(nodeByPath) // Gets the node with ID 4
```

### atIndexOfTree

Get a node by index path. Returns null if the path is invalid or out of range.

```javascript
// Get node by index path
const nodeByIndexPath = t.atIndexOfTree(treeData, [0, 1, 0])
console.log(nodeByIndexPath) // Returns the node object at the corresponding path

// Use with indexOfTree
const targetPath = t.indexOfTree(treeData, 4)
const targetNode = t.atIndexOfTree(treeData, targetPath)
console.log(targetNode) // Gets the node with ID 4

// Invalid path returns null
const invalidPath = t.atIndexOfTree(treeData, [999])
console.log(invalidPath) // null
```

---

## Node Operation Methods

Methods for adding, removing, and modifying nodes in tree structures.

### pushTree

Add a child node to the end under the specified node. Returns true if successful, false if the target node is not found.

```javascript
// Add a new child node under the node with ID 1
const addSuccess = t.pushTree(treeData, 1, { id: 7, name: 'node7' })
console.log(addSuccess) // true
console.log(treeData) // New node has been added to the end of the children array

// Try to add under a non-existent node
const addFailed = t.pushTree(treeData, 999, { id: 8, name: 'node8' })
console.log(addFailed) // false, target node not found
```

### unshiftTree

Add a child node to the beginning under the specified node. Returns true if successful, false if the target node is not found.

```javascript
// Add a new child node to the beginning under the node with ID 1
const unshiftSuccess = t.unshiftTree(treeData, 1, { id: 7, name: 'node7' })
console.log(unshiftSuccess) // true
console.log(treeData) // New node has been added to the beginning of the children array
```

### popTree

Remove the last child node under the specified node. Returns the removed node, or null if the node doesn't exist or has no children.

```javascript
// Remove the last child node under the node with ID 1
const removedNode = t.popTree(treeData, 1)
console.log(removedNode) // Returns the removed node object, or null

// Try to remove from a non-existent node
const popFailed = t.popTree(treeData, 999)
console.log(popFailed) // null
```

### shiftTree

Remove the first child node under the specified node. Returns the removed node, or null if the node doesn't exist or has no children.

```javascript
// Remove the first child node under the node with ID 1
const shiftedNode = t.shiftTree(treeData, 1)
console.log(shiftedNode) // Returns the removed node object, or null

// Try to remove from a non-existent node
const shiftFailed = t.shiftTree(treeData, 999)
console.log(shiftFailed) // null
```

### removeTree

Remove the node with the specified ID from tree-structured data, including root nodes and child nodes.

```javascript
const nodeIdToRemove = 2
const removeSuccess = t.removeTree(treeData, nodeIdToRemove)

console.log(removeSuccess) // true means successful removal, false means node not found
console.log(treeData) // Tree structure after removal
```

### concatTree

Concatenate multiple tree-structured data arrays, returns a new concatenated tree (deep cloned).

```javascript
const tree1 = [
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' }
]
const tree2 = [
  { id: 3, name: 'node3' }
]

// Concatenate multiple trees
const result = t.concatTree(tree1, tree2)
console.log(result) // [{ id: 1, name: 'node1' }, { id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

**Parameters:**
- `...trees`: Multiple tree-structured data arrays (variadic arguments)

**Notes:**
- All trees are deep cloned, won't modify the original trees
- Supports concatenating any number of tree structures

### sortTree

Sort tree-structured data, recursively sorts all levels.

```javascript
const tree = [
  { id: 3, name: 'node3' },
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' }
]

// Sort by id
const sorted = t.sortTree(tree, (a, b) => a.id - b.id)
console.log(sorted) 
// [{ id: 1, name: 'node1' }, { id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

**Parameters:**
- `tree`: Tree-structured data
- `compareFn`: Comparison function, same as `Array.sort`'s `compareFn` (optional)
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Recursively sorts nodes at all levels
- Returns a new sorted tree (deep cloned), won't modify the original tree
- Uses default sorting if `compareFn` is not provided

### sliceTree

Slice the root nodes of tree-structured data (similar to array's `slice`).

```javascript
const tree = [
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' },
  { id: 3, name: 'node3' }
]

// Slice: get nodes from index 1 to 3
const sliced = t.sliceTree(tree, 1, 3)
console.log(sliced) // [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }]

// Supports negative indices
const lastTwo = t.sliceTree(tree, -2)
console.log(lastTwo) // [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }]
```

**Parameters:**
- `tree`: Tree-structured data
- `start`: Start index (inclusive), optional
- `end`: End index (exclusive), optional
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Only slices root nodes, doesn't recursively process children
- Returns a new sliced tree (deep cloned), won't modify the original tree
- Supports negative indices (calculated from the end)
- Child node structures are completely preserved

### dedupTree

Tree-structured object array deduplication method that removes duplicate nodes based on the specified key. Keeps the first occurrence of the node. Supports single field, multiple fields combined deduplication, and custom functions.

**Parameters:**
- `tree`: Tree-structured data
- `key`: Key(s) for deduplication, supports three types:
  - `string`: Single field deduplication (e.g., `'id'`)
  - `string[]`: Multiple fields combined deduplication (e.g., `['id', 'type']`)
  - `(node: TreeNode) => any`: Custom function that returns the value for deduplication
- `fieldNames`: Custom field name configuration (optional)

```javascript
// Method 1: Single field deduplication (original usage)
const uniqueTreeData = t.dedupTree(treeData, 'id')
console.log(uniqueTreeData) // Returns deduplicated tree-structured data

// Method 2: Multiple fields combined deduplication (new feature)
const tree = [
  {
    id: 1,
    children: [
      { id: 2, type: 'A', name: 'node1' },
      { id: 2, type: 'B', name: 'node2' }, // Kept (same id but different type)
      { id: 2, type: 'A', name: 'node3' }, // Deduplicated (both id and type are same)
    ]
  }
]
const uniqueByMultiFields = t.dedupTree(tree, ['id', 'type'])
// Result: Keeps node1 and node2, node3 is deduplicated

// Method 3: Custom function deduplication
const uniqueByCustom = t.dedupTree(treeData, (node) => node.code)
// Or more complex logic
const uniqueByComplex = t.dedupTree(treeData, (node) => `${node.id}-${node.type}`)
```

**Notes:**
- If the dedupKey value is `undefined` or `null`, the node will not be deduplicated (all will be kept)
- Multiple fields combined deduplication uses the combination of field values to determine duplicates
- Recursively processes all levels of child nodes
- **Performance Optimization**: Multiple fields combined deduplication has been optimized, using efficient delimiter concatenation instead of JSON.stringify for better performance

---

## Format Conversion Methods

Methods for converting between different data formats (array, Map, object, etc.).

### convertToArrayTree

Flatten tree-structured data into an array. The returned array contains nodes without the `children` field.

```javascript
// Flatten tree structure into an array
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

// Note: Returned nodes do not contain the children field
array.forEach(node => {
  console.log(node.children) // undefined
})

// Support custom field names
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
console.log(customArray) // Flattened array without subNodes field
```

### convertToMapTree

Convert tree-structured data to a Map, where the key is the node ID and the value is the node object (without the `children` field). Suitable for scenarios requiring fast node lookup by ID.

```javascript
// Convert tree structure to Map
const map = t.convertToMapTree(treeData)
console.log(map instanceof Map) // true
console.log(map.size) // 6

// Quickly find node by ID
const node = map.get(2)
console.log(node) // { id: 2, name: 'node2' }
console.log(node.children) // undefined (does not contain children field)

// Support custom field names
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

Convert tree-structured data to a level array (two-dimensional array), grouped by depth. The outer array is indexed by depth, and the inner array contains all nodes at that depth.

```javascript
// Convert tree structure to level array
const levelArray = t.convertToLevelArrayTree(treeData)
console.log(levelArray)
// [
//   [{ id: 1, name: 'node1' }],           // Level 0
//   [{ id: 2, name: 'node2' }, { id: 3, name: 'node3' }],  // Level 1
//   [{ id: 4, name: 'node4' }, { id: 5, name: 'node5' }, { id: 6, name: 'node6' }]  // Level 2
// ]

// Traverse each level
levelArray.forEach((level, depth) => {
  console.log(`Depth ${depth}:`, level)
})

// Note: Returned nodes do not contain children field
levelArray[0][0].children // undefined

// Support custom field names
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
console.log(customLevelArray) // Array grouped by level
```

### convertToObjectTree

Convert single-root tree-structured data to an object. If the tree has only one root node, returns that node object; otherwise returns `null`.

```javascript
// Convert single-root tree to object
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

// Multiple root nodes return null
const multiRootTree = [
  { id: 1, name: 'node1' },
  { id: 2, name: 'node2' }
]
const result = t.convertToObjectTree(multiRootTree)
console.log(result) // null

// Empty tree returns null
const emptyTree = []
const emptyResult = t.convertToObjectTree(emptyTree)
console.log(emptyResult) // null
```

### convertBackTree

Convert various data structures to tree-structured data. Supports array, Map, Record (object) and other formats. Each element in the array needs to contain `id` and `parentId` fields.

```javascript
// Convert flat array to tree structure
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

// Custom root node parentId value
const arrayWithZero = [
  { id: 1, name: 'node1', parentId: 0 },
  { id: 2, name: 'node2', parentId: 1 }
]
const treeWithZero = t.convertBackTree(arrayWithZero, { rootParentId: 0 })
console.log(treeWithZero) // Correctly converted

// Custom parentId field name
const arrayWithPid = [
  { id: 1, name: 'node1', pid: null },
  { id: 2, name: 'node2', pid: 1 }
]
const treeWithPid = t.convertBackTree(arrayWithPid, { parentIdField: 'pid' })
console.log(treeWithPid) // Correctly converted

// Support custom field names
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

// Handle multiple root nodes
const multiRootArray = [
  { id: 1, name: 'root1', parentId: null },
  { id: 2, name: 'root2', parentId: null },
  { id: 3, name: 'child1', parentId: 1 }
]
const multiRootTree = t.convertBackTree(multiRootArray)
console.log(multiRootTree) // Contains two root nodes
```

**Parameter Description:**
- `data` - Supports multiple data formats:
  - Array: Flat array, each element needs to contain `id` and `parentId` fields
  - Map: key is node ID, value is node object
  - Record (object): key is node ID, value is node object
  - Single object: Single tree node object
- `options.rootParentId` - The parentId value for root nodes, defaults to `null`
- `options.parentIdField` - Parent node ID field name, defaults to `'parentId'`
- `options.fieldNames` - Custom field name configuration, supports custom `id` and `children` field names

**Notes:**
- If a node's `parentId` cannot find a corresponding parent node, that node will be treated as a root node
- Nodes without `id` will be skipped
- Nodes with `parentId` as `null`, `undefined`, or equal to `rootParentId` will be treated as root nodes
- When converting Map and Record formats, the key will be set as the node's `id`

**Example: Support Map and Record formats**

```javascript
// Map format
const map = new Map([
  [1, { name: 'node1', parentId: null }],
  [2, { name: 'node2', parentId: 1 }]
])
const treeFromMap = t.convertBackTree(map)
console.log(treeFromMap) // Correctly converted to tree structure

// Record format
const record = {
  1: { name: 'node1', parentId: null },
  2: { name: 'node2', parentId: 1 }
}
const treeFromRecord = t.convertBackTree(record)
console.log(treeFromRecord) // Correctly converted to tree structure
```

---

## Clone and Copy Methods

Methods for copying tree-structured data (deep copy, shallow copy, subtree copy, etc.).

### cloneTree

Deep clone tree-structured data, returns a completely independent copy without modifying the original tree.

```javascript
const original = [
  { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }
]

// Deep clone
const cloned = t.cloneTree(original)

// Modifying the cloned tree won't affect the original
cloned[0].name = 'modified'
console.log(original[0].name) // 'node1'
console.log(cloned[0].name)   // 'modified'
```

**Parameters:**
- `tree`: Tree-structured data
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Recursively deep clones all levels of nodes and children
- Returns a tree completely independent from the original, modifications won't affect each other
- Supports custom field name configuration

### shallowCloneTree

Shallow clone tree-structured data (only copies the first level, children share references). Better performance than deep clone, suitable for scenarios where only the top-level structure needs to be copied.

```javascript
const original = [
  { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }
]

// Shallow clone
const cloned = t.shallowCloneTree(original)

// Modifying the first level won't affect the original
cloned[0].name = 'modified'
console.log(original[0].name) // 'node1'

// But children share references, modifying children will affect the original
cloned[0].children[0].name = 'changed'
console.log(original[0].children[0].name) // 'changed'
```

**Parameters:**
- `tree`: Tree-structured data
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Only copies the first level of nodes, children maintain shared references
- Better performance than deep clone, suitable for scenarios where only top-level independence is needed
- Modifying children will affect the original tree

### cloneSubtree

Clone a subtree starting from the specified node. Returns a deep copy containing the target node and all its children. Supports finding nodes by any field.

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

// Find by id field
const subtree1 = t.cloneSubtree(tree, { id: 2 })
console.log(subtree1)
// [{ id: 2, name: 'sub1', children: [{ id: 4, name: 'sub1-1' }] }]

// Find by name field
const subtree2 = t.cloneSubtree(tree, { name: 'sub1' })
console.log(subtree2)
// [{ id: 2, name: 'sub1', children: [{ id: 4, name: 'sub1-1' }] }]

// Find by other field (e.g., code)
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

// Support custom children field name
const customTree = [
  { nodeId: 1, subNodes: [{ nodeId: 2 }] }
]
const subtree4 = t.cloneSubtree(customTree, { nodeId: 2 }, { children: 'subNodes', id: 'nodeId' })
console.log(subtree4)
// [{ nodeId: 2 }]

// Modifying the cloned subtree won't affect the original
subtree1[0].name = 'modified'
console.log(tree[0].children[0].name) // 'sub1'
```

**Parameters:**
- `tree`: Tree-structured data
- `target`: Target node object, e.g., `{ id: 1 }` or `{ name: 'sub1' }` or `{ code: 'B001' }`, object must contain only one field
- `fieldNames`: Custom field name configuration (optional, used to customize `children` field name, search field is determined by the key name in the `target` object)

**Notes:**
- Returns a subtree containing the target node (deep cloned)
- Returns an empty array if the target node is not found
- Recursively deep clones all child nodes
- Must pass an object, search field is determined by the object's key name (e.g., `{ id: 1 }` searches by `id` field, `{ name: 'xxx' }` searches by `name` field)
- `fieldNames` parameter is used to customize `children` field name, defining `id` has no effect

### cloneWithTransform

Clone tree-structured data and apply a transform function to each node. Suitable for modifying node data while cloning.

```javascript
const tree = [
  { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }
]

// Clone and add label field
const cloned = t.cloneWithTransform(tree, (node) => ({
  ...node,
  label: node.name,
  processed: true
}))

console.log(cloned[0].label) // 'node1'
console.log(cloned[0].processed) // true
console.log(cloned[0].children[0].label) // 'node2'
console.log(tree[0].label) // undefined (original tree not modified)
```

**Parameters:**
- `tree`: Tree-structured data
- `transform`: Transform function that receives a node and returns the transformed node
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Recursively transforms all levels of nodes
- Returns the transformed tree (deep cloned), won't modify the original tree
- The transform function should return a new node object

---

## Relationship Query Methods

Methods for getting relationship information between nodes (parent-child relationships, sibling relationships, depth, etc.).

### getParentTree

Get the parent node of the specified node. Returns null if the node is a root node or not found.

```javascript
// Get the parent node of the node with ID 2
const parentNode = t.getParentTree(treeData, 2)
console.log(parentNode) // Returns the parent node object { id: 1, name: 'node1', ... }

// Root nodes have no parent, returns null
const rootParentNode = t.getParentTree(treeData, 1)
console.log(rootParentNode) // null

// Node not found returns null
const parentNotFound = t.getParentTree(treeData, 999)
console.log(parentNotFound) // null
```

### getChildrenTree

Get all direct child nodes of the specified node. Returns an empty array if the node is not found or has no children.

```javascript
// Get all child nodes of the node with ID 1
const children = t.getChildrenTree(treeData, 1)
console.log(children) // Returns child node array [{ id: 2, ... }, { id: 3, ... }]

// Node has no children, returns empty array
const emptyChildren = t.getChildrenTree(treeData, 4)
console.log(emptyChildren) // []

// Node not found returns empty array
const notFound = t.getChildrenTree(treeData, 999)
console.log(notFound) // []

// Support custom field names
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
console.log(customChildren) // Returns child node array
```

### getSiblingsTree

Get all sibling nodes of the specified node (including itself). Returns an empty array if the node is not found. Sibling nodes of root nodes are other root nodes.

```javascript
// Get all sibling nodes (including itself) of the node with ID 2
const siblings = t.getSiblingsTree(treeData, 2)
console.log(siblings) // Returns sibling node array [{ id: 2, ... }, { id: 3, ... }]

// Sibling nodes of root nodes are other root nodes
const multiRoot = [
  { id: 1, children: [{ id: 2 }] },
  { id: 3, children: [{ id: 4 }] },
];
const rootSiblings = t.getSiblingsTree(multiRoot, 1)
console.log(rootSiblings) // Returns all root nodes [{ id: 1, ... }, { id: 3, ... }]

// Node not found returns empty array
const notFound = t.getSiblingsTree(treeData, 999)
console.log(notFound) // []

// Support custom field names
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
console.log(customSiblings) // Returns sibling node array (including itself)
```

### getNodeDepthMap

Returns a dictionary where keys represent node ids and values represent which layer the node is in the data. Depth starts from 1, root nodes have depth 1.

```javascript
// Get depth map of all nodes
const nodeDepthMap = t.getNodeDepthMap(treeData)
console.log(nodeDepthMap) // { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3 }

// Get depth of a specific node
const node2Depth = nodeDepthMap[2]
console.log(node2Depth) // 2

// Empty tree returns empty object
const emptyDepthMap = t.getNodeDepthMap([])
console.log(emptyDepthMap) // {}
```

### getNodeDepth

Get the depth of the specified node. Depth starts from 1, root nodes have depth 1.

```javascript
// Get depth of root node
const rootDepth = t.getNodeDepth(treeData, 1)
console.log(rootDepth) // 1

// Get depth of child node
const childDepth = t.getNodeDepth(treeData, 2)
console.log(childDepth) // 2

// Get depth of deep node
const deepDepth = t.getNodeDepth(treeData, 4)
console.log(deepDepth) // 3

// Node not found returns null
const notFound = t.getNodeDepth(treeData, 999)
console.log(notFound) // null

// Support custom field names
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

**Difference from getNodeDepthMap:**
- `getNodeDepthMap` - Batch get depth of all nodes (calculates all nodes at once)
- `getNodeDepth` - Only get depth of a single node (only calculates the target node, more efficient)

---

## Data Validation Methods

Methods for validating the validity of tree-structured data and node types.

### isLeafNode

Check if a node is a leaf node (has no children). Lightweight method that only checks the node itself, doesn't traverse the tree.

```javascript
// Nodes without children field are leaf nodes
const leafNode1 = { id: 1, name: 'node1' };
console.log(t.isLeafNode(leafNode1)) // true

// Nodes with empty children array are leaf nodes
const leafNode2 = { id: 2, name: 'node2', children: [] };
console.log(t.isLeafNode(leafNode2)) // true

// Nodes with children are not leaf nodes
const parentNode = {
  id: 3,
  name: 'node3',
  children: [{ id: 4, name: 'node4' }],
};
console.log(t.isLeafNode(parentNode)) // false

// Use in filterTree (filter out all leaf nodes)
const leafNodes = t.filterTree(treeData, (node) => t.isLeafNode(node))
console.log(leafNodes) // Returns all leaf nodes

// Use in forEachTree
t.forEachTree(treeData, (node) => {
  if (t.isLeafNode(node)) {
    console.log('Leaf node:', node.name)
  }
})

// Support custom field names
const customNode = {
  nodeId: 1,
  name: 'node1',
  subNodes: [],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isLeafNode(customNode, fieldNames)) // true
```

**Difference from existing methods:**
- `isLeafNode` - Only checks a single node, lightweight (O(1)), suitable for use during traversal
- `getChildrenTree` - Gets child node array, requires passing tree and nodeId, needs to find the node (O(n))

### isRootNode

Check if a node is a root node (has no parent). Root nodes are top-level nodes in the tree-structured data array.

**Performance Optimization**: Optimized to use a single traversal, avoiding duplicate tree traversals.

```javascript
// Check root node
const treeData = [
  {
    id: 1,
    name: 'root1',
    children: [{ id: 2, name: 'child1' }],
  },
];
console.log(t.isRootNode(treeData, 1)) // true
console.log(t.isRootNode(treeData, 2)) // false

// Multiple root nodes case
const multiRoot = [
  { id: 1, name: 'root1' },
  { id: 2, name: 'root2' },
  { id: 3, name: 'root3' },
];
console.log(t.isRootNode(multiRoot, 1)) // true
console.log(t.isRootNode(multiRoot, 2)) // true
console.log(t.isRootNode(multiRoot, 3)) // true

// Use during traversal
t.forEachTree(treeData, (node) => {
  if (t.isRootNode(treeData, node.id)) {
    console.log('Root node:', node.name)
  }
})

// Support custom field names
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

// Returns false when node doesn't exist
console.log(t.isRootNode(treeData, 999)) // false
```

**Difference from existing methods:**
- `isRootNode` - Semantic method that directly returns boolean value
- `getParentTree` - Returns parent node object, need to check if it's null
- `getNodeDepth` - Returns depth, need to check if it equals 1

### isEmptyTreeData

Check if tree-structured data (array) is empty. Empty arrays, null, and undefined are all considered empty. This function supports the fieldNames parameter to maintain API consistency, but the parameter has no effect (because it only checks if the array is empty, doesn't access children or id fields).

```javascript
// Check if tree-structured data is empty
const isEmptyTree = t.isEmptyTreeData(treeData)
console.log(isEmptyTree) // false (has data)

// Empty array returns true
const isEmptyArray = t.isEmptyTreeData([])
console.log(isEmptyArray) // true

// null or undefined returns true
const isNullTree = t.isEmptyTreeData(null)
console.log(isNullTree) // true

// Support fieldNames parameter (maintains API consistency, but has no effect)
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const isEmptyWithFieldNames = t.isEmptyTreeData(treeData, fieldNames)
console.log(isEmptyWithFieldNames) // false (same result as not passing fieldNames)
```

### isEmptySingleTreeData

Check if a single tree-structured data is empty. If the data is not valid single tree-structured data, has no children field, or children is an empty array, it is considered empty. If there are child nodes (children array is not empty), even if the child nodes themselves are empty, the tree is not empty.

```javascript
// No children field, considered empty
const tree1 = { id: 1, name: 'node1' };
const isEmpty1 = t.isEmptySingleTreeData(tree1)
console.log(isEmpty1) // true

// children is empty array, considered empty
const tree2 = {
  id: 1,
  name: 'node1',
  children: [],
};
const isEmpty2 = t.isEmptySingleTreeData(tree2)
console.log(isEmpty2) // true

// Has child nodes, not empty
const tree3 = {
  id: 1,
  name: 'node1',
  children: [
    { id: 2, name: 'node2' },
  ],
};
const isEmpty3 = t.isEmptySingleTreeData(tree3)
console.log(isEmpty3) // false

// Has child nodes, even if child nodes themselves are empty, tree is not empty
const tree4 = {
  id: 1,
  name: 'node1',
  children: [
    { id: 2, name: 'node2', children: [] },
    { id: 3, name: 'node3' }, // no children field
  ],
};
const isEmpty4 = t.isEmptySingleTreeData(tree4)
console.log(isEmpty4) // false (because there are child nodes, even if they are empty)

// Support custom field names
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

Check if data is tree-structured data (array). Tree-structured data must be an array, and each element in the array must be valid single tree-structured data.

```javascript
// Valid tree-structured data (forest)
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

// Empty array is also valid tree-structured data (empty forest)
console.log(t.isTreeData([])) // true

// Single object is not tree-structured data (should use isSingleTreeData)
console.log(t.isTreeData({ id: 1 })) // false

// Array contains non-tree-structured elements, returns false
const invalidForest = [
  { id: 1, children: [{ id: 2 }] },
  'not a tree', // invalid element
];
console.log(t.isTreeData(invalidForest)) // false

// null or undefined are not valid tree-structured data
console.log(t.isTreeData(null)) // false
console.log(t.isTreeData(undefined)) // false

// Support custom field names
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

Check if data is single tree-structured data (single object). Tree-structured data must be an object (cannot be an array, null, undefined, or primitive type). If a children field exists, it must be an array type, and all child nodes will be recursively checked.

```javascript
// Valid single tree-structured data
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

// No children field is also valid (only root node)
const singleNode = { id: 1, name: 'node1' }
console.log(t.isSingleTreeData(singleNode)) // true

// Array is not single tree-structured data
console.log(t.isSingleTreeData([])) // false

// null or undefined are not valid tree-structured data
console.log(t.isSingleTreeData(null)) // false
console.log(t.isSingleTreeData(undefined)) // false

// children cannot be null
const invalidTree = { id: 1, children: null }
console.log(t.isSingleTreeData(invalidTree)) // false

// Support custom field names
const customTree = {
  nodeId: 1,
  name: 'node1',
  subNodes: [{ nodeId: 2, name: 'node2' }],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isSingleTreeData(customTree, fieldNames)) // true
```

### isValidTreeNode

Check if a single node is a valid tree node structure (lightweight, doesn't recursively check child nodes). Only checks the structure of the node itself, doesn't check child nodes.

```javascript
// Valid tree node (has children array)
const node1 = {
  id: 1,
  name: 'node1',
  children: [{ id: 2 }],
};
console.log(t.isValidTreeNode(node1)) // true

// Valid tree node (no children field)
const node2 = { id: 1, name: 'node1' };
console.log(t.isValidTreeNode(node2)) // true

// Invalid tree node (children is not an array)
const invalidNode = {
  id: 1,
  children: 'not an array',
};
console.log(t.isValidTreeNode(invalidNode)) // false

// Support custom field names
const customNode = {
  nodeId: 1,
  subNodes: [{ nodeId: 2 }],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isValidTreeNode(customNode, fieldNames)) // true
```

**Difference from isSingleTreeData:**
- `isValidTreeNode` - Only checks the basic structure of a single node, doesn't recursively check child nodes (lightweight)
- `isSingleTreeData` - Recursively checks the entire tree structure, ensuring all child nodes are valid tree structures

### isTreeNodeWithCircularCheck

Check if a node is a valid tree node structure and detect circular references. Uses WeakSet to track visited nodes, returns false if circular references are found.

```javascript
// Valid tree node (no circular references)
const validNode = {
  id: 1,
  children: [
    { id: 2, children: [{ id: 3 }] },
  ],
};
console.log(t.isTreeNodeWithCircularCheck(validNode)) // true

// Detect circular references
const node1 = { id: 1, children: [] };
const node2 = { id: 2, children: [] };
node1.children.push(node2);
node2.children.push(node1); // circular reference
console.log(t.isTreeNodeWithCircularCheck(node1)) // false

// Detect self-reference
const selfRefNode = { id: 1, children: [] };
selfRefNode.children.push(selfRefNode); // self-reference
console.log(t.isTreeNodeWithCircularCheck(selfRefNode)) // false

// Support custom field names
const customNode = {
  nodeId: 1,
  subNodes: [{ nodeId: 2 }],
};
const fieldNames = { children: 'subNodes', id: 'nodeId' };
console.log(t.isTreeNodeWithCircularCheck(customNode, fieldNames)) // true
```

**Use Cases:**
- Check for circular references when receiving user input or external data
- Data validation to prevent infinite recursion
- Check if data structure is correct during debugging

### isSafeTreeDepth

Check if the depth of tree-structured data is safe (prevent recursion stack overflow). Returns false if the tree depth exceeds `maxDepth`.

```javascript
// Safe depth tree
const safeTree = [
  {
    id: 1,
    children: [
      { id: 2, children: [{ id: 3 }] },
    ],
  },
];
console.log(t.isSafeTreeDepth(safeTree, 10)) // true (depth is 3, less than 10)

// Depth exceeds maximum depth
const deepTree = [
  {
    id: 1,
    children: [
      { id: 2, children: [{ id: 3 }] },
    ],
  },
];
console.log(t.isSafeTreeDepth(deepTree, 2)) // false (depth is 3, exceeds 2)

// Empty tree is always safe
console.log(t.isSafeTreeDepth([], 10)) // true

// Single layer tree
const singleLayer = [{ id: 1 }, { id: 2 }];
console.log(t.isSafeTreeDepth(singleLayer, 1)) // true

// Support custom field names
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

**Use Cases:**
- Check if depth is safe before processing large trees
- Prevent recursion call stack overflow
- Performance optimization, avoid processing trees that are too deep

---

## Statistical Analysis Methods

Methods for statistical analysis of tree-structured data.

### reduceTree

Reduce tree-structured data, traverses all nodes and accumulates results.

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20, children: [{ id: 3, value: 30 }] }
]

// Calculate the sum of all node values
const sum = t.reduceTree(tree, (acc, node) => acc + (node.value || 0), 0)
console.log(sum) // 60

// Collect all node IDs
const ids = t.reduceTree(tree, (ids, node) => {
  ids.push(node.id)
  return ids
}, [])
console.log(ids) // [1, 2, 3]
```

**Parameters:**
- `tree`: Tree-structured data
- `reducer`: Reduction function that receives accumulator and current node, returns new accumulator
- `initialValue`: Initial value
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Traverses all nodes in depth-first order
- Can be used to implement various aggregation operations

---

### aggregateTree

Aggregate tree-structured data by groups, supports multiple aggregation operations (sum, average, max, min, count).

```javascript
const tree = [
  { id: 1, category: 'A', value: 10, score: 80 },
  { id: 2, category: 'A', value: 20, score: 90 },
  { id: 3, category: 'B', value: 30, score: 70, children: [{ id: 4, category: 'B', value: 40, score: 85 }] }
]

// Aggregate by category
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

**Parameters:**
- `tree`: Tree-structured data
- `options`: Aggregation options
  - `groupBy`: Grouping function that receives a node and returns a group key
  - `aggregations`: Aggregation configuration object, key is result field name, value is aggregation config
    - `operation`: Aggregation operation type ('sum' | 'avg' | 'max' | 'min' | 'count')
    - `field`: Field name to aggregate (not needed for count operation)
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Supports multiple aggregation operations simultaneously
- Recursively processes all levels of nodes
- Count operation counts node quantity, doesn't need field parameter

---

### groupTree

Group tree-structured data by field, returns node arrays grouped by field value.

```javascript
const tree = [
  { id: 1, category: 'A' },
  { id: 2, category: 'A' },
  { id: 3, category: 'B', children: [{ id: 4, category: 'B' }] }
]

// Group by category field
const grouped = t.groupTree(tree, 'category')
console.log(grouped)
// {
//   'A': [{ id: 1, category: 'A' }, { id: 2, category: 'A' }],
//   'B': [{ id: 3, category: 'B' }, { id: 4, category: 'B' }]
// }
```

**Parameters:**
- `tree`: Tree-structured data
- `field`: Grouping field name
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Returns references to original nodes, not deep copies
- Recursively processes all levels of nodes

---

### groupByTree

Group tree-structured data by condition, uses custom function to determine group key.

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 10, children: [{ id: 4, value: 30 }] }
]

// Group by whether value is >= 20
const grouped = t.groupByTree(tree, node => node.value >= 20 ? 'high' : 'low')
console.log(grouped)
// {
//   'low': [{ id: 1, value: 10 }, { id: 3, value: 10 }],
//   'high': [{ id: 2, value: 20 }, { id: 4, value: 30 }]
// }
```

**Parameters:**
- `tree`: Tree-structured data
- `groupFn`: Grouping function that receives a node and returns a group key
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Group keys are converted to strings
- Returns references to original nodes, not deep copies

---

### sumTree

Calculate the sum of a field in tree-structured data.

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20, children: [{ id: 3, value: 30 }] }
]

// Calculate sum of value field
const total = t.sumTree(tree, 'value')
console.log(total) // 60
```

**Parameters:**
- `tree`: Tree-structured data
- `field`: Field name
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Missing or null/undefined values are treated as 0
- Recursively processes all levels of nodes

---

### avgTree

Calculate the average value of a field in tree-structured data.

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 }
]

// Calculate average of value field
const average = t.avgTree(tree, 'value')
console.log(average) // 20
```

**Parameters:**
- `tree`: Tree-structured data
- `field`: Field name
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Ignores null and undefined values
- Returns 0 if all values are null/undefined

---

### maxTree

Get the maximum value of a field in tree-structured data.

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 30 },
  { id: 3, value: 20 }
]

// Get maximum value of value field
const max = t.maxTree(tree, 'value')
console.log(max) // 30
```

**Parameters:**
- `tree`: Tree-structured data
- `field`: Field name
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Only processes numeric values
- Returns null if tree is empty or has no valid values

---

### minTree

Get the minimum value of a field in tree-structured data.

```javascript
const tree = [
  { id: 1, value: 30 },
  { id: 2, value: 10 },
  { id: 3, value: 20 }
]

// Get minimum value of value field
const min = t.minTree(tree, 'value')
console.log(min) // 10
```

**Parameters:**
- `tree`: Tree-structured data
- `field`: Field name
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Only processes numeric values
- Returns null if tree is empty or has no valid values

---

### countTree

Count the number of nodes in tree-structured data that meet a condition.

```javascript
const tree = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 10, children: [{ id: 4, value: 30 }] }
]

// Count all nodes
const total = t.countTree(tree)
console.log(total) // 4

// Count nodes that meet condition
const count = t.countTree(tree, node => node.value === 10)
console.log(count) // 2
```

**Parameters:**
- `tree`: Tree-structured data
- `conditionFn`: Condition function (optional), if not provided counts all nodes
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Counts all nodes if condition function is not provided
- Recursively processes all levels of nodes

---

### getTreeStats

Get comprehensive statistics of tree-structured data.

```javascript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }
]

// Get statistics
const stats = t.getTreeStats(tree)
console.log(stats)
// {
//   totalNodes: 4,      // Total number of nodes
//   leafNodes: 2,       // Number of leaf nodes
//   maxDepth: 3,        // Maximum depth
//   minDepth: 1,        // Minimum depth
//   avgDepth: 2,        // Average depth
//   levels: 3            // Number of levels (equals maxDepth)
// }
```

**Parameters:**
- `tree`: Tree-structured data
- `fieldNames`: Custom field name configuration (optional)

**Notes:**
- Returns complete statistics object
- Empty tree returns statistics with all values as 0

---

### analyzeTree

Comprehensively analyze tree-structured data, providing detailed statistics, distribution, balance analysis, and more.

```javascript
const tree = [
  { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }
]

// Comprehensive tree structure analysis
const analysis = t.analyzeTree(tree)
console.log(analysis)
// {
//   // Basic Statistics
//   totalNodes: 4,           // Total number of nodes
//   leafNodes: 2,            // Number of leaf nodes
//   internalNodes: 2,        // Number of internal nodes
//   maxDepth: 3,             // Maximum depth
//   minDepth: 1,             // Minimum depth
//   avgDepth: 2,             // Average depth
//   levels: 3,                // Number of levels
//   
//   // Level Analysis
//   byLevel: { 0: 1, 1: 2, 2: 1 },  // Node count by level
//   maxWidth: 2,              // Maximum width (max nodes in a single level)
//   avgWidth: 1.33,          // Average width
//   widthByLevel: { 0: 1, 1: 2, 2: 1 },  // Width per level
//   
//   // Branching Factor Analysis
//   avgBranchingFactor: 1.5,  // Average branching factor (avg children per node)
//   maxBranchingFactor: 2,      // Maximum branching factor
//   minBranchingFactor: 1,      // Minimum branching factor
//   branchingFactorDistribution: { 1: 1, 2: 1 },  // Branching factor distribution
//   
//   // Depth Distribution
//   depthDistribution: { 1: 1, 2: 2, 3: 1 },  // Node count by depth
//   
//   // Balance Analysis
//   depthVariance: 0.5,       // Depth variance (smaller = more balanced)
//   isBalanced: true,          // Whether tree is balanced
//   balanceRatio: 0.33,        // Balance ratio (minDepth/maxDepth)
//   
//   // Path Analysis
//   avgPathLength: 2.25,      // Average path length
//   maxPathLength: 3,         // Maximum path length
//   minPathLength: 1,         // Minimum path length
//   
//   // Leaf Node Analysis
//   leafNodeRatio: 0.5,       // Leaf node ratio
//   leafNodesByLevel: { 2: 1, 3: 1 }  // Leaf nodes per level
// }
```

**Parameters:**
- `tree`: Tree-structured data
- `options`: Analysis options (optional), can specify which statistics to calculate, defaults to calculating all statistics
  - `includeBasic`: Whether to include basic statistics (totalNodes, leafNodes, internalNodes, maxDepth, minDepth, avgDepth, levels), default `true`
  - `includeLevelAnalysis`: Whether to include level analysis (byLevel, maxWidth, avgWidth, widthByLevel), default `true`
  - `includeBranchingFactor`: Whether to include branching factor analysis (avgBranchingFactor, maxBranchingFactor, minBranchingFactor, branchingFactorDistribution), default `true`
  - `includeDepthDistribution`: Whether to include depth distribution (depthDistribution), default `true`
  - `includeBalanceAnalysis`: Whether to include balance analysis (depthVariance, isBalanced, balanceRatio), default `true`
  - `includePathAnalysis`: Whether to include path analysis (avgPathLength, maxPathLength, minPathLength), default `true`
  - `includeLeafAnalysis`: Whether to include leaf node analysis (leafNodeRatio, leafNodesByLevel), default `true`
- `fieldNames`: Custom field name configuration (optional)

```javascript
// Calculate only basic statistics and branching factor (performance optimization)
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
console.log(quickAnalysis.byLevel) // {} (not calculated)

// Calculate only balance analysis
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

**Analysis information includes:**

1. **Basic Statistics**: Total nodes, leaf nodes, internal nodes, depth information, etc.
2. **Level Analysis**: Nodes per level, maximum width, average width, etc.
3. **Branching Factor Analysis**: Average/max/min branching factor, branching factor distribution, etc.
4. **Depth Distribution**: Number of nodes at each depth
5. **Balance Analysis**: Depth variance, whether balanced, balance ratio, etc.
6. **Path Analysis**: Average/max/min path length
7. **Leaf Node Analysis**: Leaf node ratio, leaf nodes per level

**Notes:**
- Provides comprehensive tree structure analysis, suitable for performance optimization, structure evaluation, etc.
- `isBalanced` is determined based on depth variance and depth range. A tree is considered balanced if depth variance < 2 and depth range ≤ 2
- `balanceRatio` closer to 1 indicates a more balanced tree
- **Performance Optimization**: Use the `options` parameter to calculate only the needed statistics, which can significantly improve performance for large tree structures

---

## Custom Field Names

All methods support custom property names for children and id through the last parameter, passing in a configuration object:

```javascript
// Use default field names
const foundNode1 = t.findTree(treeData, (node) => node.id === 2)

// Use custom field names
const fieldNames = { children: 'subNodes', id: 'nodeId' };
const foundNode2 = t.findTree(customTreeData, (node) => node.nodeId === 2, fieldNames);
```

**Note:** All 30 functions support the `fieldNames` parameter to maintain API consistency. Even if the parameter has no effect in certain functions (such as `isEmptyTreeData`), it can still be passed to maintain consistent code style.

## Testing

### Run Tests

```bash
# Run all tests (automatically build then test source + bundled files, 712 test cases)
npm test

# Run all tests (once, don't watch for file changes)
npm test -- --run

# Test source code only (447 test cases)
npm run test:src

# Test bundled files only (447 test cases, requires npm run build first)
npm run test:dist

# Run tests and generate coverage report
npm run test:coverage
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build project (delete dist directory first, then rebuild)
npm run build
```

<div align="center">

If this project helps you, please give it a ⭐️

Made with by [knott11]

</div>
