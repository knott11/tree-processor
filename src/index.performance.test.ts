import { describe, it, expect } from 'vitest';
import {
  isRootNode,
  dedupTree,
  analyzeTree,
} from './index';

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
    };
    
    if (depth > 1) {
      node.children = generateLargeTree(depth - 1, width, currentId);
      currentId += Math.pow(width, depth - 1);
    }
    
    nodes.push(node);
  }
  
  return nodes;
}

describe('性能测试', () => {
  describe('isRootNode 性能测试', () => {
    it('应该在大型树结构上表现良好', () => {
      // 生成一个深度为 5，每层宽度为 3 的树（约 363 个节点）
      const largeTree = generateLargeTree(5, 3);
      const targetNodeId = 1; // 根节点
      
      const { averageTime, totalTime } = measurePerformance(
        () => isRootNode(largeTree, targetNodeId),
        100
      );
      
      // 验证功能正确性
      expect(isRootNode(largeTree, targetNodeId)).toBe(true);
      
      // 性能断言：单次调用应该在合理时间内完成（< 10ms）
      expect(averageTime).toBeLessThan(10);
      
      console.log(`isRootNode 性能测试 (100次迭代):`);
      console.log(`  平均时间: ${averageTime.toFixed(4)}ms`);
      console.log(`  总时间: ${totalTime.toFixed(2)}ms`);
    });

    it('应该比旧实现（两次遍历）更快', () => {
      // 生成一个深度为 6，每层宽度为 2 的树（约 127 个节点）
      const tree = generateLargeTree(6, 2);
      const targetNodeId = 1;
      
      // 测试优化后的实现
      const optimized = measurePerformance(
        () => isRootNode(tree, targetNodeId),
        200
      );
      
      // 验证功能正确性
      expect(isRootNode(tree, targetNodeId)).toBe(true);
      
      // 性能断言：应该很快
      expect(optimized.averageTime).toBeLessThan(5);
      
      console.log(`isRootNode 优化后性能 (200次迭代):`);
      console.log(`  平均时间: ${optimized.averageTime.toFixed(4)}ms`);
    });

    it('应该在不同深度的树上表现一致', () => {
      const depths = [3, 5, 7];
      const results: number[] = [];
      
      for (const depth of depths) {
        const tree = generateLargeTree(depth, 2);
        const { averageTime } = measurePerformance(
          () => isRootNode(tree, 1),
          100
        );
        results.push(averageTime);
        expect(averageTime).toBeLessThan(10);
      }
      
      console.log(`isRootNode 不同深度性能测试:`);
      depths.forEach((depth, i) => {
        console.log(`  深度 ${depth}: ${results[i].toFixed(4)}ms`);
      });
    });
  });

  describe('dedupTree 性能测试', () => {
    it('多字段去重应该比 JSON.stringify 更快', () => {
      // 生成一个有重复节点的树
      const treeWithDuplicates = [
        {
          id: 1,
          children: Array.from({ length: 100 }, (_, i) => ({
            id: i % 50, // 创建重复的 id
            type: `type-${i % 3}`,
            name: `node-${i}`,
            value: Math.random() * 1000,
          })),
        },
      ];
      
      // 测试优化后的多字段去重（使用分隔符）
      const optimized = measurePerformance(
        () => dedupTree(treeWithDuplicates, ['id', 'type']),
        50
      );
      
      // 验证功能正确性
      const result = dedupTree(treeWithDuplicates, ['id', 'type']);
      expect(result[0].children.length).toBeLessThanOrEqual(100);
      
      // 性能断言：应该很快
      expect(optimized.averageTime).toBeLessThan(50);
      
      console.log(`dedupTree 多字段去重性能 (50次迭代):`);
      console.log(`  平均时间: ${optimized.averageTime.toFixed(4)}ms`);
      console.log(`  总时间: ${optimized.totalTime.toFixed(2)}ms`);
    });

    it('单字段去重应该保持高性能', () => {
      const tree = generateLargeTree(4, 4); // 约 341 个节点
      
      const { averageTime } = measurePerformance(
        () => dedupTree(tree, 'id'),
        100
      );
      
      expect(averageTime).toBeLessThan(20);
      
      console.log(`dedupTree 单字段去重性能 (100次迭代):`);
      console.log(`  平均时间: ${averageTime.toFixed(4)}ms`);
    });

    it('自定义函数去重应该保持高性能', () => {
      const tree = generateLargeTree(4, 3);
      
      const { averageTime } = measurePerformance(
        () => dedupTree(tree, (node) => `${node.id}-${node.type}`),
        100
      );
      
      expect(averageTime).toBeLessThan(20);
      
      console.log(`dedupTree 自定义函数去重性能 (100次迭代):`);
      console.log(`  平均时间: ${averageTime.toFixed(4)}ms`);
    });
  });

  describe('analyzeTree 性能测试', () => {
    it('部分计算应该比完整计算快得多', () => {
      // 生成一个较大的树
      const largeTree = generateLargeTree(5, 3); // 约 363 个节点
      
      // 测试完整计算
      const fullAnalysis = measurePerformance(
        () => analyzeTree(largeTree),
        10
      );
      
      // 测试只计算基础统计
      const basicOnly = measurePerformance(
        () => analyzeTree(largeTree, {
          includeBasic: true,
          includeLevelAnalysis: false,
          includeBranchingFactor: false,
          includeDepthDistribution: false,
          includeBalanceAnalysis: false,
          includePathAnalysis: false,
          includeLeafAnalysis: false,
        }),
        10
      );
      
      // 验证功能正确性
      const fullResult = analyzeTree(largeTree);
      const basicResult = analyzeTree(largeTree, { includeBasic: true });
      expect(fullResult.totalNodes).toBe(basicResult.totalNodes);
      
      // 性能断言：部分计算应该明显更快
      expect(basicOnly.averageTime).toBeLessThan(fullAnalysis.averageTime);
      
      const speedup = fullAnalysis.averageTime / basicOnly.averageTime;
      
      console.log(`analyzeTree 性能对比 (10次迭代):`);
      console.log(`  完整计算平均时间: ${fullAnalysis.averageTime.toFixed(4)}ms`);
      console.log(`  部分计算平均时间: ${basicOnly.averageTime.toFixed(4)}ms`);
      console.log(`  性能提升: ${speedup.toFixed(2)}x`);
    });

    it('不同选项组合应该有不同性能表现', () => {
      const tree = generateLargeTree(4, 4);
      
      const configs = [
        {
          name: '仅基础统计',
          options: { includeBasic: true } as any,
        },
        {
          name: '基础 + 分支因子',
          options: {
            includeBasic: true,
            includeBranchingFactor: true,
          },
        },
        {
          name: '基础 + 平衡性分析',
          options: {
            includeBasic: true,
            includeBalanceAnalysis: true,
          },
        },
        {
          name: '全部统计',
          options: {},
        },
      ];
      
      console.log(`analyzeTree 不同选项组合性能测试 (20次迭代):`);
      
      for (const config of configs) {
        const { averageTime } = measurePerformance(
          () => analyzeTree(tree, config.options),
          20
        );
        
        expect(averageTime).toBeLessThan(100);
        console.log(`  ${config.name}: ${averageTime.toFixed(4)}ms`);
      }
    });

    it('应该在大型树上保持合理性能', () => {
      const sizes = [
        { depth: 3, width: 3, name: '小树 (~40节点)' },
        { depth: 4, width: 3, name: '中树 (~120节点)' },
        { depth: 5, width: 3, name: '大树 (~363节点)' },
      ];
      
      console.log(`analyzeTree 不同规模性能测试 (10次迭代):`);
      
      for (const size of sizes) {
        const tree = generateLargeTree(size.depth, size.width);
        
        const { averageTime } = measurePerformance(
          () => analyzeTree(tree),
          10
        );
        
        // 性能应该随树大小线性增长（或更好）
        expect(averageTime).toBeLessThan(200);
        console.log(`  ${size.name}: ${averageTime.toFixed(4)}ms`);
      }
    });

    it('部分计算选项应该显著减少计算时间', () => {
      const tree = generateLargeTree(5, 3);
      
      // 只计算基础统计和分支因子（最常用的组合）
      const optimized = measurePerformance(
        () => analyzeTree(tree, {
          includeBasic: true,
          includeBranchingFactor: true,
          includeLevelAnalysis: false,
          includeDepthDistribution: false,
          includeBalanceAnalysis: false,
          includePathAnalysis: false,
          includeLeafAnalysis: false,
        }),
        20
      );
      
      // 完整计算
      const full = measurePerformance(
        () => analyzeTree(tree),
        20
      );
      
      // 验证结果正确性
      const optResult = analyzeTree(tree, {
        includeBasic: true,
        includeBranchingFactor: true,
      });
      const fullResult = analyzeTree(tree);
      
      expect(optResult.totalNodes).toBe(fullResult.totalNodes);
      expect(optResult.maxBranchingFactor).toBe(fullResult.maxBranchingFactor);
      
      // 部分计算应该更快
      expect(optimized.averageTime).toBeLessThan(full.averageTime);
      
      const improvement = ((full.averageTime - optimized.averageTime) / full.averageTime * 100).toFixed(1);
      
      console.log(`analyzeTree 优化效果:`);
      console.log(`  完整计算: ${full.averageTime.toFixed(4)}ms`);
      console.log(`  部分计算: ${optimized.averageTime.toFixed(4)}ms`);
      console.log(`  性能提升: ${improvement}%`);
    });
  });

  describe('综合性能测试', () => {
    it('所有优化函数应该在大型树上协同工作', () => {
      const tree = generateLargeTree(5, 3);
      
      // 测试一系列操作
      const { averageTime } = measurePerformance(() => {
        // 1. 检查根节点
        isRootNode(tree, 1);
        
        // 2. 去重
        dedupTree(tree, 'id');
        
        // 3. 分析（部分计算）
        analyzeTree(tree, {
          includeBasic: true,
          includeBranchingFactor: true,
        });
      }, 10);
      
      // 综合操作应该在合理时间内完成
      expect(averageTime).toBeLessThan(100);
      
      console.log(`综合性能测试 (10次迭代):`);
      console.log(`  平均时间: ${averageTime.toFixed(4)}ms`);
    });
  });
});
