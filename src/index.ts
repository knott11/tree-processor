/**
 * 树结构数据处理的字段名配置
 */
export interface FieldNames {
  children: string;
  id: string;
}

/**
 * 默认字段名配置
 */
const DEFAULT_FIELD_NAMES: FieldNames = {
  children: 'children',
  id: 'id',
};

/**
 * 树节点类型
 */
export type TreeNode = Record<string, any>;

/**
 * 树结构数据（数组形式）
 */
export type TreeData = TreeNode[];

/**
 * 遍历树结构数据，对每个节点执行回调函数
 * @param tree 树结构数据
 * @param callback 回调函数，接收节点作为参数
 * @param fieldNames 自定义字段名配置
 * @returns 返回映射后的扁平数组
 */
export function mapTree(
  tree: TreeData,
  callback: (node: TreeNode) => any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): any[] {
  const result: any[] = [];
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      result.push(callback(node));
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children);
      }
    }
  }
  
  traverse(tree);
  return result;
}

/**
 * 过滤树结构数据，返回满足条件的节点
 * @param tree 树结构数据
 * @param filterFn 过滤函数
 * @param fieldNames 自定义字段名配置
 * @returns 返回满足条件的节点数组
 */
export function filterTree(
  tree: TreeData,
  filterFn: (node: TreeNode, index: number) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  const result: TreeData = [];
  
  function traverse(nodes: TreeData, parentIndex: number = 0): void {
    nodes.forEach((node, index) => {
      if (filterFn(node, index)) {
        result.push(node);
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children, index);
      }
    });
  }
  
  traverse(tree);
  return result;
}

/**
 * 查找树结构数据中满足条件的第一个节点
 * @param tree 树结构数据
 * @param conditionFn 条件函数
 * @param fieldNames 自定义字段名配置
 * @returns 返回找到的节点，未找到返回 null
 */
export function findTree(
  tree: TreeData,
  conditionFn: (node: TreeNode) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  for (const node of tree) {
    if (conditionFn(node)) {
      return node;
    }
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      const found = findTree(children, conditionFn, fieldNames);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * 在指定父节点下添加子节点（添加到末尾）
 * @param tree 树结构数据
 * @param targetParentId 目标父节点ID
 * @param newNode 新节点
 * @param fieldNames 自定义字段名配置
 * @returns 是否成功添加
 */
export function pushTree(
  tree: TreeData,
  targetParentId: any,
  newNode: TreeNode,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  function findAndPush(nodes: TreeData): boolean {
    for (const node of nodes) {
      if (node[fieldNames.id] === targetParentId) {
        if (!node[fieldNames.children]) {
          node[fieldNames.children] = [];
        }
        node[fieldNames.children].push(newNode);
        return true;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        if (findAndPush(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return findAndPush(tree);
}

/**
 * 在指定父节点下添加子节点（添加到开头）
 * @param tree 树结构数据
 * @param targetParentId 目标父节点ID
 * @param newNode 新节点
 * @param fieldNames 自定义字段名配置
 * @returns 是否成功添加
 */
export function unshiftTree(
  tree: TreeData,
  targetParentId: any,
  newNode: TreeNode,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  function findAndUnshift(nodes: TreeData): boolean {
    for (const node of nodes) {
      if (node[fieldNames.id] === targetParentId) {
        if (!node[fieldNames.children]) {
          node[fieldNames.children] = [];
        }
        node[fieldNames.children].unshift(newNode);
        return true;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        if (findAndUnshift(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return findAndUnshift(tree);
}

/**
 * 删除指定节点下的最后一个子节点
 * @param tree 树结构数据
 * @param rootId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 是否成功删除
 */
export function popTree(
  tree: TreeData,
  rootId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  function findAndPop(nodes: TreeData): boolean {
    for (const node of nodes) {
      if (node[fieldNames.id] === rootId) {
        const children = node[fieldNames.children];
        if (Array.isArray(children) && children.length > 0) {
          children.pop();
          return true;
        }
        return false;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        if (findAndPop(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return findAndPop(tree);
}

/**
 * 删除指定节点下的第一个子节点
 * @param tree 树结构数据
 * @param rootId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 是否成功删除
 */
export function shiftTree(
  tree: TreeData,
  rootId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  function findAndShift(nodes: TreeData): boolean {
    for (const node of nodes) {
      if (node[fieldNames.id] === rootId) {
        const children = node[fieldNames.children];
        if (Array.isArray(children) && children.length > 0) {
          children.shift();
          return true;
        }
        return false;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        if (findAndShift(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return findAndShift(tree);
}

/**
 * 检查树结构数据中是否存在满足条件的节点
 * @param tree 树结构数据
 * @param filterFn 过滤函数
 * @param fieldNames 自定义字段名配置
 * @returns 如果存在满足条件的节点返回 true，否则返回 false
 */
export function someTree(
  tree: TreeData,
  filterFn: (node: TreeNode) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  for (const node of tree) {
    if (filterFn(node)) {
      return true;
    }
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      if (someTree(children, filterFn, fieldNames)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 检查树结构数据中是否所有节点都满足条件
 * @param tree 树结构数据
 * @param filterFn 过滤函数
 * @param fieldNames 自定义字段名配置
 * @returns 如果所有节点都满足条件返回 true，否则返回 false
 */
export function everyTree(
  tree: TreeData,
  filterFn: (node: TreeNode) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  for (const node of tree) {
    if (!filterFn(node)) {
      return false;
    }
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      if (!everyTree(children, filterFn, fieldNames)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 根据父节点ID和子节点索引获取节点（支持负数索引）
 * @param tree 树结构数据
 * @param parentId 父节点ID
 * @param nodeIndex 子节点索引（支持负数）
 * @param fieldNames 自定义字段名配置
 * @returns 返回找到的节点，未找到返回 null
 */
export function atTree(
  tree: TreeData,
  parentId: any,
  nodeIndex: number,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  function findParent(nodes: TreeData): TreeNode | null {
    for (const node of nodes) {
      if (node[fieldNames.id] === parentId) {
        return node;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const found = findParent(children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  
  const parent = findParent(tree);
  if (!parent) {
    return null;
  }
  
  const children = parent[fieldNames.children];
  if (!Array.isArray(children) || children.length === 0) {
    return null;
  }
  
  // 处理负数索引
  const adjustedIndex = nodeIndex >= 0 
    ? nodeIndex 
    : children.length + nodeIndex;
  
  if (adjustedIndex >= 0 && adjustedIndex < children.length) {
    return children[adjustedIndex];
  }
  
  return null;
}

/**
 * 返回从根节点到目标节点的索引路径
 * @param tree 树结构数据
 * @param targetId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回索引路径数组，未找到返回 null
 */
export function indexOfTree(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number[] | null {
  function search(nodes: TreeData, path: number[] = []): number[] | null {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const currentPath = [...path, i];
      
      if (node[fieldNames.id] === targetId) {
        return currentPath;
      }
      
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const result = search(children, currentPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }
  
  return search(tree);
}

/**
 * 根据索引路径获取节点
 * @param tree 树结构数据
 * @param path 索引路径数组
 * @param fieldNames 自定义字段名配置
 * @returns 返回找到的节点，未找到返回 null
 */
export function atIndexOfTree(
  tree: TreeData,
  path: number[],
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  if (!Array.isArray(path) || path.length === 0) {
    return null;
  }
  
  let current: TreeData = tree;
  
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    if (!Array.isArray(current) || index < 0 || index >= current.length) {
      return null;
    }
    
    const node = current[index];
    
    if (i === path.length - 1) {
      return node;
    }
    
    const children = node[fieldNames.children];
    if (!Array.isArray(children)) {
      return null;
    }
    
    current = children;
  }
  
  return null;
}

/**
 * 返回节点ID到深度的映射字典
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回节点ID到深度的映射对象
 */
export function nodeDepthMap(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): Record<string, number> {
  const depthMap: Record<string, number> = {};
  
  function calculateDepth(nodes: TreeData, depth: number = 1): void {
    for (const node of nodes) {
      depthMap[node[fieldNames.id]] = depth;
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        calculateDepth(children, depth + 1);
      }
    }
  }
  
  calculateDepth(tree);
  return depthMap;
}

/**
 * 树结构数据去重
 * @param tree 树结构数据
 * @param key 用于去重的键名
 * @param fieldNames 自定义字段名配置
 * @returns 返回去重后的树结构数据
 */
export function dedupTree(
  tree: TreeData,
  key: string,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  const seenKeys = new Set<any>();
  const result: TreeData = [];
  
  function traverse(nodes: TreeData): TreeData {
    const uniqueNodes: TreeData = [];
    
    for (const node of nodes) {
      const nodeKey = node[key];
      
      if (nodeKey !== undefined && nodeKey !== null) {
        if (seenKeys.has(nodeKey)) {
          continue;
        }
        seenKeys.add(nodeKey);
      }
      
      const newNode: TreeNode = { ...node };
      
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        newNode[fieldNames.children] = traverse(children);
      }
      
      uniqueNodes.push(newNode);
    }
    
    return uniqueNodes;
  }
  
  return traverse(tree);
}

/**
 * 删除树结构数据中指定ID的节点
 * @param tree 树结构数据
 * @param targetId 要删除的节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 是否成功删除
 */
export function removeTree(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  function removeFromNodes(nodes: TreeData): boolean {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // 如果当前节点就是要删除的节点
      if (node[fieldNames.id] === targetId) {
        nodes.splice(i, 1);
        return true;
      }
      
      // 递归检查子节点
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        if (removeFromNodes(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return removeFromNodes(tree);
}

/**
 * 遍历树结构数据，对每个节点执行回调函数（不返回值）
 * @param tree 树结构数据
 * @param callback 回调函数，接收节点作为参数
 * @param fieldNames 自定义字段名配置
 */
export function forEachTree(
  tree: TreeData,
  callback: (node: TreeNode) => void,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): void {
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      callback(node);
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children);
      }
    }
  }
  
  traverse(tree);
}

/**
 * 检查树结构数据是否为空
 * @param tree 树结构数据
 * @returns 如果树为空返回 true，否则返回 false
 */
export function isEmptyTree(
  tree: TreeData
): boolean {
  return !Array.isArray(tree) || tree.length === 0;
}

/**
 * 获取指定节点的父节点
 * @param tree 树结构数据
 * @param targetId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回父节点，未找到返回 null（根节点没有父节点，返回 null）
 */
export function getParentTree(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  function findParent(nodes: TreeData, parent: TreeNode | null = null): TreeNode | null {
    for (const node of nodes) {
      // 如果当前节点就是目标节点，返回其父节点
      if (node[fieldNames.id] === targetId) {
        return parent;
      }
      
      // 递归检查子节点，当前节点作为父节点传入
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const found = findParent(children, node);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }
  
  return findParent(tree);
}

/**
 * 检查树结构数据中是否包含指定ID的节点
 * @param tree 树结构数据
 * @param targetId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 如果包含该节点返回 true，否则返回 false
 */
export function includesTree(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  for (const node of tree) {
    if (node[fieldNames.id] === targetId) {
      return true;
    }
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      if (includesTree(children, targetId, fieldNames)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 判断数据是否是单个树结构（单个对象）
 * @param data 待判断的数据
 * @param fieldNames 自定义字段名配置
 * @returns 如果是单个树结构返回 true，否则返回 false
 */
export function isSingleTree(
  data: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // 必须是对象，不能是 null、undefined、数组或基本类型
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  // 检查是否有 children 字段
  const children = data[fieldNames.children];
  
  // 如果 children 字段存在
  if (children !== undefined) {
    // 如果是 null，不是有效的树结构
    if (children === null) {
      return false;
    }
    
    // 必须是数组
    if (!Array.isArray(children)) {
      return false;
    }
    
    // 递归检查每个子节点是否也是树结构
    for (const child of children) {
      if (!isSingleTree(child, fieldNames)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 判断数据是否是多个树结构（数组）
 * @param data 待判断的数据
 * @param fieldNames 自定义字段名配置
 * @returns 如果是多个树结构返回 true，否则返回 false
 */
export function isMultipleTrees(
  data: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // 必须是数组
  if (!Array.isArray(data)) {
    return false;
  }

  // 数组中的每个元素都必须是树结构
  for (const item of data) {
    if (!isSingleTree(item, fieldNames)) {
      return false;
    }
  }

  return true;
}

/**
 * 默认导出对象，包含所有方法
 */
const treeProcessor = {
  mapTree,
  filterTree,
  findTree,
  pushTree,
  unshiftTree,
  popTree,
  shiftTree,
  someTree,
  everyTree,
  atTree,
  indexOfTree,
  atIndexOfTree,
  nodeDepthMap,
  dedupTree,
  removeTree,
  forEachTree,
  isEmptyTree,
  getParentTree,
  includesTree,
  isSingleTree,
  isMultipleTrees,
};

export default treeProcessor;
