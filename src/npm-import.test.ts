import { describe, it, expect, beforeEach } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 测试从打包后的 npm 包引入（模拟真实使用场景）
 * 这些测试确保打包后的代码可以正常工作
 */
describe('从 npm 包引入测试', () => {
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

  describe('ESM 模块导入测试', () => {
    it('应该能够从打包后的 ESM 文件按需导入', async () => {
      // 确保打包文件存在
      const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
      if (!existsSync(esmPath)) {
        console.warn('打包文件不存在，请先运行 npm run build');
        return;
      }

      // 从打包后的文件导入（模拟 npm 包使用）
      const { mapTree, filterTree, findTree } = await import('../dist/tree-processor.esm.js');

      expect(typeof mapTree).toBe('function');
      expect(typeof filterTree).toBe('function');
      expect(typeof findTree).toBe('function');

      // 测试功能
      const mapped = mapTree(treeData, (node) => node.name);
      expect(mapped).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);

      const found = findTree(treeData, (node) => node.id === 2);
      expect(found).not.toBeNull();
      expect(found?.name).toBe('node2');
    });

    it('应该能够从打包后的 ESM 文件导入所有函数', async () => {
      const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
      if (!existsSync(esmPath)) {
        console.warn('打包文件不存在，请先运行 npm run build');
        return;
      }

      const {
        mapTree,
        forEachTree,
        filterTree,
        findTree,
        pushTree,
        unshiftTree,
        popTree,
        shiftTree,
        someTree,
        everyTree,
        includesTree,
        atTree,
        indexOfTree,
        atIndexOfTree,
        getParentTree,
        getChildrenTree,
        getSiblingsTree,
        getNodeDepthMap,
        getNodeDepth,
        dedupTree,
        removeTree,
        isEmptyTreeData,
        isEmptySingleTreeData,
        isSingleTreeData,
        isTreeData,
        isValidTreeNode,
        isTreeNodeWithCircularCheck,
        isSafeTreeDepth,
        isLeafNode,
        isRootNode,
      } = await import('../dist/tree-processor.esm.js');

      // 验证所有函数都存在
      expect(typeof mapTree).toBe('function');
      expect(typeof forEachTree).toBe('function');
      expect(typeof filterTree).toBe('function');
      expect(typeof findTree).toBe('function');
      expect(typeof pushTree).toBe('function');
      expect(typeof unshiftTree).toBe('function');
      expect(typeof popTree).toBe('function');
      expect(typeof shiftTree).toBe('function');
      expect(typeof someTree).toBe('function');
      expect(typeof everyTree).toBe('function');
      expect(typeof includesTree).toBe('function');
      expect(typeof atTree).toBe('function');
      expect(typeof indexOfTree).toBe('function');
      expect(typeof atIndexOfTree).toBe('function');
      expect(typeof getParentTree).toBe('function');
      expect(typeof getChildrenTree).toBe('function');
      expect(typeof getSiblingsTree).toBe('function');
      expect(typeof getNodeDepthMap).toBe('function');
      expect(typeof getNodeDepth).toBe('function');
      expect(typeof dedupTree).toBe('function');
      expect(typeof removeTree).toBe('function');
      expect(typeof isEmptyTreeData).toBe('function');
      expect(typeof isEmptySingleTreeData).toBe('function');
      expect(typeof isSingleTreeData).toBe('function');
      expect(typeof isTreeData).toBe('function');
      expect(typeof isValidTreeNode).toBe('function');
      expect(typeof isTreeNodeWithCircularCheck).toBe('function');
      expect(typeof isSafeTreeDepth).toBe('function');
      expect(typeof isLeafNode).toBe('function');
      expect(typeof isRootNode).toBe('function');
    });

    it('应该能够使用默认导出', async () => {
      const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
      if (!existsSync(esmPath)) {
        console.warn('打包文件不存在，请先运行 npm run build');
        return;
      }

      const treeProcessor = await import('../dist/tree-processor.esm.js');

      // 验证默认导出
      expect(treeProcessor.default).toBeDefined();
      expect(typeof treeProcessor.default.mapTree).toBe('function');
      expect(typeof treeProcessor.default.findTree).toBe('function');

      // 测试默认导出功能
      const result = treeProcessor.default.mapTree(treeData, (node) => node.name);
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('应该能够使用命名导出和默认导出', async () => {
      const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
      if (!existsSync(esmPath)) {
        console.warn('打包文件不存在，请先运行 npm run build');
        return;
      }

      const treeProcessor = await import('../dist/tree-processor.esm.js');

      // 命名导出和默认导出应该指向相同的函数
      expect(treeProcessor.mapTree).toBe(treeProcessor.default.mapTree);
      expect(treeProcessor.findTree).toBe(treeProcessor.default.findTree);
    });
  });

  describe('功能测试 - 从打包文件导入', () => {
    let mapTree: any;
    let forEachTree: any;
    let filterTree: any;
    let findTree: any;
    let pushTree: any;
    let removeTree: any;
    let getParentTree: any;
    let includesTree: any;
    let isEmptyTreeData: any;

    beforeEach(async () => {
      const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
      if (!existsSync(esmPath)) {
        console.warn('打包文件不存在，请先运行 npm run build');
        return;
      }

      const module = await import('../dist/tree-processor.esm.js');
      mapTree = module.mapTree;
      forEachTree = module.forEachTree;
      filterTree = module.filterTree;
      findTree = module.findTree;
      pushTree = module.pushTree;
      removeTree = module.removeTree;
      getParentTree = module.getParentTree;
      includesTree = module.includesTree;
      isEmptyTreeData = module.isEmptyTreeData;
    });

    it('mapTree 应该正常工作', () => {
      if (!mapTree) return;
      const result = mapTree(treeData, (node) => node.name);
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('forEachTree 应该正常工作', () => {
      if (!forEachTree) return;
      const result: string[] = [];
      forEachTree(treeData, (node: any) => {
        result.push(node.name);
      });
      expect(result).toEqual(['node1', 'node2', 'node4', 'node5', 'node3', 'node6']);
    });

    it('filterTree 应该正常工作', () => {
      if (!filterTree) return;
      const result = filterTree(treeData, (node: any) => node.id > 2);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((node: any) => node.id > 2)).toBe(true);
    });

    it('findTree 应该正常工作', () => {
      if (!findTree) return;
      const result = findTree(treeData, (node: any) => node.id === 4);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('node4');
    });

    it('pushTree 应该正常工作', () => {
      if (!pushTree) return;
      const testTree = [{ id: 1, name: 'root', children: [] }];
      const success = pushTree(testTree, 1, { id: 2, name: 'child' });
      expect(success).toBe(true);
      expect(testTree[0].children).toHaveLength(1);
      expect(testTree[0].children[0].id).toBe(2);
    });

    it('removeTree 应该正常工作', () => {
      if (!removeTree) return;
      const testTree = [
        {
          id: 1,
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

    it('getParentTree 应该正常工作', () => {
      if (!getParentTree) return;
      const parent = getParentTree(treeData, 4);
      expect(parent).not.toBeNull();
      expect(parent?.id).toBe(2);
    });

    it('includesTree 应该正常工作', () => {
      if (!includesTree) return;
      expect(includesTree(treeData, 4)).toBe(true);
      expect(includesTree(treeData, 999)).toBe(false);
    });

    it('isEmptyTreeData 应该正常工作', () => {
      if (!isEmptyTreeData) return;
      expect(isEmptyTreeData(treeData)).toBe(false);
      expect(isEmptyTreeData([])).toBe(true);
    });
  });

  describe('类型导出测试', () => {
    it('应该能够导入类型定义', async () => {
      const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
      const typesPath = join(__dirname, '..', 'dist', 'index.d.ts');
      
      if (!existsSync(esmPath) || !existsSync(typesPath)) {
        console.warn('打包文件不存在，请先运行 npm run build');
        return;
      }

      // 验证类型定义文件存在
      expect(existsSync(typesPath)).toBe(true);
    });
  });
});
