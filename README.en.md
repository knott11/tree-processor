# tree-processor

<div align="right">

[English](https://github.com/knott11/tree-processor/blob/main/README.en.md) | [中文](https://github.com/knott11/tree-processor/blob/main/README.md)

</div>

<div align="center">

![npm version](https://img.shields.io/npm/v/tree-processor?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/tree-processor?style=flat-square)
![bundle size](https://img.shields.io/badge/bundle-6.6KB-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![coverage](https://img.shields.io/badge/coverage-99%25-brightgreen?style=flat-square)

A lightweight tree-structured data processing utility library written in TypeScript, supporting tree-shaking, with each format bundle size approximately **6-7 KB** (ESM: 6.39 KB, CJS: 6.64 KB, UMD: 6.68 KB).


</div>

## 📋 Table of Contents

- [Features](#-features)
  - [Use Cases](#-use-cases)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
  - [Traversal Methods](#traversal-methods)
  - [Search Methods](#search-methods)
  - [Access Methods](#access-methods)
  - [Modification Methods](#modification-methods)
  - [Query Methods](#query-methods)
  - [Validation Methods](#validation-methods)
- [Custom Field Names](#custom-field-names)
- [Testing](#testing)
- [Development](#development)

## ✨ Features

- **Lightweight** - Each format bundle size is only 6-7 KB (ESM: 6.39 KB, CJS: 6.64 KB, UMD: 6.68 KB), minimal impact on project size
- **Tree-shaking Support** - Supports on-demand imports, only bundles the code you actually use, further reducing bundle size
- **Full TypeScript Support** - Provides complete type definitions and IntelliSense, improving development experience
- **Flexible Custom Field Names** - Supports custom children and id field names, adapting to various data structures
- **Zero Dependencies** - No external dependencies, ready to use out of the box, no need to worry about dependency conflicts
- **Comprehensive Test Coverage** - Contains 290 test cases with 99%+ test coverage (99.67% statement coverage, 99.32% branch coverage, 100% function coverage), covering basic functionality, edge cases, error handling, and complex scenarios
- **Rich API** - Provides 30+ methods, including array-like APIs (map, filter, find, some, every, includes, at, indexOf, etc.), and tree-specific operations (get parent/child nodes, depth calculation, data validation, etc.), covering complete scenarios for traversal, search, modification, and validation

**Supported methods:** mapTree, forEachTree, filterTree, findTree, pushTree, unshiftTree, popTree, shiftTree, someTree, everyTree, includesTree, atTree, indexOfTree, atIndexOfTree, dedupTree, removeTree, getParentTree, getChildrenTree, getSiblingsTree, getNodeDepthMap, getNodeDepth, isLeafNode, isRootNode, isEmptyTreeData, isEmptySingleTreeData, isTreeData, isSingleTreeData, isValidTreeNode, isTreeNodeWithCircularCheck, isSafeTreeDepth. The last parameter of each method can customize the property names for children and id.

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

## Traversal Methods

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

## Search Methods

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

## Access Methods

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

## Modification Methods

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

Remove the last child node under the specified node. Returns the removed node, or false if the node doesn't exist or has no children.

```javascript
// Remove the last child node under the node with ID 1
const removedNode = t.popTree(treeData, 1)
console.log(removedNode) // Returns the removed node object, or false

// Try to remove from a non-existent node
const popFailed = t.popTree(treeData, 999)
console.log(popFailed) // false
```

### shiftTree

Remove the first child node under the specified node. Returns the removed node, or false if the node doesn't exist or has no children.

```javascript
// Remove the first child node under the node with ID 1
const shiftedNode = t.shiftTree(treeData, 1)
console.log(shiftedNode) // Returns the removed node object, or false
```

### removeTree

Remove the node with the specified ID from tree-structured data, including root nodes and child nodes.

```javascript
const nodeIdToRemove = 2
const removeSuccess = t.removeTree(treeData, nodeIdToRemove)

console.log(removeSuccess) // true means successful removal, false means node not found
console.log(treeData) // Tree structure after removal
```

### dedupTree

Tree-structured object array deduplication method that removes duplicate nodes based on the specified key. Keeps the first occurrence of the node.

```javascript
// Deduplicate based on id field
const uniqueTreeData = t.dedupTree(treeData, 'id')
console.log(uniqueTreeData) // Returns deduplicated tree-structured data

// Deduplicate based on name field
const uniqueByNameTree = t.dedupTree(treeData, 'name')
console.log(uniqueByNameTree) // Returns data deduplicated by name
```

---

## Query Methods

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

## Validation Methods

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
# Run all tests
npm test

# Run tests and generate coverage report
npm run test:coverage

# Run tests (once, don't watch for file changes)
npm test -- --run
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build project
npm run build
```

<div align="center">

If this project helps you, please give it a ⭐️

Made with by [knott11]

</div>
