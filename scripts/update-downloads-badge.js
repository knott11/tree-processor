import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 计算近两个月的日期范围
function getTwoMonthsRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 2);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

// 获取近两个月的下载量
async function getTwoMonthsDownloads(packageName) {
  const { start, end } = getTwoMonthsRange();
  const url = `https://api.npmjs.org/downloads/range/${start}:${end}/${packageName}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.downloads && Array.isArray(data.downloads)) {
      const total = data.downloads.reduce((sum, day) => sum + day.downloads, 0);
      return total;
    }
    
    return 0;
  } catch (error) {
    console.error('获取下载量失败:', error);
    return null;
  }
}

// 更新 README 中的下载量徽章
function updateBadgeInReadme(filePath, packageName, downloads) {
  const content = readFileSync(filePath, 'utf-8');
  
  // 格式化下载量：如果超过 1000，使用 K 单位；如果超过 1000000，使用 M 单位
  let formattedDownloads = downloads.toLocaleString();
  if (downloads >= 1000000) {
    formattedDownloads = `${(downloads / 1000000).toFixed(1)}M`;
  } else if (downloads >= 1000) {
    formattedDownloads = `${(downloads / 1000).toFixed(1)}K`;
  }
  
  // 使用 shields.io 的自定义徽章，显示近两个月的下载量
  // 由于 shields.io 的 npm downloads 徽章不支持两个月，我们使用自定义徽章
  const badgeUrl = `https://img.shields.io/badge/downloads-${encodeURIComponent(formattedDownloads)}-brightgreen?style=flat-square&label=2mo`;
  
  // 替换现有的 downloads 徽章
  const newBadge = `![npm downloads (2 months)](${badgeUrl})`;
  
  // 匹配现有的 downloads 徽章行
  const badgePattern = /!\[npm downloads[^\]]*\]\([^)]+\)/;
  
  if (badgePattern.test(content)) {
    const updated = content.replace(badgePattern, newBadge);
    writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ 已更新 ${filePath} 中的下载量徽章`);
    return true;
  } else {
    console.warn(`⚠️  未找到 downloads 徽章 in ${filePath}`);
    return false;
  }
}

// 主函数
async function main() {
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const packageName = packageJson.name;
  
  console.log(`📦 获取 ${packageName} 近两个月的下载量...`);
  
  const downloads = await getTwoMonthsDownloads(packageName);
  
  if (downloads === null) {
    console.error('❌ 无法获取下载量，跳过更新');
    process.exit(1);
  }
  
  console.log(`📊 近两个月下载量: ${downloads.toLocaleString()}`);
  
  // 更新中英文 README
  const readmePath = join(rootDir, 'README.md');
  const readmeEnPath = join(rootDir, 'README.en.md');
  
  updateBadgeInReadme(readmePath, packageName, downloads);
  updateBadgeInReadme(readmeEnPath, packageName, downloads);
  
  console.log('✅ 下载量徽章更新完成');
}

main().catch((error) => {
  console.error('❌ 更新失败:', error);
  process.exit(1);
});
