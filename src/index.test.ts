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
  });

  describe('unshiftTree', () => {
    it('应该在指定节点下添加子节点到开头', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = unshiftTree(treeData, 1, newNode);
      expect(success).toBe(true);
      expect(treeData[0].children.length).toBe(3);
      expect(treeData[0].children[0].name).toBe('node7');
    });
  });

  describe('popTree', () => {
    it('应该删除指定节点下的最后一个子节点', () => {
      const success = popTree(treeData, 1);
      expect(success).toBe(true);
      expect(treeData[0].children.length).toBe(1);
      expect(treeData[0].children[0].id).toBe(2);
    });

    it('应该返回false如果节点没有子节点', () => {
      const success = popTree(treeData, 4);
      expect(success).toBe(false);
    });
  });

  describe('shiftTree', () => {
    it('应该删除指定节点下的第一个子节点', () => {
      const success = shiftTree(treeData, 1);
      expect(success).toBe(true);
      expect(treeData[0].children.length).toBe(1);
      expect(treeData[0].children[0].id).toBe(3);
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

    it('应该返回null如果未找到', () => {
      const result = atTree(treeData, 999, 0);
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
      popTree(testTree, 1);
      expect(testTree[0].children).toHaveLength(2);
      expect(testTree[0].children[1].id).toBe(3);

      // 删除第一个
      shiftTree(testTree, 1);
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
  });
});
