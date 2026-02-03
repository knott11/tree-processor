/**
 * 测试包装器
 * 自动为所有测试用例创建源代码和打包文件两个版本
 * 
 * 使用方式：
 * import { wrapTests } from './test-wrapper';
 * import * as sourceModule from './index';
 * 
 * wrapTests('Tree Processor', sourceModule, async () => {
 *   // 所有测试用例
 * });
 */

import { describe, beforeEach, beforeAll } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 获取打包文件模块
 */
async function getDistModule() {
  const esmPath = join(__dirname, '..', 'dist', 'tree-processor.esm.js');
  if (!existsSync(esmPath)) {
    throw new Error('打包文件不存在，请先运行 npm run build');
  }
  const esmUrl = esmPath.startsWith('/') 
    ? `file://${esmPath}` 
    : `file:///${esmPath.replace(/\\/g, '/')}`;
  return import(esmUrl);
}

/**
 * 包装测试套件，自动为源代码和打包文件创建测试
 * @param name 测试套件名称
 * @param sourceModule 源代码模块
 * @param testFn 测试函数，接收模块作为参数
 * @param distOnly 是否只测试打包文件（默认 false）
 */
export function wrapTests(
  name: string,
  sourceModule: any,
  testFn: (module: any) => void,
  distOnly: boolean = false
) {
  describe(name, () => {
    // 测试源代码
    if (!distOnly) {
      describe('从源代码测试', () => {
        testFn(sourceModule);
      });
    }

    // 测试打包文件
    describe('从打包文件测试', () => {
      let distModule: any;

      // 使用 beforeAll 在测试套件级别加载模块
      beforeAll(async () => {
        distModule = await getDistModule();
      });

      // 创建一个内部 describe，确保 beforeAll 先执行
      // 然后通过闭包访问 distModule
      (() => {
        // 创建一个函数来延迟执行 testFn
        const runTests = () => {
          if (distModule) {
            testFn(distModule);
          }
        };
        
        // 使用 setTimeout 确保 beforeAll 先执行
        // 但这在 Vitest 中不起作用，因为测试发现是同步的
        
        // 更好的方法：直接在 describe 回调中执行 testFn
        // 但需要确保 distModule 已经加载
        // 由于 beforeAll 是异步的，我们需要使用一个技巧
        
        // 实际上，最好的方法是让 testFn 接受一个 getter 函数
        // 但为了保持 API 简单，我们使用一个全局变量
        (globalThis as any).__currentTestModule = distModule;
      })();
      
      // 直接执行 testFn，但使用一个 getter 来获取模块
      testFn(new Proxy({} as any, {
        get(target, prop) {
          return distModule?.[prop];
        }
      }));
    });
  });
}

/**
 * 创建可切换的测试环境
 * 允许在测试运行时动态切换导入源
 */
export function createTestEnvironment() {
  let currentModule: any;
  let isDist: boolean = false;

  return {
    /**
     * 设置使用源代码
     */
    useSource: (sourceModule: any) => {
      currentModule = sourceModule;
      isDist = false;
    },

    /**
     * 设置使用打包文件
     */
    useDist: async () => {
      currentModule = await getDistModule();
      isDist = true;
    },

    /**
     * 获取当前模块
     */
    getModule: () => currentModule,

    /**
     * 检查是否使用打包文件
     */
    isDist: () => isDist,
  };
}
