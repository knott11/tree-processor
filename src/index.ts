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
    
    // 如果是最后一个索引，直接返回节点
    if (i === path.length - 1) {
      return node;
    }
    
    // 获取子节点继续遍历
    const children = node[fieldNames.children];
    if (!Array.isArray(children)) {
      return null;
    }
    
    current = children;
  }
  
  // 这行代码理论上不可达，因为：
  // - 如果 path.length === 0，在 405 行已返回
  // - 如果 path.length > 0，在循环中当 i === path.length - 1 时会返回 node
  // 但为了类型安全和防御性编程，保留此返回语句作为兜底
  return null;
}

/**
 * 返回节点ID到深度的映射字典
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回节点ID到深度的映射对象
 */
export function getNodeDepthMap(
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
 * 获取指定节点的深度
 * @param tree 树结构数据
 * @param targetId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回节点的深度（从1开始，根节点深度为1），未找到返回 null
 */
export function getNodeDepth(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number | null {
  function findDepth(nodes: TreeData, depth: number = 1): number | null {
    for (const node of nodes) {
      // 如果当前节点就是目标节点，返回当前深度
      if (node[fieldNames.id] === targetId) {
        return depth;
      }
      
      // 递归检查子节点，深度加1
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const found = findDepth(children, depth + 1);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }
  
  return findDepth(tree);
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
 * @param fieldNames 自定义字段名配置（此参数在此函数中不生效，仅为保持API一致性）
 * @returns 如果树结构数据为空返回 true，否则返回 false
 */
export function isEmptyTreeData(
  tree: TreeData,
  fieldNames?: FieldNames
): boolean {
  // 此函数只检查数组是否为空，不访问 children 或 id 字段
  // fieldNames 参数仅为保持API一致性，实际不生效
  return !Array.isArray(tree) || tree.length === 0;
}

/**
 * 检查单个树结构数据是否为空
 * @param data 单个树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 如果单个树结构数据为空返回 true，否则返回 false
 */
export function isEmptySingleTreeData(
  data: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // 如果不是有效的单个树结构数据，视为空
  if (!isSingleTreeData(data, fieldNames)) {
    return true;
  }

  // 检查是否有 children 字段
  const children = data[fieldNames.children];

  // 如果没有 children 字段，视为空（只有根节点，没有子节点）
  if (children === undefined) {
    return true;
  }

  // 如果 children 是空数组，视为空
  if (!Array.isArray(children) || children.length === 0) {
    return true;
  }

  // 如果有子节点，即使子节点本身是空的，树本身也不为空
  // 只有当树本身没有子节点时，才视为空
  return false;
}

/**
 * 获取指定节点的所有直接子节点
 * @param tree 树结构数据
 * @param targetId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回子节点数组，如果未找到节点或没有子节点则返回空数组
 */
export function getChildrenTree(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode[] {
  function findNode(nodes: TreeData): TreeNode | null {
    for (const node of nodes) {
      if (node[fieldNames.id] === targetId) {
        return node;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const found = findNode(children);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }

  const targetNode = findNode(tree);
  if (!targetNode) {
    return [];
  }

  const children = targetNode[fieldNames.children];
  return Array.isArray(children) ? children : [];
}

/**
 * 获取指定节点的所有兄弟节点（包括自己）
 * @param tree 树结构数据
 * @param targetId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回兄弟节点数组，如果未找到节点则返回空数组
 */
export function getSiblingsTree(
  tree: TreeData,
  targetId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode[] {
  function findNodeAndParent(
    nodes: TreeData,
    parent: TreeNode | null = null
  ): { node: TreeNode; parent: TreeNode | null } | null {
    for (const node of nodes) {
      if (node[fieldNames.id] === targetId) {
        return { node, parent };
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const found = findNodeAndParent(children, node);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }

  const result = findNodeAndParent(tree);
  if (!result) {
    return [];
  }

  // 如果是根节点，兄弟节点是其他根节点
  if (result.parent === null) {
    return tree;
  }

  // 如果不是根节点，从父节点的 children 中获取
  const siblings = result.parent[fieldNames.children];
  return Array.isArray(siblings) ? siblings : [];
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
 * 判断数据是否是单个树结构数据（单个对象）
 * @param data 待判断的数据
 * @param fieldNames 自定义字段名配置
 * @returns 如果是单个树结构数据返回 true，否则返回 false
 */
export function isSingleTreeData(
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
      if (!isSingleTreeData(child, fieldNames)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 判断数据是否是树结构数据（数组）
 * @param data 待判断的数据
 * @param fieldNames 自定义字段名配置
 * @returns 如果是树结构数据返回 true，否则返回 false
 */
export function isTreeData(
  data: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // 必须是数组
  if (!Array.isArray(data)) {
    return false;
  }

  // 数组中的每个元素都必须是树结构
  for (const item of data) {
    if (!isSingleTreeData(item, fieldNames)) {
      return false;
    }
  }

  return true;
}

/**
 * 检查单个节点是否是有效的树节点结构（轻量级，不递归检查子节点）
 * @param value 待检查的值
 * @param fieldNames 自定义字段名配置
 * @returns 如果是有效的树节点结构返回 true，否则返回 false
 */
export function isValidTreeNode(
  value: unknown,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): value is TreeNode {
  // 必须是对象，不能是 null、undefined、数组或基本类型
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  // 检查 children 字段
  const children = (value as any)[fieldNames.children];
  
  // children 必须是 undefined 或数组
  return children === undefined || Array.isArray(children);
}

/**
 * 检查节点是否是有效的树节点结构，并检测循环引用
 * @param value 待检查的值
 * @param fieldNames 自定义字段名配置
 * @param visited 已访问的节点集合（用于检测循环引用）
 * @returns 如果是有效的树节点结构且无循环引用返回 true，否则返回 false
 */
export function isTreeNodeWithCircularCheck(
  value: unknown,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES,
  visited: WeakSet<object> = new WeakSet()
): boolean {
  // 必须是对象，不能是 null、undefined、数组或基本类型
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  
  // 检查循环引用
  if (visited.has(value as object)) {
    return false; // 发现循环引用
  }
  
  // 标记为已访问
  visited.add(value as object);
  
  // 检查 children 字段
  const children = (value as any)[fieldNames.children];
  
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
    
    // 递归检查每个子节点
    for (const child of children) {
      if (!isTreeNodeWithCircularCheck(child, fieldNames, visited)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * 检查树结构数据的深度是否安全（防止递归爆栈）
 * @param tree 树结构数据
 * @param maxDepth 最大允许深度
 * @param fieldNames 自定义字段名配置
 * @returns 如果深度安全（不超过 maxDepth）返回 true，否则返回 false
 */
export function isSafeTreeDepth(
  tree: TreeData,
  maxDepth: number,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // maxDepth 必须大于 0
  if (maxDepth <= 0) {
    return false;
  }
  
  function checkDepth(nodes: TreeData, currentDepth: number): boolean {
    // 如果当前深度超过最大深度，不安全
    if (currentDepth > maxDepth) {
      return false;
    }
    
    // 遍历所有节点
    for (const node of nodes) {
      const children = node[fieldNames.children];
      
      // 如果有子节点，递归检查
      if (Array.isArray(children) && children.length > 0) {
        if (!checkDepth(children, currentDepth + 1)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  return checkDepth(tree, 1);
}

/**
 * 检查节点是否是叶子节点（没有子节点）
 * @param node 树节点
 * @param fieldNames 自定义字段名配置
 * @returns 如果是叶子节点返回 true，否则返回 false
 */
export function isLeafNode(
  node: TreeNode,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // 检查 children 字段
  const children = node[fieldNames.children];
  
  // 如果没有 children 字段，或者 children 是空数组，则是叶子节点
  return children === undefined || !Array.isArray(children) || children.length === 0;
}

/**
 * 检查节点是否是根节点（没有父节点）
 * @param tree 树结构数据
 * @param nodeId 节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 如果是根节点返回 true，否则返回 false（节点不存在也返回 false）
 */
export function isRootNode(
  tree: TreeData,
  nodeId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  // 先检查节点是否存在
  if (!includesTree(tree, nodeId, fieldNames)) {
    return false;
  }
  
  // 根节点没有父节点，getParentTree 返回 null
  return getParentTree(tree, nodeId, fieldNames) === null;
}

/**
 * 将树结构数据转换为扁平数组
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回扁平化后的节点数组（不包含 children 字段）
 */
export function convertToArrayTree(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode[] {
  const result: TreeNode[] = [];
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      // 创建新对象，排除 children 字段
      const { [fieldNames.children]: _, ...nodeWithoutChildren } = node;
      result.push(nodeWithoutChildren);
      
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
 * 将任何数据结构转换为树结构数据
 * 支持：扁平数组（带 parentId）、Map、Record、对象等
 * @param data 待转换的数据，可以是数组、Map、Record 或对象
 * @param options 配置选项
 * @param options.rootParentId 根节点的 parentId 值，默认为 null（仅数组格式需要）
 * @param options.parentIdField 父节点ID字段名，默认为 'parentId'（仅数组格式需要）
 * @param options.fieldNames 自定义字段名配置
 * @returns 返回转换后的树结构数据
 */
export function convertBackTree(
  data: TreeNode[] | Map<any, TreeNode> | Record<string | number, TreeNode> | TreeNode,
  options: {
    rootParentId?: any;
    parentIdField?: string;
    fieldNames?: FieldNames;
  } = {}
): TreeData {
  const {
    rootParentId = null,
    parentIdField = 'parentId',
    fieldNames = DEFAULT_FIELD_NAMES,
  } = options;
  
  // 处理数组格式（扁平数组，需要 parentId）
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return [];
    }
    
    // 创建节点映射表，key 为节点ID，value 为节点对象
    const nodeMap = new Map<any, TreeNode>();
    
    // 第一遍遍历：创建所有节点，并添加 children 字段
    for (const item of data) {
      const nodeId = item[fieldNames.id];
      if (nodeId === undefined || nodeId === null) {
        continue; // 跳过没有 id 的节点
      }
      
      // 创建节点副本，确保有 children 字段
      const node: TreeNode = {
        ...item,
        [fieldNames.children]: [],
      };
      nodeMap.set(nodeId, node);
    }
    
    // 第二遍遍历：建立父子关系
    const rootNodes: TreeData = [];
    
    for (const item of data) {
      const nodeId = item[fieldNames.id];
      const parentId = item[parentIdField];
      
      if (nodeId === undefined || nodeId === null) {
        continue;
      }
      
      const node = nodeMap.get(nodeId);
      if (!node) {
        continue;
      }
      
      // 判断是否为根节点
      if (parentId === rootParentId || parentId === undefined || parentId === null) {
        rootNodes.push(node);
      } else {
        // 查找父节点
        const parent = nodeMap.get(parentId);
        if (parent) {
          const children = parent[fieldNames.children];
          if (Array.isArray(children)) {
            children.push(node);
          } else {
            parent[fieldNames.children] = [node];
          }
        } else {
          // 如果找不到父节点，将其作为根节点处理
          rootNodes.push(node);
        }
      }
    }
    
    return rootNodes;
  }
  
  // 处理 Map 格式
  if (data instanceof Map) {
    if (data.size === 0) {
      return [];
    }
    
    // Map 转数组，然后按数组方式处理
    const array: TreeNode[] = [];
    data.forEach((value, key) => {
      array.push({ ...value, [fieldNames.id]: key });
    });
    
    return convertBackTree(array, options);
  }
  
  // 处理 Record/对象格式（普通对象，不是 Map）
  if (data && typeof data === 'object' && !Array.isArray(data) && !(data instanceof Map)) {
    // 先检查是否是单个树节点对象（有 children 字段且是数组）
    const children = (data as TreeNode)[fieldNames.children];
    if (Array.isArray(children)) {
      // 是树节点对象，直接返回
      return [data as TreeNode];
    }
    
    // 检查是否是 Record 格式（键值对对象，所有值都是对象）
    const keys = Object.keys(data);
    if (keys.length > 0) {
      // 检查是否所有值都是对象（可能是 Record）
      let isRecord = true;
      for (const key of keys) {
        const value = (data as Record<string | number, TreeNode>)[key];
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          isRecord = false;
          break;
        }
      }
      
      if (isRecord) {
        // 作为 Record 处理
        const array: TreeNode[] = [];
        for (const key of keys) {
          const value = (data as Record<string | number, TreeNode>)[key];
          array.push({ ...value, [fieldNames.id]: key });
        }
        
        if (array.length > 0) {
          return convertBackTree(array, options);
        }
      }
    }
    
    // 如果都不是，尝试作为单个根节点
    return [{ ...data, [fieldNames.children]: [] }];
  }
  
  // 其他情况返回空数组
  return [];
}

/**
 * 将树结构数据转换为 Map，key 为节点 ID，value 为节点对象
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回 Map 对象，key 为节点 ID，value 为节点对象（不包含 children 字段）
 */
export function convertToMapTree(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): Map<any, TreeNode> {
  const result = new Map<any, TreeNode>();
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      const nodeId = node[fieldNames.id];
      if (nodeId !== undefined && nodeId !== null) {
        // 创建新对象，排除 children 字段
        const { [fieldNames.children]: _, ...nodeWithoutChildren } = node;
        result.set(nodeId, nodeWithoutChildren);
      }
      
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
 * 将树结构数据转换为层级数组（二维数组），按深度分组
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回二维数组，外层数组按深度索引，内层数组包含该深度的所有节点
 */
export function convertToLevelArrayTree(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode[][] {
  const result: TreeNode[][] = [];
  
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  function traverse(nodes: TreeData, depth: number = 0): void {
    // 确保该深度级别的数组存在
    if (!result[depth]) {
      result[depth] = [];
    }
    
    for (const node of nodes) {
      // 创建新对象，排除 children 字段
      const { [fieldNames.children]: _, ...nodeWithoutChildren } = node;
      result[depth].push(nodeWithoutChildren);
      
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children, depth + 1);
      }
    }
  }
  
  traverse(tree);
  return result;
}

/**
 * 将单根树结构数据转换为对象
 * @param tree 树结构数据（应该只有一个根节点）
 * @param fieldNames 自定义字段名配置
 * @returns 如果只有一个根节点，返回该节点对象；否则返回 null
 */
export function convertToObjectTree(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  if (!Array.isArray(tree) || tree.length === 0) {
    return null;
  }
  
  // 如果只有一个根节点，返回该节点
  if (tree.length === 1) {
    return tree[0];
  }
  
  // 多个根节点，返回 null
  return null;
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
  getNodeDepthMap,
  getNodeDepth,
  dedupTree,
  removeTree,
  forEachTree,
  isEmptyTreeData,
  isEmptySingleTreeData,
  getParentTree,
  getChildrenTree,
  getSiblingsTree,
  includesTree,
  isSingleTreeData,
  isTreeData,
  isValidTreeNode,
  isTreeNodeWithCircularCheck,
  isSafeTreeDepth,
  isLeafNode,
  isRootNode,
  convertToArrayTree,
  convertBackTree,
  convertToMapTree,
  convertToLevelArrayTree,
  convertToObjectTree,
};

export default treeProcessor;
