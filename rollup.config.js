import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import { nodeExternals } from 'rollup-plugin-node-externals';

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
    // 性能优化：排除 node_modules，减少打包体积和构建时间
    nodeExternals({
      deps: true,
      devDeps: false,
      peerDeps: true,
    }),
    resolve({
      browser: true,
      // 只解析必要的模块
      preferBuiltins: false,
      // 性能优化：只解析实际使用的模块
      modulesOnly: true,
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
      // 排除测试文件，不生成类型定义
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/test-*.ts'],
      // 明确指定输出到文件系统，消除警告
      outputToFilesystem: true,
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
        // 更激进的优化选项
        passes: 2, // 多次压缩以获得更好的效果
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除这些函数调用
        collapse_vars: true, // 合并变量
        reduce_vars: true, // 减少变量
        reduce_funcs: true, // 减少函数
        inline: 2, // 内联函数
        join_vars: true, // 合并变量声明
        sequences: true, // 合并语句序列
        properties: true, // 优化属性访问
        evaluate: true, // 计算常量表达式
        booleans: true, // 优化布尔值
        typeofs: true, // 优化 typeof
        loops: true, // 优化循环
        if_return: true, // 优化 if-return
        conditionals: true, // 优化条件表达式
        comparisons: true, // 优化比较
        unsafe: false, // 不使用不安全的优化
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
      },
      mangle: {
        reserved: ['TreeProcessor'],
        properties: false, // 不混淆属性名，保持 API 兼容性
      },
      format: {
        // 移除注释
        comments: false,
        // 移除不必要的分号
        semicolons: false,
        // 移除不必要的空格
        beautify: false,
        // 尽可能压缩
        max_line_len: 0,
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
