import { defineConfig } from 'vitest/config';

export default defineConfig({
  // 性能优化：缓存目录配置
  cacheDir: 'node_modules/.vitest',
  test: {
    globals: true,
    environment: 'node',
    // 性能优化：启用线程池并行执行测试
    pool: 'threads',
    // Vitest 4 新 API：线程配置
    threads: {
      // 使用所有可用 CPU 核心
      minThreads: 1,
      maxThreads: 4,
    },
    // 测试超时时间（毫秒）
    testTimeout: 10000,
    // 文件监听模式优化
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 排除测试文件和类型定义文件
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/test-wrapper.ts', // 测试工具文件，不计入覆盖率
      ],
    },
  },
});
