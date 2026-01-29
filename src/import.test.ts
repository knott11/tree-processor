import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 测试按需导入功能
 * 这个测试确保可以按需导入单个或多个函数
 */
describe('按需导入测试', () => {
  it('应该能够从源文件按需导入单个函数', async () => {
    // 从源文件按需导入（打包后的文件应该保持相同的导出结构）
    const { mapTree, filterTree, findTree } = await import('./index.js');
    
    // 验证函数类型
    expect(typeof mapTree).toBe('function');
    expect(typeof filterTree).toBe('function');
    expect(typeof findTree).toBe('function');
  });

  it('应该能够按需导入多个函数', async () => {
    const { mapTree, filterTree, findTree, pushTree, popTree } = await import('./index.js');
    
    expect(typeof mapTree).toBe('function');
    expect(typeof filterTree).toBe('function');
    expect(typeof findTree).toBe('function');
    expect(typeof pushTree).toBe('function');
    expect(typeof popTree).toBe('function');
  });

  it('应该能够使用按需导入的函数', async () => {
    const { mapTree, findTree } = await import('./index.js');
    
    const treeData = [
      {
        id: 1,
        name: 'node1',
        children: [
          { id: 2, name: 'node2' },
        ],
      },
    ];
    
    // 测试 mapTree
    const mapped = mapTree(treeData, (node) => node.name);
    expect(mapped).toEqual(['node1', 'node2']);
    
    // 测试 findTree
    const found = findTree(treeData, (node) => node.id === 2);
    expect(found).not.toBeNull();
    expect(found?.name).toBe('node2');
  });

  it('应该能够同时使用默认导出和命名导出', async () => {
    const module = await import('./index.js');
    
    // 验证默认导出也存在（向后兼容）
    expect(module.default).toBeDefined();
    expect(typeof module.default.mapTree).toBe('function');
    
    // 验证命名导出也存在
    expect(typeof module.mapTree).toBe('function');
  });

  it('应该支持只导入需要的函数（tree-shaking 测试）', async () => {
    // 这个测试确保可以只导入一个函数而不导入其他函数
    const { mapTree } = await import('./index.js');
    
    // 如果 tree-shaking 正常工作，只导入 mapTree 不应该影响功能
    const treeData = [{ id: 1, name: 'test' }];
    const result = mapTree(treeData, (node) => node.name);
    expect(result).toEqual(['test']);
  });

  it('应该能够导入所有函数', async () => {
    const {
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
    } = await import('./index.js');
    
    // 验证所有函数都被正确导出
    expect(typeof mapTree).toBe('function');
    expect(typeof filterTree).toBe('function');
    expect(typeof findTree).toBe('function');
    expect(typeof pushTree).toBe('function');
    expect(typeof unshiftTree).toBe('function');
    expect(typeof popTree).toBe('function');
    expect(typeof shiftTree).toBe('function');
    expect(typeof someTree).toBe('function');
    expect(typeof everyTree).toBe('function');
    expect(typeof atTree).toBe('function');
    expect(typeof indexOfTree).toBe('function');
    expect(typeof atIndexOfTree).toBe('function');
    expect(typeof getNodeDepthMap).toBe('function');
    expect(typeof getNodeDepth).toBe('function');
    expect(typeof dedupTree).toBe('function');
    expect(typeof removeTree).toBe('function');
    expect(typeof forEachTree).toBe('function');
    expect(typeof isEmptyTreeData).toBe('function');
    expect(typeof getParentTree).toBe('function');
    expect(typeof getChildrenTree).toBe('function');
    expect(typeof getSiblingsTree).toBe('function');
    expect(typeof includesTree).toBe('function');
    expect(typeof isSingleTreeData).toBe('function');
    expect(typeof isTreeData).toBe('function');
    expect(typeof isValidTreeNode).toBe('function');
    expect(typeof isTreeNodeWithCircularCheck).toBe('function');
    expect(typeof isSafeTreeDepth).toBe('function');
    expect(typeof isLeafNode).toBe('function');
    expect(typeof isRootNode).toBe('function');
  });

  it('应该验证打包后的文件存在且可导入', () => {
    // 验证打包后的文件存在
    const distPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
    expect(existsSync(distPath)).toBe(true);
    
    // 验证文件内容包含命名导出
    const content = readFileSync(distPath, 'utf-8');
    expect(content).toContain('export');
  });
});
