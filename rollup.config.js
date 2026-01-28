import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tree-processor.cjs.js',
      format: 'cjs',
      name: 'TreeProcessor',
      exports: 'named',
      // 优化输出
      compact: true,
      // 移除不必要的代码
      generatedCode: {
        preset: 'es2015',
        arrowFunctions: true,
        constBindings: true,
      },
    },
    {
      file: 'dist/tree-processor.esm.js',
      format: 'es',
      name: 'TreeProcessor',
      // 优化输出
      compact: true,
      // 确保 tree-shaking 正常工作
      preserveModules: false,
      // 优化输出代码
      generatedCode: {
        preset: 'es2015',
        arrowFunctions: true,
        constBindings: true,
      },
      exports: 'named',
    },
    {
      file: 'dist/tree-processor.umd.js',
      format: 'umd',
      name: 'TreeProcessor',
      // 优化输出
      compact: true,
      // 优化输出代码
      generatedCode: {
        preset: 'es2015',
        arrowFunctions: true,
        constBindings: true,
      },
      exports: 'named',
    },
  ],
  plugins: [
    resolve({
      browser: true,
      // 只解析必要的模块
      preferBuiltins: false,
    }),
    commonjs({
      // 优化 CommonJS 转换
      transformMixedEsModules: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      // 移除注释
      removeComments: true,
      // 使用 tslib 减少代码体积
      importHelpers: true,
    }),
    terser({
      compress: {
        drop_console: false,
        drop_debugger: true,
        // 移除未使用的代码
        dead_code: true,
        // 移除未使用的变量
        unused: true,
        // 移除未使用的函数参数
        keep_fargs: false,
        // 移除未使用的函数名
        keep_fnames: false,
      },
      mangle: {
        reserved: ['TreeProcessor'],
      },
      format: {
        // 移除注释
        comments: false,
        // 移除不必要的分号
        semicolons: false,
      },
    }),
    // 打包体积分析插件
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // 可选: 'treemap', 'sunburst', 'network'
    }),
  ],
};
