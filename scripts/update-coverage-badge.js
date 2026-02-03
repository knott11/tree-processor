/**
 * 更新覆盖率徽章脚本
 * 从覆盖率报告中提取数据，更新 README 中的徽章
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const coverageJsonPath = join(rootDir, 'coverage', 'coverage-final.json');
const readmePath = join(rootDir, 'README.md');
const readmeEnPath = join(rootDir, 'README.en.md');

/**
 * 从覆盖率 JSON 文件中提取覆盖率数据
 */
function getCoverageData() {
  try {
    const coverageData = JSON.parse(readFileSync(coverageJsonPath, 'utf-8'));
    
    // 查找 src/index.ts 的覆盖率数据
    // 路径可能是绝对路径，需要匹配
    let indexCoverage = null;
    const allKeys = Object.keys(coverageData);
    
    // 查找包含 index.ts 的键
    for (const key of allKeys) {
      // 检查是否包含 src/index.ts（不区分大小写，处理不同路径格式）
      const normalizedKey = key.replace(/\\/g, '/').toLowerCase();
      if (normalizedKey.includes('src/index.ts') || 
          normalizedKey.endsWith('src/index.ts') ||
          (normalizedKey.includes('index.ts') && normalizedKey.includes('src'))) {
        indexCoverage = coverageData[key];
        console.log(`✅ 找到覆盖率数据: ${key}`);
        break;
      }
    }
    
    if (!indexCoverage) {
      console.warn('⚠️  未找到 src/index.ts 的覆盖率数据');
      console.log('📋 可用的文件键（前5个）:');
      allKeys.slice(0, 5).forEach(k => console.log(`   ${k}`));
      return null;
    }

    // 计算覆盖率百分比
    const statements = indexCoverage.s;
    const branches = indexCoverage.b;
    const functions = indexCoverage.f;
    const lines = indexCoverage.l;

    const statementCoverage = calculatePercentage(statements);
    const branchCoverage = calculatePercentage(branches);
    const functionCoverage = calculatePercentage(functions);
    const lineCoverage = calculatePercentage(lines);

    // 使用语句覆盖率作为主要指标（也可以使用平均值）
    const overallCoverage = Math.round(statementCoverage);

    return {
      statements: statementCoverage,
      branches: branchCoverage,
      functions: functionCoverage,
      lines: lineCoverage,
      overall: overallCoverage,
    };
  } catch (error) {
    console.error('❌ 读取覆盖率数据失败:', error.message);
    return null;
  }
}

/**
 * 计算覆盖率百分比
 * Vitest 的覆盖率数据格式：
 * - s: 语句执行次数映射 { "line:col": count }
 * - b: 分支执行次数映射 { "branchId": count }
 * - f: 函数执行次数映射 { "functionId": count }
 * - l: 行执行次数映射 { "line": count }
 * 
 * 覆盖率 = (执行次数 > 0 的项数) / (总项数) * 100
 */
function calculatePercentage(coverageObj) {
  if (!coverageObj || typeof coverageObj !== 'object') {
    return 0;
  }

  const entries = Object.entries(coverageObj);
  if (entries.length === 0) return 0;

  // 统计被覆盖的项（执行次数 > 0）
  const covered = entries.filter(([_, count]) => {
    // count 可能是数字或对象（对于分支，可能是数组）
    if (typeof count === 'number') {
      return count > 0;
    }
    if (Array.isArray(count)) {
      // 分支数据可能是数组，检查是否有任何分支被执行
      return count.some(c => typeof c === 'number' && c > 0);
    }
    return false;
  }).length;

  const percentage = (covered / entries.length) * 100;
  return Math.round(percentage * 100) / 100; // 保留两位小数
}

/**
 * 获取徽章颜色
 */
function getBadgeColor(coverage) {
  if (coverage >= 99) return 'brightgreen';
  if (coverage >= 90) return 'green';
  if (coverage >= 80) return 'yellowgreen';
  if (coverage >= 70) return 'yellow';
  if (coverage >= 60) return 'orange';
  return 'red';
}

/**
 * 更新 README 中的徽章
 */
function updateBadge(filePath, coverage) {
  const content = readFileSync(filePath, 'utf-8');
  
  // 匹配覆盖率徽章（支持多种格式）
  const badgeRegex = /!\[coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-[\d.]+%25-[a-z]+[^)]*\)/;
  
  const badgeUrl = `https://img.shields.io/badge/coverage-${coverage.overall}%25-${getBadgeColor(coverage.overall)}?style=flat-square`;
  const newBadge = `![coverage](${badgeUrl})`;
  
  if (badgeRegex.test(content)) {
    const updated = content.replace(badgeRegex, newBadge);
    writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ 已更新 ${filePath} 中的覆盖率徽章: ${coverage.overall}%`);
    return true;
  } else {
    console.warn(`⚠️  未找到覆盖率徽章 in ${filePath}`);
    return false;
  }
}

/**
 * 从 Vitest 输出中解析覆盖率百分比
 */
function parseCoverageFromOutput(output) {
  // 查找 index.ts 的覆盖率行
  // 格式: index.ts |      99 |    98.41 |     100 |   98.99 | 437,1103,1117,1185
  const lines = output.split('\n');
  for (const line of lines) {
    // 查找包含 index.ts 且包含 | 符号的行（表格行）
    if (line.includes('index.ts') && line.includes('|')) {
      // 提取百分比数字，使用更灵活的正则
      // 匹配格式: index.ts | 数字 | 数字 | 数字 | 数字 |
      const parts = line.split('|').map(p => p.trim()).filter(p => p);
      if (parts.length >= 5) {
        // parts[0] 是文件名，parts[1-4] 是四个覆盖率百分比
        const statements = parseFloat(parts[1]);
        const branches = parseFloat(parts[2]);
        const functions = parseFloat(parts[3]);
        const lines = parseFloat(parts[4]);
        
        if (!isNaN(statements) && !isNaN(branches) && !isNaN(functions) && !isNaN(lines)) {
          return {
            statements,
            branches,
            functions,
            lines,
          };
        }
      }
    }
  }
  return null;
}

/**
 * 主函数
 */
function main() {
  // 检查是否在 CI 环境中
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  
  console.log('📊 正在计算覆盖率...');
  
  // 运行测试覆盖率并捕获输出
  // 注意：如果是从 ci 命令调用的，test:coverage 应该已经运行过了
  // 检查覆盖率文件是否存在，如果存在则直接读取，否则运行测试
  let coverageOutput = '';
  const coverageExists = existsSync(coverageJsonPath);
  
  if (!coverageExists) {
    console.log('⚠️  覆盖率文件不存在，将自动运行 test:coverage...');
    try {
      console.log('🧪 运行测试覆盖率...');
      const output = execSync('npm run test:coverage', { 
        encoding: 'utf-8',
        cwd: rootDir,
        // 在 CI 环境中，不显示所有输出以减少日志
        stdio: isCI ? 'pipe' : 'inherit'
      });
      coverageOutput = output;
      // 显示输出（但不显示所有内容）
      const lines = output.split('\n');
      const coverageStart = lines.findIndex(l => l.includes('Coverage report'));
      if (coverageStart >= 0) {
        console.log(lines.slice(coverageStart, coverageStart + 5).join('\n'));
      }
    } catch (error) {
      console.error('❌ 运行测试覆盖率失败:', error.message);
      // 在 CI 环境中，输出完整错误信息
      if (isCI && error.stdout) {
        console.error('错误输出:', error.stdout);
      }
      process.exit(1);
    }
  } else {
    console.log('✅ 使用已存在的覆盖率报告...');
  }

  // 首先尝试从输出中解析
  let coverage = parseCoverageFromOutput(coverageOutput);
  
  // 如果解析失败，尝试从 JSON 文件读取
  if (!coverage) {
    console.log('📄 从覆盖率 JSON 文件读取...');
    const coverageData = getCoverageData();
    if (coverageData) {
      coverage = {
        statements: coverageData.statements,
        branches: coverageData.branches,
        functions: coverageData.functions,
        lines: coverageData.lines,
      };
    }
  }
  
  if (!coverage) {
    console.error('❌ 无法获取覆盖率数据');
    process.exit(1);
  }

  // 使用语句覆盖率作为主要指标（也可以使用平均值）
  const overallCoverage = Math.round(coverage.statements);

  console.log('\n📈 覆盖率数据:');
  console.log(`   语句覆盖率: ${coverage.statements}%`);
  console.log(`   分支覆盖率: ${coverage.branches}%`);
  console.log(`   函数覆盖率: ${coverage.functions}%`);
  console.log(`   行覆盖率: ${coverage.lines}%`);
  console.log(`   总体覆盖率（用于徽章）: ${overallCoverage}%`);

  // 更新徽章
  console.log('\n🔄 更新徽章...');
  updateBadge(readmePath, { ...coverage, overall: overallCoverage });
  updateBadge(readmeEnPath, { ...coverage, overall: overallCoverage });

  console.log('\n✨ 完成！');
}

main();
