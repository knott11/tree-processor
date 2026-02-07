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
  
  function traverse(nodes: TreeData): void {
    nodes.forEach((node, index) => {
      if (filterFn(node, index)) {
        result.push(node);
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children);
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
  function findParentAndPush(nodes: TreeData): boolean {
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
        if (findParentAndPush(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return findParentAndPush(tree);
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
  function findParentAndUnshift(nodes: TreeData): boolean {
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
        if (findParentAndUnshift(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return findParentAndUnshift(tree);
}

/**
 * 删除指定节点下的最后一个子节点
 * @param tree 树结构数据
 * @param targetNodeId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回被删除的节点，如果节点不存在或没有子节点则返回 null
 */
export function popTree(
  tree: TreeData,
  targetNodeId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  function findParentAndPop(nodes: TreeData): TreeNode | null {
    for (const node of nodes) {
      if (node[fieldNames.id] === targetNodeId) {
        const children = node[fieldNames.children];
        if (Array.isArray(children) && children.length > 0) {
          return children.pop() || null;
        }
        return null;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const result = findParentAndPop(children);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }
  
  return findParentAndPop(tree);
}

/**
 * 删除指定节点下的第一个子节点
 * @param tree 树结构数据
 * @param targetNodeId 目标节点ID
 * @param fieldNames 自定义字段名配置
 * @returns 返回被删除的节点，如果节点不存在或没有子节点则返回 null
 */
export function shiftTree(
  tree: TreeData,
  targetNodeId: any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeNode | null {
  function findParentAndShift(nodes: TreeData): TreeNode | null {
    for (const node of nodes) {
      if (node[fieldNames.id] === targetNodeId) {
        const children = node[fieldNames.children];
        if (Array.isArray(children) && children.length > 0) {
          return children.shift() || null;
        }
        return null;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const result = findParentAndShift(children);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }
  
  return findParentAndShift(tree);
}

/**
 * 检查树结构数据中是否存在满足条件的节点
 * @param tree 树结构数据
 * @param predicate 判断条件函数
 * @param fieldNames 自定义字段名配置
 * @returns 如果存在满足条件的节点返回 true，否则返回 false
 */
export function someTree(
  tree: TreeData,
  predicate: (node: TreeNode) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  for (const node of tree) {
    if (predicate(node)) {
      return true;
    }
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      if (someTree(children, predicate, fieldNames)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 检查树结构数据中是否所有节点都满足条件
 * @param tree 树结构数据
 * @param predicate 判断条件函数
 * @param fieldNames 自定义字段名配置
 * @returns 如果所有节点都满足条件返回 true，否则返回 false
 */
export function everyTree(
  tree: TreeData,
  predicate: (node: TreeNode) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): boolean {
  for (const node of tree) {
    if (!predicate(node)) {
      return false;
    }
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      if (!everyTree(children, predicate, fieldNames)) {
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
  const normalizedIndex = nodeIndex >= 0 
    ? nodeIndex 
    : children.length + nodeIndex;
  
  if (normalizedIndex >= 0 && normalizedIndex < children.length) {
    return children[normalizedIndex];
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
 * @param dedupKey 用于去重的键名（字符串）或键名数组（多字段联合去重）或自定义函数
 * @param fieldNames 自定义字段名配置
 * @returns 返回去重后的树结构数据
 */
export function dedupTree(
  tree: TreeData,
  dedupKey: string | string[] | ((node: TreeNode) => any),
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  const visitedKeys = new Set<any>();
  
  // 生成去重键的函数
  const getDedupKey = (node: TreeNode): any => {
    if (typeof dedupKey === 'function') {
      // 自定义函数
      return dedupKey(node);
    } else if (Array.isArray(dedupKey)) {
      // 多字段联合去重：使用分隔符连接，性能优于 JSON.stringify
      const values: any[] = [];
      let hasValue = false;
      
      for (const key of dedupKey) {
        const value = node[key];
        if (value !== undefined && value !== null) {
          hasValue = true;
          // 将值转换为字符串，使用特殊分隔符避免冲突
          // 使用 \u0001 作为分隔符（不可见字符，不会出现在普通数据中）
          values.push(String(value));
        } else {
          values.push('');
        }
      }
      
      // 如果所有值都是 undefined 或 null，返回特殊标记
      if (!hasValue) {
        return undefined;
      }
      
      // 使用分隔符连接，性能优于 JSON.stringify
      return values.join('\u0001');
    } else {
      // 单字段去重（原有逻辑）
      return node[dedupKey];
    }
  };
  
  function traverse(nodes: TreeData): TreeData {
    const uniqueNodes: TreeData = [];
    
    for (const node of nodes) {
      const uniqueKey = getDedupKey(node);
      
      if (uniqueKey !== undefined && uniqueKey !== null) {
        if (visitedKeys.has(uniqueKey)) {
          continue;
        }
        visitedKeys.add(uniqueKey);
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
  function removeNodeFromTree(nodes: TreeData): boolean {
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
        if (removeNodeFromTree(children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  return removeNodeFromTree(tree);
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
  for (const node of data) {
    if (!isSingleTreeData(node, fieldNames)) {
      return false;
    }
  }

  return true;
}

/**
 * 检查单个节点是否是有效的树节点结构（轻量级，不递归检查子节点）
 * @param node 待检查的节点
 * @param fieldNames 自定义字段名配置
 * @returns 如果是有效的树节点结构返回 true，否则返回 false
 */
export function isValidTreeNode(
  node: unknown,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): node is TreeNode {
  // 必须是对象，不能是 null、undefined、数组或基本类型
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return false;
  }
  
  // 检查 children 字段
  const children = (node as any)[fieldNames.children];
  
  // children 必须是 undefined 或数组
  return children === undefined || Array.isArray(children);
}

/**
 * 检查节点是否是有效的树节点结构，并检测循环引用
 * @param node 待检查的节点
 * @param fieldNames 自定义字段名配置
 * @param visited 已访问的节点集合（用于检测循环引用）
 * @returns 如果是有效的树节点结构且无循环引用返回 true，否则返回 false
 */
export function isTreeNodeWithCircularCheck(
  node: unknown,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES,
  visited: WeakSet<object> = new WeakSet()
): boolean {
  // 必须是对象，不能是 null、undefined、数组或基本类型
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return false;
  }
  
  // 检查循环引用
  if (visited.has(node as object)) {
    return false; // 发现循环引用
  }
  
  // 标记为已访问
  visited.add(node as object);
  
  // 检查 children 字段
  const children = (node as any)[fieldNames.children];
  
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
  // 合并遍历：同时检查节点是否存在并获取父节点，避免重复遍历
  function findNodeAndParent(nodes: TreeData, parent: TreeNode | null = null): { found: boolean; isRoot: boolean } {
    for (const node of nodes) {
      // 如果当前节点就是目标节点
      if (node[fieldNames.id] === nodeId) {
        // 如果父节点为 null，说明是根节点
        return { found: true, isRoot: parent === null };
      }
      
      // 递归检查子节点
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const result = findNodeAndParent(children, node);
        if (result.found) {
          return result;
        }
      }
    }
    return { found: false, isRoot: false };
  }
  
  const result = findNodeAndParent(tree);
  return result.found && result.isRoot;
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
    for (const node of data) {
      const nodeId = node[fieldNames.id];
      if (nodeId === undefined || nodeId === null) {
        continue; // 跳过没有 id 的节点
      }
      
      // 创建节点副本，确保有 children 字段
      const treeNode: TreeNode = {
        ...node,
        [fieldNames.children]: [],
      };
      nodeMap.set(nodeId, treeNode);
    }
    
    // 第二遍遍历：建立父子关系
    const rootNodes: TreeData = [];
    
    for (const dataNode of data) {
      const nodeId = dataNode[fieldNames.id];
      const parentId = dataNode[parentIdField];
      
      if (nodeId === undefined || nodeId === null) {
        continue;
      }
      
      const treeNode = nodeMap.get(nodeId);
      if (!treeNode) {
        continue;
      }
      
      // 判断是否为根节点
      if (parentId === rootParentId || parentId === undefined || parentId === null) {
        rootNodes.push(treeNode);
      } else {
        // 查找父节点
        const parent = nodeMap.get(parentId);
        if (parent) {
          const children = parent[fieldNames.children];
          if (Array.isArray(children)) {
            children.push(treeNode);
          } else {
            parent[fieldNames.children] = [treeNode];
          }
        } else {
          // 如果找不到父节点，将其作为根节点处理
          rootNodes.push(treeNode);
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
 * 深拷贝树结构数据
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回深拷贝后的树结构数据（完全独立，不修改原树）
 */
export function cloneTree(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  // 递归深拷贝单个节点及其所有子节点
  function deepCloneNode(node: TreeNode): TreeNode {
    const cloned: TreeNode = { ...node };
    
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      cloned[fieldNames.children] = children.map(child => deepCloneNode(child));
    }
    
    return cloned;
  }
  
  // 深拷贝所有节点
  return tree.map(node => deepCloneNode(node));
}

/**
 * 浅拷贝树结构数据（只拷贝第一层，子节点共享引用）
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回浅拷贝后的树结构数据（第一层独立，子节点共享引用）
 */
export function shallowCloneTree(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  // 只拷贝第一层节点，子节点保持引用
  return tree.map(node => ({ ...node }));
}

/**
 * 从指定节点开始拷贝子树
 * @param tree 树结构数据
 * @param target 目标节点对象，例如 { id: 1 } 或 { name: 'xxx' } 或 { code: 'xxx' }，对象只能包含一个字段
 * @param fieldNames 自定义字段名配置（可选，用于自定义 children 字段名，查找字段由 target 对象的键名决定）
 * @returns 返回拷贝的子树（深拷贝），如果未找到节点返回空数组
 */
export function cloneSubtree(
  tree: TreeData,
  target: Record<string, any>,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  // 必须传对象，对象只能有一个键值对
  if (!target || typeof target !== 'object' || Array.isArray(target) || target.constructor !== Object) {
    throw new Error('cloneSubtree: 必须传入对象，例如 { id: 1 } 或 { name: "xxx" }');
  }
  
  const keys = Object.keys(target);
  if (keys.length === 0) {
    return [];
  }
  if (keys.length > 1) {
    throw new Error('cloneSubtree: 查找对象只能包含一个字段，例如 { id: 1 } 或 { name: "xxx" }');
  }
  
  // 查找字段由对象的键名决定，不使用 fieldNames.id
  const fieldToSearch = keys[0];
  const targetValue = target[fieldToSearch];
  
  // 递归查找目标节点
  function findNode(nodes: TreeData): TreeNode | null {
    for (const node of nodes) {
      if (node[fieldToSearch] === targetValue) {
        return node;
      }
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        const found = findNode(children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  
  // 深拷贝单个节点及其所有子节点
  function deepCloneNode(node: TreeNode): TreeNode {
    const cloned: TreeNode = { ...node };
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      cloned[fieldNames.children] = children.map(child => deepCloneNode(child));
    }
    return cloned;
  }
  
  const targetNode = findNode(tree);
  if (!targetNode) {
    return [];
  }
  
  // 返回拷贝的子树
  return [deepCloneNode(targetNode)];
}

/**
 * 拷贝树结构数据并对每个节点应用转换函数
 * @param tree 树结构数据
 * @param transform 转换函数，接收节点并返回转换后的节点
 * @param fieldNames 自定义字段名配置
 * @returns 返回转换后的树结构数据（深拷贝，不修改原树）
 */
export function cloneWithTransform(
  tree: TreeData,
  transform: (node: TreeNode) => TreeNode,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  // 递归拷贝并转换节点
  function cloneAndTransformNode(node: TreeNode): TreeNode {
    // 先转换节点
    const transformedNode = transform(node);
    const cloned: TreeNode = { ...transformedNode };
    
    const children = node[fieldNames.children];
    if (Array.isArray(children) && children.length > 0) {
      cloned[fieldNames.children] = children.map(child => cloneAndTransformNode(child));
    }
    
    return cloned;
  }
  
  // 拷贝并转换所有节点
  return tree.map(node => cloneAndTransformNode(node));
}

/**
 * 判断参数是否是 FieldNames 类型
 */
function isFieldNames(arg: any): arg is FieldNames {
  return (
    arg &&
    typeof arg === 'object' &&
    !Array.isArray(arg) &&
    'children' in arg &&
    'id' in arg &&
    typeof arg.children === 'string' &&
    typeof arg.id === 'string' &&
    Object.keys(arg).length === 2
  );
}

/**
 * 连接多个树结构数据（不带 fieldNames）
 */
export function concatTree(...trees: TreeData[]): TreeData;

/**
 * 连接多个树结构数据（带 fieldNames）
 */
export function concatTree(...args: [...TreeData[], FieldNames]): TreeData;

/**
 * 连接多个树结构数据
 * @param args 树结构数据数组，最后一个参数可以是 fieldNames（可选）
 * @returns 返回连接后的树结构数据（深拷贝，不修改原树）
 */
export function concatTree(...args: TreeData[] | [...TreeData[], FieldNames]): TreeData {
  const lastArg = args[args.length - 1];
  let fieldNames: FieldNames;
  let trees: TreeData[];
  
  if (isFieldNames(lastArg)) {
    // 最后一个参数是 FieldNames
    fieldNames = lastArg;
    trees = args.slice(0, -1) as TreeData[];
  } else {
    // 所有参数都是 TreeData
    fieldNames = DEFAULT_FIELD_NAMES;
    trees = args as TreeData[];
  }
  
  const result: TreeData = [];
  
  for (const tree of trees) {
    if (Array.isArray(tree) && tree.length > 0) {
      // 使用传入的 fieldNames 或默认值
      result.push(...cloneTree(tree, fieldNames));
    }
  }
  
  return result;
}

/**
 * 对树结构数据进行排序
 * @param tree 树结构数据
 * @param compareFn 比较函数，与 Array.sort 的 compareFn 相同
 * @param fieldNames 自定义字段名配置
 * @returns 返回排序后的树结构数据（深拷贝，不修改原树）
 */
export function sortTree(
  tree: TreeData,
  compareFn?: (a: TreeNode, b: TreeNode) => number,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  // 深拷贝树
  const clonedTree = cloneTree(tree, fieldNames);
  
  // 递归排序
  function sortNodes(nodes: TreeData): void {
    // 对当前层级排序
    nodes.sort(compareFn);
    
    // 递归排序子节点
    for (const node of nodes) {
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        sortNodes(children);
      }
    }
  }
  
  sortNodes(clonedTree);
  return clonedTree;
}

/**
 * 对树结构数据进行归约操作
 * @param tree 树结构数据
 * @param reducer 归约函数，接收累加值和当前节点，返回新的累加值
 * @param initialValue 初始值
 * @param fieldNames 自定义字段名配置
 * @returns 返回归约后的结果
 */
export function reduceTree<T>(
  tree: TreeData,
  reducer: (accumulator: T, node: TreeNode) => T,
  initialValue: T,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): T {
  let accumulator = initialValue;
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      accumulator = reducer(accumulator, node);
      
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children);
      }
    }
  }
  
  traverse(tree);
  return accumulator;
}

/**
 * 对树结构数据进行切片操作（仅对根节点进行切片，不递归处理子节点）
 * @param tree 树结构数据
 * @param start 起始索引（包含）
 * @param end 结束索引（不包含），可选
 * @param fieldNames 自定义字段名配置
 * @returns 返回切片后的树结构数据（深拷贝，不修改原树）
 */
export function sliceTree(
  tree: TreeData,
  start?: number,
  end?: number,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeData {
  if (!Array.isArray(tree) || tree.length === 0) {
    return [];
  }
  
  // 对根节点进行切片
  const sliced = tree.slice(start, end);
  
  // 深拷贝切片后的节点
  return cloneTree(sliced, fieldNames);
}

/**
 * 聚合操作类型
 */
type AggregateOperation = 'sum' | 'avg' | 'max' | 'min' | 'count';

/**
 * 聚合配置
 */
interface AggregateConfig {
  operation: AggregateOperation;
  field?: string;
}

/**
 * 聚合选项
 */
interface AggregateOptions {
  groupBy: (node: TreeNode) => any;
  aggregations: Record<string, AggregateConfig>;
}

/**
 * 按分组聚合树结构数据
 * @param tree 树结构数据
 * @param options 聚合选项
 * @param fieldNames 自定义字段名配置
 * @returns 返回按分组聚合的结果
 */
export function aggregateTree(
  tree: TreeData,
  options: AggregateOptions,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): Record<string, Record<string, any>> {
  const result: Record<string, Record<string, any>> = {};
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      const groupKey = String(options.groupBy(node));
      
      if (!result[groupKey]) {
        result[groupKey] = {};
        // 初始化所有聚合字段
        for (const [key, config] of Object.entries(options.aggregations)) {
          if (config.operation === 'count') {
            result[groupKey][key] = 0;
          } else if (config.operation === 'avg') {
            result[groupKey][key] = { sum: 0, count: 0 };
          } else if (config.operation === 'max') {
            result[groupKey][key] = config.field ? (node[config.field] ?? null) : null;
          } else if (config.operation === 'min') {
            result[groupKey][key] = config.field ? (node[config.field] ?? null) : null;
          } else {
            result[groupKey][key] = 0;
          }
        }
      }
      
      // 执行聚合操作
      for (const [key, config] of Object.entries(options.aggregations)) {
        const { operation, field } = config;
        
        if (operation === 'count') {
          result[groupKey][key]++;
        } else if (operation === 'avg') {
          if (field) {
            const value = node[field] ?? 0;
            result[groupKey][key].sum += value;
            result[groupKey][key].count++;
          }
        } else if (operation === 'max') {
          if (field) {
            const value = node[field];
            if (value !== undefined && value !== null) {
              if (result[groupKey][key] === null || value > result[groupKey][key]) {
                result[groupKey][key] = value;
              }
            }
          }
        } else if (operation === 'min') {
          if (field) {
            const value = node[field];
            if (value !== undefined && value !== null) {
              if (result[groupKey][key] === null || value < result[groupKey][key]) {
                result[groupKey][key] = value;
              }
            }
          }
        } else if (operation === 'sum') {
          if (field) {
            result[groupKey][key] += node[field] ?? 0;
          }
        }
      }
      
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children);
      }
    }
  }
  
  traverse(tree);
  
  // 处理平均值
  for (const groupKey in result) {
    for (const [key, config] of Object.entries(options.aggregations)) {
      if (config.operation === 'avg' && result[groupKey][key].count > 0) {
        result[groupKey][key] = result[groupKey][key].sum / result[groupKey][key].count;
      } else if (config.operation === 'avg' && result[groupKey][key].count === 0) {
        result[groupKey][key] = 0;
      }
    }
  }
  
  return result;
}

/**
 * 按字段分组树结构数据
 * @param tree 树结构数据
 * @param field 分组字段名
 * @param fieldNames 自定义字段名配置
 * @returns 返回按字段分组的节点数组
 */
export function groupTree(
  tree: TreeData,
  field: string,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): Record<string, TreeNode[]> {
  const result: Record<string, TreeNode[]> = {};
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      const groupKey = String(node[field] ?? '');
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(node);
      
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
 * 按条件分组树结构数据
 * @param tree 树结构数据
 * @param groupFn 分组函数，接收节点并返回分组键
 * @param fieldNames 自定义字段名配置
 * @returns 返回按条件分组的节点数组
 */
export function groupByTree(
  tree: TreeData,
  groupFn: (node: TreeNode) => any,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): Record<string, TreeNode[]> {
  const result: Record<string, TreeNode[]> = {};
  
  function traverse(nodes: TreeData): void {
    for (const node of nodes) {
      const groupKey = String(groupFn(node) ?? '');
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(node);
      
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
 * 计算树结构数据中某个字段的总和
 * @param tree 树结构数据
 * @param field 字段名
 * @param fieldNames 自定义字段名配置
 * @returns 返回字段值的总和
 */
export function sumTree(
  tree: TreeData,
  field: string,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number {
  return reduceTree(
    tree,
    (sum, node) => sum + (node[field] ?? 0),
    0,
    fieldNames
  );
}

/**
 * 计算树结构数据中某个字段的平均值
 * @param tree 树结构数据
 * @param field 字段名
 * @param fieldNames 自定义字段名配置
 * @returns 返回字段值的平均值
 */
export function avgTree(
  tree: TreeData,
  field: string,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number {
  let sum = 0;
  let count = 0;
  
  reduceTree(
    tree,
    (_, node) => {
      const value = node[field];
      if (value !== undefined && value !== null) {
        sum += value;
        count++;
      }
      return null;
    },
    null,
    fieldNames
  );
  
  return count > 0 ? sum / count : 0;
}

/**
 * 获取树结构数据中某个字段的最大值
 * @param tree 树结构数据
 * @param field 字段名
 * @param fieldNames 自定义字段名配置
 * @returns 返回最大值，如果树为空返回 null
 */
export function maxTree(
  tree: TreeData,
  field: string,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number | null {
  let max: number | null = null;
  let hasValue = false;
  
  reduceTree(
    tree,
    (_, node) => {
      const value = node[field];
      if (value !== undefined && value !== null && typeof value === 'number') {
        if (!hasValue || value > max!) {
          max = value;
          hasValue = true;
        }
      }
      return null;
    },
    null,
    fieldNames
  );
  
  return hasValue ? max : null;
}

/**
 * 获取树结构数据中某个字段的最小值
 * @param tree 树结构数据
 * @param field 字段名
 * @param fieldNames 自定义字段名配置
 * @returns 返回最小值，如果树为空返回 null
 */
export function minTree(
  tree: TreeData,
  field: string,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number | null {
  let min: number | null = null;
  let hasValue = false;
  
  reduceTree(
    tree,
    (_, node) => {
      const value = node[field];
      if (value !== undefined && value !== null && typeof value === 'number') {
        if (!hasValue || value < min!) {
          min = value;
          hasValue = true;
        }
      }
      return null;
    },
    null,
    fieldNames
  );
  
  return hasValue ? min : null;
}

/**
 * 统计树结构数据中满足条件的节点数量
 * @param tree 树结构数据
 * @param conditionFn 统计条件函数，可选，不传则统计所有节点
 * @param fieldNames 自定义字段名配置
 * @returns 返回节点数量
 */
export function countTree(
  tree: TreeData,
  conditionFn?: (node: TreeNode) => boolean,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): number {
  if (!conditionFn) {
    // 统计所有节点
    return reduceTree(
      tree,
      (count) => count + 1,
      0,
      fieldNames
    );
  }
  
  // 统计满足条件的节点
  return reduceTree(
    tree,
    (count, node) => count + (conditionFn(node) ? 1 : 0),
    0,
    fieldNames
  );
}

/**
 * 树结构统计信息
 */
export interface TreeStats {
  totalNodes: number;
  leafNodes: number;
  maxDepth: number;
  minDepth: number;
  avgDepth: number;
  levels: number;
}

/**
 * 获取树结构数据的统计信息
 * @param tree 树结构数据
 * @param fieldNames 自定义字段名配置
 * @returns 返回统计信息
 */
export function getTreeStats(
  tree: TreeData,
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeStats {
  if (!Array.isArray(tree) || tree.length === 0) {
    return {
      totalNodes: 0,
      leafNodes: 0,
      maxDepth: 0,
      minDepth: 0,
      avgDepth: 0,
      levels: 0,
    };
  }
  
  let totalNodes = 0;
  let leafNodes = 0;
  let maxDepth = 0;
  let minDepth = Infinity;
  let depthSum = 0;
  
  function traverse(nodes: TreeData, depth: number): void {
    for (const node of nodes) {
      totalNodes++;
      depthSum += depth;
      
      if (depth > maxDepth) {
        maxDepth = depth;
      }
      if (depth < minDepth) {
        minDepth = depth;
      }
      
      const children = node[fieldNames.children];
      if (Array.isArray(children) && children.length > 0) {
        traverse(children, depth + 1);
      } else {
        leafNodes++;
      }
    }
  }
  
  traverse(tree, 1);
  
  return {
    totalNodes,
    leafNodes,
    maxDepth,
    minDepth: minDepth === Infinity ? 0 : minDepth,
    avgDepth: totalNodes > 0 ? depthSum / totalNodes : 0,
    levels: maxDepth,
  };
}

/**
 * 树结构分析选项
 */
export interface AnalyzeTreeOptions {
  // 基础统计
  includeBasic?: boolean;  // 包含基础统计（totalNodes, leafNodes, internalNodes, maxDepth, minDepth, avgDepth, levels）
  includeLevelAnalysis?: boolean;  // 包含层级分析（byLevel, maxWidth, avgWidth, widthByLevel）
  includeBranchingFactor?: boolean;  // 包含分支因子分析（avgBranchingFactor, maxBranchingFactor, minBranchingFactor, branchingFactorDistribution）
  includeDepthDistribution?: boolean;  // 包含深度分布（depthDistribution）
  includeBalanceAnalysis?: boolean;  // 包含平衡性分析（depthVariance, isBalanced, balanceRatio）
  includePathAnalysis?: boolean;  // 包含路径分析（avgPathLength, maxPathLength, minPathLength）
  includeLeafAnalysis?: boolean;  // 包含叶子节点分析（leafNodeRatio, leafNodesByLevel）
}

/**
 * 树结构分析结果
 */
export interface TreeAnalysis {
  // 基础统计
  totalNodes: number;
  leafNodes: number;
  internalNodes: number;
  maxDepth: number;
  minDepth: number;
  avgDepth: number;
  levels: number;
  
  // 层级分析
  byLevel: Record<number, number>;
  maxWidth: number;
  avgWidth: number;
  widthByLevel: Record<number, number>;
  
  // 分支因子分析
  avgBranchingFactor: number;
  maxBranchingFactor: number;
  minBranchingFactor: number;
  branchingFactorDistribution: Record<number, number>;
  
  // 深度分布
  depthDistribution: Record<number, number>;
  
  // 平衡性分析
  depthVariance: number;
  isBalanced: boolean;
  balanceRatio: number;
  
  // 路径分析
  avgPathLength: number;
  maxPathLength: number;
  minPathLength: number;
  
  // 叶子节点分析
  leafNodeRatio: number;
  leafNodesByLevel: Record<number, number>;
}

/**
 * 分析树结构数据的分布情况，提供全面的统计分析
 * @param tree 树结构数据
 * @param options 分析选项，可指定需要计算的统计项（可选，默认计算所有统计项）
 * @param fieldNames 自定义字段名配置
 * @returns 返回详细的分析结果
 */
export function analyzeTree(
  tree: TreeData,
  options: AnalyzeTreeOptions = {},
  fieldNames: FieldNames = DEFAULT_FIELD_NAMES
): TreeAnalysis {
  // 如果没有指定选项，默认计算所有统计项（向后兼容）
  const {
    includeBasic = true,
    includeLevelAnalysis = true,
    includeBranchingFactor = true,
    includeDepthDistribution = true,
    includeBalanceAnalysis = true,
    includePathAnalysis = true,
    includeLeafAnalysis = true,
  } = options;
  // 初始化结果对象
  const createEmptyResult = (): TreeAnalysis => ({
    totalNodes: 0,
    leafNodes: 0,
    internalNodes: 0,
    maxDepth: 0,
    minDepth: 0,
    avgDepth: 0,
    levels: 0,
    byLevel: {},
    maxWidth: 0,
    avgWidth: 0,
    widthByLevel: {},
    avgBranchingFactor: 0,
    maxBranchingFactor: 0,
    minBranchingFactor: 0,
    branchingFactorDistribution: {},
    depthDistribution: {},
    depthVariance: 0,
    isBalanced: false,
    balanceRatio: 0,
    avgPathLength: 0,
    maxPathLength: 0,
    minPathLength: 0,
    leafNodeRatio: 0,
    leafNodesByLevel: {},
  });

  if (!Array.isArray(tree) || tree.length === 0) {
    return createEmptyResult();
  }
  
  // 根据选项初始化需要计算的统计项
  const byLevel: Record<number, number> = includeLevelAnalysis ? {} : {};
  const widthByLevel: Record<number, number> = includeLevelAnalysis ? {} : {};
  const depthDistribution: Record<number, number> = includeDepthDistribution ? {} : {};
  const leafNodesByLevel: Record<number, number> = includeLeafAnalysis ? {} : {};
  const branchingFactorDistribution: Record<number, number> = includeBranchingFactor ? {} : {};
  
  let totalNodes = 0;
  let leafNodes = 0;
  let internalNodes = 0;
  let maxDepth = 0;
  let minDepth = Infinity;
  let depthSum = 0;
  let maxWidth = 0;
  let totalWidth = 0;
  let levelCount = 0;
  let totalBranchingFactor = 0;
  let nodesWithChildren = 0;
  let maxBranchingFactor = 0;
  let minBranchingFactor = Infinity;
  let pathLengthSum = 0;
  let maxPathLength = 0;
  let minPathLength = Infinity;
  // 只在需要计算平衡性分析时存储深度值
  const depths: number[] = includeBalanceAnalysis ? [] : [];
  
  function traverse(nodes: TreeData, depth: number, pathLength: number): void {
    // 统计当前层级的节点数和宽度（仅在需要时计算）
    const currentLevelWidth = nodes.length;
    
    if (includeLevelAnalysis) {
      byLevel[depth] = (byLevel[depth] || 0) + currentLevelWidth;
      widthByLevel[depth] = (widthByLevel[depth] || 0) + currentLevelWidth;
      
      if (currentLevelWidth > maxWidth) {
        maxWidth = currentLevelWidth;
      }
      totalWidth += currentLevelWidth;
      levelCount++;
    }
    
    for (const node of nodes) {
      totalNodes++;
      const currentDepth = depth + 1;
      
      if (includeBasic) {
        depthSum += currentDepth;
        if (currentDepth > maxDepth) {
          maxDepth = currentDepth;
        }
        if (currentDepth < minDepth) {
          minDepth = currentDepth;
        }
      }
      
      // 只在需要计算平衡性分析时存储深度值
      if (includeBalanceAnalysis) {
        depths.push(currentDepth);
      }
      
      // 统计深度分布（仅在需要时计算）
      if (includeDepthDistribution) {
        depthDistribution[currentDepth] = (depthDistribution[currentDepth] || 0) + 1;
      }
      
      // 路径长度分析（仅在需要时计算）
      if (includePathAnalysis) {
        const currentPathLength = pathLength + 1;
        pathLengthSum += currentPathLength;
        if (currentPathLength > maxPathLength) {
          maxPathLength = currentPathLength;
        }
        if (currentPathLength < minPathLength) {
          minPathLength = currentPathLength;
        }
      }
      
      const children = node[fieldNames.children];
      const childCount = Array.isArray(children) ? children.length : 0;
      
      if (childCount > 0) {
        if (includeBasic) {
          internalNodes++;
        }
        
        if (includeBranchingFactor) {
          totalBranchingFactor += childCount;
          nodesWithChildren++;
          
          // 分支因子分布
          branchingFactorDistribution[childCount] = (branchingFactorDistribution[childCount] || 0) + 1;
          
          if (childCount > maxBranchingFactor) {
            maxBranchingFactor = childCount;
          }
          if (childCount < minBranchingFactor) {
            minBranchingFactor = childCount;
          }
        }
        
        const nextPathLength = includePathAnalysis ? pathLength + 1 : pathLength;
        traverse(children, currentDepth, nextPathLength);
      } else {
        if (includeBasic) {
          leafNodes++;
        }
        
        // 叶子节点分析（仅在需要时计算）
        if (includeLeafAnalysis) {
          leafNodesByLevel[currentDepth] = (leafNodesByLevel[currentDepth] || 0) + 1;
        }
      }
    }
  }
  
  traverse(tree, 0, 0);
  
  // 计算平均值（仅在需要时计算）
  const avgDepth = includeBasic && totalNodes > 0 ? depthSum / totalNodes : 0;
  const avgWidth = includeLevelAnalysis && levelCount > 0 ? totalWidth / levelCount : 0;
  const avgBranchingFactor = includeBranchingFactor && nodesWithChildren > 0 ? totalBranchingFactor / nodesWithChildren : 0;
  const avgPathLength = includePathAnalysis && totalNodes > 0 ? pathLengthSum / totalNodes : 0;
  const leafNodeRatio = includeLeafAnalysis && totalNodes > 0 ? leafNodes / totalNodes : 0;
  
  // 计算深度方差（平衡性指标，仅在需要时计算）
  let depthVariance = 0;
  let isBalanced = false;
  let balanceRatio = 0;
  
  if (includeBalanceAnalysis) {
    if (depths.length > 0) {
      const averageDepth = avgDepth;
      const squaredDiffs = depths.reduce((sum, depth) => sum + Math.pow(depth - averageDepth, 2), 0);
      depthVariance = squaredDiffs / depths.length;
    }
    
    // 判断是否平衡（深度方差较小，且最大深度和最小深度差距不大）
    const depthRange = maxDepth - minDepth;
    isBalanced = depthVariance < 2 && depthRange <= 2;
    balanceRatio = maxDepth > 0 ? minDepth / maxDepth : 0;
  }
  
  return {
    totalNodes: includeBasic ? totalNodes : 0,
    leafNodes: includeBasic ? leafNodes : 0,
    internalNodes: includeBasic ? internalNodes : 0,
    maxDepth: includeBasic ? maxDepth : 0,
    minDepth: includeBasic ? (minDepth === Infinity ? 0 : minDepth) : 0,
    avgDepth,
    levels: includeBasic ? maxDepth : 0,
    byLevel: includeLevelAnalysis ? byLevel : {},
    maxWidth: includeLevelAnalysis ? maxWidth : 0,
    avgWidth,
    widthByLevel: includeLevelAnalysis ? widthByLevel : {},
    avgBranchingFactor,
    maxBranchingFactor: includeBranchingFactor ? (maxBranchingFactor === 0 ? 0 : maxBranchingFactor) : 0,
    minBranchingFactor: includeBranchingFactor ? (minBranchingFactor === Infinity ? 0 : minBranchingFactor) : 0,
    branchingFactorDistribution: includeBranchingFactor ? branchingFactorDistribution : {},
    depthDistribution: includeDepthDistribution ? depthDistribution : {},
    depthVariance,
    isBalanced,
    balanceRatio,
    avgPathLength,
    maxPathLength: includePathAnalysis ? maxPathLength : 0,
    minPathLength: includePathAnalysis ? (minPathLength === Infinity ? 0 : minPathLength) : 0,
    leafNodeRatio,
    leafNodesByLevel: includeLeafAnalysis ? leafNodesByLevel : {},
  };
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
  cloneTree,
  shallowCloneTree,
  cloneSubtree,
  cloneWithTransform,
  concatTree,
  sortTree,
  reduceTree,
  sliceTree,
  aggregateTree,
  groupTree,
  groupByTree,
  sumTree,
  avgTree,
  maxTree,
  minTree,
  countTree,
  getTreeStats,
  analyzeTree,
};

export default treeProcessor;
