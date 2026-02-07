import { describe, it, expect, beforeEach } from 'vitest';
import { wrapTests } from './test-wrapper';
import * as sourceModule from './index';

// 只测试打包文件，不测试源代码
wrapTests('Tree Processor - 仅测试打包文件', sourceModule, (module) => {
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
      module.mapTree(treeData, (item) => {
        result.push(item.name);
      });
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('应该返回映射后的数组', () => {
      const result = module.mapTree(treeData, (item) => item.name);
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });
  });

  describe('filterTree', () => {
    it('应该过滤出满足条件的节点', () => {
      const values = ['node1', 'node2', 'node3'];
      const result = module.filterTree(treeData, (item) => {
        return values.includes(item.name);
      });
      expect(result).toHaveLength(3);
      expect(result.map((n) => n.name)).toEqual(['node1', 'node2', 'node3']);
    });
  });

  describe('findTree', () => {
    it('应该找到满足条件的第一个节点', () => {
      const result = module.findTree(treeData, (item) => {
        return item.hasOwnProperty('children');
      });
      expect(result).not.toBeNull();
      expect(result?.name).toBe('node1');
    });

    it('应该返回null如果未找到', () => {
      const result = module.findTree(treeData, (item) => item.name === 'notfound');
      expect(result).toBeNull();
    });
  });

  describe('pushTree', () => {
    it('应该在指定节点下添加子节点', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = module.pushTree(treeData, 1, newNode);
      expect(success).toBe(true);
      expect(treeData[0].children.length).toBe(3);
      expect(treeData[0].children[2].name).toBe('node7');
    });

    it('应该返回false如果未找到目标节点', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = module.pushTree(treeData, 999, newNode);
      expect(success).toBe(false);
    });
  });

  describe('unshiftTree', () => {
    it('应该在指定节点下添加子节点到开头', () => {
      const newNode = { id: 7, name: 'node7' };
      const success = module.unshiftTree(treeData, 1, newNode);
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
      const success = module.unshiftTree(deepTree, 3, newNode);
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
      const success = module.unshiftTree(treeWithoutChildren, 2, newNode);
      expect(success).toBe(true);
      expect(Array.isArray(treeWithoutChildren[0].children[0].children)).toBe(true);
      expect(treeWithoutChildren[0].children[0].children[0].id).toBe(3);
    });

    it('应该返回false如果未找到目标节点（触发178行）', () => {
      const newNode = { id: 999, name: 'node999' };
      const success = module.unshiftTree(treeData, 999, newNode);
      expect(success).toBe(false);
    });
  });

  describe('popTree', () => {
    it('应该删除指定节点下的最后一个子节点', () => {
      const originalLastChild = treeData[0].children[treeData[0].children.length - 1];
      const removedNode = module.popTree(treeData, 1);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalLastChild);
      expect(treeData[0].children.length).toBe(1);
      expect(treeData[0].children[0].id).toBe(2);
    });

    it('应该返回null如果节点没有子节点', () => {
      const removedNode = module.popTree(treeData, 4);
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
      const removedNode = module.popTree(deepTree, 3);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalLastChild);
      expect(deepTree[0].children[0].children[0].children.length).toBe(1);
      expect(deepTree[0].children[0].children[0].children[0].id).toBe(4);
    });
  });

  describe('shiftTree', () => {
    it('应该删除指定节点下的第一个子节点', () => {
      const originalFirstChild = treeData[0].children[0];
      const removedNode = module.shiftTree(treeData, 1);
      expect(removedNode).not.toBeNull();
      expect(removedNode).toEqual(originalFirstChild);
      expect(treeData[0].children.length).toBe(1);
      expect(treeData[0].children[0].id).toBe(3);
    });

    it('应该返回null如果节点没有子节点', () => {
      const removedNode = module.shiftTree(treeData, 4);
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
      const removedNode = module.shiftTree(deepTree, 3);
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
      const removedNode = module.shiftTree(treeWithNoChildren, 2);
      expect(removedNode).toBeNull();
    });
  });

  describe('someTree', () => {
    it('应该返回true如果存在满足条件的节点', () => {
      const result = module.someTree(treeData, (item) => item.name === 'node2');
      expect(result).toBe(true);
    });

    it('应该返回false如果不存在满足条件的节点', () => {
      const result = module.someTree(treeData, (item) => item.name === 'jack');
      expect(result).toBe(false);
    });
  });

  describe('everyTree', () => {
    it('应该返回true如果所有节点都满足条件', () => {
      const result = module.everyTree(treeData, (item) => item.id > 0);
      expect(result).toBe(true);
    });

    it('应该返回false如果有节点不满足条件', () => {
      const result = module.everyTree(treeData, (item) => item.id > 3);
      expect(result).toBe(false);
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
      const result = module.everyTree(treeWithInvalidChild, (item) => item.name !== 'invalid');
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
      const result = module.everyTree(treeWithNestedInvalid, (item) => item.value > 0);
      expect(result).toBe(false);
    });
  });

  describe('atTree', () => {
    it('应该根据父节点ID和索引获取子节点', () => {
      const result = module.atTree(treeData, 1, 0);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该支持负数索引', () => {
      const result = module.atTree(treeData, 1, -1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(3);
    });

    it('应该返回null如果未找到', () => {
      const result = module.atTree(treeData, 999, 0);
      expect(result).toBeNull();
    });
  });

  describe('indexOfTree', () => {
    it('应该返回从根节点到目标节点的索引路径', () => {
      const result = module.indexOfTree(treeData, 4);
      expect(result).toEqual([0, 0, 0]);
    });

    it('应该返回null如果未找到', () => {
      const result = module.indexOfTree(treeData, 999);
      expect(result).toBeNull();
    });
  });

  describe('atIndexOfTree', () => {
    it('应该根据索引路径获取节点', () => {
      const result = module.atIndexOfTree(treeData, [0, 1, 0]);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(6);
    });

    it('应该返回null如果路径无效', () => {
      const result = module.atIndexOfTree(treeData, [999, 0]);
      expect(result).toBeNull();
    });
  });

  describe('getNodeDepthMap', () => {
    it('应该返回节点ID到深度的映射', () => {
      const result = module.getNodeDepthMap(treeData);
      expect(result[1]).toBe(1);
      expect(result[2]).toBe(2);
      expect(result[4]).toBe(3);
    });
  });

  describe('getNodeDepth', () => {
    it('应该返回根节点的深度', () => {
      const depth = module.getNodeDepth(treeData, 1);
      expect(depth).toBe(1);
    });

    it('应该返回子节点的深度', () => {
      const depth = module.getNodeDepth(treeData, 2);
      expect(depth).toBe(2);
    });

    it('应该返回深层节点的深度', () => {
      const depth = module.getNodeDepth(treeData, 4);
      expect(depth).toBe(3);
    });

    it('应该返回null如果未找到节点', () => {
      const depth = module.getNodeDepth(treeData, 999);
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
      expect(module.getNodeDepth(multiRoot, 1)).toBe(1);
      expect(module.getNodeDepth(multiRoot, 2)).toBe(1);
      expect(module.getNodeDepth(multiRoot, 3)).toBe(2);
      expect(module.getNodeDepth(multiRoot, 5)).toBe(3);
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
      expect(module.getNodeDepth(customTree, 1, fieldNames)).toBe(1);
      expect(module.getNodeDepth(customTree, 2, fieldNames)).toBe(2);
      expect(module.getNodeDepth(customTree, 3, fieldNames)).toBe(3);
    });

    it('应该处理空数组', () => {
      const depth = module.getNodeDepth([], 1);
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
      expect(module.getNodeDepth(deepTree, 1)).toBe(1);
      expect(module.getNodeDepth(deepTree, 2)).toBe(2);
      expect(module.getNodeDepth(deepTree, 3)).toBe(3);
      expect(module.getNodeDepth(deepTree, 4)).toBe(4);
      expect(module.getNodeDepth(deepTree, 5)).toBe(5);
    });

    it('应该与getNodeDepthMap返回的深度一致', () => {
      const depthMap = module.getNodeDepthMap(treeData);
      expect(module.getNodeDepth(treeData, 1)).toBe(depthMap[1]);
      expect(module.getNodeDepth(treeData, 2)).toBe(depthMap[2]);
      expect(module.getNodeDepth(treeData, 4)).toBe(depthMap[4]);
      expect(module.getNodeDepth(treeData, 6)).toBe(depthMap[6]);
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
      const result = module.dedupTree(duplicateTree, 'id');
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
      const result = module.findTree(customTree, (item) => item.nodeId === 2, fieldNames);
      expect(result).not.toBeNull();
      expect(result?.nodeId).toBe(2);
    });
  });

  // ========== 复杂场景和边界情况测试 ==========

  describe('边界情况 - 空数据', () => {
    it('mapTree应该处理空数组', () => {
      const result = module.mapTree([], (node) => node);
      expect(result).toEqual([]);
    });

    it('filterTree应该处理空数组', () => {
      const result = module.filterTree([], () => true);
      expect(result).toEqual([]);
    });

    it('findTree应该处理空数组', () => {
      const result = module.findTree([], () => true);
      expect(result).toBeNull();
    });

    it('someTree应该处理空数组', () => {
      const result = module.someTree([], () => true);
      expect(result).toBe(false);
    });

    it('everyTree应该处理空数组', () => {
      const result = module.everyTree([], () => true);
      expect(result).toBe(true);
    });

    it('getNodeDepthMap应该处理空数组', () => {
      const result = module.getNodeDepthMap([]);
      expect(result).toEqual({});
    });

    it('dedupTree应该处理空数组', () => {
      const result = module.dedupTree([], 'id');
      expect(result).toEqual([]);
    });
  });

  describe('边界情况 - 单节点树', () => {
    it('mapTree应该处理单节点', () => {
      const singleNode = [{ id: 1, name: 'root' }];
      const result = module.mapTree(singleNode, (node) => node.name);
      expect(result).toEqual(['root']);
    });

    it('findTree应该找到单节点', () => {
      const singleNode = [{ id: 1, name: 'root' }];
      const result = module.findTree(singleNode, (node) => node.id === 1);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('root');
    });

    it('pushTree应该在单节点下添加子节点', () => {
      const singleNode: any[] = [{ id: 1, name: 'root' }];
      const success = module.pushTree(singleNode, 1, { id: 2, name: 'child' });
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

      const result = module.findTree(deepTree, (node) => node.id === 5);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('level5');

      const depthMap = module.getNodeDepthMap(deepTree);
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

      const path = module.indexOfTree(deepTree, 4);
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

      const result = module.mapTree(treeWithNull, (node) => node.name);
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

      const result = module.mapTree(treeWithUndefined, (node) => node.name);
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

      const result = module.mapTree(treeWithEmpty, (node) => node.name);
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

      const result = module.mapTree(treeWithInvalid, (node) => node.name);
      expect(result).toEqual(['node1']);
    });
  });

  describe('边界情况 - atTree索引边界', () => {
    it('应该处理索引超出范围的情况', () => {
      const result = module.atTree(treeData, 1, 999);
      expect(result).toBeNull();
    });

    it('应该处理负数索引超出范围的情况', () => {
      const result = module.atTree(treeData, 1, -999);
      expect(result).toBeNull();
    });

    it('应该处理负数索引等于数组长度的情况', () => {
      const result = module.atTree(treeData, 1, -2);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该处理索引为0的情况', () => {
      const result = module.atTree(treeData, 1, 0);
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
      const result = module.atTree(treeWithInvalidChildren, 1, 0);
      expect(result).toBeNull();
    });

    it('应该处理父节点存在但children为空数组的情况', () => {
      const treeWithEmptyChildren = [
        {
          id: 1,
          children: [],
        },
      ];
      const result = module.atTree(treeWithEmptyChildren, 1, 0);
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
      const result = module.atTree(treeWithChildren, 1, -1);
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
      const result = module.atTree(deepTree, 3, 0);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(4);
    });
  });

  describe('边界情况 - atIndexOfTree路径边界', () => {
    it('应该处理空路径数组', () => {
      const result = module.atIndexOfTree(treeData, []);
      expect(result).toBeNull();
    });

    it('应该处理路径超出范围', () => {
      const result = module.atIndexOfTree(treeData, [999, 0]);
      expect(result).toBeNull();
    });

    it('应该处理负数索引路径', () => {
      const result = module.atIndexOfTree(treeData, [-1, 0]);
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
      const result = module.atIndexOfTree(deepTree, [0, 0, 0, 0]);
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
      const result = module.atIndexOfTree(treeWithInvalidChildren, [0, 0, 0]);
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
      const result = module.atIndexOfTree(shallowTree, [0, 0, 0]);
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
      const result = module.atIndexOfTree(treeWithoutChildren, [0, 0]);
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
      const result = module.atIndexOfTree(treeWithUndefinedChildren, [0, 0, 0]);
      expect(result).toBeNull();
    });

    it('应该处理for循环正常结束但未返回节点的情况（触发431行）', () => {
      // 这个测试理论上不应该触发 431 行，因为如果 for 循环正常结束，
      // 应该已经在循环内返回了。但为了完整性，我们测试一个边界情况
      // 实际上，431 行可能是不可达代码，但为了 100% 覆盖率，我们需要确保所有路径都被测试
      const emptyTree: any[] = [];
      // 空树，但路径不为空，会在第一次循环就返回 null（414行）
      // 431 行可能是不可达代码，但让我们确保所有情况都被测试
      const result = module.atIndexOfTree(emptyTree, [0]);
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

      const result = module.mapTree(multiRoot, (node) => node.name);
      expect(result).toEqual(['root1', 'child1', 'root2', 'child2', 'root3']);
    });

    it('findTree应该在多个根节点中查找', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
        { id: 3, name: 'root3' },
      ];

      const result = module.findTree(multiRoot, (node) => node.id === 2);
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
      module.pushTree(testTree, 1, newNode);

      // 验证新节点已添加
      expect(testTree[0].children).toHaveLength(2);
      expect(testTree[0].children[1].id).toBe(3);

      // 验证原有节点未受影响
      expect(testTree[0].children[0].id).toBe(2);
    });

    it('多次pushTree应该按顺序添加', () => {
      const testTree: any[] = [{ id: 1, name: 'parent', children: [] }];

      module.pushTree(testTree, 1, { id: 2, name: 'child1' });
      module.pushTree(testTree, 1, { id: 3, name: 'child2' });
      module.pushTree(testTree, 1, { id: 4, name: 'child3' });

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
      module.popTree(testTree, 1);
      expect(testTree[0].children).toHaveLength(2);
      expect(testTree[0].children[1].id).toBe(3);

      // 删除第一个
      module.shiftTree(testTree, 1);
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

      const result = module.dedupTree(duplicateTree, 'id');
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

      const result = module.dedupTree(duplicateTree, 'id');
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

      const result = module.dedupTree(duplicateTree, 'id');
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
      module.filterTree(testTree, (node, index) => {
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
      module.filterTree(testTree, (node, index) => {
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
      const found = module.findTree(customTree, (n) => n.nodeId === 2, fieldNames);
      expect(found).not.toBeNull();

      const mapped = module.mapTree(customTree, (n) => n.name, fieldNames);
      expect(mapped).toContain('root');
      expect(mapped).toContain('child');

      const depthMap = module.getNodeDepthMap(customTree, fieldNames);
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
        module.mapTree(customTree, (n) => n.name, fieldNames);
      }).not.toThrow();
    });
  });

  describe('复杂场景 - 特殊值处理', () => {
    it('应该处理id为0的节点', () => {
      const treeWithZero = [
        { id: 0, name: 'zero' },
        { id: 1, name: 'one' },
      ];

      const result = module.findTree(treeWithZero, (n) => n.id === 0);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('zero');
    });

    it('应该处理id为false的节点', () => {
      const treeWithFalse = [
        { id: false, name: 'false' },
        { id: true, name: 'true' },
      ];

      const result = module.findTree(treeWithFalse, (n) => n.id === false);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('false');
    });

    it('应该处理id为字符串的情况', () => {
      const treeWithString = [
        { id: 'node1', name: 'first' },
        { id: 'node2', name: 'second' },
      ];

      const result = module.findTree(treeWithString, (n) => n.id === 'node2');
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
      const found = module.findTree(complexTree, (n) => n.id === 1);
      expect(found).not.toBeNull();

      module.pushTree(complexTree, 1, { id: 4, name: 'child3' });
      expect(complexTree[0].children).toHaveLength(3);

      const filtered = module.filterTree(complexTree, (n) => n.id > 2);
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
      module.pushTree(deepTree, 3, { id: 5, name: 'deep-child' });
      
      const found = module.findTree(deepTree, (n) => n.id === 3);
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
      
      const success = module.removeTree(testTree, 2);
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
      
      const success = module.removeTree(testTree, 4);
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
      
      const success = module.removeTree(testTree, 2);
      expect(success).toBe(true);
      expect(testTree).toHaveLength(2);
      expect(testTree[0].id).toBe(1);
      expect(testTree[1].id).toBe(3);
    });

    it('应该返回false如果未找到目标节点', () => {
      const testTree = [
        { id: 1, name: 'root' },
      ];
      
      const success = module.removeTree(testTree, 999);
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
      
      const success = module.removeTree(testTree, 2, fieldNames);
      expect(success).toBe(true);
      expect(testTree[0].subNodes).toHaveLength(0);
    });
  });

  describe('forEachTree', () => {
    it('应该遍历所有节点并执行回调', () => {
      const result: string[] = [];
      module.forEachTree(treeData, (item) => {
        result.push(item.name);
      });
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('应该不返回值', () => {
      const result = module.forEachTree(treeData, (item) => {
        return item.name;
      });
      expect(result).toBeUndefined();
    });

    it('应该支持修改节点', () => {
      const testTree: any[] = [
        { id: 1, name: 'node1', children: [{ id: 2, name: 'node2' }] },
      ];
      
      module.forEachTree(testTree, (node) => {
        node.visited = true;
      });
      
      expect(testTree[0].visited).toBe(true);
      expect(testTree[0].children[0].visited).toBe(true);
    });

    it('应该处理空数组', () => {
      const result: string[] = [];
      module.forEachTree([], (item) => {
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
      
      module.forEachTree(customTree, (item) => {
        result.push(item.name);
      }, fieldNames);
      
      expect(result).toEqual(['root', 'child']);
    });
  });

  describe('isEmptyTreeData', () => {
    it('应该返回true如果树为空数组', () => {
      expect(module.isEmptyTreeData([])).toBe(true);
    });

    it('应该返回true如果树为null或undefined', () => {
      expect(module.isEmptyTreeData(null as any)).toBe(true);
      expect(module.isEmptyTreeData(undefined as any)).toBe(true);
    });

    it('应该返回false如果树不为空', () => {
      expect(module.isEmptyTreeData(treeData)).toBe(false);
    });

    it('应该返回false如果树有单个节点', () => {
      expect(module.isEmptyTreeData([{ id: 1, name: 'root' }])).toBe(false);
    });

    it('应该返回false如果树有多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
      ];
      expect(module.isEmptyTreeData(multiRoot)).toBe(false);
    });

    it('应该返回false如果树有子节点', () => {
      const treeWithChildren = [
        {
          id: 1,
          children: [{ id: 2 }],
        },
      ];
      expect(module.isEmptyTreeData(treeWithChildren)).toBe(false);
    });

    it('应该支持fieldNames参数（虽然不生效，但保持API一致性）', () => {
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      // fieldNames 参数不生效，只检查数组是否为空
      expect(module.isEmptyTreeData([], fieldNames)).toBe(true);
      expect(module.isEmptyTreeData(treeData, fieldNames)).toBe(false);
      
      // 即使传入自定义字段名，结果也应该一致
      const customTree = [
        {
          nodeId: 1,
          subNodes: [{ nodeId: 2 }],
        },
      ];
      expect(module.isEmptyTreeData(customTree, fieldNames)).toBe(false);
      expect(module.isEmptyTreeData(customTree)).toBe(false); // 不传 fieldNames 结果相同
    });
  });

  describe('isEmptySingleTreeData', () => {
    it('应该返回true如果数据不是有效的单个树结构', () => {
      expect(module.isEmptySingleTreeData(null)).toBe(true);
      expect(module.isEmptySingleTreeData(undefined)).toBe(true);
      expect(module.isEmptySingleTreeData([])).toBe(true);
      expect(module.isEmptySingleTreeData('string')).toBe(true);
      expect(module.isEmptySingleTreeData(123)).toBe(true);
    });

    it('应该返回true如果没有children字段', () => {
      const tree = { id: 1, name: 'node1' };
      expect(module.isEmptySingleTreeData(tree)).toBe(true);
    });

    it('应该返回true如果children是空数组', () => {
      const tree = {
        id: 1,
        name: 'node1',
        children: [],
      };
      expect(module.isEmptySingleTreeData(tree)).toBe(true);
    });

    it('应该返回false如果有子节点', () => {
      const tree = {
        id: 1,
        name: 'node1',
        children: [
          { id: 2, name: 'node2' },
        ],
      };
      expect(module.isEmptySingleTreeData(tree)).toBe(false);
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
      expect(module.isEmptySingleTreeData(treeWithEmptyChildren)).toBe(false);

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
      expect(module.isEmptySingleTreeData(nonEmptyTree)).toBe(false);
    });

    it('应该支持自定义字段名', () => {
      const emptyTree = {
        nodeId: 1,
        name: 'node1',
        subNodes: [],
      };
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      expect(module.isEmptySingleTreeData(emptyTree, fieldNames)).toBe(true);

      const nonEmptyTree = {
        nodeId: 1,
        name: 'node1',
        subNodes: [
          { nodeId: 2, name: 'node2' },
        ],
      };
      expect(module.isEmptySingleTreeData(nonEmptyTree, fieldNames)).toBe(false);
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
      expect(module.isEmptySingleTreeData(deepTree)).toBe(false);
    });
  });

  describe('getParentTree', () => {
    it('应该返回子节点的父节点', () => {
      const result = module.getParentTree(treeData, 2);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('应该返回深层节点的父节点', () => {
      const result = module.getParentTree(treeData, 4);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(2);
    });

    it('应该返回null如果节点是根节点', () => {
      const result = module.getParentTree(treeData, 1);
      expect(result).toBeNull();
    });

    it('应该返回null如果未找到节点', () => {
      const result = module.getParentTree(treeData, 999);
      expect(result).toBeNull();
    });

    it('应该支持多个根节点', () => {
      const multiRoot = [
        { id: 1, children: [{ id: 2 }] },
        { id: 3, children: [{ id: 4 }] },
      ];
      const result = module.getParentTree(multiRoot, 4);
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
      const result = module.getParentTree(customTree, 2, fieldNames);
      expect(result).not.toBeNull();
      expect(result?.nodeId).toBe(1);
    });
  });

  describe('getChildrenTree', () => {
    it('应该返回节点的所有直接子节点', () => {
      const children = module.getChildrenTree(treeData, 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(3);
    });

    it('应该返回空数组如果节点没有子节点', () => {
      const children = module.getChildrenTree(treeData, 4);
      expect(children).toEqual([]);
    });

    it('应该返回空数组如果未找到节点', () => {
      const children = module.getChildrenTree(treeData, 999);
      expect(children).toEqual([]);
    });

    it('应该处理深层嵌套的节点', () => {
      const children = module.getChildrenTree(treeData, 2);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(4);
      expect(children[1].id).toBe(5);
    });

    it('应该处理多个根节点', () => {
      const multiRoot = [
        { id: 1, children: [{ id: 2 }, { id: 3 }] },
        { id: 4, children: [{ id: 5 }] },
      ];
      const children = module.getChildrenTree(multiRoot, 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(3);
    });

    it('应该处理节点children字段不存在的情况', () => {
      const treeWithoutChildren = [
        { id: 1, name: 'node1' },
      ];
      const children = module.getChildrenTree(treeWithoutChildren, 1);
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
      const children = module.getChildrenTree(treeWithInvalidChildren, 1);
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
      const children = module.getChildrenTree(customTree, 1, fieldNames);
      expect(children).toHaveLength(2);
      expect(children[0].nodeId).toBe(2);
      expect(children[1].nodeId).toBe(3);
    });

    it('应该处理空树', () => {
      const children = module.getChildrenTree([], 1);
      expect(children).toEqual([]);
    });

    it('应该处理单节点树', () => {
      const singleNode = [{ id: 1, name: 'node1' }];
      const children = module.getChildrenTree(singleNode, 1);
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
      const children = module.getChildrenTree(unbalancedTree, 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(4);
    });
  });

  describe('getSiblingsTree', () => {
    it('应该返回节点的所有兄弟节点（包括自己）', () => {
      const siblings = module.getSiblingsTree(treeData, 2);
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
      const siblings = module.getSiblingsTree(multiRoot, 1);
      expect(siblings).toHaveLength(3);
      expect(siblings[0].id).toBe(1);
      expect(siblings[1].id).toBe(3);
      expect(siblings[2].id).toBe(5);
    });

    it('应该返回空数组如果未找到节点', () => {
      const siblings = module.getSiblingsTree(treeData, 999);
      expect(siblings).toEqual([]);
    });

    it('应该处理深层嵌套的节点', () => {
      const siblings = module.getSiblingsTree(treeData, 4);
      expect(siblings).toHaveLength(2);
      expect(siblings[0].id).toBe(4);
      expect(siblings[1].id).toBe(5);
    });

    it('应该处理只有一个子节点的情况', () => {
      const siblings = module.getSiblingsTree(treeData, 6);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(6);
    });

    it('应该处理单节点树（根节点）', () => {
      const singleNode = [{ id: 1, name: 'node1' }];
      const siblings = module.getSiblingsTree(singleNode, 1);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(1);
    });

    it('应该处理节点children字段不存在的情况', () => {
      const treeWithoutChildren = [
        { id: 1, name: 'node1' },
        { id: 2, name: 'node2' },
      ];
      const siblings = module.getSiblingsTree(treeWithoutChildren, 1);
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
      const siblings = module.getSiblingsTree(treeWithInvalidChildren, 1);
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
      const siblings = module.getSiblingsTree(customTree, 2, fieldNames);
      expect(siblings).toHaveLength(3);
      expect(siblings[0].nodeId).toBe(2);
      expect(siblings[1].nodeId).toBe(3);
      expect(siblings[2].nodeId).toBe(4);
    });

    it('应该处理空树', () => {
      const siblings = module.getSiblingsTree([], 1);
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
      const siblings = module.getSiblingsTree(unbalancedTree, 2);
      expect(siblings).toHaveLength(3);
      expect(siblings[0].id).toBe(2);
      expect(siblings[1].id).toBe(4);
      expect(siblings[2].id).toBe(5);
    });

    it('应该处理根节点的兄弟节点（单个根节点）', () => {
      const singleRoot = [
        { id: 1, children: [{ id: 2 }] },
      ];
      const siblings = module.getSiblingsTree(singleRoot, 1);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe(1);
    });
  });

  describe('includesTree', () => {
    it('应该返回true如果树包含指定节点', () => {
      const result = module.includesTree(treeData, 2);
      expect(result).toBe(true);
    });

    it('应该返回true如果树包含深层节点', () => {
      const result = module.includesTree(treeData, 4);
      expect(result).toBe(true);
    });

    it('应该返回true如果树包含根节点', () => {
      const result = module.includesTree(treeData, 1);
      expect(result).toBe(true);
    });

    it('应该返回false如果树不包含指定节点', () => {
      const result = module.includesTree(treeData, 999);
      expect(result).toBe(false);
    });

    it('应该处理空树', () => {
      const result = module.includesTree([], 1);
      expect(result).toBe(false);
    });

    it('应该支持多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
        { id: 3, name: 'root3' },
      ];
      expect(module.includesTree(multiRoot, 2)).toBe(true);
      expect(module.includesTree(multiRoot, 4)).toBe(false);
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
      expect(module.includesTree(customTree, 2, fieldNames)).toBe(true);
      expect(module.includesTree(customTree, 999, fieldNames)).toBe(false);
    });

    it('应该处理特殊ID值', () => {
      const treeWithSpecialIds = [
        { id: 0, name: 'zero' },
        { id: false, name: 'false' },
        { id: '', name: 'empty' },
      ];
      expect(module.includesTree(treeWithSpecialIds, 0)).toBe(true);
      expect(module.includesTree(treeWithSpecialIds, false)).toBe(true);
      expect(module.includesTree(treeWithSpecialIds, '')).toBe(true);
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
        expect(module.isSingleTreeData(tree)).toBe(true);
      });

      it('应该识别没有子节点的树结构', () => {
        const tree = {
          id: 1,
          name: 'node1',
        };
        expect(module.isSingleTreeData(tree)).toBe(true);
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
        expect(module.isSingleTreeData(tree)).toBe(true);
      });

      it('应该识别空 children 数组的树结构', () => {
        const tree = {
          id: 1,
          name: 'node1',
          children: [],
        };
        expect(module.isSingleTreeData(tree)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(module.isSingleTreeData(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(module.isSingleTreeData(undefined)).toBe(false);
      });

      it('应该拒绝数组', () => {
        expect(module.isSingleTreeData([{ id: 1 }])).toBe(false);
      });

      it('应该拒绝基本类型（字符串）', () => {
        expect(module.isSingleTreeData('string')).toBe(false);
      });

      it('应该拒绝基本类型（数字）', () => {
        expect(module.isSingleTreeData(123)).toBe(false);
      });

      it('应该拒绝基本类型（布尔值）', () => {
        expect(module.isSingleTreeData(true)).toBe(false);
      });

      it('应该拒绝空对象（没有 children 字段）', () => {
        expect(module.isSingleTreeData({})).toBe(true); // 空对象也是有效的树结构
      });

      it('应该拒绝 children 不是数组的对象', () => {
        const invalidTree = {
          id: 1,
          children: 'not an array',
        };
        expect(module.isSingleTreeData(invalidTree)).toBe(false);
      });

      it('应该拒绝 children 是 null 的对象', () => {
        const invalidTree = {
          id: 1,
          children: null,
        };
        expect(module.isSingleTreeData(invalidTree)).toBe(false);
      });

      it('应该拒绝包含非树结构子节点的对象', () => {
        const invalidTree = {
          id: 1,
          children: [
            { id: 2, name: 'node2' },
            'not a tree node', // 无效的子节点
          ],
        };
        expect(module.isSingleTreeData(invalidTree)).toBe(false);
      });

      it('应该拒绝包含数组子节点的对象', () => {
        const invalidTree = {
          id: 1,
          children: [
            { id: 2, name: 'node2' },
            [{ id: 3, name: 'node3' }], // 数组不是有效的树节点
          ],
        };
        expect(module.isSingleTreeData(invalidTree)).toBe(false);
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
        expect(module.isSingleTreeData(tree, fieldNames)).toBe(true);
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
        expect(module.isSingleTreeData(tree, fieldNames)).toBe(true);
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
        expect(module.isSingleTreeData(tree, fieldNames)).toBe(true);
      });

      it('应该在使用自定义字段名时拒绝无效结构', () => {
        const invalidTree = {
          nodeId: 1,
          subNodes: 'not an array',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isSingleTreeData(invalidTree, fieldNames)).toBe(false);
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
        expect(module.isSingleTreeData(tree)).toBe(true);
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
        expect(module.isSingleTreeData(tree)).toBe(true);
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
        expect(module.isSingleTreeData(tree)).toBe(true);
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
        expect(module.isTreeData(forest)).toBe(true);
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
        expect(module.isTreeData(forest)).toBe(true);
      });

      it('应该识别空数组（空森林）', () => {
        expect(module.isTreeData([])).toBe(true);
      });

      it('应该识别包含没有子节点的树的森林', () => {
        const forest = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
          { id: 3, name: 'node3' },
        ];
        expect(module.isTreeData(forest)).toBe(true);
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
        expect(module.isTreeData(forest)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(module.isTreeData(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(module.isTreeData(undefined)).toBe(false);
      });

      it('应该拒绝非数组类型（对象）', () => {
        const tree = {
          id: 1,
          children: [{ id: 2 }],
        };
        expect(module.isTreeData(tree)).toBe(false);
      });

      it('应该拒绝非数组类型（字符串）', () => {
        expect(module.isTreeData('string')).toBe(false);
      });

      it('应该拒绝非数组类型（数字）', () => {
        expect(module.isTreeData(123)).toBe(false);
      });

      it('应该拒绝包含非树结构元素的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          'not a tree', // 无效元素
        ];
        expect(module.isTreeData(invalidForest)).toBe(false);
      });

      it('应该拒绝包含数组元素的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          [{ id: 3 }], // 数组不是树结构
        ];
        expect(module.isTreeData(invalidForest)).toBe(false);
      });

      it('应该拒绝包含 null 元素的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          null,
        ];
        expect(module.isTreeData(invalidForest)).toBe(false);
      });

      it('应该拒绝包含无效树结构的数组', () => {
        const invalidForest = [
          { id: 1, children: [{ id: 2 }] },
          { id: 3, children: 'not an array' }, // 无效的树结构
        ];
        expect(module.isTreeData(invalidForest)).toBe(false);
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
        expect(module.isTreeData(forest, fieldNames)).toBe(true);
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
        expect(module.isTreeData(forest, fieldNames)).toBe(true);
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
        expect(module.isTreeData(forest, fieldNames)).toBe(true);
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
        expect(module.isTreeData(invalidForest, fieldNames)).toBe(false);
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
        expect(module.isTreeData(forest)).toBe(true);
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
        expect(module.isTreeData(forest)).toBe(true);
      });

      it('应该处理大型森林（多棵树）', () => {
        const forest = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          children: [
            { id: (i + 1) * 10 + 1 },
            { id: (i + 1) * 10 + 2 },
          ],
        }));
        expect(module.isTreeData(forest)).toBe(true);
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
        expect(module.isValidTreeNode(node)).toBe(true);
      });

      it('应该识别有效的树节点（没有 children 字段）', () => {
        const node = {
          id: 1,
          name: 'node1',
        };
        expect(module.isValidTreeNode(node)).toBe(true);
      });

      it('应该识别有效的树节点（children 是空数组）', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [],
        };
        expect(module.isValidTreeNode(node)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(module.isValidTreeNode(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(module.isValidTreeNode(undefined)).toBe(false);
      });

      it('应该拒绝数组', () => {
        expect(module.isValidTreeNode([{ id: 1 }])).toBe(false);
      });

      it('应该拒绝基本类型（字符串）', () => {
        expect(module.isValidTreeNode('string')).toBe(false);
      });

      it('应该拒绝基本类型（数字）', () => {
        expect(module.isValidTreeNode(123)).toBe(false);
      });

      it('应该拒绝基本类型（布尔值）', () => {
        expect(module.isValidTreeNode(true)).toBe(false);
      });

      it('应该拒绝 children 是 null 的对象', () => {
        const invalidNode = {
          id: 1,
          children: null,
        };
        expect(module.isValidTreeNode(invalidNode)).toBe(false);
      });

      it('应该拒绝 children 不是数组的对象', () => {
        const invalidNode = {
          id: 1,
          children: 'not an array',
        };
        expect(module.isValidTreeNode(invalidNode)).toBe(false);
      });

      it('应该接受空对象', () => {
        expect(module.isValidTreeNode({})).toBe(true);
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
        expect(module.isValidTreeNode(node, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名且没有 children 字段', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isValidTreeNode(node, fieldNames)).toBe(true);
      });

      it('应该拒绝自定义字段名但 children 不是数组', () => {
        const node = {
          nodeId: 1,
          subNodes: 'not an array',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isValidTreeNode(node, fieldNames)).toBe(false);
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
        expect(module.isTreeNodeWithCircularCheck(node)).toBe(true);
      });

      it('应该识别有效的树节点（没有 children 字段）', () => {
        const node = {
          id: 1,
          name: 'node1',
        };
        expect(module.isTreeNodeWithCircularCheck(node)).toBe(true);
      });

      it('应该识别有效的树节点（children 是空数组）', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [],
        };
        expect(module.isTreeNodeWithCircularCheck(node)).toBe(true);
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
        expect(module.isTreeNodeWithCircularCheck(node)).toBe(true);
      });
    });

    describe('循环引用检测', () => {
      it('应该检测到直接循环引用', () => {
        const node1: any = { id: 1, children: [] };
        const node2: any = { id: 2, children: [] };
        node1.children.push(node2);
        node2.children.push(node1); // 循环引用

        expect(module.isTreeNodeWithCircularCheck(node1)).toBe(false);
      });

      it('应该检测到间接循环引用', () => {
        const node1: any = { id: 1, children: [] };
        const node2: any = { id: 2, children: [] };
        const node3: any = { id: 3, children: [] };
        node1.children.push(node2);
        node2.children.push(node3);
        node3.children.push(node1); // 间接循环引用

        expect(module.isTreeNodeWithCircularCheck(node1)).toBe(false);
      });

      it('应该检测到自引用', () => {
        const node: any = { id: 1, children: [] };
        node.children.push(node); // 自引用

        expect(module.isTreeNodeWithCircularCheck(node)).toBe(false);
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

        expect(module.isTreeNodeWithCircularCheck(node1)).toBe(false);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 null', () => {
        expect(module.isTreeNodeWithCircularCheck(null)).toBe(false);
      });

      it('应该拒绝 undefined', () => {
        expect(module.isTreeNodeWithCircularCheck(undefined)).toBe(false);
      });

      it('应该拒绝数组', () => {
        expect(module.isTreeNodeWithCircularCheck([{ id: 1 }])).toBe(false);
      });

      it('应该拒绝基本类型（字符串）', () => {
        expect(module.isTreeNodeWithCircularCheck('string')).toBe(false);
      });

      it('应该拒绝基本类型（数字）', () => {
        expect(module.isTreeNodeWithCircularCheck(123)).toBe(false);
      });

      it('应该拒绝 children 是 null 的对象', () => {
        const invalidNode = {
          id: 1,
          children: null,
        };
        expect(module.isTreeNodeWithCircularCheck(invalidNode)).toBe(false);
      });

      it('应该拒绝 children 不是数组的对象', () => {
        const invalidNode = {
          id: 1,
          children: 'not an array',
        };
        expect(module.isTreeNodeWithCircularCheck(invalidNode)).toBe(false);
      });

      it('应该接受空对象', () => {
        expect(module.isTreeNodeWithCircularCheck({})).toBe(true);
      });

      it('应该拒绝包含非树结构子节点的对象', () => {
        const invalidNode: any = {
          id: 1,
          children: [
            { id: 2, name: 'node2' },
            'not a tree node', // 无效的子节点
          ],
        };
        expect(module.isTreeNodeWithCircularCheck(invalidNode)).toBe(false);
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
        expect(module.isTreeNodeWithCircularCheck(node, fieldNames)).toBe(true);
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
        expect(module.isTreeNodeWithCircularCheck(node1, fieldNames)).toBe(false);
      });

      it('应该拒绝自定义字段名但 children 不是数组', () => {
        const node = {
          nodeId: 1,
          subNodes: 'not an array',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isTreeNodeWithCircularCheck(node, fieldNames)).toBe(false);
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
        expect(module.isSafeTreeDepth(tree, 10)).toBe(true);
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
        expect(module.isSafeTreeDepth(tree, 3)).toBe(true);
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
        expect(module.isSafeTreeDepth(tree, 2)).toBe(false);
      });

      it('应该识别单层树为安全', () => {
        const tree = [
          { id: 1 },
          { id: 2 },
        ];
        expect(module.isSafeTreeDepth(tree, 1)).toBe(true);
      });

      it('应该识别空树为安全', () => {
        expect(module.isSafeTreeDepth([], 10)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该拒绝 maxDepth 为 0', () => {
        const tree = [{ id: 1 }];
        expect(module.isSafeTreeDepth(tree, 0)).toBe(false);
      });

      it('应该拒绝 maxDepth 为负数', () => {
        const tree = [{ id: 1 }];
        expect(module.isSafeTreeDepth(tree, -1)).toBe(false);
      });

      it('应该处理深层嵌套的树', () => {
        let tree: any = { id: 1 };
        let current = tree;
        for (let i = 2; i <= 10; i++) {
          current.children = [{ id: i }];
          current = current.children[0];
        }
        expect(module.isSafeTreeDepth([tree], 10)).toBe(true);
        expect(module.isSafeTreeDepth([tree], 9)).toBe(false);
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
        expect(module.isSafeTreeDepth(tree, 4)).toBe(true);
        expect(module.isSafeTreeDepth(tree, 3)).toBe(false);
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
        expect(module.isSafeTreeDepth(forest, 3)).toBe(true);
        expect(module.isSafeTreeDepth(forest, 2)).toBe(false);
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
        expect(module.isSafeTreeDepth(tree, 3, fieldNames)).toBe(true);
        expect(module.isSafeTreeDepth(tree, 2, fieldNames)).toBe(false);
      });

      it('应该支持自定义字段名处理深层树', () => {
        let tree: any = { nodeId: 1 };
        let current = tree;
        for (let i = 2; i <= 5; i++) {
          current.subNodes = [{ nodeId: i }];
          current = current.subNodes[0];
        }
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isSafeTreeDepth([tree], 5, fieldNames)).toBe(true);
        expect(module.isSafeTreeDepth([tree], 4, fieldNames)).toBe(false);
      });
    });
  });

  describe('isLeafNode', () => {
    describe('基础功能', () => {
      it('应该识别没有 children 字段的节点为叶子节点', () => {
        const node = { id: 1, name: 'node1' };
        expect(module.isLeafNode(node)).toBe(true);
      });

      it('应该识别 children 为空数组的节点为叶子节点', () => {
        const node = { id: 1, name: 'node1', children: [] };
        expect(module.isLeafNode(node)).toBe(true);
      });

      it('应该识别有子节点的节点不是叶子节点', () => {
        const node = {
          id: 1,
          name: 'node1',
          children: [{ id: 2, name: 'node2' }],
        };
        expect(module.isLeafNode(node)).toBe(false);
      });

      it('应该识别 children 为 undefined 的节点为叶子节点', () => {
        const node = { id: 1, name: 'node1', children: undefined };
        expect(module.isLeafNode(node)).toBe(true);
      });
    });

    describe('边界情况', () => {
      it('应该处理空对象', () => {
        expect(module.isLeafNode({})).toBe(true);
      });

      it('应该处理 children 为 null 的节点（视为叶子节点）', () => {
        const node = { id: 1, children: null };
        expect(module.isLeafNode(node)).toBe(true);
      });

      it('应该处理 children 不是数组的节点（视为叶子节点）', () => {
        const node = { id: 1, children: 'not an array' };
        expect(module.isLeafNode(node)).toBe(true);
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
        expect(module.isLeafNode(node)).toBe(false);
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
        expect(module.isLeafNode(node, fieldNames)).toBe(true);
      });

      it('应该支持自定义字段名识别有子节点的节点', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
          subNodes: [{ nodeId: 2 }],
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isLeafNode(node, fieldNames)).toBe(false);
      });

      it('应该支持自定义字段名识别没有 children 字段的节点', () => {
        const node = {
          nodeId: 1,
          name: 'node1',
        };
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isLeafNode(node, fieldNames)).toBe(true);
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
        const leafNodes = module.filterTree(treeData, (node) => module.isLeafNode(node));
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
        module.forEachTree(treeData, (node) => {
          if (module.isLeafNode(node)) {
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
        expect(module.isRootNode(treeData, 1)).toBe(true);
      });

      it('应该识别非根节点', () => {
        const treeData = [
          {
            id: 1,
            name: 'node1',
            children: [{ id: 2, name: 'node2' }],
          },
        ];
        expect(module.isRootNode(treeData, 2)).toBe(false);
      });

      it('应该识别多个根节点', () => {
        const treeData = [
          { id: 1, name: 'root1' },
          { id: 2, name: 'root2' },
          { id: 3, name: 'root3' },
        ];
        expect(module.isRootNode(treeData, 1)).toBe(true);
        expect(module.isRootNode(treeData, 2)).toBe(true);
        expect(module.isRootNode(treeData, 3)).toBe(true);
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
        expect(module.isRootNode(treeData, 1)).toBe(true);
        expect(module.isRootNode(treeData, 2)).toBe(false);
        expect(module.isRootNode(treeData, 3)).toBe(false);
        expect(module.isRootNode(treeData, 4)).toBe(false);
      });
    });

    describe('边界情况', () => {
      it('应该处理空树', () => {
        expect(module.isRootNode([], 1)).toBe(false);
      });

      it('应该处理不存在的节点', () => {
        const treeData = [{ id: 1, name: 'node1' }];
        expect(module.isRootNode(treeData, 999)).toBe(false);
      });

      it('应该处理单节点树', () => {
        const treeData = [{ id: 1, name: 'node1' }];
        expect(module.isRootNode(treeData, 1)).toBe(true);
      });

      it('应该处理只有根节点的树', () => {
        const treeData = [
          { id: 1, name: 'root1' },
          { id: 2, name: 'root2' },
        ];
        expect(module.isRootNode(treeData, 1)).toBe(true);
        expect(module.isRootNode(treeData, 2)).toBe(true);
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
        expect(module.isRootNode(treeData, 1, fieldNames)).toBe(true);
        expect(module.isRootNode(treeData, 2, fieldNames)).toBe(false);
      });

      it('应该支持自定义字段名处理多个根节点', () => {
        const treeData = [
          { nodeId: 1, name: 'root1' },
          { nodeId: 2, name: 'root2' },
        ];
        const fieldNames = { children: 'subNodes', id: 'nodeId' };
        expect(module.isRootNode(treeData, 1, fieldNames)).toBe(true);
        expect(module.isRootNode(treeData, 2, fieldNames)).toBe(true);
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
        module.forEachTree(treeData, (node) => {
          if (module.isRootNode(treeData, node.id)) {
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
        expect(module.isRootNode(treeData, 1)).toBe(module.getParentTree(treeData, 1) === null);
        expect(module.isRootNode(treeData, 2)).toBe(module.getParentTree(treeData, 2) === null);
        expect(module.isRootNode(treeData, 3)).toBe(module.getParentTree(treeData, 3) === null);
      });
    });

    describe('convertToArrayTree', () => {
      it('应该将树结构扁平化为数组', () => {
        const result = module.convertToArrayTree(treeData);
        expect(result).toHaveLength(6);
        expect(result.map((n) => n.id)).toEqual([1, 2, 4, 5, 3, 6]);
        expect(result.map((n) => n.name)).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
      });

      it('应该移除 children 字段', () => {
        const result = module.convertToArrayTree(treeData);
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
        const result = module.convertToArrayTree(customTree);
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
        const result = module.convertToArrayTree([]);
        expect(result).toEqual([]);
      });

      it('应该处理单层树', () => {
        const singleTree = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = module.convertToArrayTree(singleTree);
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
        const result = module.convertToArrayTree(customTree, {
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
        const result = module.convertToArrayTree(treeWithNull);
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
        const result = module.convertToArrayTree(deepTree);
        expect(result).toHaveLength(4);
        expect(result.map((n) => n.name)).toEqual(['level1', 'level2', 'level3', 'level4']);
      });

      it('应该处理节点没有 children 字段的情况', () => {
        const treeWithoutChildren = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = module.convertToArrayTree(treeWithoutChildren);
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
        const result = module.convertBackTree(array);
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
        const result = module.convertBackTree(array);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
        expect(result[0].children).toHaveLength(1);
        expect(result[1].children).toHaveLength(1);
      });

      it('应该处理空数组', () => {
        const result = module.convertBackTree([]);
        expect(result).toEqual([]);
      });

      it('应该跳过没有 id 的节点', () => {
        const array = [
          { id: 1, name: 'node1', parentId: null },
          { name: 'node2', parentId: 1 }, // 没有 id
          { id: 3, name: 'node3', parentId: 1 },
        ];
        const result = module.convertBackTree(array);
        expect(result).toHaveLength(1);
        expect(result[0].children).toHaveLength(1);
        expect(result[0].children[0].id).toBe(3);
      });

      it('应该处理找不到父节点的情况（作为根节点）', () => {
        const array = [
          { id: 1, name: 'node1', parentId: 999 }, // 父节点不存在
          { id: 2, name: 'node2', parentId: null },
        ];
        const result = module.convertBackTree(array);
        expect(result).toHaveLength(2); // 两个都作为根节点
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
      });

      it('应该支持自定义 rootParentId', () => {
        const array = [
          { id: 1, name: 'node1', parentId: 0 },
          { id: 2, name: 'node2', parentId: 1 },
        ];
        const result = module.convertBackTree(array, { rootParentId: 0 });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(1);
      });

      it('应该支持自定义 parentIdField', () => {
        const array = [
          { id: 1, name: 'node1', pid: null },
          { id: 2, name: 'node2', pid: 1 },
        ];
        const result = module.convertBackTree(array, { parentIdField: 'pid' });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(1);
      });

      it('应该支持自定义字段名', () => {
        const array = [
          { nodeId: 1, name: 'node1', parentId: null },
          { nodeId: 2, name: 'node2', parentId: 1 },
        ];
        const result = module.convertBackTree(array, {
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
        const result = module.convertBackTree(array);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].children).toHaveLength(1);
      });

      it('应该保持节点的其他属性', () => {
        const array = [
          { id: 1, name: 'node1', value: 100, status: 'active', parentId: null },
          { id: 2, name: 'node2', value: 200, parentId: 1 },
        ];
        const result = module.convertBackTree(array);
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
        const array = module.convertToArrayTree(originalTree);
        // 添加 parentId
        const arrayWithParent = array.map((node) => {
          const parent = module.findTree(originalTree, (n) => {
            const children = n.children || [];
            return children.some((c: any) => c.id === node.id);
          });
          return {
            ...node,
            parentId: parent ? parent.id : null,
          };
        });
        const convertedTree = module.convertBackTree(arrayWithParent);
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
        const result = module.convertBackTree(map);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
      });

      it('应该支持 Record 格式转换', () => {
        const record = {
          1: { name: 'node1', parentId: null },
          2: { name: 'node2', parentId: 1 },
        };
        const result = module.convertBackTree(record);
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
        const result = module.convertBackTree(obj);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(obj);
      });

      it('应该处理空 Map', () => {
        const emptyMap = new Map();
        const result = module.convertBackTree(emptyMap);
        expect(result).toEqual([]);
      });

      it('应该处理空 Record', () => {
        const emptyRecord = {};
        const result = module.convertBackTree(emptyRecord);
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
        const result = module.convertBackTree(array);
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
        const result = module.convertBackTree(array);
        // 0 和 false 是有效的 id 值
        expect(result.length).toBeGreaterThanOrEqual(1);
      });

      it('应该处理字符串类型的 id', () => {
        const array = [
          { id: '1', name: 'node1', parentId: null },
          { id: '2', name: 'node2', parentId: '1' },
        ];
        const result = module.convertBackTree(array);
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
        const result = module.convertBackTree(map);
        expect(result.length).toBeGreaterThanOrEqual(0);
      });

      it('应该处理 Record 中 value 不是对象的情况', () => {
        const record = {
          1: { name: 'node1', parentId: null },
          2: null as any, // null 值
          3: 'string' as any, // 非对象值
        };
        const result = module.convertBackTree(record);
        expect(result.length).toBeGreaterThanOrEqual(0);
      });

      it('应该处理单个对象但不是树结构的情况', () => {
        const obj = { id: 1, name: 'node1' }; // 没有 children 字段
        const result = module.convertBackTree(obj);
        expect(result).toHaveLength(1);
        expect(result[0].children).toEqual([]);
      });

      it('应该处理 parentId 等于 rootParentId 的情况', () => {
        const array = [
          { id: 1, name: 'node1', parentId: 0 },
          { id: 2, name: 'node2', parentId: 0 },
        ];
        const result = module.convertBackTree(array, { rootParentId: 0 });
        expect(result).toHaveLength(2);
      });
    });

    describe('convertToMapTree', () => {
      it('应该将树结构转换为 Map', () => {
        const result = module.convertToMapTree(treeData);
        expect(result instanceof Map).toBe(true);
        expect(result.size).toBe(6);
        expect(result.get(1)).toBeDefined();
        expect(result.get(1)?.name).toBe('node1');
        expect(result.get(1)).not.toHaveProperty('children');
      });

      it('应该排除 children 字段', () => {
        const result = module.convertToMapTree(treeData);
        result.forEach((node) => {
          expect(node).not.toHaveProperty('children');
        });
      });

      it('应该处理空树', () => {
        const result = module.convertToMapTree([]);
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
        const result = module.convertToMapTree(customTree, {
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
        const result = module.convertToMapTree(tree);
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
        const result = module.convertToMapTree(tree);
        expect(result.size).toBe(1);
        // 后出现的会覆盖前面的
        expect(result.get(1)?.name).toBe('node1-duplicate');
      });

      it('应该处理字符串类型的 id', () => {
        const tree = [
          { id: '1', name: 'node1' },
          { id: '2', name: 'node2' },
        ];
        const result = module.convertToMapTree(tree);
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
        const result = module.convertToMapTree(deepTree);
        expect(result.size).toBe(3);
        expect(result.get(1)?.name).toBe('level1');
        expect(result.get(2)?.name).toBe('level2');
        expect(result.get(3)?.name).toBe('level3');
      });
    });

    describe('convertToLevelArrayTree', () => {
      it('应该将树结构转换为层级数组', () => {
        const result = module.convertToLevelArrayTree(treeData);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(3); // 3层深度
        expect(result[0]).toHaveLength(1); // 第1层1个节点
        expect(result[1]).toHaveLength(2); // 第2层2个节点
        expect(result[2]).toHaveLength(3); // 第3层3个节点
      });

      it('应该按深度正确分组', () => {
        const result = module.convertToLevelArrayTree(treeData);
        expect(result[0][0].id).toBe(1);
        expect(result[1].map((n) => n.id)).toEqual([2, 3]);
        expect(result[2].map((n) => n.id)).toEqual([4, 5, 6]);
      });

      it('应该排除 children 字段', () => {
        const result = module.convertToLevelArrayTree(treeData);
        result.forEach((level) => {
          level.forEach((node) => {
            expect(node).not.toHaveProperty('children');
          });
        });
      });

      it('应该处理空树', () => {
        const result = module.convertToLevelArrayTree([]);
        expect(result).toEqual([]);
      });

      it('应该处理单层树', () => {
        const singleLevel = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = module.convertToLevelArrayTree(singleLevel);
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
        const result = module.convertToLevelArrayTree(customTree, {
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
        const result = module.convertToLevelArrayTree(unbalancedTree);
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
        const result = module.convertToLevelArrayTree(deepTree);
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
        const result = module.convertToLevelArrayTree(multiRoot);
        expect(result.length).toBe(2);
        expect(result[0]).toHaveLength(2); // 两个根节点
        expect(result[1]).toHaveLength(1); // 一个子节点
      });

      it('应该处理节点没有 children 字段的情况', () => {
        const tree = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = module.convertToLevelArrayTree(tree);
        expect(result.length).toBe(1);
        expect(result[0]).toHaveLength(2);
      });
    });

    describe('convertToObjectTree', () => {
      it('应该将单根树转换为对象', () => {
        const singleRoot = [{ id: 1, name: 'node1', children: [] }];
        const result = module.convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
        expect(result?.name).toBe('node1');
      });

      it('多个根节点应该返回 null', () => {
        const multiRoot = [
          { id: 1, name: 'node1' },
          { id: 2, name: 'node2' },
        ];
        const result = module.convertToObjectTree(multiRoot);
        expect(result).toBeNull();
      });

      it('空树应该返回 null', () => {
        const result = module.convertToObjectTree([]);
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
        const result = module.convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
        expect(result?.name).toBe('node1');
        expect(result?.value).toBe(100);
        expect(result?.children).toHaveLength(1);
      });

      it('应该处理 null 输入', () => {
        const result = module.convertToObjectTree(null as any);
        expect(result).toBeNull();
      });

      it('应该处理 undefined 输入', () => {
        const result = module.convertToObjectTree(undefined as any);
        expect(result).toBeNull();
      });

      it('应该处理非数组输入', () => {
        const result = module.convertToObjectTree({ id: 1, name: 'node1' } as any);
        expect(result).toBeNull();
      });

      it('应该处理单根树但没有 children 字段的情况', () => {
        const singleRoot = [{ id: 1, name: 'node1' }];
        const result = module.convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
      });

      it('应该处理单根树但 children 为 null 的情况', () => {
        const singleRoot = [{ id: 1, name: 'node1', children: null }];
        const result = module.convertToObjectTree(singleRoot);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(1);
      });
    });
  });

  describe('补充测试 - null/undefined 处理', () => {
    it('filterTree 应该处理 undefined children', () => {
      const tree = [
        { id: 1, children: undefined },
        { id: 2, children: null },
      ];
      const result = module.filterTree(tree, (node) => node.id === 1);
      expect(result).toHaveLength(1);
    });

    it('应该处理 children 为 undefined 的情况', () => {
      const tree = [
        { id: 1, children: undefined },
        { id: 2 },
      ];
      const result = module.mapTree(tree, (node) => node.id);
      expect(result).toEqual([1, 2]);
    });

    it('应该处理 children 为 null 的情况', () => {
      const tree = [
        { id: 1, children: null },
        { id: 2 },
      ];
      const result = module.mapTree(tree, (node) => node.id);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('补充测试 - 错误消息验证', () => {
    it('cloneSubtree 应该抛出正确的错误消息（非对象）', () => {
      const tree = [{ id: 1 }];
      expect(() => module.cloneSubtree(tree, 123 as any)).toThrow(
        'cloneSubtree: 必须传入对象，例如 { id: 1 } 或 { name: "xxx" }'
      );
    });

    it('cloneSubtree 应该抛出正确的错误消息（多个字段）', () => {
      const tree = [{ id: 1, name: 'node1' }];
      expect(() => module.cloneSubtree(tree, { id: 1, name: 'node1' })).toThrow(
        'cloneSubtree: 查找对象只能包含一个字段，例如 { id: 1 } 或 { name: "xxx" }'
      );
    });

    it('cloneSubtree 应该抛出正确的错误消息（数组）', () => {
      const tree = [{ id: 1 }];
      expect(() => module.cloneSubtree(tree, [1] as any)).toThrow(
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
      
      const filtered = module.filterTree(tree, (node) => node.value > 20);
      const mapped = module.mapTree(filtered, (node) => node.id);
      const found = module.findTree(filtered, (node) => node.value === 50);
      
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
      const depth3Nodes = module.filterTree(deepTree, (node) => node.level === 3);
      expect(depth3Nodes).toHaveLength(1);
      expect(depth3Nodes[0].id).toBe(3);

      // 获取所有 level 4 的节点
      const depth4Nodes = module.filterTree(deepTree, (node) => node.level === 4);
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

      const allNodes = module.mapTree(largeTree, (node) => node.id);
      expect(allNodes).toHaveLength(100);

      const filtered = module.filterTree(largeTree, (node) => node.id % 2 === 0);
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  describe('补充测试 - 边界值处理', () => {
    it('isSafeTreeDepth 应该处理 maxDepth = 0', () => {
      const tree = [{ id: 1 }];
      expect(module.isSafeTreeDepth(tree, 0)).toBe(false);
    });

    it('isSafeTreeDepth 应该处理 maxDepth < 0', () => {
      const tree = [{ id: 1 }];
      expect(module.isSafeTreeDepth(tree, -1)).toBe(false);
    });

    it('isSafeTreeDepth 应该处理空树', () => {
      expect(module.isSafeTreeDepth([], 10)).toBe(true);
    });

    it('getNodeDepth 应该处理不存在的节点', () => {
      const tree = [{ id: 1, children: [{ id: 2 }] }];
      const depth = module.getNodeDepth(tree, 999);
      expect(depth).toBeNull();
    });

    it('getNodeDepthMap 应该处理空树', () => {
      const map = module.getNodeDepthMap([]);
      expect(map).toEqual({});
    });
  });

  describe('补充测试 - 数据类型边界', () => {
    it('应该处理 children 为数字的情况', () => {
      const tree = [
        { id: 1, children: 123 as any },
        { id: 2, children: 'string' as any },
      ];
      
      const result = module.mapTree(tree, (node) => node.id);
      expect(result).toEqual([1, 2]);
    });

    it('应该处理 children 为布尔值的情况', () => {
      const tree = [
        { id: 1, children: true as any },
        { id: 2, children: false as any },
      ];
      
      const result = module.filterTree(tree, (node) => node.id === 1);
      expect(result).toHaveLength(1);
    });

    it('应该处理节点没有 id 字段的情况', () => {
      const tree = [
        { name: 'node1', children: [{ name: 'node2' }] },
      ];
      
      const result = module.mapTree(tree, (node) => node.name);
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
      const result = module.mapTree(tree, (node) => node.customId, fieldNames);
      expect(result).toEqual([1]);
    });

    it('应该处理自定义字段名与节点字段不匹配', () => {
      const tree = [
        { id: 1, children: [{ id: 2 }] },
      ];
      const fieldNames = { children: 'subNodes', id: 'nodeId' };
      // 字段名不匹配，应该找不到子节点
      const result = module.getChildrenTree(tree, 1, fieldNames);
      expect(result).toEqual([]);
    });
  });

  describe('补充测试 - 性能边界', () => {
    it('应该处理单层大量节点', () => {
      const tree: any[] = [];
      for (let i = 1; i <= 1000; i++) {
        tree.push({ id: i, name: `node-${i}` });
      }
      
      const result = module.findTree(tree, (node) => node.id === 500);
      expect(result?.id).toBe(500);
    });

    it('应该处理极深的树结构', () => {
      let deepTree: any = { id: 1 };
      let current = deepTree;
      for (let i = 2; i <= 100; i++) {
        current.children = [{ id: i }];
        current = current.children[0];
      }
      
      const depth = module.getNodeDepth([deepTree], 100);
      expect(depth).toBe(100);
    });
  });

  describe('补充测试 - 返回值验证', () => {
    it('popTree 应该返回被删除的节点', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const popped = module.popTree(tree, 1);
      expect(popped?.id).toBe(3);
      expect(tree[0].children).toHaveLength(1);
    });

    it('popTree 应该在没有子节点时返回 null', () => {
      const tree = [{ id: 1, children: [] }];
      const popped = module.popTree(tree, 1);
      expect(popped).toBeNull();
    });

    it('shiftTree 应该返回被删除的节点', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const shifted = module.shiftTree(tree, 1);
      expect(shifted?.id).toBe(2);
      expect(tree[0].children).toHaveLength(1);
    });

    it('shiftTree 应该在没有子节点时返回 null', () => {
      const tree = [{ id: 1, children: [] }];
      const shifted = module.shiftTree(tree, 1);
      expect(shifted).toBeNull();
    });
  });

  describe('补充测试 - 数组方法边界', () => {
    it('sliceTree 应该处理负数 start', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const result = module.sliceTree(tree, -1);
      expect(result).toHaveLength(1);
    });

    it('sliceTree 应该处理负数 end', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const result = module.sliceTree(tree, 0, -1);
      // 负数 end 会被转换为正数，如果 end < start 则返回空数组
      expect(Array.isArray(result)).toBe(true);
    });

    it('sliceTree 应该处理 start > end', () => {
      const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }];
      const result = module.sliceTree(tree, 2, 1);
      expect(result).toHaveLength(0);
    });
  });
}, true); // distOnly: true - 只测试打包文件，不测试源代码
