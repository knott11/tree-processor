import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcPath = join(__dirname, '..', 'src');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

console.log('\n📝 源码体积统计\n');
console.log('─'.repeat(60));

let totalSize = 0;
const results = [];

if (!existsSync(srcPath)) {
  console.log(`⚠️  目录不存在: ${srcPath}`);
  process.exit(1);
}

const allFiles = getAllFiles(srcPath);

allFiles.forEach((filePath) => {
  if (existsSync(filePath)) {
    const stats = readFileSync(filePath);
    const size = stats.length;
    totalSize += size;
    const relativePath = filePath.replace(srcPath + '\\', '').replace(srcPath + '/', '');
    results.push({
      file: relativePath,
      size,
      formatted: formatBytes(size),
    });
  }
});

// 按大小排序
results.sort((a, b) => b.size - a.size);

// 显示结果
results.forEach(({ file, formatted, size }) => {
  const barLength = results.length > 0 && results[0].size > 0 
    ? Math.floor((size / results[0].size) * 30) 
    : 0;
  const bar = '█'.repeat(barLength);
  console.log(`${file.padEnd(30)} ${formatted.padStart(12)} ${bar}`);
});

console.log('─'.repeat(60));
console.log(`总计: ${formatBytes(totalSize)}`);
if (results.length > 0) {
  console.log(`平均: ${formatBytes(Math.round(totalSize / results.length))}`);
  console.log(`文件数: ${results.length}`);
}
console.log('\n💡 提示: 运行 npm run build 后查看打包后的体积\n');
