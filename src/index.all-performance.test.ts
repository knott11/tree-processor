import { describe, it, expect } from 'vitest';
import * as t from './index';

/**
 * 性能测试工具函数
 */
function measurePerformance<T>(
  fn: () => T,
  iterations: number = 1000
): { result: T; averageTime: number; totalTime: number } {
  const start = performance.now();
  let result: T;
  
  for (let i = 0; i < iterations; i++) {
    result = fn();
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const averageTime = totalTime / iterations;
  
  return { result: result!, averageTime, totalTime };
}

/**
 * 生成大型测试树
 */
function generateLargeTree(depth: number, width: number, startId: number = 1): any[] {
  if (depth === 0) {
    return [];
  }
  
  const nodes: any[] = [];
  let currentId = startId;
  
  for (let i = 0; i < width; i++) {
    const node: any = {
      id: currentId++,
      name: `node-${currentId}`,
      type: `type-${i % 3}`,
      value: Math.random() * 1000,
      count: Math.floor(Math.random() * 100),
    };
    
    if (depth > 1) {
      node.children = generateLargeTree(depth - 1, width, currentId);
      currentId += Math.pow(width, depth - 1);
    }
    
    nodes.push(node);
  }
  
  return nodes;
}

/**
 * 生成扁平数组（用于 convertBackTree 测试）
 */
function generateFlatArray(count: number): any[] {
  const result: any[] = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      id: i,
      name: `node-${i}`,
      parentId: i > 1 ? Math.floor(i / 2) : null,
    });
  }
  return result;
}

describe('所有函数性能测试', () => {
  const mediumTree = generateLargeTree(4, 3); // 约 120 个节点
  const largeTree = generateLargeTree(5, 3); // 约 363 个节点
  
  describe('遍历类函数', () => {
    it('mapTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.mapTree(mediumTree, (node) => node.name),
        100
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  mapTree: ${averageTime.toFixed(4)}ms`);
    });

    it('filterTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.filterTree(mediumTree, (node) => node.id % 2 === 0),
        100
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  filterTree: ${averageTime.toFixed(4)}ms`);
    });

    it('findTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.findTree(largeTree, (node) => node.id === 100),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  findTree: ${averageTime.toFixed(4)}ms`);
    });

    it('forEachTree 性能测试', () => {
      const { averageTime } = measurePerformance(() => {
        t.forEachTree(mediumTree, () => {});
      }, 100);
      expect(averageTime).toBeLessThan(5);
      console.log(`  forEachTree: ${averageTime.toFixed(4)}ms`);
    });

    it('someTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.someTree(mediumTree, (node) => node.id === 50),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  someTree: ${averageTime.toFixed(4)}ms`);
    });

    it('everyTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.everyTree(mediumTree, (node) => node.id > 0),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  everyTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('修改类函数', () => {
    it('pushTree 性能测试', () => {
      const tree = generateLargeTree(3, 3);
      const { averageTime } = measurePerformance(
        () => t.pushTree(tree, 1, { id: 999, name: 'new' }),
        100
      );
      expect(averageTime).toBeLessThan(3);
      console.log(`  pushTree: ${averageTime.toFixed(4)}ms`);
    });

    it('unshiftTree 性能测试', () => {
      const tree = generateLargeTree(3, 3);
      const { averageTime } = measurePerformance(
        () => t.unshiftTree(tree, 1, { id: 999, name: 'new' }),
        100
      );
      expect(averageTime).toBeLessThan(3);
      console.log(`  unshiftTree: ${averageTime.toFixed(4)}ms`);
    });

    it('popTree 性能测试', () => {
      const tree = generateLargeTree(3, 3);
      const { averageTime } = measurePerformance(
        () => t.popTree(tree, 1),
        100
      );
      expect(averageTime).toBeLessThan(3);
      console.log(`  popTree: ${averageTime.toFixed(4)}ms`);
    });

    it('shiftTree 性能测试', () => {
      const tree = generateLargeTree(3, 3);
      const { averageTime } = measurePerformance(
        () => t.shiftTree(tree, 1),
        100
      );
      expect(averageTime).toBeLessThan(3);
      console.log(`  shiftTree: ${averageTime.toFixed(4)}ms`);
    });

    it('removeTree 性能测试', () => {
      const tree = generateLargeTree(3, 3);
      const { averageTime } = measurePerformance(
        () => t.removeTree([...tree], 10),
        100
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  removeTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('查找和访问类函数', () => {
    it('atTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.atTree(mediumTree, 1, 0),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  atTree: ${averageTime.toFixed(4)}ms`);
    });

    it('indexOfTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.indexOfTree(mediumTree, 50),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  indexOfTree: ${averageTime.toFixed(4)}ms`);
    });

    it('atIndexOfTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.atIndexOfTree(mediumTree, [0, 1]),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  atIndexOfTree: ${averageTime.toFixed(4)}ms`);
    });

    it('includesTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.includesTree(mediumTree, 50),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  includesTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('关系查询类函数', () => {
    it('getParentTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.getParentTree(mediumTree, 50),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  getParentTree: ${averageTime.toFixed(4)}ms`);
    });

    it('getChildrenTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.getChildrenTree(mediumTree, 1),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  getChildrenTree: ${averageTime.toFixed(4)}ms`);
    });

    it('getSiblingsTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.getSiblingsTree(mediumTree, 10),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  getSiblingsTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('深度计算类函数', () => {
    it('getNodeDepth 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.getNodeDepth(mediumTree, 50),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  getNodeDepth: ${averageTime.toFixed(4)}ms`);
    });

    it('getNodeDepthMap 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.getNodeDepthMap(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  getNodeDepthMap: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('判断类函数', () => {
    it('isLeafNode 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isLeafNode(mediumTree, 50),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  isLeafNode: ${averageTime.toFixed(4)}ms`);
    });

    it('isRootNode 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isRootNode(mediumTree, 1),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  isRootNode: ${averageTime.toFixed(4)}ms`);
    });

    it('isEmptyTreeData 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isEmptyTreeData(mediumTree),
        500
      );
      expect(averageTime).toBeLessThan(0.1);
      console.log(`  isEmptyTreeData: ${averageTime.toFixed(4)}ms`);
    });

    it('isEmptySingleTreeData 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isEmptySingleTreeData(mediumTree[0]),
        500
      );
      expect(averageTime).toBeLessThan(0.1);
      console.log(`  isEmptySingleTreeData: ${averageTime.toFixed(4)}ms`);
    });

    it('isTreeData 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isTreeData(mediumTree),
        500
      );
      expect(averageTime).toBeLessThan(0.1);
      console.log(`  isTreeData: ${averageTime.toFixed(4)}ms`);
    });

    it('isSingleTreeData 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isSingleTreeData(mediumTree[0]),
        500
      );
      expect(averageTime).toBeLessThan(0.1);
      console.log(`  isSingleTreeData: ${averageTime.toFixed(4)}ms`);
    });

    it('isValidTreeNode 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isValidTreeNode(mediumTree[0]),
        500
      );
      expect(averageTime).toBeLessThan(0.1);
      console.log(`  isValidTreeNode: ${averageTime.toFixed(4)}ms`);
    });

    it('isTreeNodeWithCircularCheck 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isTreeNodeWithCircularCheck(mediumTree[0]),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  isTreeNodeWithCircularCheck: ${averageTime.toFixed(4)}ms`);
    });

    it('isSafeTreeDepth 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.isSafeTreeDepth(mediumTree),
        200
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  isSafeTreeDepth: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('转换类函数', () => {
    it('convertToArrayTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.convertToArrayTree(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  convertToArrayTree: ${averageTime.toFixed(4)}ms`);
    });

    it('convertBackTree 性能测试', () => {
      const flatArray = generateFlatArray(100);
      const { averageTime } = measurePerformance(
        () => t.convertBackTree(flatArray),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  convertBackTree: ${averageTime.toFixed(4)}ms`);
    });

    it('convertToMapTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.convertToMapTree(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  convertToMapTree: ${averageTime.toFixed(4)}ms`);
    });

    it('convertToLevelArrayTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.convertToLevelArrayTree(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  convertToLevelArrayTree: ${averageTime.toFixed(4)}ms`);
    });

    it('convertToObjectTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.convertToObjectTree(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  convertToObjectTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('克隆类函数', () => {
    it('cloneTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.cloneTree(mediumTree),
        20
      );
      expect(averageTime).toBeLessThan(20);
      console.log(`  cloneTree: ${averageTime.toFixed(4)}ms`);
    });

    it('shallowCloneTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.shallowCloneTree(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  shallowCloneTree: ${averageTime.toFixed(4)}ms`);
    });

    it('cloneSubtree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.cloneSubtree(mediumTree, { id: 1 }),
        20
      );
      expect(averageTime).toBeLessThan(20);
      console.log(`  cloneSubtree: ${averageTime.toFixed(4)}ms`);
    });

    it('cloneWithTransform 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.cloneWithTransform(mediumTree, (node) => ({ ...node, cloned: true })),
        20
      );
      expect(averageTime).toBeLessThan(20);
      console.log(`  cloneWithTransform: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('操作类函数', () => {
    it('concatTree 性能测试', () => {
      const tree1 = generateLargeTree(3, 2);
      const tree2 = generateLargeTree(3, 2);
      const { averageTime } = measurePerformance(
        () => t.concatTree(tree1, tree2),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  concatTree: ${averageTime.toFixed(4)}ms`);
    });

    it('sortTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.sortTree(mediumTree, (a, b) => a.id - b.id),
        20
      );
      expect(averageTime).toBeLessThan(20);
      console.log(`  sortTree: ${averageTime.toFixed(4)}ms`);
    });

    it('reduceTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.reduceTree(mediumTree, (acc, node) => acc + node.id, 0),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  reduceTree: ${averageTime.toFixed(4)}ms`);
    });

    it('sliceTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.sliceTree(mediumTree, 0, 5),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  sliceTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('聚合类函数', () => {
    it('aggregateTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.aggregateTree(mediumTree, {
          groupBy: (node) => node.type,
          aggregations: {
            total: { operation: 'sum', field: 'value' },
            count: { operation: 'count' },
          },
        }),
        20
      );
      expect(averageTime).toBeLessThan(20);
      console.log(`  aggregateTree: ${averageTime.toFixed(4)}ms`);
    });

    it('groupTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.groupTree(mediumTree, 'type'),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  groupTree: ${averageTime.toFixed(4)}ms`);
    });

    it('groupByTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.groupByTree(mediumTree, (node) => node.type),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  groupByTree: ${averageTime.toFixed(4)}ms`);
    });

    it('sumTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.sumTree(mediumTree, 'value'),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  sumTree: ${averageTime.toFixed(4)}ms`);
    });

    it('avgTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.avgTree(mediumTree, 'value'),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  avgTree: ${averageTime.toFixed(4)}ms`);
    });

    it('maxTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.maxTree(mediumTree, 'value'),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  maxTree: ${averageTime.toFixed(4)}ms`);
    });

    it('minTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.minTree(mediumTree, 'value'),
        50
      );
      expect(averageTime).toBeLessThan(5);
      console.log(`  minTree: ${averageTime.toFixed(4)}ms`);
    });

    it('countTree 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.countTree(mediumTree),
        100
      );
      expect(averageTime).toBeLessThan(2);
      console.log(`  countTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('统计和分析类函数', () => {
    it('getTreeStats 性能测试', () => {
      const { averageTime } = measurePerformance(
        () => t.getTreeStats(mediumTree),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  getTreeStats: ${averageTime.toFixed(4)}ms`);
    });

    it('analyzeTree 性能测试（完整计算）', () => {
      const { averageTime } = measurePerformance(
        () => t.analyzeTree(mediumTree),
        20
      );
      expect(averageTime).toBeLessThan(20);
      console.log(`  analyzeTree (完整): ${averageTime.toFixed(4)}ms`);
    });

    it('analyzeTree 性能测试（部分计算）', () => {
      const { averageTime } = measurePerformance(
        () => t.analyzeTree(mediumTree, {
          includeBasic: true,
          includeBranchingFactor: true,
        }),
        20
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  analyzeTree (部分): ${averageTime.toFixed(4)}ms`);
    });

    it('dedupTree 性能测试', () => {
      const treeWithDuplicates = generateLargeTree(3, 4);
      const { averageTime } = measurePerformance(
        () => t.dedupTree(treeWithDuplicates, 'id'),
        50
      );
      expect(averageTime).toBeLessThan(10);
      console.log(`  dedupTree: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('综合性能测试', () => {
    it('所有函数在大型树上的综合性能', () => {
      const tree = generateLargeTree(5, 3);
      
      const { averageTime } = measurePerformance(() => {
        // 遍历
        t.mapTree(tree, (n) => n.name);
        t.filterTree(tree, (n) => n.id % 2 === 0);
        t.findTree(tree, (n) => n.id === 100);
        
        // 查找
        t.getParentTree(tree, 50);
        t.getChildrenTree(tree, 1);
        t.includesTree(tree, 50);
        
        // 判断
        t.isLeafNode(tree, 50);
        t.isRootNode(tree, 1);
        
        // 统计
        t.countTree(tree);
        t.sumTree(tree, 'value');
      }, 5);
      
      expect(averageTime).toBeLessThan(100);
      console.log(`  综合操作: ${averageTime.toFixed(4)}ms`);
    });
  });
});
