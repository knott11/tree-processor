import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist');

const files = [
  'tree-processor.cjs.js',
  'tree-processor.esm.js',
  'tree-processor.umd.js',
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

console.log('\n📦 打包体积统计\n');
console.log('─'.repeat(60));

let totalSize = 0;
const results = [];

files.forEach((file) => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    const stats = readFileSync(filePath);
    const size = stats.length;
    totalSize += size;
    results.push({
      file,
      size,
      formatted: formatBytes(size),
    });
  } else {
    console.log(`⚠️  文件不存在: ${file}`);
  }
});

// 按大小排序
results.sort((a, b) => b.size - a.size);

// 显示结果
results.forEach(({ file, formatted, size }) => {
  const barLength = Math.floor((size / results[0].size) * 30);
  const bar = '█'.repeat(barLength);
  console.log(`${file.padEnd(30)} ${formatted.padStart(12)} ${bar}`);
});

console.log('─'.repeat(60));
console.log(`总计: ${formatBytes(totalSize)}`);
console.log(`平均: ${formatBytes(Math.round(totalSize / results.length))}`);
console.log('\n💡 提示: 运行 npm run build 后查看 dist/stats.html 获取详细分析\n');
