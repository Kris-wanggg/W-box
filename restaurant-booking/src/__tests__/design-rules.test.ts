import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Enforces the rules in CLAUDE.md against the source tree.
 *
 * These are the "設計規範" checks — they fail if a component drifts away from
 * the design system (invents a hex colour, uses inline CSS, drops semantic
 * tags, or ships a control with no interaction states).
 */

// `import.meta.url` is not a file: URL under the jsdom environment, so resolve
// from the Vitest root instead.
const srcDir = join(process.cwd(), 'src');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : walk(full);
    }
    return /\.(tsx?|css)$/.test(entry) ? [full] : [];
  });
}

const allFiles = walk(srcDir);
const componentFiles = allFiles.filter((f) => f.endsWith('.tsx'));
const rel = (f: string) => relative(srcDir, f);

describe('色彩 Token 映射 — 嚴禁自行發明 #HEX 色碼', () => {
  it.each(componentFiles.map((f) => [rel(f), f]))(
    '%s 不含硬編碼的顏色值',
    (_name, file) => {
      const source = readFileSync(file, 'utf8');
      const hexes = source.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
      // `#A20260808-018` style reservation IDs are content, not colour.
      const colourHexes = hexes.filter((h) => /^#[0-9a-fA-F]{3,8}$/.test(h));
      expect(colourHexes, `硬編碼色碼: ${colourHexes.join(', ')}`).toEqual([]);
    },
  );

  it.each(componentFiles.map((f) => [rel(f), f]))(
    '%s 不含 rgb()/rgba()/hsl() 字面值',
    (_name, file) => {
      const source = readFileSync(file, 'utf8');
      const fns = source.match(/\b(rgba?|hsla?)\(/g) ?? [];
      expect(fns, `色彩函式字面值: ${fns.join(', ')}`).toEqual([]);
    },
  );

  it('所有 token 都定義在 tokens.css 的 :root 與 .dark 兩個模式', () => {
    const tokens = readFileSync(join(srcDir, 'tokens.css'), 'utf8');
    const [, rootBlock = ''] = tokens.match(/:root\s*\{([\s\S]*?)\}/) ?? [];
    const [, darkBlock = ''] = tokens.match(/\.dark\s*\{([\s\S]*?)\}/) ?? [];

    const names = (block: string) =>
      (block.match(/--color-[\w-]+/g) ?? []).sort();

    expect(names(rootBlock).length).toBeGreaterThan(0);
    expect(names(darkBlock)).toEqual(names(rootBlock));
  });
});

describe('樣式 — 嚴格不使用原生內聯 CSS', () => {
  it.each(componentFiles.map((f) => [rel(f), f]))(
    '%s 不使用 style={{ }} 內聯樣式',
    (_name, file) => {
      const source = readFileSync(file, 'utf8');
      expect(source).not.toMatch(/\sstyle=\{\{/);
    },
  );
});

describe('間距與排版 — 卡片與容器需具備響應式佈局', () => {
  it.each(
    componentFiles
      .filter((f) => /screens\//.test(f))
      .map((f) => [rel(f), f]),
  )('%s 使用 md: 斷點做響應式佈局', (_name, file) => {
    const source = readFileSync(file, 'utf8');
    expect(source).toMatch(/\bmd:/);
  });
});

describe('檢查清單 — 語意化標籤必須正確', () => {
  it('Navbar 使用 <header> 與 <nav>', () => {
    const source = readFileSync(join(srcDir, 'components/Navbar.tsx'), 'utf8');
    expect(source).toMatch(/<header/);
    expect(source).toMatch(/<nav/);
  });

  it('Footer 使用 <footer>', () => {
    const source = readFileSync(join(srcDir, 'components/Footer.tsx'), 'utf8');
    expect(source).toMatch(/<footer/);
  });

  it.each(
    componentFiles
      .filter((f) => /screens\//.test(f))
      .map((f) => [rel(f), f]),
  )('%s 使用 <main> 包裹主要內容', (_name, file) => {
    const source = readFileSync(file, 'utf8');
    expect(source).toMatch(/<main/);
  });
});

describe('檢查清單 — UI 必須具備豐富的互動狀態', () => {
  it('Button 定義 hover / active / focus / disabled 樣式', () => {
    const source = readFileSync(join(srcDir, 'components/ui/Button.tsx'), 'utf8');
    for (const state of ['hover:', 'active:', 'focus-visible:', 'disabled:']) {
      expect(source, `Button 缺少 ${state} 狀態`).toContain(state);
    }
  });

  it.each(
    componentFiles
      .filter((f) => !/main\.tsx$/.test(f))
      .map((f) => [rel(f), f]),
  )('%s 中的每個 <button> 都有 hover 或 focus 狀態', (_name, file) => {
    const source = readFileSync(file, 'utf8');
    if (!source.includes('<button')) return;
    expect(source).toMatch(/hover:|focus-visible:/);
  });
});
