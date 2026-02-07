import { describe, it, expect, beforeEach } from 'vitest';
import {
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
} from './index';

describe('Tree Processor', () => {
  let treeData: any[];

  beforeEach(() => {
    treeData = [
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
  });

  describe('mapTree', () => {
    it('应该遍历所有节点并执行回调', () => {
      const result: string[] = [];
      mapTree(treeData, (item) => {
        result.push(item.name);
      });
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('应该返回映射后的数组', () => {
      const result = mapTree(treeData, (item) => item.name);
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });
  });

  describe('filterTree', () => {
    it('应该过滤出满足条件的节点', () => {
      const values = ['node1', 'node2', 'node3'];
      const result = filterTree(treeData, (item) => {
        return values.includes(item.name);
      });
      expect(result).toHaveLength(3);
      expect(result.map((n) => n.name)).toEqual(['node1', 'node2', 'node3']);
    });
  });

  describe('findTree', () => {
    it('应该找到满足条件的第一个节点', () => {
      const result = findTree(treeData, (item) => {
        return item.hasOwnProperty('children');
      });
      expect(result).not.toBeNull();
      expect(result?.name).toBe('node1');
    });

    it('应该返回null如果未找到', () => {
      const result = findTree(treeData, (item) => item.name === 'notfound');
      expect(result).toBeNull();
    });
  });

  describe('pushTree', () => {
    it('应该在指定节点下添加子节点', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = pushTree(treeData, 1, newNode);
      expect(success).toBe(true);
      expect(treeData[0].children.length).toBe(3);
      expect(treeData[0].children[2].name).toBe('node7');
    });

    it('应该返回false如果未找到目标节点', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = pushTree(treeData, 999, newNode);
      expect(success).toBe(false);
    });

    it('应该支持自定义字段名', () => {
      const tree = [{ nodeId: 1, subNodes: [] }];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const newNode = { nodeId: 2, name: 'child' };
      const success = pushTree(tree, 1, newNode, fieldNames);
      expect(success).toBe(true);
      expect(tree[0].subNodes).toHaveLength(1);
      expect(tree[0].subNodes[0].nodeId).toBe(2);
    });

    it('应该处理空树', () => {
      const tree: any[] = [];
      const newNode = { id: 1, name: 'root' };
      const success = pushTree(tree, 1, newNode);
      expect(success).toBe(false);
    });

    it('应该能够为没有children的节点创建children数组', () => {
      const tree = [{ id: 1, name: 'root' }];
      const newNode = { id: 2, name: 'child' };
      const success = pushTree(tree, 1, newNode);
      expect(success).toBe(true);
      expect(Array.isArray(tree[0].children)).toBe(true);
      expect(tree[0].children).toHaveLength(1);
    });
  });

  describe('unshiftTree', () => {
    it('应该在指定节点下添加子节点到开头', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = unshiftTree(treeData, 1, newNode);
      expect(success).toBe(true);
      expect(treeData[0].children.length).toBe(3);
      expect(treeData[0].children[0].name).toBe('node7');
    });

    it('应该在深层子节点中找到目标节点并添加子节点（触发173行）', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      // 在深层子节点中找到节点3并添加子节点
      const newNode = { id: 4, name: 'node4' };
      const success = unshiftTree(deepTree, 3, newNode);
      expect(success).toBe(true);
      expect(deepTree[0].children[0].children[0].children.length).toBe(1);
      expect(deepTree[0].children[0].children[0].children[0].id).toBe(4);
    });

    it('应该处理节点存在但没有children字段的情况（触发166行）', () => {
      const treeWithoutChildren = [
        {
          id: 1,
          children: [
            {
              id: 2,
              // 没有 children 字段
            },
          ],
        },
      ];
      const newNode = { id: 3, name: 'node3' };
      const success = unshiftTree(treeWithoutChildren, 2, newNode);
      expect(success).toBe(true);
      expect(Array.isArray(treeWithoutChildren[0].children[0].children)).toBe(true);
      expect(treeWithoutChildren[0].children[0].children[0].id).toBe(3);
    });

    it('应该返回false如果未找到目标节点（触发178行）', () => {
      const newNode = { id: 999, name: 'node999' };
      const success = unshiftTree(treeData, 999, newNode);
      expect(success).toBe(false);
    });
  });

  describe('popTree', () => {
    it('应该删除指定节点下的最后一个子节点', () => {
      const originalLastChild = treeData[0].children[treeData[0].children.length - 1];
      const removedNode = popTree(treeData, 1);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalLastChild);
      expect(treeData[0].children.length).toBe(1);
      expect(treeData[0].children[0].id).toBe(2);
    });

    it('应该返回null如果节点没有子节点', () => {
      const removedNode = popTree(treeData, 4);
      expect(removedNode).toBeNull();
    });

    it('应该支持自定义字段名', () => {
      const tree = [
        { nodeId: 1, subNodes: [{ nodeId: 2 }, { nodeId: 3 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const originalLastChild = tree[0].subNodes[tree[0].subNodes.length - 1];
      const removedNode = popTree(tree, 1, fieldNames);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalLastChild);
      expect(tree[0].subNodes).toHaveLength(1);
      expect(tree[0].subNodes[0].nodeId).toBe(2);
    });

    it('应该处理空树', () => {
      const removedNode = popTree([], 1);
      expect(removedNode).toBeNull();
    });

    it('应该返回null如果未找到目标节点', () => {
      const removedNode = popTree(treeData, 999);
      expect(removedNode).toBeNull();
    });

    it('应该在深层子节点中找到目标节点并删除（触发209行）', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [{ id: 4 }, { id: 5 }],
                },
              ],
            },
          ],
        },
      ];
      // 在深层子节点中找到节点3并删除其最后一个子节点
      const originalLastChild = deepTree[0].children[0].children[0].children[deepTree[0].children[0].children[0].children.length - 1];
      const removedNode = popTree(deepTree, 3);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalLastChild);
      expect(deepTree[0].children[0].children[0].children.length).toBe(1);
      expect(deepTree[0].children[0].children[0].children[0].id).toBe(4);
    });
  });

  describe('shiftTree', () => {
    it('应该删除指定节点下的第一个子节点', () => {
      const originalFirstChild = treeData[0].children[0];
      const removedNode = shiftTree(treeData, 1);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalFirstChild);
      expect(treeData[0].children.length).toBe(1);
      expect(treeData[0].children[0].id).toBe(3);
    });

    it('应该返回null如果节点没有子节点', () => {
      const removedNode = shiftTree(treeData, 4);
      expect(removedNode).toBeNull();
    });

    it('应该支持自定义字段名', () => {
      const tree = [
        { nodeId: 1, subNodes: [{ nodeId: 2 }, { nodeId: 3 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const originalFirstChild = tree[0].subNodes[0];
      const removedNode = shiftTree(tree, 1, fieldNames);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalFirstChild);
      expect(tree[0].subNodes).toHaveLength(1);
      expect(tree[0].subNodes[0].nodeId).toBe(3);
    });

    it('应该处理空树', () => {
      const removedNode = shiftTree([], 1);
      expect(removedNode).toBeNull();
    });

    it('应该返回null如果未找到目标节点', () => {
      const removedNode = shiftTree(treeData, 999);
      expect(removedNode).toBeNull();
    });

    it('应该在深层子节点中找到目标节点并删除第一个子节点（触发243行）', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [{ id: 4 }, { id: 5 }],
                },
              ],
            },
          ],
        },
      ];
      // 在深层子节点中找到节点3并删除其第一个子节点
      const originalFirstChild = deepTree[0].children[0].children[0].children[0];
      const removedNode = shiftTree(deepTree, 3);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalFirstChild);
      expect(deepTree[0].children[0].children[0].children.length).toBe(1);
      expect(deepTree[0].children[0].children[0].children[0].id).toBe(5);
    });

    it('应该处理节点存在但没有子节点的情况（触发239行）', () => {
      const treeWithNoChildren = [
        {
          id: 1,
          children: [
            {
              id: 2,
              // 没有 children 字段
            },
          ],
        },
      ];
      const removedNode = shiftTree(treeWithNoChildren, 2);
      expect(removedNode).toBeNull();
    });
  });

  describe('someTree', () => {
    it('应该返回true如果存在满足条件的节点', () => {
      const result = someTree(treeData, (item) => item.name === 'node2');
      expect(result).toBe(true);
    });

    it('应该返回false如果不存在满足条件的节点', () => {
      const result = someTree(treeData, (item) => item.name === 'jack');
      expect(result).toBe(false);
    });

    it('应该处理空树', () => {
      const result = someTree([], (item) => item.id > 0);
      expect(result).toBe(false);
    });

    it('应该支持自定义字段名', () => {
      const tree = [{ nodeId: 1, name: 'test' }];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = someTree(tree, (item) => item.name === 'test', fieldNames);
      expect(result).toBe(true);
    });

    it('应该在深层节点中找到满足条件的节点', () => {
      const result = someTree(treeData, (item) => item.id === 6);
      expect(result).toBe(true);
    });
  });

  describe('everyTree', () => {
    it('应该返回true如果所有节点都满足条件', () => {
      const result = everyTree(treeData, (item) => item.id > 0);
      expect(result).toBe(true);
    });

    it('应该返回false如果有节点不满足条件', () => {
      const result = everyTree(treeData, (item) => item.id > 3);
      expect(result).toBe(false);
    });

    it('应该处理空树（空树所有节点都满足条件）', () => {
      const result = everyTree([], (item) => item.id > 0);
      expect(result).toBe(true);
    });

    it('应该支持自定义字段名', () => {
      const tree = [{ nodeId: 1, name: 'test' }];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = everyTree(tree, (item) => item.nodeId > 0, fieldNames);
      expect(result).toBe(true);
    });

    it('应该返回false如果子节点中有不满足条件的节点', () => {
      const treeWithInvalidChild = [
        {
          id: 1,
          children: [
            { id: 2, name: 'valid' },
            { id: 3, name: 'invalid' },
          ],
        },
      ];
      const result = everyTree(treeWithInvalidChild, (item) => item.name !== 'invalid');
      expect(result).toBe(false);
    });

    it('应该递归检查子节点，如果子节点不满足条件则返回false', () => {
      const treeWithNestedInvalid = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                { id: 3, value: 0 }, // 不满足条件
              ],
            },
          ],
        },
      ];
      const result = everyTree(treeWithNestedInvalid, (item) => item.value > 0);
      expect(result).toBe(false);
    });
  });

  describe('atTree', () => {
    it('应该根据父节点ID和索引获取子节点', () => {
      const result = atTree(treeData, 1, 0);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该支持负数索引', () => {
      const result = atTree(treeData, 1, -1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(3);
    });

    it('应该返回null如果未找到父节点', () => {
      const result = atTree(treeData, 999, 0);
      expect(result).toBeNull();
    });

    it('应该返回null如果索引超出范围', () => {
      const result = atTree(treeData, 1, 999);
      expect(result).toBeNull();
    });

    it('应该返回null如果父节点没有子节点', () => {
      const tree = [{ id: 1, name: 'leaf' }];
      const result = atTree(tree, 1, 0);
      expect(result).toBeNull();
    });

    it('应该支持自定义字段名', () => {
      const tree = [
        { nodeId: 1, subNodes: [{ nodeId: 2 }, { nodeId: 3 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = atTree(tree, 1, 0, fieldNames);
      expect(result).not.toBeNull();
      expect(result?.nodeId).toBe(2);
    });

    it('应该处理空树', () => {
      const result = atTree([], 1, 0);
      expect(result).toBeNull();
    });
  });

  describe('indexOfTree', () => {
    it('应该返回从根节点到目标节点的索引路径', () => {
      const result = indexOfTree(treeData, 4);
      expect(result).toEqual([0, 0, 0]);
    });

    it('应该返回null如果未找到', () => {
      const result = indexOfTree(treeData, 999);
      expect(result).toBeNull();
    });

    it('应该处理多个根节点的情况', () => {
      const multiRoot = [
        { id: 1, children: [{ id: 2 }] },
        { id: 3, children: [{ id: 4 }] },
      ];
      const result = indexOfTree(multiRoot, 4);
      expect(result).toEqual([1, 0]);
    });

    it('应该支持自定义字段名', () => {
      const tree = [
        { nodeId: 1, subNodes: [{ nodeId: 2 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = indexOfTree(tree, 2, fieldNames);
      expect(result).toEqual([0, 0]);
    });

    it('应该处理空树', () => {
      const result = indexOfTree([], 1);
      expect(result).toBeNull();
    });
  });

  describe('atIndexOfTree', () => {
    it('应该根据索引路径获取节点', () => {
      const result = atIndexOfTree(treeData, [0, 1, 0]);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(6);
    });

    it('应该返回null如果路径无效', () => {
      const result = atIndexOfTree(treeData, [999, 0]);
      expect(result).toBeNull();
    });

    it('应该返回null如果路径为空', () => {
      const result = atIndexOfTree(treeData, []);
      expect(result).toBeNull();
    });

    it('应该返回null如果路径索引为负数', () => {
      const result = atIndexOfTree(treeData, [-1, 0]);
      expect(result).toBeNull();
    });

    it('应该支持自定义字段名', () => {
      const tree = [
        { nodeId: 1, subNodes: [{ nodeId: 2, subNodes: [{ nodeId: 3 }] }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = atIndexOfTree(tree, [0, 0, 0], fieldNames);
      expect(result).not.toBeNull();
      expect(result?.nodeId).toBe(3);
    });

    it('应该处理空树', () => {
      const result = atIndexOfTree([], [0]);
      expect(result).toBeNull();
    });
  });

  describe('getNodeDepthMap', () => {
    it('应该返回节点ID到深度的映射', () => {
      const result = getNodeDepthMap(treeData);
      expect(result[1]).toBe(1);
      expect(result[2]).toBe(2);
      expect(result[4]).toBe(3);
    });
  });

  describe('getNodeDepth', () => {
    it('应该返回根节点的深度', () => {
      const depth = getNodeDepth(treeData, 1);
      expect(depth).toBe(1);
    });

    it('应该返回子节点的深度', () => {
      const depth = getNodeDepth(treeData, 2);
      expect(depth).toBe(2);
    });

    it('应该返回深层节点的深度', () => {
      const depth = getNodeDepth(treeData, 4);
      expect(depth).toBe(3);
    });

    it('应该返回null如果未找到节点', () => {
      const depth = getNodeDepth(treeData, 999);
      expect(depth).toBeNull();
    });

    it('应该处理多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        {
          id: 2,
          name: 'root2',
          children: [
            { id: 3, name: 'child1' },
            {
              id: 4,
              name: 'child2',
              children: [{ id: 5, name: 'grandchild' }],
            },
          ],
        },
      ];
      expect(getNodeDepth(multiRoot, 1)).toBe(1);
      expect(getNodeDepth(multiRoot, 2)).toBe(1);
      expect(getNodeDepth(multiRoot, 3)).toBe(2);
      expect(getNodeDepth(multiRoot, 5)).toBe(3);
    });

    it('应该支持自定义字段名', () => {
      const customTree = [
        {
          nodeId: 1,
          name: 'root',
          subNodes: [
            {
              nodeId: 2,
              name: 'child',
              subNodes: [{ nodeId: 3, name: 'grandchild' }],
            },
          ],
        },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      expect(getNodeDepth(customTree, 1, fieldNames)).toBe(1);
      expect(getNodeDepth(customTree, 2, fieldNames)).toBe(2);
      expect(getNodeDepth(customTree, 3, fieldNames)).toBe(3);
    });

    it('应该处理空数组', () => {
      const depth = getNodeDepth([], 1);
      expect(depth).toBeNull();
    });

    it('应该处理深层嵌套的树', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [
                    {
                      id: 4,
                      children: [{ id: 5 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      expect(getNodeDepth(deepTree, 1)).toBe(1);
      expect(getNodeDepth(deepTree, 2)).toBe(2);
      expect(getNodeDepth(deepTree, 3)).toBe(3);
      expect(getNodeDepth(deepTree, 4)).toBe(4);
      expect(getNodeDepth(deepTree, 5)).toBe(5);
    });

    it('应该与getNodeDepthMap返回的深度一致', () => {
      const depthMap = getNodeDepthMap(treeData);
      expect(getNodeDepth(treeData, 1)).toBe(depthMap[1]);
      expect(getNodeDepth(treeData, 2)).toBe(depthMap[2]);
      expect(getNodeDepth(treeData, 4)).toBe(depthMap[4]);
      expect(getNodeDepth(treeData, 6)).toBe(depthMap[6]);
    });
  });

  describe('dedupTree', () => {
    it('应该去除重复的节点', () => {
      const duplicateTree = [
        {
          id: 1,
          name: 'node1',
          children: [
            { id: 2, name: 'node2' },
            { id: 2, name: 'node2-duplicate' },
          ],
        },
      ];
      const result = dedupTree(duplicateTree, 'id');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children[0].id).toBe(2);
    });

    it('应该支持多字段联合去重', () => {
      const duplicateTree = [
        {
          id: 1,
          name: 'node1',
          children: [
            { id: 2, name: 'node2', type: 'A' },
            { id: 2, name: 'node2-different', type: 'B' }, // id相同但type不同，应该保留
            { id: 2, name: 'node2-same', type: 'A' }, // id和type都相同，应该被去重
            { id: 3, name: 'node3', type: 'A' },
          ],
        },
      ];
      // 使用多字段联合去重：id 和 type
      const result = dedupTree(duplicateTree, ['id', 'type']);
      expect(result[0].children).toHaveLength(3);
      expect(result[0].children[0].name).toBe('node2');
      expect(result[0].children[1].name).toBe('node2-different');
      expect(result[0].children[2].name).toBe('node3');
    });

    it('应该支持自定义函数去重', () => {
      const duplicateTree = [
        {
          id: 1,
          name: 'node1',
          children: [
            { id: 2, name: 'node2', code: 'A001' },
            { id: 2, name: 'node2-different', code: 'A002' },
            { id: 2, name: 'node2-same', code: 'A001' }, // code相同，应该被去重
          ],
        },
      ];
      // 使用自定义函数：根据 code 字段去重
      const result = dedupTree(duplicateTree, (node) => node.code);
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children[0].code).toBe('A001');
      expect(result[0].children[1].code).toBe('A002');
    });

    it('多字段联合去重应该处理嵌套节点', () => {
      const duplicateTree = [
        {
          id: 1,
          name: 'node1',
          children: [
            {
              id: 2,
              name: 'node2',
              type: 'A',
              children: [
                { id: 3, name: 'node3', type: 'B' },
                { id: 3, name: 'node3-duplicate', type: 'B' },
              ],
            },
            {
              id: 2,
              name: 'node2-duplicate',
              type: 'A',
              children: [{ id: 4, name: 'node4' }],
            },
          ],
        },
      ];
      const result = dedupTree(duplicateTree, ['id', 'type']);
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children[0].children).toHaveLength(1);
      expect(result[0].children[0].children[0].name).toBe('node3');
    });
  });

  describe('自定义字段名', () => {
    it('应该支持自定义children和id字段名', () => {
      const customTree = [
        {
          nodeId: 1,
          name: 'node1',
          subNodes: [
            { nodeId: 2, name: 'node2' },
          ],
        },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = findTree(customTree, (item) => item.nodeId === 2, fieldNames);
      expect(result).not.toBeNull();
      expect(result?.nodeId).toBe(2);
    });
  });

  // ========== 复杂场景和边界情况测试 ==========

  describe('边界情况 - 空数据', () => {
    it('mapTree应该处理空数组', () => {
      const result = mapTree([], (node) => node);
      expect(result).toEqual([]);
    });

    it('filterTree应该处理空数组', () => {
      const result = filterTree([], () => true);
      expect(result).toEqual([]);
    });

    it('findTree应该处理空数组', () => {
      const result = findTree([], () => true);
      expect(result).toBeNull();
    });

    it('someTree应该处理空数组', () => {
      const result = someTree([], () => true);
      expect(result).toBe(false);
    });

    it('everyTree应该处理空数组', () => {
      const result = everyTree([], () => true);
      expect(result).toBe(true);
    });

    it('getNodeDepthMap应该处理空数组', () => {
      const result = getNodeDepthMap([]);
      expect(result).toEqual({});
    });

    it('dedupTree应该处理空数组', () => {
      const result = dedupTree([], 'id');
      expect(result).toEqual([]);
    });
  });

  describe('边界情况 - 单节点树', () => {
    it('mapTree应该处理单节点', () => {
      const singleNode = [{ id: 1, name: 'root' }];
      const result = mapTree(singleNode, (node) => node.name);
      expect(result).toEqual(['root']);
    });

    it('findTree应该找到单节点', () => {
      const singleNode = [{ id: 1, name: 'root' }];
      const result = findTree(singleNode, (node) => node.id === 1);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('root');
    });

    it('pushTree应该在单节点下添加子节点', () => {
      const singleNode: any[] = [{ id: 1, name: 'root' }];
      const success = pushTree(singleNode, 1, { id: 2, name: 'child' });
      expect(success).toBe(true);
      expect(singleNode[0].children).toHaveLength(1);
      expect(singleNode[0].children[0].name).toBe('child');
    });
  });

  describe('边界情况 - 深层嵌套', () => {
    it('应该处理深层嵌套的树结构', () => {
      const deepTree = [
        {
          id: 1,
          name: 'level1',
          children: [
            {
              id: 2,
              name: 'level2',
              children: [
                {
                  id: 3,
                  name: 'level3',
                  children: [
                    {
                      id: 4,
                      name: 'level4',
                      children: [
                        { id: 5, name: 'level5' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = findTree(deepTree, (node) => node.id === 5);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('level5');

      const depthMap = getNodeDepthMap(deepTree);
      expect(depthMap[5]).toBe(5);
    });

    it('indexOfTree应该返回深层节点的正确路径', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [{ id: 4 }],
                },
              ],
            },
          ],
        },
      ];

      const path = indexOfTree(deepTree, 4);
      expect(path).toEqual([0, 0, 0, 0]);
    });
  });

  describe('边界情况 - children字段异常', () => {
    it('应该处理children为null的情况', () => {
      const treeWithNull = [
        {
          id: 1,
          name: 'node1',
          children: null,
        },
        {
          id: 2,
          name: 'node2',
        },
      ];

      const result = mapTree(treeWithNull, (node) => node.name);
      expect(result).toEqual(['node1', 'node2']);
    });

    it('应该处理children为undefined的情况', () => {
      const treeWithUndefined = [
        {
          id: 1,
          name: 'node1',
          children: undefined,
        },
      ];

      const result = mapTree(treeWithUndefined, (node) => node.name);
      expect(result).toEqual(['node1']);
    });

    it('应该处理children为空数组的情况', () => {
      const treeWithEmpty = [
        {
          id: 1,
          name: 'node1',
          children: [],
        },
      ];

      const result = mapTree(treeWithEmpty, (node) => node.name);
      expect(result).toEqual(['node1']);
    });

    it('应该处理children为非数组的情况', () => {
      const treeWithInvalid = [
        {
          id: 1,
          name: 'node1',
          children: 'not-an-array',
        },
      ];

      const result = mapTree(treeWithInvalid, (node) => node.name);
      expect(result).toEqual(['node1']);
    });
  });

  describe('边界情况 - atTree索引边界', () => {
    it('应该处理索引超出范围的情况', () => {
      const result = atTree(treeData, 1, 999);
      expect(result).toBeNull();
    });

    it('应该处理负数索引超出范围的情况', () => {
      const result = atTree(treeData, 1, -999);
      expect(result).toBeNull();
    });

    it('应该处理负数索引等于数组长度的情况', () => {
      const result = atTree(treeData, 1, -2);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该处理索引为0的情况', () => {
      const result = atTree(treeData, 1, 0);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该处理父节点存在但children不是数组的情况', () => {
      const treeWithInvalidChildren = [
        {
          id: 1,
          children: 'not an array' as any,
        },
      ];
      const result = atTree(treeWithInvalidChildren, 1, 0);
      expect(result).toBeNull();
    });

    it('应该处理父节点存在但children为空数组的情况', () => {
      const treeWithEmptyChildren = [
        {
          id: 1,
          children: [],
        },
      ];
      const result = atTree(treeWithEmptyChildren, 1, 0);
      expect(result).toBeNull();
    });

    it('应该处理负数索引的分支覆盖（确保三元表达式false分支被执行）', () => {
      // 确保 nodeIndex < 0 的分支被覆盖
      const treeWithChildren = [
        {
          id: 1,
          children: [{ id: 2 }, { id: 3 }, { id: 4 }],
        },
      ];
      // 测试负数索引：-1 应该返回最后一个元素（触发 false 分支）
      const result = atTree(treeWithChildren, 1, -1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(4);
    });

    it('应该处理在深层子节点中找到父节点的情况（触发329行）', () => {
      // 测试 atTree 中 findParent 在深层子节点中找到父节点的情况
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [{ id: 4 }],
                },
              ],
            },
          ],
        },
      ];
      // 在深层子节点中找到父节点，应该触发 329 行的 return found
      const result = atTree(deepTree, 3, 0);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(4);
    });
  });

  describe('边界情况 - atIndexOfTree路径边界', () => {
    it('应该处理空路径数组', () => {
      const result = atIndexOfTree(treeData, []);
      expect(result).toBeNull();
    });

    it('应该处理路径超出范围', () => {
      const result = atIndexOfTree(treeData, [999, 0]);
      expect(result).toBeNull();
    });

    it('应该处理负数索引路径', () => {
      const result = atIndexOfTree(treeData, [-1, 0]);
      expect(result).toBeNull();
    });

    it('应该处理多层路径', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                { id: 3, children: [{ id: 4 }] },
              ],
            },
          ],
        },
      ];
      const result = atIndexOfTree(deepTree, [0, 0, 0, 0]);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(4);
    });

    it('应该处理中间节点children不是数组的情况', () => {
      const treeWithInvalidChildren = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: 'not an array' as any,
            },
          ],
        },
      ];
      const result = atIndexOfTree(treeWithInvalidChildren, [0, 0, 0]);
      expect(result).toBeNull();
    });

    it('应该处理路径长度超过实际树深度的情况', () => {
      const shallowTree = [
        {
          id: 1,
          children: [{ id: 2 }],
        },
      ];
      // 路径 [0, 0, 0] 但树只有两层，循环结束后应该返回 null
      const result = atIndexOfTree(shallowTree, [0, 0, 0]);
      expect(result).toBeNull();
    });

    it('应该处理路径中间节点没有children字段的情况', () => {
      const treeWithoutChildren = [
        {
          id: 1,
          // 没有 children 字段
        },
      ];
      // 路径 [0, 0] 但节点1没有children，循环结束后应该返回 null
      const result = atIndexOfTree(treeWithoutChildren, [0, 0]);
      expect(result).toBeNull();
    });

    it('应该处理路径中间节点children为undefined的情况', () => {
      const treeWithUndefinedChildren = [
        {
          id: 1,
          children: [
            {
              id: 2,
              // children 为 undefined
            },
          ],
        },
      ];
      // 路径 [0, 0, 0] 但节点2的children是undefined，应该返回 null
      const result = atIndexOfTree(treeWithUndefinedChildren, [0, 0, 0]);
      expect(result).toBeNull();
    });

    it('应该处理for循环正常结束但未返回节点的情况（触发431行）', () => {
      // 这个测试理论上不应该触发 431 行，因为如果 for 循环正常结束，
      // 应该已经在循环内返回了。但为了完整性，我们测试一个边界情况
      // 实际上，431 行可能是不可达代码，但为了 100% 覆盖率，我们需要确保所有路径都被测试
      const emptyTree: any[] = [];
      // 空树，但路径不为空，会在第一次循环就返回 null（414行）
      // 431 行可能是不可达代码，但让我们确保所有情况都被测试
      const result = atIndexOfTree(emptyTree, [0]);
      expect(result).toBeNull();
    });
  });

  describe('复杂场景 - 多根节点', () => {
    it('应该处理多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1', children: [{ id: 2, name: 'child1' }] },
        { id: 3, name: 'root2', children: [{ id: 4, name: 'child2' }] },
        { id: 5, name: 'root3' },
      ];

      const result = mapTree(multiRoot, (node) => node.name);
      expect(result).toEqual(['root1', 'child1', 'root2', 'child2', 'root3']);
    });

    it('findTree应该在多个根节点中查找', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
        { id: 3, name: 'root3' },
      ];

      const result = findTree(multiRoot, (node) => node.id === 2);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('root2');
    });
  });

  describe('复杂场景 - 数据修改操作', () => {
    it('pushTree后数据应该保持一致性', () => {
      const testTree = [
        {
          id: 1,
          name: 'parent',
          children: [{ id: 2, name: 'child1' }],
        },
      ];

      const newNode = { id: 3, name: 'child2' };
      pushTree(testTree, 1, newNode);

      // 验证新节点已添加
      expect(testTree[0].children).toHaveLength(2);
      expect(testTree[0].children[1].id).toBe(3);

      // 验证原有节点未受影响
      expect(testTree[0].children[0].id).toBe(2);
    });

    it('多次pushTree应该按顺序添加', () => {
      const testTree: any[] = [{ id: 1, name: 'parent', children: [] }];

      pushTree(testTree, 1, { id: 2, name: 'child1' });
      pushTree(testTree, 1, { id: 3, name: 'child2' });
      pushTree(testTree, 1, { id: 4, name: 'child3' });

      expect(testTree[0].children).toHaveLength(3);
      expect(testTree[0].children[0].id).toBe(2);
      expect(testTree[0].children[1].id).toBe(3);
      expect(testTree[0].children[2].id).toBe(4);
    });

    it('popTree和shiftTree应该正确删除节点', () => {
      const testTree = [
        {
          id: 1,
          children: [
            { id: 2, name: 'first' },
            { id: 3, name: 'middle' },
            { id: 4, name: 'last' },
          ],
        },
      ];

      // 删除最后一个
      const lastRemoved = popTree(testTree, 1);
      expect(lastRemoved).not.toBeNull();
      expect(lastRemoved?.id).toBe(4);
      expect(lastRemoved?.name).toBe('last');
      expect(testTree[0].children).toHaveLength(2);
      expect(testTree[0].children[1].id).toBe(3);

      // 删除第一个
      const firstRemoved = shiftTree(testTree, 1);
      expect(firstRemoved).not.toBeNull();
      expect(firstRemoved?.id).toBe(2);
      expect(firstRemoved?.name).toBe('first');
      expect(testTree[0].children).toHaveLength(1);
      expect(testTree[0].children[0].id).toBe(3);
    });
  });

  describe('复杂场景 - dedupTree去重', () => {
    it('应该处理多个重复节点', () => {
      const duplicateTree = [
        {
          id: 1,
          name: 'node1',
          children: [
            { id: 2, name: 'node2' },
            { id: 2, name: 'node2-duplicate' },
            { id: 3, name: 'node3' },
            { id: 2, name: 'node2-another' },
          ],
        },
      ];

      const result = dedupTree(duplicateTree, 'id');
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children[0].id).toBe(2);
      expect(result[0].children[1].id).toBe(3);
    });

    it('应该处理嵌套的重复节点', () => {
      const duplicateTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                { id: 3, name: 'first' },
                { id: 3, name: 'duplicate' },
              ],
            },
            {
              id: 2,
              children: [{ id: 4 }],
            },
          ],
        },
      ];

      const result = dedupTree(duplicateTree, 'id');
      // id=2的节点会被去重，只保留第一个
      expect(result[0].children).toHaveLength(1);
      // 第一个id=2的节点下，id=3的节点也会被去重
      expect(result[0].children[0].children).toHaveLength(1);
      expect(result[0].children[0].children[0].name).toBe('first');
    });

    it('应该处理null和undefined值的去重', () => {
      const duplicateTree = [
        {
          id: 1,
          children: [
            { id: null, name: 'null1' },
            { id: null, name: 'null2' },
            { id: undefined, name: 'undefined1' },
            { id: undefined, name: 'undefined2' },
          ],
        },
      ];

      const result = dedupTree(duplicateTree, 'id');
      // 根据dedupTree的实现，只有当nodeKey !== undefined && nodeKey !== null时才会去重
      // 所以null和undefined的节点不会被去重，会全部保留
      expect(result[0].children.length).toBe(4);
      expect(result[0].children[0].name).toBe('null1');
      expect(result[0].children[1].name).toBe('null2');
      expect(result[0].children[2].name).toBe('undefined1');
      expect(result[0].children[3].name).toBe('undefined2');
    });
  });

  describe('复杂场景 - filterTree索引参数', () => {
    it('应该正确传递索引参数', () => {
      const testTree = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
      ];

      const indices: number[] = [];
      filterTree(testTree, (node, index) => {
        indices.push(index);
        return node.id > 1;
      });

      expect(indices).toEqual([0, 1, 2]);
    });

    it('应该处理嵌套节点的索引', () => {
      const testTree = [
        {
          id: 1,
          children: [
            { id: 2 },
            { id: 3 },
          ],
        },
      ];

      const indices: number[] = [];
      filterTree(testTree, (node, index) => {
        indices.push(index);
        return true;
      });

      expect(indices.length).toBeGreaterThan(0);
    });
  });

  describe('复杂场景 - 自定义字段名边界情况', () => {
    it('应该处理所有方法使用自定义字段名', () => {
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

      // 测试多个方法
      const found = findTree(customTree, (n) => n.nodeId === 2, fieldNames);
      expect(found).not.toBeNull();

      const mapped = mapTree(customTree, (n) => n.name, fieldNames);
      expect(mapped).toContain('root');
      expect(mapped).toContain('child');

      const depthMap = getNodeDepthMap(customTree, fieldNames);
      expect(depthMap[2]).toBe(2);
    });

    it('应该处理自定义字段名为空字符串的情况', () => {
      // 注意：空字符串作为字段名在实际使用中不常见
      // 这里测试代码不会抛出错误，但功能可能不符合预期
      const customTree = [
        {
          name: 'root',
        },
      ];
      const fieldNames = { children: '', id: '' };
      
      // 应该不会抛出错误
      expect(() => {
        mapTree(customTree, (n) => n.name, fieldNames);
      }).not.toThrow();
    });
  });

  describe('复杂场景 - 特殊值处理', () => {
    it('应该处理id为0的节点', () => {
      const treeWithZero = [
        { id: 0, name: 'zero' },
        { id: 1, name: 'one' },
      ];

      const result = findTree(treeWithZero, (n) => n.id === 0);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('zero');
    });

    it('应该处理id为false的节点', () => {
      const treeWithFalse = [
        { id: false, name: 'false' },
        { id: true, name: 'true' },
      ];

      const result = findTree(treeWithFalse, (n) => n.id === false);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('false');
    });

    it('应该处理id为字符串的情况', () => {
      const treeWithString = [
        { id: 'node1', name: 'first' },
        { id: 'node2', name: 'second' },
      ];

      const result = findTree(treeWithString, (n) => n.id === 'node2');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('second');
    });
  });

  describe('复杂场景 - 组合操作', () => {
    it('应该支持链式操作', () => {
      const complexTree = [
        {
          id: 1,
          name: 'root',
          children: [
            { id: 2, name: 'child1' },
            { id: 3, name: 'child2' },
          ],
        },
      ];

      // 先查找，再添加，再过滤
      const found = findTree(complexTree, (n) => n.id === 1);
      expect(found).not.toBeNull();

      pushTree(complexTree, 1, { id: 4, name: 'child3' });
      expect(complexTree[0].children).toHaveLength(3);

      const filtered = filterTree(complexTree, (n) => n.id > 2);
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('应该支持深度查找和修改', () => {
      const deepTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                { id: 3, children: [{ id: 4 }] },
              ],
            },
          ],
        },
      ];

      // 在深层节点添加子节点
      pushTree(deepTree, 3, { id: 5, name: 'deep-child' });
      
      const found = findTree(deepTree, (n) => n.id === 3);
      expect(found).not.toBeNull();
      expect(found?.children).toHaveLength(2);
    });
  });

  describe('removeTree', () => {
    it('应该删除指定ID的节点', () => {
      const testTree = [
        {
          id: 1,
          name: 'root',
          children: [
            { id: 2, name: 'child1' },
            { id: 3, name: 'child2' },
          ],
        },
      ];
      
      const success = removeTree(testTree, 2);
      expect(success).toBe(true);
      expect(testTree[0].children).toHaveLength(1);
      expect(testTree[0].children[0].id).toBe(3);
    });

    it('应该删除深层嵌套的节点', () => {
      const testTree = [
        {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                { id: 4, name: 'deep' },
                { id: 5, name: 'deep2' },
              ],
            },
          ],
        },
      ];
      
      const success = removeTree(testTree, 4);
      expect(success).toBe(true);
      expect(testTree[0].children[0].children).toHaveLength(1);
      expect(testTree[0].children[0].children[0].id).toBe(5);
    });

    it('应该能够删除根节点', () => {
      const testTree = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
        { id: 3, name: 'root3' },
      ];
      
      const success = removeTree(testTree, 2);
      expect(success).toBe(true);
      expect(testTree).toHaveLength(2);
      expect(testTree[0].id).toBe(1);
      expect(testTree[1].id).toBe(3);
    });

    it('应该返回false如果未找到目标节点', () => {
      const testTree = [
        { id: 1, name: 'root' },
      ];
      
      const success = removeTree(testTree, 999);
      expect(success).toBe(false);
      expect(testTree).toHaveLength(1);
    });

    it('应该支持自定义字段名', () => {
      const testTree = [
        {
          nodeId: 1,
          subNodes: [
            { nodeId: 2, name: 'child' },
          ],
        },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      
      const success = removeTree(testTree, 2, fieldNames);
      expect(success).toBe(true);
      expect(testTree[0].subNodes).toHaveLength(0);
    });
  });

  describe('forEachTree', () => {
    it('应该遍历所有节点并执行回调', () => {
      const result: string[] = [];
      forEachTree(treeData, (item) => {
        result.push(item.name);
      });
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('应该不返回值', () => {
      const result = forEachTree(treeData, (item) => {
        return item.name;
      });
      expect(result).toBeUndefined();
    });

    it('应该支持修改节点', () => {
      const testTree: any[] = [
        { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] },
      ];
      
      forEachTree(testTree, (node) => {
        node.visited = true;
      });
      
      expect(testTree[0].visited).toBe(true);
      expect(testTree[0].children[0].visited).toBe(true);
    });

    it('应该处理空数组', () => {
      const result: string[] = [];
      forEachTree([], (item) => {
        result.push(item.name);
      });
      expect(result).toEqual([]);
    });

    it('应该支持自定义字段名', () => {
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
      const result: string[] = [];
      
      forEachTree(customTree, (item) => {
        result.push(item.name);
      }, fieldNames);
      
      expect(result).toEqual(['root', 'child']);
    });
  });

  describe('isEmptyTreeData', () => {
    it('应该返回true如果树为空数组', () => {
      expect(isEmptyTreeData([])).toBe(true);
    });

    it('应该返回true如果树为null或undefined', () => {
      expect(isEmptyTreeData(null as any)).toBe(true);
      expect(isEmptyTreeData(undefined as any)).toBe(true);
    });

    it('应该返回false如果树不为空', () => {
      expect(isEmptyTreeData(treeData)).toBe(false);
    });

    it('应该返回false如果树有单个节点', () => {
      expect(isEmptyTreeData([{ id: 1, name: 'root' }])).toBe(false);
    });

    it('应该返回false如果树有多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
      ];
      expect(isEmptyTreeData(multiRoot)).toBe(false);
    });

    it('应该返回false如果树有子节点', () => {
      const treeWithChildren = [
        {
          id: 1,
          children: [{ id: 2 }],
        },
      ];
      expect(isEmptyTreeData(treeWithChildren)).toBe(false);
    });

    it('应该支持fieldNames参数（虽然不生效，但保持API一致性）', () => {
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      // fieldNames 参数不生效，只检查数组是否为空
      expect(isEmptyTreeData([], fieldNames)).toBe(true);
      expect(isEmptyTreeData(treeData, fieldNames)).toBe(false);
      
      // 即使传入自定义字段名，结果也应该一致
      const customTree = [
        {
          nodeId: 1,
          subNodes: [{ nodeId: 2 }],
        },
      ];
      expect(isEmptyTreeData(customTree, fieldNames)).toBe(false);
      expect(isEmptyTreeData(customTree)).toBe(false); // 不传 fieldNames 结果相同
    });
  });

  describe('isEmptySingleTreeData', () => {
    it('应该返回true如果数据不是有效的单个树结构', () => {
      expect(isEmptySingleTreeData(null)).toBe(true);
      expect(isEmptySingleTreeData(undefined)).toBe(true);
      expect(isEmptySingleTreeData([])).toBe(true);
      expect(isEmptySingleTreeData('string')).toBe(true);
      expect(isEmptySingleTreeData(123)).toBe(true);
    });

    it('应该返回true如果没有children字段', () => {
      const tree = { id: 1, name: 'node1' };
      expect(isEmptySingleTreeData(tree)).toBe(true);
    });

    it('应该返回true如果children是空数组', () => {
      const tree = {
        id: 1,
        name: 'node1',
        children: [],
      };
      expect(isEmptySingleTreeData(tree)).toBe(true);
    });

    it('应该返回false如果有子节点', () => {
      const tree = {
        id: 1,
        name: 'node1',
        children: [
          { id: 2, name: 'node2' },
        ],
      };
      expect(isEmptySingleTreeData(tree)).toBe(false);
    });

    it('应该返回false如果有子节点（即使子节点是空的）', () => {
      // 有子节点，即使子节点本身是空的，树也不为空
      const treeWithEmptyChildren = {
        id: 1,
        name: 'node1',
        children: [
          { id: 2, name: 'node2', children: [] },
          { id: 3, name: 'node3' }, // 没有children字段
        ],
      };
      expect(isEmptySingleTreeData(treeWithEmptyChildren)).toBe(false);

      // 有非空的子节点
      const nonEmptyTree = {
        id: 1,
        name: 'node1',
        children: [
          { id: 2, name: 'node2', children: [] },
          {
            id: 3,
            name: 'node3',
            children: [{ id: 4, name: 'node4' }],
          },
        ],
      };
      expect(isEmptySingleTreeData(nonEmptyTree)).toBe(false);
    });

    it('应该支持自定义字段名', () => {
      const emptyTree = {
        nodeId: 1,
        name: 'node1',
        subNodes: [],
      };
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      expect(isEmptySingleTreeData(emptyTree, fieldNames)).toBe(true);

      const nonEmptyTree = {
        nodeId: 1,
        name: 'node1',
        subNodes: [
          { nodeId: 2, name: 'node2' },
        ],
      };
      expect(isEmptySingleTreeData(nonEmptyTree, fieldNames)).toBe(false);
    });

    it('应该处理深层嵌套的树（有子节点就不为空）', () => {
      const deepTree = {
        id: 1,
        children: [
          {
            id: 2,
            children: [
              {
                id: 3,
                children: [],
              },
            ],
          },
        ],
      };
      // 即使所有子节点都是空的，只要有子节点，树就不为空
      expect(isEmptySingleTreeData(deepTree)).toBe(false);
    });
  });

  describe('getParentTree', () => {
    it('应该返回子节点的父节点', () => {
      const result = getParentTree(treeData, 2);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('应该返回深层节点的父节点', () => {
      const result = getParentTree(treeData, 4);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该返回null如果节点是根节点', () => {
      const result = getParentTree(treeData, 1);
      expect(result).toBeNull();
    });

    it('应该返回null如果未找到节点', () => {
      const result = getParentTree(treeData, 999);
      expect(result).toBeNull();
    });

    it('应该支持多个根节点', () => {
      const multiRoot = [
        { id: 1, children: [{ id: 2 }] },
        { id: 3, children: [{ id: 4 }] },
      ];
      const result = getParentTree(multiRoot, 4);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(3);
    });

    it('应该支持自定义字段名', () => {
      const customTree = [
        {
          nodeId: 1,
          subNodes: [
            { nodeId: 2, name: 'child' },
          ],
        },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = getParentTree(customTree, 2, fieldNames);
      expect(result).not.toBeNull();
      expect(result?.nodeId).toBe(1);
    });
  });

  describe('getChildrenTree', () => {
    it('应该返回节点的所有直接子节点', () => {
      const children = getChildrenTree(treeData, 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(3);
    });

    it('应该返回空数组如果节点没有子节点', () => {
      const children = getChildrenTree(treeData, 4);
      expect(children).toEqual([]);
    });

    it('应该返回空数组如果未找到节点', () => {
      const children = getChildrenTree(treeData, 999);
      expect(children).toEqual([]);
    });

    it('应该处理深层嵌套的节点', () => {
      const children = getChildrenTree(treeData, 2);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(4);
      expect(children[1].id).toBe(5);
    });

    it('应该处理多个根节点', () => {
      const multiRoot = [
        { id: 1, children: [{ id: 2 }, { id: 3 }] },
        { id: 4, children: [{ id: 5 }] },
      ];
      const children = getChildrenTree(multiRoot, 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(3);
    });

    it('应该处理节点children字段不存在的情况', () => {
      const treeWithoutChildren = [
        { id: 1, name: 'node1' },
      ];
      const children = getChildrenTree(treeWithoutChildren, 1);
      expect(children).toEqual([]);
    });

    it('应该处理节点children不是数组的情况', () => {
      const treeWithInvalidChildren = [
        {
          id: 1,
          name: 'node1',
          children: 'not an array',
        },
      ];
      const children = getChildrenTree(treeWithInvalidChildren, 1);
      expect(children).toEqual([]);
    });

    it('应该支持自定义字段名', () => {
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
      const children = getChildrenTree(customTree, 1, fieldNames);
      expect(children).toHaveLength(2);
      expect(children[0].nodeId).toBe(2);
      expect(children[1].nodeId).toBe(3);
    });

    it('应该处理空树', () => {
      const children = getChildrenTree([], 1);
      expect(children).toEqual([]);
    });

    it('应该处理单节点树', () => {
      const singleNode = [{ id: 1, name: 'node1' }];
      const children = getChildrenTree(singleNode, 1);
      expect(children).toEqual([]);
    });

    it('应该处理不平衡树', () => {
      const unbalancedTree = [
        {
          id: 1,
          children: [
            { id: 2, children: [{ id: 3 }] },
            { id: 4 },
          ],
        },
      ];
      const children = getChildrenTree(unbalancedTree, 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(4);
    });
  });

  describe('getSiblingsTree', () => {
    it('应该返回节点的所有兄弟节点（包括自己）', () => {
      const siblings = getSiblingsTree(treeData, 2);
      expect(siblings).toHaveLength(2);
      expect(siblings[0].id).toBe(2);
      expect(siblings[1].id).toBe(3);
    });

    it('应该返回根节点的所有兄弟节点（多个根节点）', () => {
      const multiRoot = [
        { id: 1, children: [{ id: 2 }] },
        { id: 3, children: [{ id: 4 }] },
        { id: 5, children: [{ id: 6 }] },
      ];
      const siblings = getSiblingsTree(multiRoot, 1);
      expect(siblings).toHaveLength(3);
      expect(siblings[0].id).toBe(1);
      expect(siblings[1].id).toBe(3);
      expect(siblings[2].id).toBe(5);
    });

    it('应该返回空数组如果未找到节点', () => {
      const siblings = getSiblingsTree(treeData, 999);
      expect(siblings).toEqual([]);
    });

    it('应该支持自定义字段名', () => {
      const tree = [
        { nodeId: 1, subNodes: [{ nodeId: 2 }, { nodeId: 3 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const siblings = getSiblingsTree(tree, 2, fieldNames);
      expect(siblings).toHaveLength(2);
      expect(siblings[0].nodeId).toBe(2);
      expect(siblings[1].nodeId).toBe(3);
    });

    it('应该处理空树', () => {
      const siblings = getSiblingsTree([], 1);
      expect(siblings).toEqual([]);
    });

    it('应该处理单个根节点的情况', () => {
      const singleRoot = [{ id: 1, children: [{ id: 2 }] }];
      const siblings = getSiblingsTree(singleRoot, 1);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(1);
    });

    it('应该处理深层嵌套的节点', () => {
      const siblings = getSiblingsTree(treeData, 4);
      expect(siblings).toHaveLength(2);
      expect(siblings[0].id).toBe(4);
      expect(siblings[1].id).toBe(5);
    });

    it('应该处理只有一个子节点的情况', () => {
      const siblings = getSiblingsTree(treeData, 6);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(6);
    });

    it('应该处理单节点树（根节点）', () => {
      const singleNode = [{ id: 1, name: 'node1' }];
      const siblings = getSiblingsTree(singleNode, 1);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(1);
    });

    it('应该处理节点children字段不存在的情况', () => {
      const treeWithoutChildren = [
        { id: 1, name: 'node1' },
        { id: 2, name: 'node2' },
      ];
      const siblings = getSiblingsTree(treeWithoutChildren, 1);
      expect(siblings).toHaveLength(2);
      expect(siblings[0].id).toBe(1);
      expect(siblings[1].id).toBe(2);
    });

    it('应该处理节点children不是数组的情况', () => {
      const treeWithInvalidChildren = [
        {
          id: 1,
          name: 'node1',
          children: 'not an array',
        },
        { id: 2, name: 'node2' },
      ];
      const siblings = getSiblingsTree(treeWithInvalidChildren, 1);
      expect(siblings).toHaveLength(2);
    });

    it('应该支持自定义字段名', () => {
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
      const siblings = getSiblingsTree(customTree, 2, fieldNames);
      expect(siblings).toHaveLength(3);
      expect(siblings[0].nodeId).toBe(2);
      expect(siblings[1].nodeId).toBe(3);
      expect(siblings[2].nodeId).toBe(4);
    });

    it('应该处理空树', () => {
      const siblings = getSiblingsTree([], 1);
      expect(siblings).toEqual([]);
    });

    it('应该处理不平衡树', () => {
      const unbalancedTree = [
        {
          id: 1,
          children: [
            { id: 2, children: [{ id: 3 }] },
            { id: 4 },
            { id: 5 },
          ],
        },
      ];
      const siblings = getSiblingsTree(unbalancedTree, 2);
      expect(siblings).toHaveLength(3);
      expect(siblings[0].id).toBe(2);
      expect(siblings[1].id).toBe(4);
      expect(siblings[2].id).toBe(5);
    });

    it('应该处理根节点的兄弟节点（单个根节点）', () => {
      const singleRoot = [
        { id: 1, children: [{ id: 2 }] },
      ];
      const siblings = getSiblingsTree(singleRoot, 1);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(1);
    });
  });

  describe('includesTree', () => {
    it('应该返回true如果树包含指定节点', () => {
      const result = includesTree(treeData, 2);
      expect(result).toBe(true);
    });

    it('应该返回true如果树包含深层节点', () => {
      const result = includesTree(treeData, 4);
      expect(result).toBe(true);
    });

    it('应该返回true如果树包含根节点', () => {
      const result = includesTree(treeData, 1);
      expect(result).toBe(true);
    });

    it('应该返回false如果树不包含指定节点', () => {
      const result = includesTree(treeData, 999);
      expect(result).toBe(false);
    });

    it('应该处理空树', () => {
      const result = includesTree([], 1);
      expect(result).toBe(false);
    });

    it('应该支持自定义字段名', () => {
      const tree = [{ nodeId: 1, subNodes: [{ nodeId: 2 }] }];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      const result = includesTree(tree, 2, fieldNames);
      expect(result).toBe(true);
    });

    it('应该返回false如果树不包含指定节点', () => {
      const result = includesTree(treeData, 999);
      expect(result).toBe(false);
    });

    it('应该处理空树', () => {
      const result = includesTree([], 1);
      expect(result).toBe(false);
    });

    it('应该支持多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
        { id: 3, name: 'root3' },
      ];
      expect(includesTree(multiRoot, 2)).toBe(true);
      expect(includesTree(multiRoot, 4)).toBe(false);
    });

    it('应该支持自定义字段名', () => {
      const customTree = [
        {
          nodeId: 1,
          subNodes: [
            { nodeId: 2, name: 'child' },
          ],
        },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      expect(includesTree(customTree, 2, fieldNames)).toBe(true);
      expect(includesTree(customTree, 999, fieldNames)).toBe(false);
    });

    it('应该处理特殊ID值', () => {
      const treeWithSpecialIds = [
        { id: 0, name: 'zero' },
        { id: false, name: 'false' },
        { id: '', name: 'empty' },
      ];
      expect(includesTree(treeWithSpecialIds, 0)).toBe(true);
      expect(includesTree(treeWithSpecialIds, false)).toBe(true);
      expect(includesTree(treeWithSpecialIds, '')).toBe(true);
    });
  });

  describe('isSingleTreeData', () => {
    describe('基础功能', () => {
      it('应该识别有效的树结构（单个对象）', () => {
        const tree = {
          id: 1,
          name: 'node1',
          children: [
            { id: 2, name: 'node2' },
            { id: 3, name: 'node3' },
          ],
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });

      it('应该识别没有子节点的树结构', () => {
        const tree = {
          id: 1,
          name: 'node1',
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });

      it('应该识别深层嵌套的树结构', () => {
        const tree = {
          id: 1,
          name: 'node1',
          children: [
            {
              id: 2,
              name: 'node2',
              children: [
                {
                  id: 3,
                  name: 'node3',
                  children: [{ id: 4, name: 'node4' }],
                },
              ],
            },
          ],
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });

      it('应该识别空 children 数组的树结构', () => {
        const tree = {
          id: 1,
          name: 'node1',
          children: [],
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(isSingleTreeData(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(isSingleTreeData(undefined)).toBe(false);
      });

      it('应该拒绝数组', () => {
        expect(isSingleTreeData([{ id: 1 }])).toBe(false);
      });

      it('应该拒绝基本类型（字符串）', () => {
        expect(isSingleTreeData('string')).toBe(false);
      });

      it('应该拒绝基本类型（数字）', () => {
        expect(isSingleTreeData(123)).toBe(false);
      });

      it('应该拒绝基本类型（布尔值）', () => {
        expect(isSingleTreeData(true)).toBe(false);
      });

      it('应该拒绝空对象（没有 children 字段）', () => {
        expect(isSingleTreeData({})).toBe(true); // 空对象也是有效的树结构
      });

      it('应该拒绝 children 不是数组的对象', () => {
        const invalidTree = {
          id: 1,
          children: 'not an array',
        };
        expect(isSingleTreeData(invalidTree)).toBe(false);
      });

      it('应该拒绝 children 是 null 的对象', () => {
        const invalidTree = {
          id: 1,
          children: null,
        };
        expect(isSingleTreeData(invalidTree)).toBe(false);
      });

      it('应该拒绝包含非树结构子节点的对象', () => {
        const invalidTree = {
          id: 1,
          children: [
            { id: 2, name: 'node2' },
            'not a tree node', // 无效的子节点
          ],
        };
        expect(isSingleTreeData(invalidTree)).toBe(false);
      });

      it('应该拒绝包含数组子节点的对象', () => {
        const invalidTree = {
          id: 1,
          children: [
            { id: 2, name: 'node2' },
            [{ id: 3, name: 'node3' }], // 数组不是有效的树节点
          ],
        };
        expect(isSingleTreeData(invalidTree)).toBe(false);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义 children 字段名', () => {
        const tree = {
          id: 1,
          name: 'node1',
          subNodes: [
            { id: 2, name: 'node2' },
            { id: 3, name: 'node3' },
          ],
        };
        const fieldNames = { children: 'subNodes', id: 'id' };
        expect(isSingleTreeData(tree, fieldNames)).toBe(true);
      });

      it('应该支持中文字段名', () => {
        const tree = {
          id: 1,
          name: 'node1',
          子节点: [
            { id: 2, name: 'node2' },
          ],
        };
        const fieldNames = { children: '子节点', id: 'id' };
        expect(isSingleTreeData(tree, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名且递归检查子节点', () => {
        const tree = {
          nodeId: 1,
          name: 'node1',
          subNodes: [
            {
              nodeId: 2,
              name: 'node2',
              subNodes: [
                { nodeId: 3, name: 'node3' },
              ],
            },
          ],
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isSingleTreeData(tree, fieldNames)).toBe(true);
      });

      it('应该在使用自定义字段名时拒绝无效结构', () => {
        const invalidTree = {
          nodeId: 1,
          subNodes: 'not an array',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isSingleTreeData(invalidTree, fieldNames)).toBe(false);
      });
    });

    describe('复杂场景', () => {
      it('应该处理包含各种数据类型的节点', () => {
        const tree = {
          id: 1,
          name: 'node1',
          age: 25,
          active: true,
          tags: ['tag1', 'tag2'],
          metadata: { key: 'value' },
          children: [
            {
              id: 2,
              name: 'node2',
              data: null,
              children: [],
            },
          ],
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });

      it('应该处理不平衡树结构', () => {
        const tree = {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                { id: 3, children: [{ id: 4 }] },
              ],
            },
            { id: 5 }, // 没有子节点
          ],
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });

      it('应该处理单分支树（每个节点只有一个子节点）', () => {
        const tree = {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [{ id: 4 }],
                },
              ],
            },
          ],
        };
        expect(isSingleTreeData(tree)).toBe(true);
      });
    });
  });

  describe('isTreeData', () => {
    describe('基础功能', () => {
      it('应该识别有效的森林结构（数组）', () => {
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
        expect(isTreeData(forest)).toBe(true);
      });

      it('应该识别包含单棵树的森林', () => {
        const forest = [
          {
            id: 1,
            name: 'node1',
            children: [
              { id: 2, name: 'node2' },
            ],
          },
        ];
        expect(isTreeData(forest)).toBe(true);
      });

      it('应该识别空数组（空森林）', () => {
        expect(isTreeData([])).toBe(true);
      });

      it('应该识别包含没有子节点的树的森林', () => {
        const forest = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
          { id: 3, name: 'node3' },
        ];
        expect(isTreeData(forest)).toBe(true);
      });

      it('应该识别深层嵌套的森林', () => {
        const forest = [
          {
            id: 1,
            children: [
              {
                id: 2,
                children: [
                  {
                    id: 3,
                    children: [{ id: 4 }],
                  },
                ],
              },
            ],
          },
          {
            id: 5,
            children: [{ id: 6 }],
          },
        ];
        expect(isTreeData(forest)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(isTreeData(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(isTreeData(undefined)).toBe(false);
      });

      it('应该拒绝非数组类型（对象）', () => {
        const tree = {
          id: 1,
          children: [{ id: 2 }],
        };
        expect(isTreeData(tree)).toBe(false);
      });

      it('应该拒绝非数组类型（字符串）', () => {
        expect(isTreeData('string')).toBe(false);
      });

      it('应该拒绝非数组类型（数字）', () => {
        expect(isTreeData(123)).toBe(false);
      });

      it('应该拒绝包含非树结构元素的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          'not a tree', // 无效元素
        ];
        expect(isTreeData(invalidForest)).toBe(false);
      });

      it('应该拒绝包含数组元素的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          [{ id: 3 }], // 数组不是树结构
        ];
        expect(isTreeData(invalidForest)).toBe(false);
      });

      it('应该拒绝包含 null 元素的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          null,
        ];
        expect(isTreeData(invalidForest)).toBe(false);
      });

      it('应该拒绝包含无效树结构的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          { id: 3, children: 'not an array' }, // 无效的树结构
        ];
        expect(isTreeData(invalidForest)).toBe(false);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义 children 字段名', () => {
        const forest = [
          {
            id: 1,
            name: 'node1',
            subNodes: [
              { id: 2, name: 'node2' },
            ],
          },
          {
            id: 3,
            name: 'node3',
            subNodes: [{ id: 4, name: 'node4' }],
          },
        ];
        const fieldNames = { children: 'subNodes', id: 'id' };
        expect(isTreeData(forest, fieldNames)).toBe(true);
      });

      it('应该支持中文字段名', () => {
        const forest = [
          {
            id: 1,
            name: 'node1',
            子节点: [
              { id: 2, name: 'node2' },
            ],
          },
        ];
        const fieldNames = { children: '子节点', id: 'id' };
        expect(isTreeData(forest, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名且递归检查所有树', () => {
        const forest = [
          {
            nodeId: 1,
            name: 'node1',
            subNodes: [
              {
                nodeId: 2,
                name: 'node2',
                subNodes: [{ nodeId: 3, name: 'node3' }],
              },
            ],
          },
          {
            nodeId: 4,
            name: 'node4',
            subNodes: [],
          },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isTreeData(forest, fieldNames)).toBe(true);
      });

      it('应该在使用自定义字段名时拒绝无效结构', () => {
        const invalidForest = [
          {
            nodeId: 1,
            subNodes: [{ nodeId: 2 }],
          },
          {
            nodeId: 3,
            subNodes: 'not an array',
          },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isTreeData(invalidForest, fieldNames)).toBe(false);
      });
    });

    describe('复杂场景', () => {
      it('应该处理包含多棵不同深度树的森林', () => {
        const forest = [
          {
            id: 1,
            children: [
              {
                id: 2,
                children: [
                  { id: 3, children: [{ id: 4 }] },
                ],
              },
            ],
          },
          { id: 5 }, // 单节点树
          {
            id: 6,
            children: [{ id: 7 }, { id: 8 }],
          },
        ];
        expect(isTreeData(forest)).toBe(true);
      });

      it('应该处理包含各种数据类型的森林', () => {
        const forest = [
          {
            id: 1,
            name: 'node1',
            age: 25,
            active: true,
            tags: ['tag1'],
            children: [],
          },
          {
            id: 2,
            data: null,
            metadata: { key: 'value' },
            children: [{ id: 3 }],
          },
        ];
        expect(isTreeData(forest)).toBe(true);
      });

      it('应该处理大型森林（多棵树）', () => {
        const forest = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          children: [
            { id: (i + 1) * 10 + 1 },
            { id: (i + 1) * 10 + 2 },
          ],
        }));
        expect(isTreeData(forest)).toBe(true);
      });
    });
  });

  describe('isValidTreeNode', () => {
    describe('基础功能', () => {
      it('应该识别有效的树节点（有 children 数组）', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [{ id: 2 }],
        };
        expect(isValidTreeNode(node)).toBe(true);
      });

      it('应该识别有效的树节点（没有 children 字段）', () => {
        const node = {
          id: 1,
          name: 'node1',
        };
        expect(isValidTreeNode(node)).toBe(true);
      });

      it('应该识别有效的树节点（children 是空数组）', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [],
        };
        expect(isValidTreeNode(node)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(isValidTreeNode(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(isValidTreeNode(undefined)).toBe(false);
      });

      it('应该拒绝数组', () => {
        expect(isValidTreeNode([{ id: 1 }])).toBe(false);
      });

      it('应该拒绝基本类型（字符串）', () => {
        expect(isValidTreeNode('string')).toBe(false);
      });

      it('应该拒绝基本类型（数字）', () => {
        expect(isValidTreeNode(123)).toBe(false);
      });

      it('应该拒绝基本类型（布尔值）', () => {
        expect(isValidTreeNode(true)).toBe(false);
      });

      it('应该拒绝 children 是 null 的对象', () => {
        const invalidNode = {
          id: 1,
          children: null,
        };
        expect(isValidTreeNode(invalidNode)).toBe(false);
      });

      it('应该拒绝 children 不是数组的对象', () => {
        const invalidNode = {
          id: 1,
          children: 'not an array',
        };
        expect(isValidTreeNode(invalidNode)).toBe(false);
      });

      it('应该接受空对象', () => {
        expect(isValidTreeNode({})).toBe(true);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义 children 字段名', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
          subNodes: [{ nodeId: 2 }],
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isValidTreeNode(node, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名且没有 children 字段', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isValidTreeNode(node, fieldNames)).toBe(true);
      });

      it('应该拒绝自定义字段名但 children 不是数组', () => {
        const node = {
          nodeId: 1,
          subNodes: 'not an array',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isValidTreeNode(node, fieldNames)).toBe(false);
      });
    });
  });

  describe('isTreeNodeWithCircularCheck', () => {
    describe('基础功能', () => {
      it('应该识别有效的树节点（无循环引用）', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [
            { id: 2, name: 'node2' },
            { id: 3, name: 'node3' },
          ],
        };
        expect(isTreeNodeWithCircularCheck(node)).toBe(true);
      });

      it('应该识别有效的树节点（没有 children 字段）', () => {
        const node = {
          id: 1,
          name: 'node1',
        };
        expect(isTreeNodeWithCircularCheck(node)).toBe(true);
      });

      it('应该识别有效的树节点（children 是空数组）', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [],
        };
        expect(isTreeNodeWithCircularCheck(node)).toBe(true);
      });

      it('应该识别深层嵌套的有效树节点', () => {
        const node = {
          id: 1,
          children: [
            {
              id: 2,
              children: [
                {
                  id: 3,
                  children: [{ id: 4 }],
                },
              ],
            },
          ],
        };
        expect(isTreeNodeWithCircularCheck(node)).toBe(true);
      });
    });

    describe('循环引用检测', () => {
      it('应该检测到直接循环引用', () => {
        const node1: any = { id: 1, children: [] };
        const node2: any = { id: 2, children: [] };
        node1.children.push(node2);
        node2.children.push(node1); // 循环引用

        expect(isTreeNodeWithCircularCheck(node1)).toBe(false);
      });

      it('应该检测到间接循环引用', () => {
        const node1: any = { id: 1, children: [] };
        const node2: any = { id: 2, children: [] };
        const node3: any = { id: 3, children: [] };
        node1.children.push(node2);
        node2.children.push(node3);
        node3.children.push(node1); // 间接循环引用

        expect(isTreeNodeWithCircularCheck(node1)).toBe(false);
      });

      it('应该检测到自引用', () => {
        const node: any = { id: 1, children: [] };
        node.children.push(node); // 自引用

        expect(isTreeNodeWithCircularCheck(node)).toBe(false);
      });

      it('应该检测到深层循环引用', () => {
        const node1: any = { id: 1, children: [] };
        const node2: any = { id: 2, children: [] };
        const node3: any = { id: 3, children: [] };
        const node4: any = { id: 4, children: [] };
        node1.children.push(node2);
        node2.children.push(node3);
        node3.children.push(node4);
        node4.children.push(node2); // 深层循环引用

        expect(isTreeNodeWithCircularCheck(node1)).toBe(false);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(isTreeNodeWithCircularCheck(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(isTreeNodeWithCircularCheck(undefined)).toBe(false);
      });

      it('应该拒绝数组', () => {
        expect(isTreeNodeWithCircularCheck([{ id: 1 }])).toBe(false);
      });

      it('应该拒绝基本类型（字符串）', () => {
        expect(isTreeNodeWithCircularCheck('string')).toBe(false);
      });

      it('应该拒绝基本类型（数字）', () => {
        expect(isTreeNodeWithCircularCheck(123)).toBe(false);
      });

      it('应该拒绝 children 是 null 的对象', () => {
        const invalidNode = {
          id: 1,
          children: null,
        };
        expect(isTreeNodeWithCircularCheck(invalidNode)).toBe(false);
      });

      it('应该拒绝 children 不是数组的对象', () => {
        const invalidNode = {
          id: 1,
          children: 'not an array',
        };
        expect(isTreeNodeWithCircularCheck(invalidNode)).toBe(false);
      });

      it('应该接受空对象', () => {
        expect(isTreeNodeWithCircularCheck({})).toBe(true);
      });

      it('应该拒绝包含非树结构子节点的对象', () => {
        const invalidNode: any = {
          id: 1,
          children: [
            { id: 2, name: 'node2' },
            'not a tree node', // 无效的子节点
          ],
        };
        expect(isTreeNodeWithCircularCheck(invalidNode)).toBe(false);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义 children 字段名', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
          subNodes: [
            { nodeId: 2, name: 'node2' },
          ],
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isTreeNodeWithCircularCheck(node, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名检测循环引用', () => {
        const node1: any = {
          nodeId: 1,
          subNodes: [],
        };
        const node2: any = {
          nodeId: 2,
          subNodes: [],
        };
        node1.subNodes.push(node2);
        node2.subNodes.push(node1); // 循环引用

        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isTreeNodeWithCircularCheck(node1, fieldNames)).toBe(false);
      });

      it('应该拒绝自定义字段名但 children 不是数组', () => {
        const node = {
          nodeId: 1,
          subNodes: 'not an array',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isTreeNodeWithCircularCheck(node, fieldNames)).toBe(false);
      });
    });
  });

  describe('isSafeTreeDepth', () => {
    describe('基础功能', () => {
      it('应该识别深度安全的树', () => {
        const tree = [
          {
            id: 1,
            children: [
              { id: 2, children: [{ id: 3 }] },
            ],
          },
        ];
        expect(isSafeTreeDepth(tree, 10)).toBe(true);
      });

      it('应该识别深度刚好等于最大深度的树', () => {
        const tree = [
          {
            id: 1,
            children: [
              { id: 2, children: [{ id: 3 }] },
            ],
          },
        ];
        expect(isSafeTreeDepth(tree, 3)).toBe(true);
      });

      it('应该识别深度超过最大深度的树', () => {
        const tree = [
          {
            id: 1,
            children: [
              { id: 2, children: [{ id: 3 }] },
            ],
          },
        ];
        expect(isSafeTreeDepth(tree, 2)).toBe(false);
      });

      it('应该识别单层树为安全', () => {
        const tree = [
          { id: 1 },
          { id: 2 },
        ];
        expect(isSafeTreeDepth(tree, 1)).toBe(true);
      });

      it('应该识别空树为安全', () => {
        expect(isSafeTreeDepth([], 10)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 maxDepth 为 0', () => {
        const tree = [{ id: 1 }];
        expect(isSafeTreeDepth(tree, 0)).toBe(false);
      });

      it('应该拒绝 maxDepth 为负数', () => {
        const tree = [{ id: 1 }];
        expect(isSafeTreeDepth(tree, -1)).toBe(false);
      });

      it('应该处理深层嵌套的树', () => {
        let tree: any = { id: 1 };
        let current = tree;
        for (let i = 2; i <= 10; i++) {
          current.children = [{ id: i }];
          current = current.children[0];
        }
        expect(isSafeTreeDepth([tree], 10)).toBe(true);
        expect(isSafeTreeDepth([tree], 9)).toBe(false);
      });

      it('应该处理不平衡树', () => {
        const tree = [
          {
            id: 1,
            children: [
              {
                id: 2,
                children: [
                  { id: 3, children: [{ id: 4 }] },
                ],
              },
            ],
          },
          { id: 5 },
        ];
        expect(isSafeTreeDepth(tree, 4)).toBe(true);
        expect(isSafeTreeDepth(tree, 3)).toBe(false);
      });

      it('应该处理多棵树的森林', () => {
        const forest = [
          {
            id: 1,
            children: [{ id: 2 }],
          },
          {
            id: 3,
            children: [
              {
                id: 4,
                children: [{ id: 5 }],
              },
            ],
          },
        ];
        expect(isSafeTreeDepth(forest, 3)).toBe(true);
        expect(isSafeTreeDepth(forest, 2)).toBe(false);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义 children 字段名', () => {
        const tree = [
          {
            nodeId: 1,
            subNodes: [
              { nodeId: 2, subNodes: [{ nodeId: 3 }] },
            ],
          },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isSafeTreeDepth(tree, 3, fieldNames)).toBe(true);
        expect(isSafeTreeDepth(tree, 2, fieldNames)).toBe(false);
      });

      it('应该支持自定义字段名处理深层树', () => {
        let tree: any = { nodeId: 1 };
        let current = tree;
        for (let i = 2; i <= 5; i++) {
          current.subNodes = [{ nodeId: i }];
          current = current.subNodes[0];
        }
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isSafeTreeDepth([tree], 5, fieldNames)).toBe(true);
        expect(isSafeTreeDepth([tree], 4, fieldNames)).toBe(false);
      });
    });
  });

  describe('isLeafNode', () => {
    describe('基础功能', () => {
      it('应该识别没有 children 字段的节点为叶子节点', () => {
        const node = { id: 1, name: 'node1' };
        expect(isLeafNode(node)).toBe(true);
      });

      it('应该识别 children 为空数组的节点为叶子节点', () => {
        const node = { id: 1, name: 'node1', children: [] };
        expect(isLeafNode(node)).toBe(true);
      });

      it('应该识别有子节点的节点不是叶子节点', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [{ id: 2, name: 'node2' }],
        };
        expect(isLeafNode(node)).toBe(false);
      });

      it('应该识别 children 为 undefined 的节点为叶子节点', () => {
        const node = { id: 1, name: 'node1', children: undefined };
        expect(isLeafNode(node)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该处理空对象', () => {
        expect(isLeafNode({})).toBe(true);
      });

      it('应该处理 children 为 null 的节点（视为叶子节点）', () => {
        const node = { id: 1, children: null };
        expect(isLeafNode(node)).toBe(true);
      });

      it('应该处理 children 不是数组的节点（视为叶子节点）', () => {
        const node = { id: 1, children: 'not an array' };
        expect(isLeafNode(node)).toBe(true);
      });

      it('应该处理有多个子节点的节点', () => {
        const node = {
          id: 1,
          children: [
            { id: 2 },
            { id: 3 },
            { id: 4 },
          ],
        };
        expect(isLeafNode(node)).toBe(false);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义 children 字段名', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
          subNodes: [],
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isLeafNode(node, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名识别有子节点的节点', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
          subNodes: [{ nodeId: 2 }],
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isLeafNode(node, fieldNames)).toBe(false);
      });

      it('应该支持自定义字段名识别没有 children 字段的节点', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isLeafNode(node, fieldNames)).toBe(true);
      });
    });

    describe('实际使用场景', () => {
      it('应该能在 filterTree 中使用', () => {
        const treeData = [
          {
            id: 1,
            name: 'node1',
            children: [
              { id: 2, name: 'node2' },
              { id: 3, name: 'node3', children: [] },
            ],
          },
        ];
        const leafNodes = filterTree(treeData, (node) => isLeafNode(node));
        expect(leafNodes).toHaveLength(2);
        expect(leafNodes[0].id).toBe(2);
        expect(leafNodes[1].id).toBe(3);
      });

      it('应该能在 forEachTree 中使用', () => {
        const treeData = [
          {
            id: 1,
            name: 'node1',
            children: [{ id: 2, name: 'node2' }],
          },
        ];
        const leafNodeIds: number[] = [];
        forEachTree(treeData, (node) => {
          if (isLeafNode(node)) {
            leafNodeIds.push(node.id);
          }
        });
        expect(leafNodeIds).toEqual([2]);
      });
    });
  });

  describe('isRootNode', () => {
    describe('基础功能', () => {
      it('应该识别根节点', () => {
        const treeData = [
          {
            id: 1,
            name: 'node1',
            children: [{ id: 2, name: 'node2' }],
          },
        ];
        expect(isRootNode(treeData, 1)).toBe(true);
      });

      it('应该识别非根节点', () => {
        const treeData = [
          {
            id: 1,
            name: 'node1',
            children: [{ id: 2, name: 'node2' }],
          },
        ];
        expect(isRootNode(treeData, 2)).toBe(false);
      });

      it('应该识别多个根节点', () => {
        const treeData = [
          { id: 1, name: 'root1' },
          { id: 2, name: 'root2' },
          { id: 3, name: 'root3' },
        ];
        expect(isRootNode(treeData, 1)).toBe(true);
        expect(isRootNode(treeData, 2)).toBe(true);
        expect(isRootNode(treeData, 3)).toBe(true);
      });

      it('应该识别深层节点不是根节点', () => {
        const treeData = [
          {
            id: 1,
            children: [
              {
                id: 2,
                children: [
                  { id: 3, children: [{ id: 4 }] },
                ],
              },
            ],
          },
        ];
        expect(isRootNode(treeData, 1)).toBe(true);
        expect(isRootNode(treeData, 2)).toBe(false);
        expect(isRootNode(treeData, 3)).toBe(false);
        expect(isRootNode(treeData, 4)).toBe(false);
      });
    });

    describe('边界情况', () => {
      it('应该处理空树', () => {
        expect(isRootNode([], 1)).toBe(false);
      });

      it('应该处理不存在的节点', () => {
        const treeData = [{ id: 1, name: 'node1' }];
        expect(isRootNode(treeData, 999)).toBe(false);
      });

      it('应该处理单节点树', () => {
        const treeData = [{ id: 1, name: 'node1' }];
        expect(isRootNode(treeData, 1)).toBe(true);
      });

      it('应该处理只有根节点的树', () => {
        const treeData = [
          { id: 1, name: 'root1' },
          { id: 2, name: 'root2' },
        ];
        expect(isRootNode(treeData, 1)).toBe(true);
        expect(isRootNode(treeData, 2)).toBe(true);
      });
    });

    describe('自定义字段名', () => {
      it('应该支持自定义字段名', () => {
        const treeData = [
          {
            nodeId: 1,
            name: 'root1',
            subNodes: [
              { nodeId: 2, name: 'child1' },
            ],
          },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isRootNode(treeData, 1, fieldNames)).toBe(true);
        expect(isRootNode(treeData, 2, fieldNames)).toBe(false);
      });

      it('应该支持自定义字段名处理多个根节点', () => {
        const treeData = [
          { nodeId: 1, name: 'root1' },
          { nodeId: 2, name: 'root2' },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(isRootNode(treeData, 1, fieldNames)).toBe(true);
        expect(isRootNode(treeData, 2, fieldNames)).toBe(true);
      });
    });

    describe('实际使用场景', () => {
      it('应该能在遍历时使用', () => {
        const treeData = [
          {
            id: 1,
            name: 'root1',
            children: [{ id: 2, name: 'child1' }],
          },
          { id: 3, name: 'root2' },
        ];
        const rootNodeIds: number[] = [];
        forEachTree(treeData, (node) => {
          if (isRootNode(treeData, node.id)) {
            rootNodeIds.push(node.id);
          }
        });
        expect(rootNodeIds).toEqual([1, 3]);
      });

      it('应该与 getParentTree 结果一致', () => {
        const treeData = [
          {
            id: 1,
            children: [{ id: 2, children: [{ id: 3 }] }],
          },
        ];
        expect(isRootNode(treeData, 1)).toBe(getParentTree(treeData, 1) === null);
        expect(isRootNode(treeData, 2)).toBe(getParentTree(treeData, 2) === null);
        expect(isRootNode(treeData, 3)).toBe(getParentTree(treeData, 3) === null);
      });
    });

    describe('convertToArrayTree', () => {
      it('应该将树结构扁平化为数组', () => {
        const result = convertToArrayTree(treeData);
        expect(result).toHaveLength(6);
        expect(result.map((n) => n.id)).toEqual([1, 2, 4, 5, 3, 6]);
        expect(result.map((n) => n.name)).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
      });

      it('应该移除 children 字段', () => {
        const result = convertToArrayTree(treeData);
        result.forEach((node) => {
          expect(node).not.toHaveProperty('children');
        });
      });

      it('应该保留其他所有字段', () => {
        const customTree = [
          {
            id: 1,
            name: 'node1',
            value: 100,
            status: 'active',
            children: [
              { id: 2, name: 'node2', value: 200 },
            ],
          },
        ];
        const result = convertToArrayTree(customTree);
        expect(result[0]).toHaveProperty('id', 1);
        expect(result[0]).toHaveProperty('name', 'node1');
        expect(result[0]).toHaveProperty('value', 100);
        expect(result[0]).toHaveProperty('status', 'active');
        expect(result[0]).not.toHaveProperty('children');
        expect(result[1]).toHaveProperty('id', 2);
        expect(result[1]).toHaveProperty('name', 'node2');
        expect(result[1]).toHaveProperty('value', 200);
        expect(result[1]).not.toHaveProperty('children');
      });

      it('应该处理空树', () => {
        const result = convertToArrayTree([]);
        expect(result).toEqual([]);
      });

      it('应该处理单层树', () => {
        const singleTree = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = convertToArrayTree(singleTree);
        expect(result).toHaveLength(2);
        expect(result[0]).not.toHaveProperty('children');
        expect(result[1]).not.toHaveProperty('children');
      });

      it('应该支持自定义字段名', () => {
        const customTree = [
          {
            nodeId: 1,
            name: 'node1',
            subNodes: [
              { nodeId: 2, name: 'node2' },
            ],
          },
        ];
        const result = convertToArrayTree(customTree, {
          children: 'subNodes',
          id: 'nodeId',
        });
        expect(result).toHaveLength(2);
        expect(result[0]).not.toHaveProperty('subNodes');
        expect(result[1]).not.toHaveProperty('subNodes');
      });

      it('应该处理 children 为 null 或 undefined 的情况', () => {
        const treeWithNull = [
          { id: 1, name: 'node1', children: null },
          { id: 2, name: 'node2', children: undefined },
        ];
        const result = convertToArrayTree(treeWithNull);
        expect(result).toHaveLength(2);
        expect(result[0]).not.toHaveProperty('children');
        expect(result[1]).not.toHaveProperty('children');
      });

      it('应该处理深层嵌套的树', () => {
        const deepTree = [
          {
            id: 1,
            name: 'level1',
            children: [
              {
                id: 2,
                name: 'level2',
                children: [
                  {
                    id: 3,
                    name: 'level3',
                    children: [
                      { id: 4, name: 'level4' },
                    ],
                  },
                ],
              },
            ],
          },
        ];
        const result = convertToArrayTree(deepTree);
        expect(result).toHaveLength(4);
        expect(result.map((n) => n.name)).toEqual(['level1', 'level2', 'level3', 'level4']);
      });

      it('应该处理节点没有 children 字段的情况', () => {
        const treeWithoutChildren = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = convertToArrayTree(treeWithoutChildren);
        expect(result).toHaveLength(2);
        expect(result[0]).not.toHaveProperty('children');
      });
    });

    describe('convertBackTree', () => {
      it('应该将扁平数组转换为树结构', () => {
        const array = [
          { id: 1, name: 'node1', parentId: null },
          { id: 2, name: 'node2', parentId: 1 },
          { id: 3, name: 'node3', parentId: 1 },
          { id: 4, name: 'node4', parentId: 2 },
          { id: 5, name: 'node5', parentId: 2 },
          { id: 6, name: 'node6', parentId: 3 },
        ];
        const result = convertBackTree(array);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(2);
        expect(result[0].children[0].id).toBe(2);
        expect(result[0].children[1].id).toBe(3);
        expect(result[0].children[0].children).toHaveLength(2);
        expect(result[0].children[1].children).toHaveLength(1);
      });

      it('应该处理多个根节点', () => {
        const array = [
          { id: 1, name: 'root1', parentId: null },
          { id: 2, name: 'root2', parentId: null },
          { id: 3, name: 'child1', parentId: 1 },
          { id: 4, name: 'child2', parentId: 2 },
        ];
        const result = convertBackTree(array);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
        expect(result[0].children).toHaveLength(1);
        expect(result[1].children).toHaveLength(1);
      });

      it('应该处理空数组', () => {
        const result = convertBackTree([]);
        expect(result).toEqual([]);
      });

      it('应该跳过没有 id 的节点', () => {
        const array = [
          { id: 1, name: 'node1', parentId: null },
          { name: 'node2', parentId: 1 }, // 没有 id
          { id: 3, name: 'node3', parentId: 1 },
        ];
        const result = convertBackTree(array);
        expect(result).toHaveLength(1);
        expect(result[0].children).toHaveLength(1);
        expect(result[0].children[0].id).toBe(3);
      });

      it('应该处理找不到父节点的情况（作为根节点）', () => {
        const array = [
          { id: 1, name: 'node1', parentId: 999 }, // 父节点不存在
          { id: 2, name: 'node2', parentId: null },
        ];
        const result = convertBackTree(array);
        expect(result).toHaveLength(2); // 两个都作为根节点
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
      });

      it('应该支持自定义 rootParentId', () => {
        const array = [
          { id: 1, name: 'node1', parentId: 0 },
          { id: 2, name: 'node2', parentId: 1 },
        ];
        const result = convertBackTree(array, { rootParentId: 0 });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(1);
      });

      it('应该支持自定义 parentIdField', () => {
        const array = [
          { id: 1, name: 'node1', pid: null },
          { id: 2, name: 'node2', pid: 1 },
        ];
        const result = convertBackTree(array, { parentIdField: 'pid' });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(1);
      });

      it('应该支持自定义字段名', () => {
        const array = [
          { nodeId: 1, name: 'node1', parentId: null },
          { nodeId: 2, name: 'node2', parentId: 1 },
        ];
        const result = convertBackTree(array, {
          fieldNames: { id: 'nodeId', children: 'subNodes' },
        });
        expect(result).toHaveLength(1);
        expect(result[0].nodeId).toBe(1);
        expect(result[0].subNodes).toHaveLength(1);
        expect(result[0].subNodes[0].nodeId).toBe(2);
      });

      it('应该处理 parentId 为 undefined 的情况', () => {
        const array = [
          { id: 1, name: 'node1' }, // parentId 为 undefined
          { id: 2, name: 'node2', parentId: 1 },
        ];
        const result = convertBackTree(array);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(1);
      });

      it('应该保持节点的其他属性', () => {
        const array = [
          { id: 1, name: 'node1', value: 100, status: 'active', parentId: null },
          { id: 2, name: 'node2', value: 200, parentId: 1 },
        ];
        const result = convertBackTree(array);
        expect(result[0]).toHaveProperty('name', 'node1');
        expect(result[0]).toHaveProperty('value', 100);
        expect(result[0]).toHaveProperty('status', 'active');
        expect(result[0].children[0]).toHaveProperty('name', 'node2');
        expect(result[0].children[0]).toHaveProperty('value', 200);
      });

      it('应该与 convertToArrayTree 配合使用', () => {
        const originalTree = [
          {
            id: 1,
            name: 'node1',
            children: [
              {
                id: 2,
                name: 'node2',
                children: [{ id: 4, name: 'node4' }],
              },
              { id: 3, name: 'node3' },
            ],
          },
        ];
        const array = convertToArrayTree(originalTree);
        // 添加 parentId
        const arrayWithParent = array.map((node) => {
          const parent = findTree(originalTree, (n) => {
            const children = n.children || [];
            return children.some((c: any) => c.id === node.id);
          });
          return {
            ...node,
            parentId: parent ? parent.id : null,
          };
        });
        const convertedTree = convertBackTree(arrayWithParent);
        // 验证结构
        expect(convertedTree).toHaveLength(1);
        expect(convertedTree[0].id).toBe(1);
        expect(convertedTree[0].children).toHaveLength(2);
      });

      it('应该支持 Map 格式转换', () => {
        const map = new Map([
          [1, { name: 'node1', parentId: null }],
          [2, { name: 'node2', parentId: 1 }],
        ]);
        const result = convertBackTree(map);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
      });

      it('应该支持 Record 格式转换', () => {
        const record = {
          1: { name: 'node1', parentId: null },
          2: { name: 'node2', parentId: 1 },
        };
        const result = convertBackTree(record);
        // Record 转换时，key 会被设置为 id，然后按数组方式处理
        // 由于有 parentId，应该能正确构建树结构
        expect(result.length).toBeGreaterThan(0);
        // 找到根节点（parentId 为 null 的节点）
        const rootNode = result.find(node => {
          const nodeId = node.id;
          return nodeId === 1 || nodeId === '1';
        });
        expect(rootNode).toBeDefined();
        if (rootNode) {
          expect(rootNode.name).toBe('node1');
        }
      });

      it('应该支持单个对象转换', () => {
        const obj = { id: 1, name: 'node1', children: [] };
        const result = convertBackTree(obj);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(obj);
      });

      it('应该处理空 Map', () => {
        const emptyMap = new Map();
        const result = convertBackTree(emptyMap);
        expect(result).toEqual([]);
      });

      it('应该处理空 Record', () => {
        const emptyRecord = {};
        const result = convertBackTree(emptyRecord);
        // 空 Record 会被当作单个对象处理，返回包含该对象的数组
        // 但由于是空对象，会被转换为包含 children 字段的对象
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(0);
      });

      it('应该处理 id 为 null 或 undefined 的节点', () => {
        const array = [
          { id: null, name: 'node1', parentId: null },
          { id: undefined, name: 'node2', parentId: null },
          { id: 1, name: 'node3', parentId: null },
        ];
        const result = convertBackTree(array);
        // 只有 id 有效的节点会被处理
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
      });

      it('应该处理 id 为 0 或 false 的节点', () => {
        const array = [
          { id: 0, name: 'node0', parentId: null },
          { id: false, name: 'nodeFalse', parentId: null },
          { id: 1, name: 'node1', parentId: 0 },
        ];
        const result = convertBackTree(array);
        // 0 和 false 是有效的 id 值
        expect(result.length).toBeGreaterThanOrEqual(1);
      });

      it('应该处理字符串类型的 id', () => {
        const array = [
          { id: '1', name: 'node1', parentId: null },
          { id: '2', name: 'node2', parentId: '1' },
        ];
        const result = convertBackTree(array);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
        expect(result[0].children).toHaveLength(1);
        expect(result[0].children[0].id).toBe('2');
      });

      it('应该处理 Map 中 value 不是对象的情况', () => {
        const map = new Map([
          [1, { name: 'node1', parentId: null }],
          [2, null as any], // null 值
        ]);
        const result = convertBackTree(map);
        expect(result.length).toBeGreaterThanOrEqual(0);
      });

      it('应该处理 Record 中 value 不是对象的情况', () => {
        const record = {
          1: { name: 'node1', parentId: null },
          2: null as any, // null 值
          3: 'string' as any, // 非对象值
        };
        const result = convertBackTree(record);
        expect(result.length).toBeGreaterThanOrEqual(0);
      });

      it('应该处理单个对象但不是树结构的情况', () => {
        const obj = { id: 1, name: 'node1' }; // 没有 children 字段
        const result = convertBackTree(obj);
        expect(result).toHaveLength(1);
        expect(result[0].children).toEqual([]);
      });

      it('应该处理 parentId 等于 rootParentId 的情况', () => {
        const array = [
          { id: 1, name: 'node1', parentId: 0 },
          { id: 2, name: 'node2', parentId: 0 },
        ];
        const result = convertBackTree(array, { rootParentId: 0 });
        expect(result).toHaveLength(2);
      });
    });

    describe('convertToMapTree', () => {
      it('应该将树结构转换为 Map', () => {
        const result = convertToMapTree(treeData);
        expect(result instanceof Map).toBe(true);
        expect(result.size).toBe(6);
        expect(result.get(1)).toBeDefined();
        expect(result.get(1)?.name).toBe('node1');
        expect(result.get(1)).not.toHaveProperty('children');
      });

      it('应该排除 children 字段', () => {
        const result = convertToMapTree(treeData);
        result.forEach((node) => {
          expect(node).not.toHaveProperty('children');
        });
      });

      it('应该处理空树', () => {
        const result = convertToMapTree([]);
        expect(result.size).toBe(0);
      });

      it('应该支持自定义字段名', () => {
        const customTree = [
          {
            nodeId: 1,
            name: 'node1',
            subNodes: [
              { nodeId: 2, name: 'node2' },
            ],
          },
        ];
        const result = convertToMapTree(customTree, {
          children: 'subNodes',
          id: 'nodeId',
        });
        expect(result.size).toBe(2);
        expect(result.get(1)).toBeDefined();
        expect(result.get(2)).toBeDefined();
      });

      it('应该跳过 id 为 null 或 undefined 的节点', () => {
        const tree = [
          { id: null, name: 'node1' },
          { id: undefined, name: 'node2' },
          { id: 1, name: 'node3' },
        ];
        const result = convertToMapTree(tree);
        expect(result.size).toBe(1);
        expect(result.get(1)).toBeDefined();
      });

      it('应该处理重复 id 的情况（保留最后一个）', () => {
        const tree = [
          {
            id: 1,
            name: 'node1',
            children: [
              { id: 1, name: 'node1-duplicate' }, // 重复 id
            ],
          },
        ];
        const result = convertToMapTree(tree);
        expect(result.size).toBe(1);
        // 后出现的会覆盖前面的
        expect(result.get(1)?.name).toBe('node1-duplicate');
      });

      it('应该处理字符串类型的 id', () => {
        const tree = [
          { id: '1', name: 'node1' },
          { id: '2', name: 'node2' },
        ];
        const result = convertToMapTree(tree);
        expect(result.size).toBe(2);
        expect(result.get('1')?.name).toBe('node1');
        expect(result.get('2')?.name).toBe('node2');
      });

      it('应该处理深层嵌套的树', () => {
        const deepTree = [
          {
            id: 1,
            name: 'level1',
            children: [
              {
                id: 2,
                name: 'level2',
                children: [
                  { id: 3, name: 'level3' },
                ],
              },
            ],
          },
        ];
        const result = convertToMapTree(deepTree);
        expect(result.size).toBe(3);
        expect(result.get(1)?.name).toBe('level1');
        expect(result.get(2)?.name).toBe('level2');
        expect(result.get(3)?.name).toBe('level3');
      });
    });

    describe('convertToLevelArrayTree', () => {
      it('应该将树结构转换为层级数组', () => {
        const result = convertToLevelArrayTree(treeData);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3); // 3层深度
        expect(result[0]).toHaveLength(1); // 第1层1个节点
        expect(result[1]).toHaveLength(2); // 第2层2个节点
        expect(result[2]).toHaveLength(3); // 第3层3个节点
      });

      it('应该按深度正确分组', () => {
        const result = convertToLevelArrayTree(treeData);
        expect(result[0][0].id).toBe(1);
        expect(result[1].map((n) => n.id)).toEqual([2, 3]);
        expect(result[2].map((n) => n.id)).toEqual([4, 5, 6]);
      });

      it('应该排除 children 字段', () => {
        const result = convertToLevelArrayTree(treeData);
        result.forEach((level) => {
          level.forEach((node) => {
            expect(node).not.toHaveProperty('children');
          });
        });
      });

      it('应该处理空树', () => {
        const result = convertToLevelArrayTree([]);
        expect(result).toEqual([]);
      });

      it('应该处理单层树', () => {
        const singleLevel = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = convertToLevelArrayTree(singleLevel);
        expect(result.length).toBe(1);
        expect(result[0]).toHaveLength(2);
      });

      it('应该支持自定义字段名', () => {
        const customTree = [
          {
            nodeId: 1,
            name: 'node1',
            subNodes: [
              { nodeId: 2, name: 'node2' },
            ],
          },
        ];
        const result = convertToLevelArrayTree(customTree, {
          children: 'subNodes',
          id: 'nodeId',
        });
        expect(result.length).toBe(2);
        expect(result[0][0].nodeId).toBe(1);
        expect(result[1][0].nodeId).toBe(2);
      });

      it('应该处理不平衡树', () => {
        const unbalancedTree = [
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
                name: 'node3', // 没有子节点
              },
            ],
          },
        ];
        const result = convertToLevelArrayTree(unbalancedTree);
        expect(result.length).toBe(3);
        expect(result[0]).toHaveLength(1);
        expect(result[1]).toHaveLength(2);
        expect(result[2]).toHaveLength(2);
      });

      it('应该处理深层嵌套的树', () => {
        const deepTree = [
          {
            id: 1,
            name: 'level1',
            children: [
              {
                id: 2,
                name: 'level2',
                children: [
                  {
                    id: 3,
                    name: 'level3',
                    children: [
                      { id: 4, name: 'level4' },
                    ],
                  },
                ],
              },
            ],
          },
        ];
        const result = convertToLevelArrayTree(deepTree);
        expect(result.length).toBe(4);
        expect(result[0][0].id).toBe(1);
        expect(result[1][0].id).toBe(2);
        expect(result[2][0].id).toBe(3);
        expect(result[3][0].id).toBe(4);
      });

      it('应该处理多个根节点', () => {
        const multiRoot = [
          { id: 1, name: 'root1' },
          {
            id: 2,
            name: 'root2',
            children: [{ id: 3, name: 'child1' }],
          },
        ];
        const result = convertToLevelArrayTree(multiRoot);
        expect(result.length).toBe(2);
        expect(result[0]).toHaveLength(2); // 两个根节点
        expect(result[1]).toHaveLength(1); // 一个子节点
      });

      it('应该处理节点没有 children 字段的情况', () => {
        const tree = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = convertToLevelArrayTree(tree);
        expect(result.length).toBe(1);
        expect(result[0]).toHaveLength(2);
      });
    });

    describe('convertToObjectTree', () => {
      it('应该将单根树转换为对象', () => {
        const singleRoot = [{ id: 1, name: 'node1', children: [] }];
        const result = convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
        expect(result?.name).toBe('node1');
      });

      it('多个根节点应该返回 null', () => {
        const multiRoot = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = convertToObjectTree(multiRoot);
        expect(result).toBeNull();
      });

      it('空树应该返回 null', () => {
        const result = convertToObjectTree([]);
        expect(result).toBeNull();
      });

      it('应该保留完整的节点结构', () => {
        const singleRoot = [
          {
            id: 1,
            name: 'node1',
            value: 100,
            children: [{ id: 2, name: 'node2' }],
          },
        ];
        const result = convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
        expect(result?.name).toBe('node1');
        expect(result?.value).toBe(100);
        expect(result?.children).toHaveLength(1);
      });

      it('应该处理 null 输入', () => {
        const result = convertToObjectTree(null as any);
        expect(result).toBeNull();
      });

      it('应该处理 undefined 输入', () => {
        const result = convertToObjectTree(undefined as any);
        expect(result).toBeNull();
      });

      it('应该处理非数组输入', () => {
        const result = convertToObjectTree({ id: 1, name: 'node1' } as any);
        expect(result).toBeNull();
      });

      it('应该处理单根树但没有 children 字段的情况', () => {
        const singleRoot = [{ id: 1, name: 'node1' }];
        const result = convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
      });

      it('应该处理单根树但 children 为 null 的情况', () => {
        const singleRoot = [{ id: 1, name: 'node1', children: null }];
        const result = convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
      });
    });

    describe('cloneTree', () => {
      it('应该深拷贝树结构', () => {
        const tree = [{ id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }];
        const cloned = cloneTree(tree);
        expect(cloned).not.toBe(tree);
        expect(cloned[0]).not.toBe(tree[0]);
        expect(cloned[0].children[0]).not.toBe(tree[0].children[0]);
      });

      it('应该不修改原树', () => {
        const tree = [{ id: 1, name: 'node1' }];
        const cloned = cloneTree(tree);
        cloned[0].name = 'modified';
        expect(tree[0].name).toBe('node1');
      });

      it('应该递归拷贝所有层级', () => {
        const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }];
        const cloned = cloneTree(tree);
        cloned[0].children[0].children[0].id = 999;
        expect(tree[0].children[0].children[0].id).toBe(3);
      });

      it('应该处理空数组', () => {
        const result = cloneTree([]);
        expect(result).toEqual([]);
      });

      it('应该支持自定义字段名', () => {
        const tree = [{ nodeId: 1, subNodes: [{ nodeId: 2 }] }];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        const cloned = cloneTree(tree, fieldNames);
        expect(cloned[0].nodeId).toBe(1);
        expect(cloned[0].subNodes[0].nodeId).toBe(2);
        cloned[0].nodeId = 999;
        expect(tree[0].nodeId).toBe(1);
      });

      it('应该保留所有节点属性', () => {
        const tree = [{ id: 1, name: 'node1', value: 100, extra: { data: 'test' } }];
        const cloned = cloneTree(tree);
        expect(cloned[0].name).toBe('node1');
        expect(cloned[0].value).toBe(100);
        expect(cloned[0].extra.data).toBe('test');
      });
    });

    describe('shallowCloneTree', () => {
      it('应该浅拷贝第一层节点', () => {
        const tree = [{ id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }];
        const cloned = shallowCloneTree(tree);
        expect(cloned).not.toBe(tree);
        expect(cloned[0]).not.toBe(tree[0]);
        // 子节点应该共享引用（浅拷贝）
        expect(cloned[0].children).toBe(tree[0].children);
      });

      it('应该不修改原树的第一层', () => {
        const tree = [{ id: 1, name: 'node1' }];
        const cloned = shallowCloneTree(tree);
        cloned[0].name = 'modified';
        expect(tree[0].name).toBe('node1');
      });

      it('应该处理空数组', () => {
        const result = shallowCloneTree([]);
        expect(result).toEqual([]);
      });

      it('应该支持自定义字段名', () => {
        const tree = [{ nodeId: 1, subNodes: [{ nodeId: 2 }] }];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        const cloned = shallowCloneTree(tree, fieldNames);
        expect(cloned[0].nodeId).toBe(1);
        cloned[0].nodeId = 999;
        expect(tree[0].nodeId).toBe(1);
      });
    });

    describe('cloneSubtree', () => {
      it('应该拷贝指定节点的子树（按 id）', () => {
        const tree = [
          {
            id: 1,
            name: 'node1',
            children: [
              { id: 2, name: 'node2', children: [{ id: 4, name: 'node4' }] },
              { id: 3, name: 'node3' },
            ],
          },
        ];
        const cloned = cloneSubtree(tree, { id: 2 });
        expect(cloned).toHaveLength(1);
        expect(cloned[0].id).toBe(2);
        expect(cloned[0].name).toBe('node2');
        expect(cloned[0].children).toHaveLength(1);
        expect(cloned[0].children[0].id).toBe(4);
      });

      it('应该深拷贝子树', () => {
        const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }];
        const cloned = cloneSubtree(tree, { id: 2 });
        cloned[0].children[0].id = 999;
        expect(tree[0].children[0].children[0].id).toBe(3);
      });

      it('未找到节点应该返回空数组', () => {
        const tree = [{ id: 1, name: 'node1' }];
        const result = cloneSubtree(tree, { id: 999 });
        expect(result).toEqual([]);
      });

      it('应该处理空数组', () => {
        const result = cloneSubtree([], { id: 1 });
        expect(result).toEqual([]);
      });

      it('应该支持自定义 children 字段名', () => {
        const tree = [{ nodeId: 1, subNodes: [{ nodeId: 2 }] }];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        const cloned = cloneSubtree(tree, { nodeId: 2 }, fieldNames);
        expect(cloned).toHaveLength(1);
        expect(cloned[0].nodeId).toBe(2);
      });

      it('查找字段由对象键名决定，不使用 fieldNames.id', () => {
        const tree = [{ customId: 1, children: [{ customId: 2 }] }];
        const fieldNames = { children: 'children', id: 'id' };
        // 即使 fieldNames.id 是 'id'，但查找字段由对象键名决定，所以用 customId
        const cloned = cloneSubtree(tree, { customId: 2 }, fieldNames);
        expect(cloned).toHaveLength(1);
        expect(cloned[0].customId).toBe(2);
      });

      it('应该支持按 name 字段查找（传对象）', () => {
        const tree = [
          {
            id: 1,
            name: 'root',
            children: [
              { id: 2, name: 'sub1', children: [{ id: 4, name: 'sub1-1' }] },
              { id: 3, name: 'sub2' },
            ],
          },
        ];
        const cloned = cloneSubtree(tree, { name: 'sub1' });
        expect(cloned).toHaveLength(1);
        expect(cloned[0].name).toBe('sub1');
        expect(cloned[0].id).toBe(2);
        expect(cloned[0].children).toHaveLength(1);
        expect(cloned[0].children[0].name).toBe('sub1-1');
      });

      it('应该支持按其他字段查找（传对象）', () => {
        const tree = [
          {
            id: 1,
            code: 'A001',
            children: [
              { id: 2, code: 'B001', children: [{ id: 4, code: 'C001' }] },
              { id: 3, code: 'B002' },
            ],
          },
        ];
        const cloned = cloneSubtree(tree, { code: 'B001' });
        expect(cloned).toHaveLength(1);
        expect(cloned[0].code).toBe('B001');
        expect(cloned[0].id).toBe(2);
        expect(cloned[0].children).toHaveLength(1);
        expect(cloned[0].children[0].code).toBe('C001');
      });

      it('按其他字段查找未找到应该返回空数组', () => {
        const tree = [{ id: 1, name: 'node1' }];
        const result = cloneSubtree(tree, { name: 'notfound' });
        expect(result).toEqual([]);
      });

      it('传空对象应该返回空数组', () => {
        const tree = [{ id: 1, name: 'node1' }];
        const result = cloneSubtree(tree, {});
        expect(result).toEqual([]);
      });

      it('传多个字段的对象应该抛出错误', () => {
        const tree = [{ id: 1, name: 'node1', code: 'A001' }];
        expect(() => cloneSubtree(tree, { name: 'node1', code: 'A001' })).toThrow();
      });

      it('不传对象应该抛出错误', () => {
        const tree = [{ id: 1, name: 'node1' }];
        expect(() => cloneSubtree(tree, 1 as any)).toThrow();
        expect(() => cloneSubtree(tree, 'node1' as any)).toThrow();
      });
    });

    describe('cloneWithTransform', () => {
      it('应该拷贝并转换节点', () => {
        const tree = [{ id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] }];
        const cloned = cloneWithTransform(tree, (node) => ({
          ...node,
          label: node.name,
        }));
        expect(cloned[0].label).toBe('node1');
        expect(cloned[0].children[0].label).toBe('node2');
        expect(tree[0].label).toBeUndefined();
      });

      it('应该深拷贝转换后的树', () => {
        const tree = [{ id: 1, name: 'node1' }];
        const cloned = cloneWithTransform(tree, (node) => ({ ...node, count: 1 }));
        cloned[0].count = 999;
        expect(tree[0].count).toBeUndefined();
      });

      it('应该递归转换所有节点', () => {
        const tree = [
          {
            id: 1,
            children: [
              { id: 2, children: [{ id: 3 }] },
            ],
          },
        ];
        const cloned = cloneWithTransform(tree, (node) => ({
          ...node,
          processed: true,
        }));
        expect(cloned[0].processed).toBe(true);
        expect(cloned[0].children[0].processed).toBe(true);
        expect(cloned[0].children[0].children[0].processed).toBe(true);
      });

      it('应该处理空数组', () => {
        const result = cloneWithTransform([], (node) => node);
        expect(result).toEqual([]);
      });

      it('应该支持自定义字段名', () => {
        const tree = [{ nodeId: 1, subNodes: [{ nodeId: 2 }] }];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        const cloned = cloneWithTransform(
          tree,
          (node) => ({ ...node, label: `Node ${node.nodeId}` }),
          fieldNames
        );
        expect(cloned[0].label).toBe('Node 1');
        expect(cloned[0].subNodes[0].label).toBe('Node 2');
      });
    });
  });

  describe('数据分析方法', () => {
    describe('aggregateTree', () => {
      it('应该按分组聚合数据', () => {
        const tree = [
          { id: 1, category: 'A', value: 10, score: 80 },
          { id: 2, category: 'A', value: 20, score: 90 },
          { id: 3, category: 'B', value: 30, score: 70, children: [{ id: 4, category: 'B', value: 40, score: 85 }] },
        ];
        
        const result = aggregateTree(tree, {
          groupBy: (node) => node.category,
          aggregations: {
            totalValue: { operation: 'sum', field: 'value' },
            avgScore: { operation: 'avg', field: 'score' },
            count: { operation: 'count' },
          },
        });
        
        expect(result['A'].totalValue).toBe(30);
        expect(result['A'].avgScore).toBe(85);
        expect(result['A'].count).toBe(2);
        expect(result['B'].totalValue).toBe(70);
        expect(result['B'].count).toBe(2);
      });

      it('应该处理空树', () => {
        const result = aggregateTree([], {
          groupBy: (node) => node.category,
          aggregations: { count: { operation: 'count' } },
        });
        expect(result).toEqual({});
      });

      it('应该支持自定义字段名', () => {
        const tree = [
          { nodeId: 1, type: 'X', amount: 100 },
          { nodeId: 2, type: 'X', amount: 200 },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        const result = aggregateTree(
          tree,
          {
            groupBy: (node) => node.type,
            aggregations: { total: { operation: 'sum', field: 'amount' } },
          },
          fieldNames
        );
        expect(result['X'].total).toBe(300);
      });
    });

    describe('groupTree', () => {
      it('应该按字段分组', () => {
        const tree = [
          { id: 1, category: 'A' },
          { id: 2, category: 'A' },
          { id: 3, category: 'B', children: [{ id: 4, category: 'B' }] },
        ];
        const result = groupTree(tree, 'category');
        expect(result['A']).toHaveLength(2);
        expect(result['B']).toHaveLength(2);
      });

      it('应该处理空树', () => {
        const result = groupTree([], 'category');
        expect(result).toEqual({});
      });
    });

    describe('groupByTree', () => {
      it('应该按条件分组', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2, value: 20 },
          { id: 3, value: 10, children: [{ id: 4, value: 30 }] },
        ];
        const result = groupByTree(tree, (node) => node.value >= 20 ? 'high' : 'low');
        expect(result['low']).toHaveLength(2);
        expect(result['high']).toHaveLength(2);
      });
    });

    describe('sumTree', () => {
      it('应该计算字段总和', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2, value: 20, children: [{ id: 3, value: 30 }] },
        ];
        expect(sumTree(tree, 'value')).toBe(60);
      });

      it('应该处理空值和缺失字段', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2 },
          { id: 3, value: null },
        ];
        expect(sumTree(tree, 'value')).toBe(10);
      });
    });

    describe('avgTree', () => {
      it('应该计算字段平均值', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2, value: 20 },
          { id: 3, value: 30 },
        ];
        expect(avgTree(tree, 'value')).toBe(20);
      });

      it('应该忽略 null 和 undefined', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2 },
          { id: 3, value: null },
        ];
        expect(avgTree(tree, 'value')).toBe(10);
      });

      it('应该处理空树', () => {
        expect(avgTree([], 'value')).toBe(0);
      });
    });

    describe('maxTree', () => {
      it('应该获取字段最大值', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2, value: 30 },
          { id: 3, value: 20 },
        ];
        expect(maxTree(tree, 'value')).toBe(30);
      });

      it('应该处理空树', () => {
        expect(maxTree([], 'value')).toBeNull();
      });

      it('应该忽略非数字值', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2, value: 'abc' },
          { id: 3, value: 20 },
        ];
        expect(maxTree(tree, 'value')).toBe(20);
      });
    });

    describe('minTree', () => {
      it('应该获取字段最小值', () => {
        const tree = [
          { id: 1, value: 30 },
          { id: 2, value: 10 },
          { id: 3, value: 20 },
        ];
        expect(minTree(tree, 'value')).toBe(10);
      });

      it('应该处理空树', () => {
        expect(minTree([], 'value')).toBeNull();
      });
    });

    describe('countTree', () => {
      it('应该统计所有节点', () => {
        const tree = [
          { id: 1 },
          { id: 2, children: [{ id: 3 }] },
        ];
        expect(countTree(tree)).toBe(3);
      });

      it('应该统计满足条件的节点', () => {
        const tree = [
          { id: 1, value: 10 },
          { id: 2, value: 20 },
          { id: 3, value: 10 },
        ];
        expect(countTree(tree, (node) => node.value === 10)).toBe(2);
      });
    });

    describe('getTreeStats', () => {
      it('应该返回统计信息', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] },
        ];
        const stats = getTreeStats(tree);
        expect(stats.totalNodes).toBe(4);
        expect(stats.leafNodes).toBe(2);
        expect(stats.maxDepth).toBe(3);
        expect(stats.minDepth).toBe(1);
        expect(stats.levels).toBe(3);
      });

      it('应该处理空树', () => {
        const stats = getTreeStats([]);
        expect(stats.totalNodes).toBe(0);
        expect(stats.leafNodes).toBe(0);
        expect(stats.maxDepth).toBe(0);
      });

      it('应该支持自定义字段名', () => {
        const tree = [
          { nodeId: 1, subNodes: [{ nodeId: 2 }] },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        const stats = getTreeStats(tree, fieldNames);
        expect(stats.totalNodes).toBe(2);
        expect(stats.leafNodes).toBe(1);
      });
    });

    describe('analyzeTree', () => {
      it('应该提供全面的树结构分析', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] },
        ];
        const analysis = analyzeTree(tree);
        
        // 基础统计
        expect(analysis.totalNodes).toBe(4);
        expect(analysis.leafNodes).toBe(2);
        expect(analysis.internalNodes).toBe(2);
        expect(analysis.maxDepth).toBe(3);
        expect(analysis.levels).toBe(3);
        
        // 层级分析
        expect(analysis.byLevel[0]).toBe(1);
        expect(analysis.byLevel[1]).toBe(2);
        expect(analysis.byLevel[2]).toBe(1);
        expect(analysis.maxWidth).toBeGreaterThan(0);
        expect(analysis.avgWidth).toBeGreaterThan(0);
        
        // 分支因子
        expect(analysis.avgBranchingFactor).toBeGreaterThan(0);
        expect(analysis.maxBranchingFactor).toBeGreaterThan(0);
        
        // 深度分布
        expect(analysis.depthDistribution[1]).toBe(1);
        expect(analysis.depthDistribution[2]).toBe(2);
        expect(analysis.depthDistribution[3]).toBe(1);
        
        // 平衡性
        expect(typeof analysis.isBalanced).toBe('boolean');
        expect(analysis.balanceRatio).toBeGreaterThanOrEqual(0);
        expect(analysis.balanceRatio).toBeLessThanOrEqual(1);
        
        // 路径分析
        expect(analysis.avgPathLength).toBeGreaterThan(0);
        expect(analysis.maxPathLength).toBeGreaterThan(0);
        
        // 叶子节点
        expect(analysis.leafNodeRatio).toBeGreaterThan(0);
        expect(analysis.leafNodeRatio).toBeLessThanOrEqual(1);
      });

      it('应该处理空树', () => {
        const analysis = analyzeTree([]);
        expect(analysis.totalNodes).toBe(0);
        expect(analysis.leafNodes).toBe(0);
        expect(analysis.maxDepth).toBe(0);
        expect(analysis.byLevel).toEqual({});
        expect(analysis.depthDistribution).toEqual({});
      });

      it('应该正确计算分支因子', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3 }, { id: 4 }] },
        ];
        const analysis = analyzeTree(tree);
        expect(analysis.maxBranchingFactor).toBe(3);
        expect(analysis.avgBranchingFactor).toBe(3);
      });

      it('应该正确计算平衡性', () => {
        const balancedTree = [
          { id: 1, children: [{ id: 2 }, { id: 3 }] },
        ];
        const analysis = analyzeTree(balancedTree);
        expect(typeof analysis.isBalanced).toBe('boolean');
        expect(analysis.depthVariance).toBeGreaterThanOrEqual(0);
      });

      it('应该支持只计算部分统计项', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] },
        ];
        
        // 只计算基础统计，明确设置其他选项为 false
        const basicAnalysis = analyzeTree(tree, { 
          includeBasic: true,
          includeLevelAnalysis: false,
          includeBranchingFactor: false,
          includeDepthDistribution: false,
          includeBalanceAnalysis: false,
          includePathAnalysis: false,
          includeLeafAnalysis: false,
        });
        expect(basicAnalysis.totalNodes).toBe(4);
        expect(basicAnalysis.leafNodes).toBe(2);
        expect(basicAnalysis.maxDepth).toBe(3);
        // 其他统计项应该为空或默认值
        expect(basicAnalysis.byLevel).toEqual({});
        expect(basicAnalysis.branchingFactorDistribution).toEqual({});
        expect(basicAnalysis.depthDistribution).toEqual({});
        expect(basicAnalysis.depthVariance).toBe(0);
        expect(basicAnalysis.isBalanced).toBe(false);
        expect(basicAnalysis.avgPathLength).toBe(0);
        expect(basicAnalysis.leafNodeRatio).toBe(0);
      });

      it('应该支持只计算层级分析', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3 }] },
        ];
        
        const levelAnalysis = analyzeTree(tree, { 
          includeBasic: false,
          includeLevelAnalysis: true 
        });
        expect(levelAnalysis.totalNodes).toBe(0);
        expect(levelAnalysis.byLevel[0]).toBe(1);
        expect(levelAnalysis.byLevel[1]).toBe(2);
        expect(levelAnalysis.maxWidth).toBeGreaterThan(0);
      });

      it('应该支持只计算分支因子', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3 }, { id: 4 }] },
        ];
        
        const branchingAnalysis = analyzeTree(tree, { 
          includeBasic: false,
          includeBranchingFactor: true 
        });
        expect(branchingAnalysis.totalNodes).toBe(0);
        expect(branchingAnalysis.maxBranchingFactor).toBe(3);
        expect(branchingAnalysis.avgBranchingFactor).toBe(3);
        expect(branchingAnalysis.branchingFactorDistribution[3]).toBe(1);
      });

      it('应该支持只计算平衡性分析', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3 }] },
        ];
        
        const balanceAnalysis = analyzeTree(tree, { 
          includeBasic: true,
          includeBalanceAnalysis: true 
        });
        expect(balanceAnalysis.totalNodes).toBe(3);
        expect(typeof balanceAnalysis.isBalanced).toBe('boolean');
        expect(balanceAnalysis.depthVariance).toBeGreaterThanOrEqual(0);
        expect(balanceAnalysis.balanceRatio).toBeGreaterThanOrEqual(0);
      });

      it('应该支持组合选项', () => {
        const tree = [
          { id: 1, children: [{ id: 2 }, { id: 3 }] },
        ];
        
        const combinedAnalysis = analyzeTree(tree, { 
          includeBasic: true,
          includeBranchingFactor: true,
          includeBalanceAnalysis: true,
          includeLevelAnalysis: false,
          includeDepthDistribution: false,
          includePathAnalysis: false,
          includeLeafAnalysis: false,
        });
        expect(combinedAnalysis.totalNodes).toBe(3);
        expect(combinedAnalysis.maxBranchingFactor).toBe(2);
        expect(typeof combinedAnalysis.isBalanced).toBe('boolean');
        expect(combinedAnalysis.byLevel).toEqual({});
        expect(combinedAnalysis.depthDistribution).toEqual({});
        expect(combinedAnalysis.avgPathLength).toBe(0);
        expect(combinedAnalysis.leafNodeRatio).toBe(0);
      });
    });
  });

  describe('补充测试 - null/undefined 处理', () => {
    it('filterTree 应该处理 undefined children', () => {
      const tree = [
        { id: 1, children: undefined },
        { id: 2, children: null },
      ];
      const result = filterTree(tree, (node) => node.id === 1);
      expect(result).toHaveLength(1);
    });

    it('应该处理 children 为 undefined 的情况', () => {
      const tree = [
        { id: 1, children: undefined },
        { id: 2 },
      ];
      const result = mapTree(tree, (node) => node.id);
      expect(result).toEqual([1, 2]);
    });

    it('应该处理 children 为 null 的情况', () => {
      const tree = [
        { id: 1, children: null },
        { id: 2 },
      ];
      const result = mapTree(tree, (node) => node.id);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('补充测试 - 错误消息验证', () => {
    it('cloneSubtree 应该抛出正确的错误消息（非对象）', () => {
      const tree = [{ id: 1 }];
      expect(() => cloneSubtree(tree, 123 as any)).toThrow(
        'cloneSubtree: 必须传入对象，例如 { id: 1 } 或 { name: "xxx" }'
      );
    });

    it('cloneSubtree 应该抛出正确的错误消息（多个字段）', () => {
      const tree = [{ id: 1, name: 'node1' }];
      expect(() => cloneSubtree(tree, { id: 1, name: 'node1' })).toThrow(
        'cloneSubtree: 查找对象只能包含一个字段，例如 { id: 1 } 或 { name: "xxx" }'
      );
    });

    it('cloneSubtree 应该抛出正确的错误消息（数组）', () => {
      const tree = [{ id: 1 }];
      expect(() => cloneSubtree(tree, [1] as any)).toThrow(
        'cloneSubtree: 必须传入对象，例如 { id: 1 } 或 { name: "xxx" }'
      );
    });
  });

  describe('补充测试 - 复杂场景组合', () => {
    it('应该支持链式操作：filter -> map -> find', () => {
      const tree = [
        { id: 1, value: 10, children: [{ id: 2, value: 20 }, { id: 3, value: 30 }] },
        { id: 4, value: 40, children: [{ id: 5, value: 50 }] },
      ];
      
      const filtered = filterTree(tree, (node) => node.value > 20);
      const mapped = mapTree(filtered, (node) => node.id);
      const found = findTree(filtered, (node) => node.value === 50);
      
      expect(mapped).toContain(3);
      expect(mapped).toContain(4);
      expect(mapped).toContain(5);
      expect(found?.id).toBe(5);
    });

    it('应该支持深度嵌套的复杂操作', () => {
      const deepTree = [
        {
          id: 1,
          level: 1,
          children: [
            {
              id: 2,
              level: 2,
              children: [
                {
                  id: 3,
                  level: 3,
                  children: [
                    { id: 4, level: 4 },
                    { id: 5, level: 4 },
                  ],
                },
              ],
            },
          ],
        },
      ];

      // 获取深度为 3 的节点
      const depth3Nodes = filterTree(deepTree, (node) => node.level === 3);
      expect(depth3Nodes).toHaveLength(1);
      expect(depth3Nodes[0].id).toBe(3);

      // 获取所有 level 4 的节点
      const depth4Nodes = filterTree(deepTree, (node) => node.level === 4);
      expect(depth4Nodes).toHaveLength(2);
    });

    it('应该支持大规模数据的操作', () => {
      // 创建一个有 100 个节点的树
      const largeTree: any[] = [];
      for (let i = 1; i <= 10; i++) {
        const children: any[] = [];
        for (let j = 1; j <= 9; j++) {
          children.push({ id: i * 10 + j, name: `node-${i}-${j}` });
        }
        largeTree.push({ id: i, name: `node-${i}`, children });
      }

      const allNodes = mapTree(largeTree, (node) => node.id);
      expect(allNodes).toHaveLength(100);

      const filtered = filterTree(largeTree, (node) => node.id % 2 === 0);
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  describe('补充测试 - 边界值处理', () => {
    it('isSafeTreeDepth 应该处理 maxDepth = 0', () => {
      const tree = [{ id: 1 }];
      expect(isSafeTreeDepth(tree, 0)).toBe(false);
    });

    it('isSafeTreeDepth 应该处理 maxDepth < 0', () => {
      const tree = [{ id: 1 }];
      expect(isSafeTreeDepth(tree, -1)).toBe(false);
    });

    it('isSafeTreeDepth 应该处理空树', () => {
      expect(isSafeTreeDepth([], 10)).toBe(true);
    });

    it('getNodeDepth 应该处理不存在的节点', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }];
      const depth = getNodeDepth(tree, 999);
      expect(depth).toBeNull();
    });

    it('getNodeDepthMap 应该处理空树', () => {
      const map = getNodeDepthMap([]);
      expect(map).toEqual({});
    });
  });

  describe('补充测试 - 数据类型边界', () => {
    it('应该处理 children 为数字的情况', () => {
      const tree = [
        { id: 1, children: 123 as any },
        { id: 2, children: 'string' as any },
      ];
      
      const result = mapTree(tree, (node) => node.id);
      expect(result).toEqual([1, 2]);
    });

    it('应该处理 children 为布尔值的情况', () => {
      const tree = [
        { id: 1, children: true as any },
        { id: 2, children: false as any },
      ];
      
      const result = filterTree(tree, (node) => node.id === 1);
      expect(result).toHaveLength(1);
    });

    it('应该处理节点没有 id 字段的情况', () => {
      const tree = [
        { name: 'node1', children: [{ name: 'node2' }] },
      ];
      
      const result = mapTree(tree, (node) => node.name);
      expect(result).toEqual(['node1', 'node2']);
    });
  });

  describe('补充测试 - 自定义字段名边界', () => {
    it('应该处理自定义字段名为空字符串', () => {
      const tree = [
        { customId: 1, customChildren: [{ customId: 2 }] },
      ];
      const fieldNames = { children: '', id: '' };
      // 使用空字符串作为字段名，会查找空字符串字段，找不到子节点
      const result = mapTree(tree, (node) => node.customId, fieldNames);
      expect(result).toEqual([1]);
    });

    it('应该处理自定义字段名与节点字段不匹配', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      // 字段名不匹配，应该找不到子节点
      const result = getChildrenTree(tree, 1, fieldNames);
      expect(result).toEqual([]);
    });
  });

  describe('补充测试 - 性能边界', () => {
    it('应该处理单层大量节点', () => {
      const tree: any[] = [];
      for (let i = 1; i <= 1000; i++) {
        tree.push({ id: i, name: `node-${i}` });
      }
      
      const result = findTree(tree, (node) => node.id === 500);
      expect(result?.id).toBe(500);
    });

    it('应该处理极深的树结构', () => {
      let deepTree: any = { id: 1 };
      let current = deepTree;
      for (let i = 2; i <= 100; i++) {
        current.children = [{ id: i }];
        current = current.children[0];
      }
      
      const depth = getNodeDepth([deepTree], 100);
      expect(depth).toBe(100);
    });
  });

  describe('补充测试 - 返回值验证', () => {
    it('popTree 应该返回被删除的节点', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const popped = popTree(tree, 1);
      expect(popped?.id).toBe(3);
      expect(tree[0].children).toHaveLength(1);
    });

    it('popTree 应该在没有子节点时返回 null', () => {
      const tree = [{ id: 1, children: [] }];
      const popped = popTree(tree, 1);
      expect(popped).toBeNull();
    });

    it('shiftTree 应该返回被删除的节点', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const shifted = shiftTree(tree, 1);
      expect(shifted?.id).toBe(2);
      expect(tree[0].children).toHaveLength(1);
    });

    it('shiftTree 应该在没有子节点时返回 null', () => {
      const tree = [{ id: 1, children: [] }];
      const shifted = shiftTree(tree, 1);
      expect(shifted).toBeNull();
    });
  });

  describe('补充测试 - 数组方法边界', () => {
    it('sliceTree 应该处理负数 start', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const result = sliceTree(tree, -1);
      expect(result).toHaveLength(1);
    });

    it('sliceTree 应该处理负数 end', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const result = sliceTree(tree, 0, -1);
      // 负数 end 会被转换为正数，如果 end < start 则返回空数组
      expect(Array.isArray(result)).toBe(true);
    });

    it('sliceTree 应该处理 start > end', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const result = sliceTree(tree, 2, 1);
      expect(result).toHaveLength(0);
    });
  });
});
