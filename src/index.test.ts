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
  nodeDepthMap,
  dedupTree,
  removeTree,
  forEachTree,
  isEmptyTree,
  getParentTree,
  includesTree,
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

  describe('nodeDepthMap', () => {
    it('应该返回节点ID到深度的映射', () => {
      const result = nodeDepthMap(treeData);
      expect(result[1]).toBe(1);
      expect(result[2]).toBe(2);
      expect(result[4]).toBe(3);
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

    it('nodeDepthMap应该处理空数组', () => {
      const result = nodeDepthMap([]);
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
      const singleNode = [{ id: 1, name: 'root' }];
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

      const depthMap = nodeDepthMap(deepTree);
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
      const testTree = [{ id: 1, name: 'parent', children: [] }];

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

      const depthMap = nodeDepthMap(customTree, fieldNames);
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
      const testTree = [
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

  describe('isEmptyTree', () => {
    it('应该返回true如果树为空数组', () => {
      expect(isEmptyTree([])).toBe(true);
    });

    it('应该返回true如果树为null或undefined', () => {
      expect(isEmptyTree(null as any)).toBe(true);
      expect(isEmptyTree(undefined as any)).toBe(true);
    });

    it('应该返回false如果树不为空', () => {
      expect(isEmptyTree(treeData)).toBe(false);
    });

    it('应该返回false如果树有单个节点', () => {
      expect(isEmptyTree([{ id: 1, name: 'root' }])).toBe(false);
    });

    it('应该返回false如果树有多个根节点', () => {
      const multiRoot = [
        { id: 1, name: 'root1' },
        { id: 2, name: 'root2' },
      ];
      expect(isEmptyTree(multiRoot)).toBe(false);
    });

    it('应该返回false如果树有子节点', () => {
      const treeWithChildren = [
        {
          id: 1,
          children: [{ id: 2 }],
        },
      ];
      expect(isEmptyTree(treeWithChildren)).toBe(false);
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
});
