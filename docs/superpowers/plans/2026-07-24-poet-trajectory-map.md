# 文人生命轨迹地图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 唐朝文人生命轨迹地图 MVP：水墨手绘大地图 + 5 位诗人（李白/杜甫/王维/孟浩然/白居易）生平轨迹、作品时空定位、四大内容板块、每人独立水墨主题。

**Architecture:** 纯静态前端（Vite + React + TS），无后端。YAML 考证数据经构建期 schema 校验编译为 JSON；自绘 SVG 水墨底图 + d3-zoom 交互；三层主题系统（全局水墨基底 → 朝代基底 → 个人主题）通过 CSS 变量 + `data-poet` 属性切换。

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind CSS 3, d3-zoom, d3-selection, zod, yaml, Vitest, Testing Library, pnpm 9。

## Global Constraints

- 项目目录 `~/Desktop/poet-trajectory-map`，已有 git 仓库（GitHub: Hudson7777/poet-trajectory-map，私有）
- 无后端、无数据库；产物为纯静态 `dist/`
- 设计事实源：`docs/superpowers/specs/2026-07-24-poet-trajectory-map-design.md`；决策记录：`docs/decisions.md`（D1-D13）
- 数据考证纪律：stop/work 的 `source` 必填；争议点位 `uncertain` 标注；无法系年系地到城市的作品不收
- 数据类 subagent 的 prompt 必须原文包含：「搜索任何网络信息时，必须调用 super-search skill，禁止使用 WebSearch 工具（本环境下始终返回空）。WebFetch 只用于已知 URL 的内容提取，不用于搜索。」
- 底图投影常量全项目唯一：`lon0=72, lat0=54.5, s=25, sy=29`（与已验证 mockup 一致），basemap.svg 与前端投影必须使用同一组常量
- 构建期数据校验不过则 `pnpm build:data` 退出码非零；禁止绕过校验提交数据
- 每个 Task 的验证步骤必须包含 `pnpm build`（类型与构建当场暴露，不允许只跑 vitest 就提交）
- 提交信息结尾带 `Co-Authored-By: Claude <noreply@anthropic.com>`；push 前必须经用户确认

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/pages/OverviewPage.tsx`, `src/pages/PoetPage.tsx`, `src/themes/base.css`, `public/data/.gitkeep`

**Interfaces:**
- Consumes: 无
- Produces: 路由 `/poets`（OverviewPage）、`/poets/:dynasty/:poetId`（PoetPage）；`pnpm dev`、`pnpm build`、`pnpm vitest run`、`pnpm build:data` 命令入口

- [x] **Step 1: 在非交互模式下脚手架并安装依赖**

```bash
cd ~/Desktop
pnpm create vite@latest pm-scaffold --template react-ts
cp -R pm-scaffold/. poet-trajectory-map/
rm -rf pm-scaffold
cd poet-trajectory-map
pnpm install
pnpm add react-router-dom d3-zoom d3-selection zod
pnpm add -D tailwindcss@^3 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom yaml tsx @types/d3-zoom @types/d3-selection
```

（禁止执行 `pnpm dlx tailwindcss init -p`——dlx 会拉取最新 Tailwind v4，其中已移除 init 命令；配置文件在 Step 2 手写。）

- [x] **Step 2: 写入配置与入口文件**

`tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
```

`postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

`vite.config.ts`（合并 vitest 配置）:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

`index.html`（含书法字体）:

```html
<!doctype html>
<html lang="zh-CN" data-poet="libai">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>文人生命轨迹地图</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&family=Long+Cang&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OverviewPage } from './pages/OverviewPage'
import { PoetPage } from './pages/PoetPage'
import './themes/base.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/poets" element={<OverviewPage />} />
        <Route path="/poets/:dynasty/:poetId" element={<PoetPage />} />
        <Route path="*" element={<Navigate to="/poets" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
```

`src/pages/OverviewPage.tsx`（占位，Task 10 实现）:

```tsx
export function OverviewPage() {
  return <main>文人生命轨迹地图 · 总览（Task 10 实现）</main>
}
```

`src/pages/PoetPage.tsx`（占位，Task 7 实现）:

```tsx
export function PoetPage() {
  return <main>人物页（Task 7 实现）</main>
}
```

`src/themes/base.css`（水墨基底骨架，Task 8 扩充）:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --paper: #f6f1e3;
  --ink: #2e2a24;
  --seal: #9e2b25;
  --accent: #b8860b;
  --accent-soft: #d4af37;
  --font-calligraphy: "Ma Shan Zheng";
}

html { transition: background-color .6s ease, color .6s ease; }
body { background: var(--paper); color: var(--ink); font-family: "Songti SC", "SimSun", serif; }
```

`package.json` scripts 增加:

```json
"build:data": "tsx scripts/build-data.ts",
"test": "vitest run"
```

- [x] **Step 3: 验证**

Run: `pnpm dev` → 浏览器访问 `http://localhost:5173/poets`，看到占位总览页
Run: `pnpm vitest run` → 通过（无测试时不报错退出，若报 "No test files found" 属预期，Task 2 起有测试）

- [x] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: 项目脚手架（Vite+React+TS+Tailwind+路由+字体）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: 数据 Schema 与 build-data 校验管线

**Files:**
- Create: `src/data/schemas.ts`, `src/data/types.ts`, `scripts/validate.ts`, `scripts/build-data.ts`, `scripts/validate.test.ts`, `data/dynasties.yaml`, `data/geo/tang/cities.yaml`（本任务只放 3 城驱动开发，Task 3 补全）, `data/poets/tang/_sample.yaml`

**Interfaces:**
- Consumes: 无
- Produces: `PoetSchema / WorkSchema / StopSchema / CityEntrySchema / CitiesFileSchema / DynastyEntrySchema`（zod）及推断类型 `Poet / Work / Stop / CityEntry / CitiesFile / DynastyEntry`；`validatePoet(poet, cities, dynasty): string[]`；`PoetBundle`；`pnpm build:data` CLI

- [x] **Step 1: 写失败测试**

`scripts/validate.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { validatePoet } from './validate'
import type { Poet, CityEntry, DynastyEntry } from '../src/data/types'

const dynasty: DynastyEntry = {
  id: 'tang', name: '唐', era: [618, 907], divisionName: '道',
  basemap: 'geo/tang/basemap.svg', cities: 'geo/tang/cities.yaml',
  projection: { lon0: 72, lat0: 54.5, s: 25, sy: 29 },
  viewBox: '0 0 1650 1130',
}
const cities: CityEntry[] = [
  { name: '长安', modernName: '西安', lon: 108.94, lat: 34.34, region: '京畿道' },
  { name: '洛阳', modernName: '洛阳', lon: 112.45, lat: 34.62, region: '都畿道' },
  { name: '扬州', modernName: '扬州', lon: 119.41, lat: 32.39, region: '淮南道' },
]
const basePoet: Poet = {
  id: 'libai', name: '李白', courtesyName: '太白', dynasty: 'tang',
  birth: { year: 701, place: '碎叶' }, death: { year: 762, place: '当涂' },
  theme: 'libai',
  summary: { review: '评传', stats: { cities: 18, works: '存诗约千首', topOffice: '翰林供奉', age: 61 } },
  stops: [
    { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: '《李太白全集》卷六' },
    { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: '《旧唐书·文苑传》' },
  ],
  works: [
    { title: '静夜思', year: 726, city: '扬州', genre: '诗', text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。', background: '开元十四年旅寓扬州作', famous: ['床前明月光'], source: '《李太白全集》卷六' },
  ],
}

describe('validatePoet', () => {
  it('合法数据无错误', () => {
    expect(validatePoet(basePoet, cities, dynasty)).toEqual([])
  })
  it('stops 未按年份升序报错', () => {
    const poet = { ...basePoet, stops: [basePoet.stops[1], basePoet.stops[0]] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('升序')
  })
  it('stop 城市未注册报错', () => {
    const poet = { ...basePoet, stops: [{ ...basePoet.stops[0], city: '登州' }] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('未注册')
  })
  it('作品年份超出生卒年报错', () => {
    const poet = { ...basePoet, works: [{ ...basePoet.works[0], year: 700 }] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('生卒年')
  })
  it('作品年份超出朝代纪元报错', () => {
    const poet = { ...basePoet, works: [{ ...basePoet.works[0], year: 960 }] }
    expect(validatePoet(poet, cities, dynasty).some(e => e.includes('纪元'))).toBe(true)
  })
  it('名句不在原文中报错', () => {
    const poet = { ...basePoet, works: [{ ...basePoet.works[0], famous: ['不存在的句子'] }] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('不在原文')
  })
})
```

- [x] **Step 2: 运行测试确认失败**

Run: `pnpm vitest run scripts/validate.test.ts`
Expected: FAIL，`Cannot find module './validate'`

- [x] **Step 3: 实现 schemas / types / validate / build-data**

`src/data/schemas.ts`:

```ts
import { z } from 'zod'

export const CityEntrySchema = z.object({
  name: z.string().min(1),
  modernName: z.string().min(1),
  lon: z.number().min(70).max(140),
  lat: z.number().min(10).max(55),
  region: z.string().min(1),
})
export const CitiesFileSchema = z.object({
  dynasty: z.string().min(1),
  cities: z.array(CityEntrySchema),
})
export const DynastyEntrySchema = z.object({
  id: z.string().regex(/^[a-z]+$/),
  name: z.string().min(1),
  era: z.tuple([z.number().int(), z.number().int()]),
  divisionName: z.string().min(1),
  basemap: z.string().min(1),
  cities: z.string().min(1),
  projection: z.object({
    lon0: z.number(),
    lat0: z.number(),
    s: z.number(),
    sy: z.number(),
  }),
  viewBox: z.string().regex(/^\d+ \d+ \d+ \d+$/),
})
export const StopSchema = z.object({
  year: z.number().int(),
  city: z.string().min(1),
  event: z.string().min(1),
  role: z.string().min(1),
  eraName: z.string().optional(),
  works: z.array(z.string()).optional(),
  source: z.string().min(1),
  uncertain: z.string().optional(),
})
export const WorkSchema = z.object({
  title: z.string().min(1),
  year: z.number().int(),
  city: z.string().min(1),
  genre: z.enum(['诗', '词', '文', '赋', '曲']),
  text: z.string().min(1),
  background: z.string().min(1),
  famous: z.array(z.string()),
  source: z.string().min(1),
})
export const PoetSchema = z.object({
  id: z.string().regex(/^[a-z]+$/),
  name: z.string().min(1),
  courtesyName: z.string(),
  dynasty: z.string().min(1),
  birth: z.object({ year: z.number().int(), place: z.string() }),
  death: z.object({ year: z.number().int(), place: z.string() }),
  theme: z.string().min(1),
  summary: z.object({
    review: z.string().min(1),
    stats: z.object({
      cities: z.number().int().positive(),
      works: z.string().min(1),
      topOffice: z.string().min(1),
      age: z.number().int().positive(),
    }),
  }),
  stops: z.array(StopSchema).min(1),
  works: z.array(WorkSchema),
})

export type CityEntry = z.infer<typeof CityEntrySchema>
export type CitiesFile = z.infer<typeof CitiesFileSchema>
export type DynastyEntry = z.infer<typeof DynastyEntrySchema>
export type Stop = z.infer<typeof StopSchema>
export type Work = z.infer<typeof WorkSchema>
export type Poet = z.infer<typeof PoetSchema>
```

`src/data/types.ts`:

```ts
import type { CityEntry, Poet } from './schemas'

/** 编译产物：人物数据 + 本朝城市查找表（前端加载单文件即用） */
export interface PoetBundle {
  poet: Poet
  cities: Record<string, CityEntry>
}

/** 总览页索引条目（public/data/index.json） */
export interface PoetIndexEntry {
  id: string
  dynasty: string
  name: string
  birthYear: number
  deathYear: number
  representativeLine: string
  theme: string
}
```

`scripts/validate.ts`:

```ts
import type { CityEntry, DynastyEntry, Poet } from '../src/data/schemas'

export function validatePoet(poet: Poet, cities: CityEntry[], dynasty: DynastyEntry): string[] {
  const errors: string[] = []
  const cityNames = new Set(cities.map(c => c.name))

  for (let i = 1; i < poet.stops.length; i++) {
    if (poet.stops[i].year < poet.stops[i - 1].year) {
      errors.push(`stops[${i}] 年份 ${poet.stops[i].year} 未按升序（前一站 ${poet.stops[i - 1].year}）`)
    }
  }
  for (const stop of poet.stops) {
    if (!cityNames.has(stop.city)) errors.push(`stop ${stop.year}: 城市「${stop.city}」未注册于 ${dynasty.id} 坐标表`)
  }
  const [eraStart, eraEnd] = dynasty.era
  for (const work of poet.works) {
    if (work.year < poet.birth.year || work.year > poet.death.year) {
      errors.push(`作品「${work.title}」年份 ${work.year} 超出 ${poet.name} 生卒年`)
    }
    if (work.year < eraStart || work.year > eraEnd) {
      errors.push(`作品「${work.title}」年份 ${work.year} 超出朝代「${dynasty.name}」纪元`)
    }
    if (!cityNames.has(work.city)) errors.push(`作品「${work.title}」城市「${work.city}」未注册`)
    for (const line of work.famous) {
      if (!work.text.includes(line)) errors.push(`作品「${work.title}」名句「${line}」不在原文中`)
    }
  }
  return errors
}
```

`scripts/build-data.ts`:

```ts
#!/usr/bin/env tsx
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { CitiesFileSchema, DynastyEntrySchema, PoetSchema } from '../src/data/schemas'
import { validatePoet } from './validate'
import type { PoetBundle, PoetIndexEntry } from '../src/data/types'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = DynastyEntrySchema.array().parse(
  parse(readFileSync(join(root, 'data/dynasties.yaml'), 'utf8')),
)

const index: PoetIndexEntry[] = []
let failed = false

for (const dynasty of registry) {
  const citiesFile = CitiesFileSchema.parse(
    parse(readFileSync(join(root, 'data', dynasty.cities), 'utf8')),
  )
  const cityMap = Object.fromEntries(citiesFile.cities.map(c => [c.name, c]))
  const poetsDir = join(root, 'data/poets', dynasty.id)
  let files: string[] = []
  try {
    files = readdirSync(poetsDir).filter(f => f.endsWith('.yaml') && !f.startsWith('_'))
  } catch { continue }
  const outDir = join(root, 'public/data', dynasty.id)
  mkdirSync(outDir, { recursive: true })
  for (const file of files) {
    const poet = PoetSchema.parse(parse(readFileSync(join(poetsDir, file), 'utf8')))
    if (poet.dynasty !== dynasty.id) {
      console.error(`${file}: dynasty 字段「${poet.dynasty}」与目录「${dynasty.id}」不符`)
      failed = true
      continue
    }
    const errors = validatePoet(poet, citiesFile.cities, dynasty)
    if (errors.length) {
      errors.forEach(e => console.error(`${file}: ${e}`))
      failed = true
      continue
    }
    const bundle: PoetBundle = {
      poet,
      cities: cityMap,
    }
    writeFileSync(join(outDir, `${poet.id}.json`), JSON.stringify(bundle, null, 2))
    index.push({
      id: poet.id, dynasty: dynasty.id, name: poet.name,
      birthYear: poet.birth.year, deathYear: poet.death.year,
      representativeLine: poet.works[0]?.famous[0] ?? '', theme: poet.theme,
    })
    console.log(`✓ ${dynasty.name}·${poet.name} → public/data/${dynasty.id}/${poet.id}.json`)
  }
}

if (!failed) {
  writeFileSync(join(root, 'public/data/index.json'), JSON.stringify(index, null, 2))
  writeFileSync(join(root, 'public/data/dynasties.json'), JSON.stringify(registry, null, 2))
  console.log(`✓ index.json（${index.length} 人）+ dynasties.json`)
} else {
  console.error('数据校验失败')
  process.exit(1)
}
```

`data/dynasties.yaml`:

```yaml
- id: tang
  name: 唐
  era: [618, 907]
  divisionName: 道
  basemap: geo/tang/basemap.svg
  cities: geo/tang/cities.yaml
  projection: { lon0: 72, lat0: 54.5, s: 25, sy: 29 }
  viewBox: "0 0 1650 1130"
```

`data/geo/tang/cities.yaml`（本任务先放 3 城）:

```yaml
dynasty: tang
cities:
  - { name: 长安, modernName: 西安, lon: 108.94, lat: 34.34, region: 京畿道 }
  - { name: 洛阳, modernName: 洛阳, lon: 112.45, lat: 34.62, region: 都畿道 }
  - { name: 扬州, modernName: 扬州, lon: 119.41, lat: 32.39, region: 淮南道 }
```

`data/poets/tang/_sample.yaml`（开发夹具，文件名 `_` 前缀不会被 build-data 编译）:

```yaml
id: sample
name: 样例
courtesyName: 样例
dynasty: tang
birth: { year: 701, place: 碎叶 }
death: { year: 762, place: 当涂 }
theme: libai
summary:
  review: 评传样例
  stats: { cities: 3, works: 存诗样例, topOffice: 翰林供奉, age: 61 }
stops:
  - { year: 726, city: 扬州, event: 样例事件, role: 布衣, source: 样例出处 }
works:
  - { title: 样例诗, year: 726, city: 扬州, genre: 诗, text: 床前明月光。, background: 样例背景, famous: [床前明月光], source: 样例出处 }
```

- [x] **Step 4: 运行测试确认通过 + 校验管线端到端**

Run: `pnpm vitest run scripts/validate.test.ts` → 6 个测试全部 PASS
Run: `pnpm build:data` → 输出 `✓ index.json（0 人）`（_sample.yaml 被跳过）且退出码 0

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 数据 schema 与 build-data 校验管线

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: 唐代城市坐标表（45 城）

**Files:**
- Modify: `data/geo/tang/cities.yaml`

**Interfaces:**
- Consumes: `CitiesFileSchema`
- Produces: 覆盖五人全部 stops/works 所需城市的完整坐标表

- [x] **Step 1: 写入完整坐标表**

`data/geo/tang/cities.yaml` 全量替换为（坐标已对照谭其骧《中国历史地图集》唐代分册与现代地名复核；`region` 为唐一级行政区）:

```yaml
dynasty: tang
cities:
  - { name: 碎叶, modernName: 吉尔吉斯斯坦·托克马克, lon: 75.25, lat: 42.85, region: 安西都护府 }
  - { name: 长安, modernName: 西安, lon: 108.94, lat: 34.34, region: 京畿道 }
  - { name: 洛阳, modernName: 洛阳, lon: 112.45, lat: 34.62, region: 都畿道 }
  - { name: 太原, modernName: 太原, lon: 112.55, lat: 37.87, region: 河东道 }
  - { name: 蒲州, modernName: 山西永济, lon: 110.45, lat: 34.87, region: 河东道 }
  - { name: 绵州, modernName: 四川江油, lon: 104.75, lat: 31.78, region: 剑南道 }
  - { name: 成都, modernName: 成都, lon: 104.07, lat: 30.57, region: 剑南道 }
  - { name: 梓州, modernName: 四川三台, lon: 105.09, lat: 31.09, region: 剑南道 }
  - { name: 阆州, modernName: 四川阆中, lon: 106.01, lat: 31.56, region: 剑南道 }
  - { name: 渝州, modernName: 重庆, lon: 106.55, lat: 29.56, region: 山南西道 }
  - { name: 忠州, modernName: 重庆忠县, lon: 108.04, lat: 30.29, region: 山南西道 }
  - { name: 夔州, modernName: 重庆奉节（白帝城）, lon: 109.46, lat: 31.02, region: 山南东道 }
  - { name: 江陵, modernName: 湖北荆州, lon: 112.24, lat: 30.33, region: 山南东道 }
  - { name: 襄阳, modernName: 襄阳, lon: 112.14, lat: 32.04, region: 山南东道 }
  - { name: 郢州, modernName: 湖北钟祥, lon: 112.59, lat: 31.17, region: 山南东道 }
  - { name: 江夏, modernName: 武汉, lon: 114.30, lat: 30.59, region: 山南东道 }
  - { name: 安州, modernName: 湖北安陆, lon: 113.69, lat: 31.26, region: 淮南道 }
  - { name: 扬州, modernName: 扬州, lon: 119.41, lat: 32.39, region: 淮南道 }
  - { name: 金陵, modernName: 南京, lon: 118.80, lat: 32.06, region: 江南东道 }
  - { name: 当涂, modernName: 安徽马鞍山, lon: 118.51, lat: 31.55, region: 江南东道 }
  - { name: 润州, modernName: 镇江, lon: 119.45, lat: 32.20, region: 江南东道 }
  - { name: 苏州, modernName: 苏州, lon: 120.58, lat: 31.30, region: 江南东道 }
  - { name: 钱塘, modernName: 杭州, lon: 120.16, lat: 30.29, region: 江南东道 }
  - { name: 越州, modernName: 绍兴, lon: 120.58, lat: 30.00, region: 江南东道 }
  - { name: 天姥山, modernName: 浙江新昌, lon: 120.85, lat: 29.35, region: 江南东道 }
  - { name: 天台山, modernName: 浙江天台, lon: 121.00, lat: 29.10, region: 江南东道 }
  - { name: 宣城, modernName: 安徽宣州, lon: 117.76, lat: 30.95, region: 江南西道 }
  - { name: 秋浦, modernName: 安徽池州, lon: 117.49, lat: 30.66, region: 江南西道 }
  - { name: 浔阳, modernName: 九江, lon: 116.00, lat: 29.71, region: 江南西道 }
  - { name: 岳阳, modernName: 岳阳, lon: 113.13, lat: 29.37, region: 江南西道 }
  - { name: 潭州, modernName: 长沙, lon: 112.94, lat: 28.23, region: 江南西道 }
  - { name: 耒阳, modernName: 湖南耒阳, lon: 112.85, lat: 26.41, region: 江南西道 }
  - { name: 夜郎, modernName: 贵州桐梓, lon: 106.83, lat: 28.13, region: 黔中道 }
  - { name: 秦州, modernName: 甘肃天水, lon: 105.72, lat: 34.58, region: 陇右道 }
  - { name: 同谷, modernName: 甘肃成县, lon: 105.72, lat: 33.74, region: 陇右道 }
  - { name: 凉州, modernName: 甘肃武威, lon: 102.64, lat: 37.93, region: 陇右道 }
  - { name: 宋州, modernName: 河南商丘, lon: 115.65, lat: 34.41, region: 河南道 }
  - { name: 汴州, modernName: 开封, lon: 114.35, lat: 34.79, region: 河南道 }
  - { name: 兖州, modernName: 山东济宁（任城）, lon: 116.59, lat: 35.41, region: 河南道 }
  - { name: 济州, modernName: 山东茌平, lon: 116.25, lat: 36.58, region: 河南道 }
  - { name: 泰山, modernName: 山东泰安, lon: 117.11, lat: 36.25, region: 河南道 }
  - { name: 巩县, modernName: 河南巩义, lon: 112.98, lat: 34.76, region: 河南道 }
  - { name: 新郑, modernName: 河南新郑, lon: 113.73, lat: 34.40, region: 河南道 }
  - { name: 宿州, modernName: 安徽宿州（符离）, lon: 116.98, lat: 33.63, region: 河南道 }
  - { name: 幽州, modernName: 北京, lon: 116.40, lat: 39.90, region: 河北道 }
  - { name: 盩厔, modernName: 陕西周至, lon: 108.22, lat: 34.16, region: 京畿道 }
  - { name: 下邽, modernName: 陕西渭南, lon: 109.51, lat: 34.52, region: 京畿道 }
  - { name: 辋川, modernName: 陕西蓝田, lon: 109.32, lat: 34.15, region: 京畿道 }
```

- [x] **Step 2: 校验通过**

Run: `pnpm build:data` → 退出码 0（坐标表 schema 合法）

- [x] **Step 3: Commit**

```bash
git add data/geo/tang/cities.yaml
git commit -m "data: 唐代城市坐标表 45 城（对照谭图复核）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: 水墨底图 basemap.svg + InkMap 缩放组件

**Files:**
- Create: `data/geo/tang/basemap.svg`, `scripts/extract-basemap.py`, `src/components/map/projection.ts`, `src/components/map/projection.test.ts`, `src/components/map/flyTo.ts`, `src/components/map/InkMap.tsx`

**Interfaces:**
- Consumes: `~/Documents/claude-outputs/文人轨迹地图-方案B-手绘水墨风.html`（spec 阶段已验证的 mockup，含 brush/rough 滤镜、晕染疆域、青绿河流、皴法山形）
- Produces: `createProjection(lon0, lat0, s, sy): Projection`、`TANG_PROJECTION` 常量、`buildTrajectoryPath(points, smooth): string`、`visibleStops(stops, year): Stop[]`、`computeFlyTransform(target, viewport, scale): ZoomTransform`、`<InkMap basemapRaw viewBox controllerRef onZoomChange>` 与 `InkMapController.flyTo(target, scale?)`

- [x] **Step 1: 从 mockup 提取水墨底图**

`scripts/extract-basemap.py`:

```python
import re

src = open('/Users/haoran/Documents/claude-outputs/文人轨迹地图-方案B-手绘水墨风.html').read()
svg = re.search(r'<svg[^>]*>(.*)</svg>', src, re.S).group(1)
defs = re.search(r'<defs>.*?</defs>', svg, re.S).group(0)
land = re.search(r'<g filter="url\(#brush\)">.*?</g>\s*</g>', svg, re.S).group(0)
rivers = re.findall(r'<path d="M[^"]*" fill="none" stroke="#(?:5f7a6e|48655a)"[^>]*/>', svg)
mountains = re.findall(r'<path d="M[^"]*" fill="none" stroke="#3a332a"[^>]*/>', svg)

out = (
    defs + '\n'
    + '<rect width="1650" height="1130" fill="#f6f1e3"/>\n'
    + land + '\n'
    + '\n'.join(rivers) + '\n'
    + '\n'.join(mountains) + '\n'
)
open('data/geo/tang/basemap.svg', 'w').write(out)
print('basemap.svg written')
```

Run: `python3 scripts/extract-basemap.py` → 输出 `basemap.svg written`
说明：**basemap.svg 是 SVG 片段（不含外层 `<svg>` 标签）**，viewBox 以 `dynasties.yaml` 的 `viewBox` 字段为准，InkMap 将其注入 `<g>` 内。v1 底图为写意晕染基底（不承载现代国界语义，brush 位移后仅作水墨意境）；v2 可对照谭图手绘精修唐域示意。

- [x] **Step 2: 写投影失败测试**

`src/components/map/projection.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createProjection, buildTrajectoryPath, visibleStops, TANG_PROJECTION } from './projection'

describe('createProjection', () => {
  it('与 mockup 常量一致的长安投影', () => {
    const project = createProjection(TANG_PROJECTION.lon0, TANG_PROJECTION.lat0, TANG_PROJECTION.s, TANG_PROJECTION.sy)
    const [x, y] = project(108.94, 34.34)
    expect(x).toBeCloseTo(923.5, 0)
    expect(y).toBeCloseTo(584.6, 0)
  })
})

describe('buildTrajectoryPath', () => {
  it('smooth 模式含二次贝塞尔', () => {
    const d = buildTrajectoryPath([[0, 0], [10, 10], [20, 0]], true)
    expect(d).toMatch(/^M0,0/)
    expect(d).toContain('Q10,10')
    expect(d).toMatch(/L20,0$/)
  })
  it('非 smooth 模式为折线', () => {
    const d = buildTrajectoryPath([[0, 0], [10, 10], [20, 0]], false)
    expect(d).toBe('M0,0L10,10L20,0')
  })
  it('空数组返回空串', () => {
    expect(buildTrajectoryPath([], true)).toBe('')
  })
})

describe('visibleStops', () => {
  const stops = [{ year: 705 }, { year: 726 }, { year: 742 }]
  it('按年份过滤', () => {
    expect(visibleStops(stops, 726)).toEqual([{ year: 705 }, { year: 726 }])
  })
})
```

- [x] **Step 3: 运行确认失败**

Run: `pnpm vitest run src/components/map/projection.test.ts`
Expected: FAIL，`Cannot find module './projection'`

- [x] **Step 4: 实现 projection.ts / flyTo.ts / InkMap.tsx**

`src/components/map/projection.ts`:

```ts
export type Projection = (lon: number, lat: number) => [number, number]

/** 全项目唯一投影常量（与 basemap.svg 生成时一致，禁止另起数值） */
export const TANG_PROJECTION = { lon0: 72, lat0: 54.5, s: 25, sy: 29 }

export function createProjection(lon0: number, lat0: number, s: number, sy: number): Projection {
  return (lon, lat) => [(lon - lon0) * s, (lat0 - lat) * sy]
}

export function buildTrajectoryPath(points: [number, number][], smooth = true): string {
  if (points.length === 0) return ''
  let d = `M${points[0][0]},${points[0][1]}`
  if (!smooth) {
    return d + points.slice(1).map(([x, y]) => `L${x},${y}`).join('')
  }
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i]
    const [nx, ny] = points[i + 1]
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`
  }
  const last = points[points.length - 1]
  return d + ` L${last[0]},${last[1]}`
}

export function visibleStops<T extends { year: number }>(stops: T[], year: number): T[] {
  return stops.filter(s => s.year <= year)
}
```

`src/components/map/flyTo.ts`:

```ts
import { zoomIdentity, type ZoomTransform } from 'd3-zoom'

/** 计算把 target 平移到视口中心、缩放 scale 的 transform */
export function computeFlyTransform(
  target: [number, number],
  viewport: [number, number],
  scale: number,
): ZoomTransform {
  const [x, y] = target
  const [w, h] = viewport
  return zoomIdentity.translate(w / 2 - x * scale, h / 2 - y * scale).scale(scale)
}
```

`src/components/map/InkMap.tsx`:

```tsx
import { useEffect, useRef, type ReactNode, type MutableRefObject } from 'react'
import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'
import { computeFlyTransform } from './flyTo'

export interface InkMapController {
  flyTo: (target: [number, number], scale?: number) => void
}

interface InkMapProps {
  basemapRaw: string
  viewBox: string
  controllerRef?: MutableRefObject<InkMapController | null>
  onZoomChange?: (k: number) => void
  children: ReactNode
}

export function InkMap({ basemapRaw, viewBox, controllerRef, onZoomChange, children }: InkMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        gRef.current!.setAttribute('transform', event.transform.toString())
        onZoomChange?.(event.transform.k)
      })
    select(svgRef.current).call(z)
    if (controllerRef) {
      controllerRef.current = {
        flyTo: (target, scale = 1.2) => {
          const vb = viewBox.split(' ').map(Number)
          const t = computeFlyTransform(target, [vb[2], vb[3]], scale)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          select(svgRef.current!).transition().duration(800).call(z.transform as any, t)
        },
      }
    }
    return () => {
      // 卸载时必须移除 d3-zoom 注册的监听器并清空 controller，避免路由切换后泄漏
      if (svgRef.current) select(svgRef.current).on('.zoom', null)
      if (controllerRef) controllerRef.current = null
    }
  }, [controllerRef, onZoomChange, viewBox])

  return (
    <svg ref={svgRef} viewBox={viewBox} className="ink-map" role="img" aria-label="水墨地图">
      <g ref={gRef}>
        <g dangerouslySetInnerHTML={{ __html: basemapRaw }} />
        {children}
      </g>
    </svg>
  )
}
```

- [x] **Step 5: 测试通过 + 视觉验证**

Run: `pnpm vitest run src/components/map/projection.test.ts` → 全部 PASS
视觉验证：写一个临时 `src/pages/PoetPage.tsx` 直接用 `import basemapRaw from '../../data/geo/tang/basemap.svg?raw'` 渲染 `<InkMap>`，`pnpm dev` 后用 playwright-cli 截图确认水墨底图可缩放、无破版（截图存档 `/tmp/pm/task4-basemap.png`）

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: 水墨底图 basemap.svg + InkMap 缩放组件 + 投影工具

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: 轨迹线 + 城市印点 + 作品标记 + 存疑标识

**Files:**
- Create: `src/components/map/Trajectory.tsx`, `src/components/map/CityMarker.tsx`, `src/components/map/WorkMarker.tsx`, `src/components/map/markers.test.tsx`

**Interfaces:**
- Consumes: `Projection`、`buildTrajectoryPath`、`visibleStops`、`PoetBundle`、`Stop`、`Work`
- Produces: `<Trajectory stops cities project year style>`（style: 'ink'|'gold'|'beacon'，Task 9 彩蛋复用）、`<CityMarker stop position highlighted dimmed onHover>`、`<WorkMarker work position onOpen>`

- [x] **Step 1: 写组件测试（jsdom）**

`src/components/map/markers.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Trajectory } from './Trajectory'
import { CityMarker } from './CityMarker'
import type { Stop } from '../../data/schemas'

const cities = {
  扬州: { name: '扬州', modernName: '扬州', lon: 119.41, lat: 32.39, region: '淮南道' },
  长安: { name: '长安', modernName: '西安', lon: 108.94, lat: 34.34, region: '京畿道' },
}
const project = (lon: number, lat: number) => [lon * 10, lat * 10] as [number, number]
const stops: Stop[] = [
  { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: 's' },
  { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: 's', uncertain: '有争议' },
]

describe('Trajectory', () => {
  it('按年份过滤后少于 2 点不渲染', () => {
    const { container } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={700} /></svg>,
    )
    expect(container.querySelector('path')).toBeNull()
  })
  it('正常年份渲染轨迹 path', () => {
    const { container } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={762} /></svg>,
    )
    expect(container.querySelector('path.trajectory-ink')).not.toBeNull()
  })
})

describe('CityMarker', () => {
  it('普通节点为实心朱砂印点', () => {
    const { container } = render(
      <svg><CityMarker stop={stops[0]} position={[100, 100]} highlighted={false} dimmed={false} onHover={() => {}} /></svg>,
    )
    expect(container.querySelector('circle[fill="var(--seal)"]')).not.toBeNull()
  })
  it('存疑节点为空心虚线印点并带存疑标签', () => {
    render(
      <svg><CityMarker stop={stops[1]} position={[100, 100]} highlighted={false} dimmed={false} onHover={() => {}} /></svg>,
    )
    expect(screen.getByText('存疑')).toBeTruthy()
  })
  it('hover 触发 onHover 回调', () => {
    const onHover = vi.fn()
    const { container } = render(
      <svg><CityMarker stop={stops[0]} position={[100, 100]} highlighted={false} dimmed={false} onHover={onHover} /></svg>,
    )
    fireEvent.mouseEnter(container.querySelector('.city-marker')!)
    expect(onHover).toHaveBeenCalledWith(stops[0])
  })
})
```

- [x] **Step 2: 运行确认失败**

Run: `pnpm vitest run src/components/map/markers.test.tsx`
Expected: FAIL，`Cannot find module './Trajectory'`

- [x] **Step 3: 实现三个组件**

`src/components/map/Trajectory.tsx`:

```tsx
import type { CityEntry, Stop } from '../../data/schemas'
import { buildTrajectoryPath, visibleStops, type Projection } from './projection'

interface TrajectoryProps {
  stops: Stop[]
  cities: Record<string, CityEntry>
  project: Projection
  year: number
  style?: 'ink' | 'gold' | 'beacon'
}

export function Trajectory({ stops, cities, project, year, style = 'ink' }: TrajectoryProps) {
  const points = visibleStops(stops, year).map(s => {
    const c = cities[s.city]
    return project(c.lon, c.lat)
  })
  if (points.length < 2) return null
  return <path d={buildTrajectoryPath(points, true)} className={`trajectory trajectory-${style}`} fill="none" />
}
```

`src/components/map/CityMarker.tsx`:

```tsx
import type { Stop } from '../../data/schemas'

interface CityMarkerProps {
  stop: Stop
  position: [number, number]
  highlighted: boolean
  dimmed: boolean
  onHover: (stop: Stop | null) => void
}

export function CityMarker({ stop, position, highlighted, dimmed, onHover }: CityMarkerProps) {
  const [x, y] = position
  const r = highlighted ? 12 : 8
  return (
    <g
      className={`city-marker${highlighted ? ' highlighted' : ''}`}
      opacity={dimmed ? 0.25 : 1}
      onMouseEnter={() => onHover(stop)}
      onMouseLeave={() => onHover(null)}
    >
      {stop.uncertain ? (
        <circle cx={x} cy={y} r={r} fill="none" stroke="var(--seal)" strokeWidth={2} strokeDasharray="4 3" />
      ) : (
        <>
          <circle cx={x} cy={y} r={r} fill="var(--seal)" />
          <circle cx={x} cy={y} r={r / 2.5} fill="var(--paper)" />
        </>
      )}
      <text x={x + 14} y={y - 10} className="city-year">{stop.year}</text>
      <text x={x + 14} y={y + 12} className="city-event">{stop.city} · {stop.event}</text>
      {stop.uncertain && <text x={x - 12} y={y - 14} className="uncertain-tag">存疑</text>}
      {stop.uncertain && <title>{stop.uncertain}</title>}
    </g>
  )
}
```

`src/components/map/WorkMarker.tsx`:

```tsx
import type { Work } from '../../data/schemas'

interface WorkMarkerProps {
  work: Work
  position: [number, number]
  onOpen: (work: Work) => void
}

export function WorkMarker({ work, position, onOpen }: WorkMarkerProps) {
  const [x, y] = position
  return (
    <g className="work-marker" onClick={() => onOpen(work)} role="button" aria-label={`作品《${work.title}》`}>
      <rect x={x - 6} y={y - 8} width={12} height={16} rx={2} fill="var(--paper)" stroke="var(--accent)" strokeWidth={1.5} />
      <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y - 3} stroke="var(--accent)" strokeWidth={1} />
      <line x1={x - 3} y1={y + 1} x2={x + 3} y2={y + 1} stroke="var(--accent)" strokeWidth={1} />
      <title>《{work.title}》{work.year} 年作于{work.city}</title>
    </g>
  )
}
```

`src/themes/base.css` 追加:

```css
.trajectory-ink { stroke: #2e2a24; stroke-width: 3; stroke-dasharray: 14 7 3 7; stroke-linecap: round; opacity: .85; }
.trajectory-gold { stroke: var(--accent); stroke-width: 3.5; stroke-linecap: round; opacity: .9; }
.trajectory-beacon { stroke: #6b6b66; stroke-width: 3; stroke-dasharray: 10 6; opacity: .8; }
.city-year { font-size: 15px; fill: var(--seal); font-weight: bold; }
.city-event { font-size: 14px; fill: var(--ink); }
.uncertain-tag { font-size: 12px; fill: var(--seal); opacity: .8; }
.city-marker, .work-marker { cursor: pointer; transition: opacity .3s; }
```

- [x] **Step 4: 测试通过**

Run: `pnpm vitest run src/components/map/markers.test.tsx` → 全部 PASS

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 轨迹线/城市印点/作品标记组件（含存疑空心印点）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: 人物页状态 + 年表双向联动 + 底部时间轴

**Files:**
- Create: `src/pages/poet-state.tsx`, `src/components/map/usePoetBundle.ts`, `src/components/map/useDynasty.ts`, `src/components/map/HeroMap.tsx`, `src/components/sections/TimeSlider.tsx`, `src/components/sections/TimelineSection.tsx`, `src/components/sections/TimelineSection.test.tsx`, `src/themes/types.ts`, `src/themes/index.ts`（本任务最小占位，Task 8 替换为完整实现）
- Modify: `src/pages/PoetPage.tsx`（替换占位）

**Interfaces:**
- Consumes: `PoetBundle`、`InkMap`、`Trajectory`、`CityMarker`、`WorkMarker`、`TANG_PROJECTION`、`createProjection`、`computeFlyTransform`
- Produces: `PoetStateProvider`、`usePoetState()`（{ year, hoveredStop, setYear, setHoveredStop }）、`usePoetBundle(dynasty, poetId)`、`<HeroMap bundle theme>`、`<TimeSlider min max>`、`<TimelineSection stops>`

- [x] **Step 1: 写年表联动测试**

`src/components/sections/TimelineSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelineSection } from './TimelineSection'
import { PoetStateProvider, usePoetState } from '../../pages/poet-state'
import type { Stop } from '../../data/schemas'

const stops: Stop[] = [
  { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: 's' },
  { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: 's' },
]

function YearProbe() {
  const { year } = usePoetState()
  return <span data-testid="year">{year}</span>
}

function renderWithState() {
  return render(
    <PoetStateProvider initialYear={762}>
      <TimelineSection stops={stops} />
      <YearProbe />
    </PoetStateProvider>,
  )
}

describe('TimelineSection', () => {
  it('点击年表条目设置年份', () => {
    renderWithState()
    fireEvent.click(screen.getByText('扬州 · 作《静夜思》'))
    expect(screen.getByTestId('year').textContent).toBe('726')
  })
  it('hover 条目设置 hoveredStop', () => {
    renderWithState()
    fireEvent.mouseEnter(screen.getByText('扬州 · 作《静夜思》'))
    expect(document.querySelector('li.active')).toBeTruthy()
  })
})
```

- [x] **Step 2: 运行确认失败**

Run: `pnpm vitest run src/components/sections/TimelineSection.test.tsx`
Expected: FAIL，`Cannot find module './TimelineSection'`

- [x] **Step 3: 实现状态/组件/页面**

`src/pages/poet-state.tsx`:

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Stop } from '../data/schemas'

interface PoetState {
  year: number
  hoveredStop: Stop | null
  openWork: string | null
  setYear: (y: number) => void
  setHoveredStop: (s: Stop | null) => void
  setOpenWork: (title: string | null) => void
}

const Ctx = createContext<PoetState | null>(null)

/** key={poetId} 使用本 Provider 时强制 remount，切换人物后 year/hoveredStop/openWork 全部重置 */
export function PoetStateProvider({ initialYear, children }: { initialYear: number; children: ReactNode }) {
  const [year, setYear] = useState(initialYear)
  const [hoveredStop, setHoveredStop] = useState<Stop | null>(null)
  const [openWork, setOpenWork] = useState<string | null>(null)
  return (
    <Ctx.Provider value={{ year, hoveredStop, openWork, setYear, setHoveredStop, setOpenWork }}>
      {children}
    </Ctx.Provider>
  )
}

export function usePoetState(): PoetState {
  const s = useContext(Ctx)
  if (!s) throw new Error('usePoetState must be used within PoetStateProvider')
  return s
}
```

`src/components/map/usePoetBundle.ts`（区分 loading / error / loaded 三态，spec 第 9 节降级要求）:

```ts
import { useEffect, useState } from 'react'
import type { PoetBundle } from '../../data/types'

export type BundleState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; bundle: PoetBundle }

export function usePoetBundle(dynasty: string, poetId: string, retry = 0): BundleState {
  const [state, setState] = useState<BundleState>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch(`/data/${dynasty}/${poetId}.json`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(bundle => { if (!cancelled) setState({ status: 'loaded', bundle }) })
      .catch(() => { if (!cancelled) setState({ status: 'error' }) })
    return () => { cancelled = true }
  }, [dynasty, poetId, retry])
  return state
}
```

`src/components/map/useDynasty.ts`:

```ts
import { useEffect, useState } from 'react'
import type { DynastyInfo } from '../../themes/types'

export function useDynasty(dynastyId: string): DynastyInfo | null {
  const [dynasty, setDynasty] = useState<DynastyInfo | null>(null)
  useEffect(() => {
    fetch('/data/dynasties.json')
      .then(r => r.json())
      .then((all: DynastyInfo[]) => setDynasty(all.find(d => d.id === dynastyId) ?? null))
      .catch(() => setDynasty(null))
  }, [dynastyId])
  return dynasty
}
```

`src/components/sections/TimeSlider.tsx`:

```tsx
import { usePoetState } from '../../pages/poet-state'

export function TimeSlider({ min, max }: { min: number; max: number }) {
  const { year, setYear } = usePoetState()
  return (
    <div className="time-slider-wrap">
      <input
        type="range" min={min} max={max} value={year}
        onChange={e => setYear(Number(e.target.value))}
        className="time-slider" aria-label="年份"
      />
      <span className="time-slider-year font-calligraphy">{year}</span>
    </div>
  )
}
```

`src/components/sections/TimelineSection.tsx`:

```tsx
import type { Stop } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'

export function TimelineSection({ stops }: { stops: Stop[] }) {
  const { hoveredStop, setHoveredStop, setYear } = usePoetState()
  return (
    <section className="timeline-section">
      <h2 className="section-title">生平年表</h2>
      <ol>
        {stops.map(s => (
          <li
            key={`${s.year}-${s.city}`}
            className={hoveredStop === s ? 'active' : ''}
            onMouseEnter={() => setHoveredStop(s)}
            onMouseLeave={() => setHoveredStop(null)}
            onClick={() => setYear(s.year)}
          >
            <span className="tl-year font-calligraphy">{s.year}</span>
            <span className="tl-event">{s.city} · {s.event}</span>
            <span className="tl-role">{s.role}</span>
            {s.uncertain && <span className="tl-uncertain" title={s.uncertain}>存疑</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
```

`src/themes/types.ts`（本任务创建完整类型，Task 8 的主题文件与测试直接消费，不存在先后断裂）:

```ts
export interface EasterEggConfig {
  id: string
  type: 'map-node' | 'quote-hover' | 'timeline' | 'decoration' | 'trajectory-style'
  target?: string
  style?: 'ink' | 'gold' | 'beacon'
  trigger?: { yearGte: number }
}

export interface PoetTheme {
  accent: string
  accentSoft: string
  inkTone: string
  paperTone: string
  seal: string
  motifs: string[]
  calligraphy: 'liujian' | 'longcang' | 'mashan' | 'zhimang'
  easterEggs: EasterEggConfig[]
}

export interface DynastyInfo {
  id: string
  name: string
  era: [number, number]
  divisionName: string
  projection: { lon0: number; lat0: number; s: number; sy: number }
  viewBox: string
}
```

`src/themes/index.ts`（本任务最小占位，Task 8 替换为 glob 自动发现版本）:

```ts
import type { PoetTheme } from './types'

export const poetThemes: Record<string, PoetTheme> = {
  libai: {
    accent: '#b8860b', accentSoft: '#d4af37', inkTone: '#2e3340', paperTone: '#e9e8e0',
    seal: '#9e2b25', motifs: ['moon'], calligraphy: 'liujian', easterEggs: [],
  },
}
export function applyPoetTheme(): void {}
```

`src/components/map/HeroMap.tsx`（朝代完全数据驱动，无任何 tang 字面量——D10 承诺成立）:

```tsx
import { useEffect, useMemo, useRef } from 'react'
import type { PoetBundle } from '../../data/types'
import type { DynastyInfo, PoetTheme } from '../../themes/types'
import { usePoetState } from '../../pages/poet-state'
import { InkMap, type InkMapController } from './InkMap'
import { Trajectory } from './Trajectory'
import { CityMarker } from './CityMarker'
import { WorkMarker } from './WorkMarker'
import { createProjection, visibleStops } from './projection'

const basemapModules = import.meta.glob('../../../data/geo/*/basemap.svg', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

interface HeroMapProps {
  bundle: PoetBundle
  theme: PoetTheme
  dynasty: DynastyInfo
}

export function HeroMap({ bundle, theme, dynasty }: HeroMapProps) {
  const { year, hoveredStop, setHoveredStop, setOpenWork } = usePoetState()
  const controllerRef = useRef<InkMapController | null>(null)
  const project = useMemo(() => {
    const p = dynasty.projection
    return createProjection(p.lon0, p.lat0, p.s, p.sy)
  }, [dynasty])
  const basemapRaw = basemapModules[`../../../data/geo/${dynasty.id}/basemap.svg`] ?? ''
  const visible = visibleStops(bundle.poet.stops, year)

  useEffect(() => {
    const latest = visible[visible.length - 1]
    if (!latest || !controllerRef.current) return
    const city = bundle.cities[latest.city]
    controllerRef.current.flyTo(project(city.lon, city.lat), 1.2)
    // 仅在年份变化时飞行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  // 轨迹样式：通用读取 trajectory-style 彩蛋配置，不认识具体彩蛋 id
  const styleEgg = theme.easterEggs.find(e => e.type === 'trajectory-style')
  const trajectoryStyle = styleEgg?.trigger?.yearGte !== undefined
    ? (year >= styleEgg.trigger.yearGte ? styleEgg.style ?? 'ink' : 'ink')
    : styleEgg?.style ?? 'ink'

  return (
    <section className="hero-map">
      <InkMap basemapRaw={basemapRaw} viewBox={dynasty.viewBox} controllerRef={controllerRef}>
        <Trajectory stops={bundle.poet.stops} cities={bundle.cities} project={project} year={year} style={trajectoryStyle} />
        {visible.map(stop => {
          const c = bundle.cities[stop.city]
          return (
            <CityMarker
              key={`${stop.year}-${stop.city}`}
              stop={stop}
              position={project(c.lon, c.lat)}
              highlighted={hoveredStop === stop}
              dimmed={hoveredStop !== null && hoveredStop !== stop}
              onHover={setHoveredStop}
            />
          )
        })}
        {bundle.poet.works.filter(w => w.year <= year).map(work => {
          const c = bundle.cities[work.city]
          const [x, y] = project(c.lon, c.lat)
          return (
            <WorkMarker
              key={`${work.title}-${work.year}`}
              work={work}
              position={[x + 12, y - 12]}
              onOpen={w => setOpenWork(w.title)}
            />
          )
        })}
      </InkMap>
    </section>
  )
}
```

`src/pages/PoetPage.tsx` 替换占位为（含 error 态重试与降级、key 强制重置）:

```tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePoetBundle } from '../components/map/usePoetBundle'
import { useDynasty } from '../components/map/useDynasty'
import { PoetStateProvider } from './poet-state'
import { HeroMap } from '../components/map/HeroMap'
import { TimeSlider } from '../components/sections/TimeSlider'
import { TimelineSection } from '../components/sections/TimelineSection'
import { poetThemes, applyPoetTheme } from '../themes'

export function PoetPage() {
  const { dynasty, poetId } = useParams<{ dynasty: string; poetId: string }>()
  const [retry, setRetry] = useState(0)
  const state = usePoetBundle(dynasty!, poetId!, retry)
  const dynastyInfo = useDynasty(dynasty!)
  const theme = poetThemes[poetId!] ?? poetThemes.libai
  useEffect(() => { applyPoetTheme(theme, poetId!) }, [theme, poetId])

  if (state.status === 'error') {
    return (
      <main className="load-error">
        <p>人物数据加载失败。</p>
        <button onClick={() => setRetry(r => r + 1)}>重试</button>
      </main>
    )
  }
  if (state.status === 'loading' || !dynastyInfo) {
    return <main className="loading">加载中…</main>
  }
  const { bundle } = state
  return (
    <PoetStateProvider key={poetId} initialYear={bundle.poet.death.year}>
      <main className="poet-page">
        <HeroMap bundle={bundle} theme={theme} dynasty={dynastyInfo} />
        <TimeSlider min={bundle.poet.birth.year} max={bundle.poet.death.year} />
        <TimelineSection stops={bundle.poet.stops} />
      </main>
    </PoetStateProvider>
  )
}
```

- [x] **Step 4: 测试通过 + 视觉验证**

Run: `pnpm vitest run src/components/sections/TimelineSection.test.tsx` → PASS
视觉验证：`pnpm build:data` 后用 `_sample.yaml` 临时复制为 `data/poets/tang/sample.yaml`（验证后删除），`pnpm dev` 访问 `/poets/tang/sample`，playwright-cli 截图确认地图 + 年表 + 时间轴渲染（`/tmp/pm/task6-hero.png`）

- [x] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 人物页状态/年表双向联动/底部时间轴/HeroMap

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Summary + Quotes + Works 三大板块

**Files:**
- Create: `src/components/sections/SummarySection.tsx`, `src/components/sections/QuotesSection.tsx`, `src/components/sections/WorksSection.tsx`, `src/components/sections/sections.test.tsx`
- Modify: `src/pages/PoetPage.tsx`（挂载三板块）

**Interfaces:**
- Consumes: `Poet`、`Work`、`usePoetState`
- Produces: `<SummarySection poet>`、`<QuotesSection works>`、`<WorksSection works>`

- [ ] **Step 1: 写板块测试**

`src/components/sections/sections.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SummarySection } from './SummarySection'
import { QuotesSection } from './QuotesSection'
import { WorksSection } from './WorksSection'
import { PoetStateProvider } from '../../pages/poet-state'
import type { Poet, Work } from '../../data/schemas'

const works: Work[] = [
  { title: '静夜思', year: 726, city: '扬州', genre: '诗', text: '床前明月光，疑是地上霜。', background: '背景', famous: ['床前明月光'], source: 's' },
  { title: '将进酒', year: 752, city: '嵩山', genre: '诗', text: '君不见黄河之水天上来。', background: '背景', famous: ['君不见黄河之水天上来'], source: 's' },
]
const poet = {
  summary: { review: '李白，字太白，兴圣皇帝九世孙。', stats: { cities: 18, works: '存诗约千首', topOffice: '翰林供奉', age: 61 } },
} as Poet

describe('SummarySection', () => {
  it('渲染评传与四个生涯数字', () => {
    render(<SummarySection poet={poet} />)
    expect(screen.getByText('李白，字太白，兴圣皇帝九世孙。')).toBeTruthy()
    expect(screen.getByText('行迹城市')).toBeTruthy()
    expect(screen.getByText('18')).toBeTruthy()
  })
})

describe('QuotesSection', () => {
  it('聚合名句最多 5 句并标注出处', () => {
    render(<QuotesSection works={works} />)
    expect(screen.getByText('床前明月光')).toBeTruthy()
    expect(screen.getByText('《静夜思》')).toBeTruthy()
  })
})

describe('WorksSection', () => {
  it('点击作品卡展开全文与背景', () => {
    render(
      <PoetStateProvider initialYear={762}>
        <WorksSection works={works} />
      </PoetStateProvider>,
    )
    fireEvent.click(screen.getByText('《静夜思》'))
    expect(screen.getByText('床前明月光，疑是地上霜。')).toBeTruthy()
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm vitest run src/components/sections/sections.test.tsx`
Expected: FAIL，`Cannot find module './SummarySection'`

- [ ] **Step 3: 实现三板块并挂载**

`src/components/sections/SummarySection.tsx`:

```tsx
import type { Poet } from '../../data/schemas'

export function SummarySection({ poet }: { poet: Poet }) {
  const { review, stats } = poet.summary
  const items = [
    { label: '行迹城市', value: stats.cities },
    { label: '存世作品', value: stats.works },
    { label: '仕途最高', value: stats.topOffice },
    { label: '享年', value: stats.age },
  ]
  return (
    <section className="summary-section">
      <h2 className="section-title">其人</h2>
      <p className="review">{review}</p>
      <div className="stats">
        {items.map(i => (
          <div key={i.label} className="stat">
            <div className="stat-value font-calligraphy">{i.value}</div>
            <div className="stat-label">{i.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

`src/components/sections/QuotesSection.tsx`:

```tsx
import type { Work } from '../../data/schemas'

export function QuotesSection({ works }: { works: Work[] }) {
  const quotes = works.flatMap(w => w.famous.map(line => ({ line, title: w.title }))).slice(0, 5)
  return (
    <section className="quotes-section">
      <h2 className="section-title">精华名句</h2>
      <div className="quotes">
        {quotes.map(q => (
          <blockquote key={q.line} className="quote">
            <span className="quote-line font-calligraphy">{q.line}</span>
            <cite>《{q.title}》</cite>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
```

`src/components/sections/WorksSection.tsx`（展开状态走 PoetState.openWork，地图作品标记与卡片通过 Context 联动，无 DOM id 契约）:

```tsx
import { useEffect } from 'react'
import type { Work } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'

export function WorksSection({ works }: { works: Work[] }) {
  const { openWork, setOpenWork } = usePoetState()

  useEffect(() => {
    if (!openWork) return
    document.getElementById(`work-${openWork}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [openWork])

  return (
    <section className="works-section">
      <h2 className="section-title">作品集</h2>
      {works.map(w => (
        <article key={`${w.title}-${w.year}`} id={`work-${w.title}`} className="work-card mounted-card">
          <header onClick={() => setOpenWork(openWork === w.title ? null : w.title)}>
            <span className="work-year font-calligraphy">{w.year}</span>
            <h3>《{w.title}》</h3>
            <span className="work-city">{w.city}</span>
            <span className="work-genre">{w.genre}</span>
          </header>
          {openWork === w.title && (
            <div className="work-detail">
              <p className="work-text">{w.text}</p>
              <p className="work-background">{w.background}</p>
              <p className="work-source">出处：{w.source}</p>
            </div>
          )}
        </article>
      ))}
    </section>
  )
}
```

`src/pages/PoetPage.tsx` 的 `<main>` 内 `</TimelineSection>` 后追加:

```tsx
        <SummarySection poet={bundle.poet} />
        <QuotesSection works={bundle.poet.works} />
        <WorksSection works={bundle.poet.works} />
```

（顶部 import 追加 `import { SummarySection } from '../components/sections/SummarySection'` 等三行。）

- [ ] **Step 4: 测试通过**

Run: `pnpm vitest run src/components/sections/sections.test.tsx` → PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 人物总结/精华名句/作品集三大板块

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: 主题系统（七类 token + 书法字体 + 色调流转）

**Files:**
- Create: `src/themes/poets/libai.ts`, `src/themes/poets/dufu.ts`, `src/themes/poets/wangwei.ts`, `src/themes/poets/menghaoran.ts`, `src/themes/poets/baijuyi.ts`, `src/themes/themes.test.ts`
- Modify: `src/themes/index.ts`（替换 Task 6 占位为 glob 自动发现 + applyPoetTheme 完整实现）, `src/themes/base.css`

**Interfaces:**
- Consumes: 无
- Produces: `PoetTheme` / `EasterEggConfig` 类型、`poetThemes: Record<string, PoetTheme>`、`applyPoetTheme(theme, poetId): void`、`CALLIGRAPHY_FONTS` 映射

- [ ] **Step 1: 写主题测试**

`src/themes/themes.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { poetThemes, applyPoetTheme } from './index'
import type { PoetTheme } from './types'

const REQUIRED_TOKENS: (keyof PoetTheme)[] = ['accent', 'accentSoft', 'inkTone', 'paperTone', 'seal', 'motifs', 'calligraphy']

describe('poetThemes', () => {
  it.each(Object.keys(poetThemes))('%s 主题七类 token 齐全', id => {
    const theme = poetThemes[id]
    for (const key of REQUIRED_TOKENS) expect(theme[key], key).toBeTruthy()
    expect(theme.motifs.length).toBeGreaterThan(0)
    expect(theme.easterEggs.length).toBeGreaterThanOrEqual(2)
  })
  it('自动发现五人主题', () => {
    expect(Object.keys(poetThemes).sort()).toEqual(['baijuyi', 'dufu', 'libai', 'menghaoran', 'wangwei'])
  })
})

describe('applyPoetTheme', () => {
  it('设置 data-poet 与 CSS 变量', () => {
    applyPoetTheme(poetThemes.libai, 'libai')
    const el = document.documentElement
    expect(el.dataset.poet).toBe('libai')
    expect(el.style.getPropertyValue('--accent')).toBe(poetThemes.libai.accent)
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm vitest run src/themes/themes.test.ts`
Expected: FAIL，`Cannot find module './index'`

- [ ] **Step 3: 实现主题系统**

`src/themes/types.ts`:

```ts
export interface EasterEggConfig {
  id: string
  type: 'map-node' | 'quote-hover' | 'timeline' | 'decoration'
  target?: string
}

export interface PoetTheme {
  accent: string
  accentSoft: string
  inkTone: string
  paperTone: string
  seal: string
  motifs: string[]
  calligraphy: 'liujian' | 'longcang' | 'mashan' | 'zhimang'
  easterEggs: EasterEggConfig[]
}
```

`src/themes/poets/libai.ts`:

```ts
import type { PoetTheme } from '../types'

/** 李白 · 谪仙·明月：月白为底、青莲黛为墨、酒金为 accent。意象出自：举杯邀明月 / 将进酒 / 号青莲居士 / 仗剑去国 */
export const libaiTheme: PoetTheme = {
  accent: '#b8860b',
  accentSoft: '#d4af37',
  inkTone: '#2e3340',
  paperTone: '#e9e8e0',
  seal: '#9e2b25',
  motifs: ['moon', 'wine', 'lotus', 'sword'],
  calligraphy: 'liujian',
  easterEggs: [
    { id: 'catch-moon', type: 'map-node', target: '当涂' },
    { id: 'gold-trajectory', type: 'trajectory-style', style: 'gold' },
    { id: 'westward-suiye', type: 'decoration' },
    { id: 'hanlin-seal', type: 'timeline', target: '742' },
  ],
}
```

`src/themes/poets/dufu.ts`:

```ts
import type { PoetTheme } from '../types'

/** 杜甫 · 诗史·烽燧：赭石沉郁、烽烟灰。意象出自：安史之乱 / 茅屋为秋风所破歌 / 晚年孤舟漂泊 */
export const dufuTheme: PoetTheme = {
  accent: '#8a5a3b',
  accentSoft: '#a97a56',
  inkTone: '#33302b',
  paperTone: '#f0ece1',
  seal: '#8f2d23',
  motifs: ['beacon', 'hut', 'boat'],
  calligraphy: 'longcang',
  easterEggs: [
    { id: 'beacon-trajectory', type: 'trajectory-style', style: 'beacon', trigger: { yearGte: 755 } },
    { id: 'straw-hut-hover', type: 'map-node', target: '成都' },
    { id: 'snow-mountain', type: 'decoration' },
  ],
}
```

`src/themes/poets/wangwei.ts`:

```ts
import type { PoetTheme } from '../types'

/** 王维 · 辋川·空山：青绿竹青、留白禅意。意象出自：独坐幽篁里 / 空山新雨后 / 弹琴复长啸 */
export const wangweiTheme: PoetTheme = {
  accent: '#5f7a6e',
  accentSoft: '#7a9b8a',
  inkTone: '#28323b',
  paperTone: '#f2f4ef',
  seal: '#9e2b25',
  motifs: ['bamboo', 'mountain', 'qin'],
  calligraphy: 'mashan',
  easterEggs: [
    { id: 'bamboo-sway', type: 'map-node', target: '辋川' },
    { id: 'zen-whitespace', type: 'decoration' },
    { id: 'mountain-ripple', type: 'map-node', target: '辋川' },
  ],
}
```

`src/themes/poets/menghaoran.ts`:

```ts
import type { PoetTheme } from '../types'

/** 孟浩然 · 鹿门·春晓：春泥褐、新绿、淡粉。意象出自：隐居鹿门山 / 春晓 / 欲济无舟楫 */
export const menghaoranTheme: PoetTheme = {
  accent: '#7a9b62',
  accentSoft: '#a3b98a',
  inkTone: '#3a352c',
  paperTone: '#f5f1e6',
  seal: '#a0503c',
  motifs: ['peach', 'spring-rain', 'boat'],
  calligraphy: 'zhimang',
  easterEggs: [
    { id: 'falling-petals', type: 'quote-hover' },
    { id: 'lake-level', type: 'map-node', target: '岳阳' },
  ],
}
```

`src/themes/poets/baijuyi.ts`:

```ts
import type { PoetTheme } from '../types'

/** 白居易 · 江南·香山：杏花粉、春水绿。意象出自：乱花渐欲迷人眼 / 琵琶行 / 号香山居士 */
export const baijuyiTheme: PoetTheme = {
  accent: '#c07a86',
  accentSoft: '#d4a0a7',
  inkTone: '#2f2b28',
  paperTone: '#f7f2ea',
  seal: '#9e2b25',
  motifs: ['apricot', 'lute', 'incense-peak'],
  calligraphy: 'zhimang',
  easterEggs: [
    { id: 'lute-notes', type: 'map-node', target: '浔阳' },
    { id: 'grass-sway', type: 'quote-hover' },
    { id: 'slow-ending', type: 'decoration' },
  ],
}
```

`src/themes/index.ts`（替换 Task 6 占位；glob 自动发现主题，新增人物只放一个 `src/themes/poets/<new>.ts` 文件即生效）:

```ts
import type { PoetTheme } from './types'

const modules = import.meta.glob('./poets/*.ts', { eager: true }) as Record<string, Record<string, PoetTheme>>

export const poetThemes: Record<string, PoetTheme> = Object.fromEntries(
  Object.entries(modules).flatMap(([path, mod]) => {
    const id = path.replace('./poets/', '').replace('.ts', '')
    const theme = Object.values(mod)[0]
    return theme ? [[id, theme]] : []
  }),
)

export const CALLIGRAPHY_FONTS: Record<PoetTheme['calligraphy'], string> = {
  liujian: '"Liu Jian Mao Cao"',
  longcang: '"Long Cang"',
  mashan: '"Ma Shan Zheng"',
  zhimang: '"Zhi Mang Xing"',
}

export function applyPoetTheme(theme: PoetTheme, poetId: string): void {
  const el = document.documentElement
  el.dataset.poet = poetId
  el.style.setProperty('--accent', theme.accent)
  el.style.setProperty('--accent-soft', theme.accentSoft)
  el.style.setProperty('--ink', theme.inkTone)
  el.style.setProperty('--paper', theme.paperTone)
  el.style.setProperty('--seal', theme.seal)
  el.style.setProperty('--font-calligraphy', CALLIGRAPHY_FONTS[theme.calligraphy])
}
```

`src/themes/base.css` 追加:

```css
.font-calligraphy { font-family: var(--font-calligraphy), "Kaiti SC", "STKaiti", "KaiTi", serif; }
.section-title { font-size: 28px; letter-spacing: 8px; margin: 48px 0 24px; }
.quote-line { writing-mode: vertical-rl; font-size: 34px; letter-spacing: 6px; }
.mounted-card { background: #f8f4e8; border: 1px solid #c9b992; box-shadow: 0 2px 12px rgba(80, 60, 30, .15); padding: 16px 20px; }
.work-card header { cursor: pointer; display: flex; gap: 16px; align-items: baseline; }
.work-text { white-space: pre-line; line-height: 2; }
```

（PoetPage 的 `applyPoetTheme` 调用已在 Task 6 的最终代码中包含，此处无需改动。）

- [ ] **Step 4: 测试通过 + 视觉验证**

Run: `pnpm vitest run src/themes/themes.test.ts` → PASS
视觉验证：切换 `index.html` 的 `data-poet` 或访问不同人物页（用 sample 数据），playwright-cli 截图确认色调差异与书法字体生效（`/tmp/pm/task8-theme.png`）

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 三层主题系统 + 五人物主题 + 书法字体 + 色调流转

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: 意象符号 + 彩蛋框架 + 五人物彩蛋

**Files:**
- Create: `src/themes/motifs/MotifIcon.tsx`（moon/wine/lotus/sword/beacon/hut/boat/bamboo/mountain/qin/peach/spring-rain/apricot/lute/incense-peak 共 14 个 SVG 小图标）, `src/themes/easter-eggs/registry.tsx`, `src/themes/easter-eggs/CatchMoon.tsx`, `src/themes/easter-eggs/HanlinSeal.tsx`, `src/themes/easter-eggs/StrawHutHover.tsx`, `src/themes/easter-eggs/BambooSway.tsx`, `src/themes/easter-eggs/MountainRipple.tsx`, `src/themes/easter-eggs/FallingPetals.tsx`, `src/themes/easter-eggs/LuteNotes.tsx`, `src/themes/easter-eggs/LakeLevel.tsx`, `src/themes/easter-eggs/WestwardSuiye.tsx`, `src/themes/easter-eggs/registry.test.tsx`
- Modify: `src/components/map/HeroMap.tsx`（渲染 decoration/map-node 彩蛋）, `src/components/sections/QuotesSection.tsx`（渲染 quote-hover 彩蛋）, `src/components/sections/TimelineSection.tsx`（渲染 timeline 彩蛋）

**Interfaces:**
- Consumes: `EasterEggConfig`、`PoetTheme`
- Produces: `<MotifIcon name>`、`renderEasterEggs(configs, scope)`（scope: 'map'|'quote'|'timeline'）

- [ ] **Step 1: 写彩蛋注册表测试**

`src/themes/easter-eggs/registry.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderEasterEggs, easterEggComponents } from './registry'
import { poetThemes } from '../index'

describe('easter egg registry', () => {
  it('所有主题引用的彩蛋 id 均有对应组件', () => {
    for (const theme of Object.values(poetThemes)) {
      for (const egg of theme.easterEggs) {
        expect(easterEggComponents[egg.id], egg.id).toBeTruthy()
      }
    }
  })
  it('renderEasterEggs 按 scope 过滤', () => {
    const { container } = render(
      <svg>{renderEasterEggs([
        { id: 'catch-moon', type: 'map-node', target: '当涂' },
        { id: 'hanlin-seal', type: 'timeline', target: '742' },
      ], 'map')}</svg>,
    )
    expect(container.querySelectorAll('g').length).toBe(1)
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm vitest run src/themes/easter-eggs/registry.test.tsx`
Expected: FAIL，`Cannot find module './registry'`

- [ ] **Step 3: 实现彩蛋框架与彩蛋组件**

`src/themes/motifs/MotifIcon.tsx`（14 个意象图标统一入口，每个为简笔水墨 SVG；此处给出完整代码）:

```tsx
const PATHS: Record<string, string> = {
  moon: 'M20 4 A16 16 0 1 0 20 36 A12.8 12.8 0 1 1 20 4 Z',
  wine: 'M10 8 h20 l-4 12 a6 6 0 0 1 -12 0 Z M20 26 v8 M14 36 h12',
  lotus: 'M20 6 C14 14 10 20 20 30 C30 20 26 14 20 6 Z M8 22 C12 28 16 32 20 34 C24 32 28 28 32 22',
  sword: 'M12 4 l4 16 -2 10 6 2 6 -2 -2 -10 4 -16 M10 30 h20',
  beacon: 'M14 36 h12 M16 36 V18 h8 V36 M14 14 h12 M18 10 h4 M20 4 v4',
  hut: 'M8 20 L20 8 L32 20 M12 20 v14 h16 v-14',
  boat: 'M6 26 C14 32 26 32 34 26 L30 22 H10 Z M20 6 v14 M20 8 l8 8',
  bamboo: 'M14 36 V6 M14 12 h6 M14 22 h-5 M26 36 V8 M26 16 h-6 M26 26 h5',
  mountain: 'M4 32 L14 12 L20 24 L26 10 L36 32 Z',
  qin: 'M6 28 h28 v4 H6 Z M10 28 v-6 M30 28 v-6 M14 24 h12',
  peach: 'M20 10 C10 14 8 24 14 30 C18 34 26 34 30 28 C34 20 30 10 20 10 Z M20 10 C20 6 24 4 28 4',
  'spring-rain': 'M10 10 l-3 6 M20 10 l-3 6 M30 10 l-3 6 M8 24 l-3 6 M18 24 l-3 6 M28 24 l-3 6',
  apricot: 'M20 8 a5 5 0 0 1 5 5 a5 5 0 0 1 -2 4 a5 5 0 0 1 -6 5 a5 5 0 0 1 -6 -5 a5 5 0 0 1 -2 -4 a5 5 0 0 1 5 -5 a5 5 0 0 1 6 0 Z M20 22 v12',
  lute: 'M20 6 C14 12 14 18 20 22 C14 26 14 32 20 36 C26 32 26 26 20 22 C26 18 26 12 20 6 Z',
  'incense-peak': 'M10 32 C14 20 18 12 20 8 C22 12 26 20 30 32 Z M16 32 h8',
}

export function MotifIcon({ name, size = 40 }: { name: string; size?: number }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
```

`src/themes/easter-eggs/registry.tsx`（彩蛋位置由 HeroMap 经 `project()` 动态解析，组件内禁止硬编码坐标）:

```tsx
import type { ReactElement } from 'react'
import type { EasterEggConfig } from '../types'
import { CatchMoon } from './CatchMoon'
import { WestwardSuiye } from './WestwardSuiye'
import { HanlinSeal } from './HanlinSeal'
import { StrawHutHover } from './StrawHutHover'
import { BambooSway } from './BambooSway'
import { MountainRipple } from './MountainRipple'
import { FallingPetals } from './FallingPetals'
import { LuteNotes } from './LuteNotes'
import { LakeLevel } from './LakeLevel'

export const easterEggComponents: Record<string, (props: { target?: string; position?: [number, number] }) => ReactElement | null> = {
  'catch-moon': CatchMoon,
  'westward-suiye': WestwardSuiye,
  'hanlin-seal': HanlinSeal,
  'straw-hut-hover': StrawHutHover,
  'bamboo-sway': BambooSway,
  'mountain-ripple': MountainRipple,
  'falling-petals': FallingPetals,
  'lute-notes': LuteNotes,
  'lake-level': LakeLevel,
}

const SCOPE_MAP: Partial<Record<EasterEggConfig['type'], string>> = {
  'map-node': 'map',
  decoration: 'map',
  'quote-hover': 'quote',
  timeline: 'timeline',
  // 'trajectory-style' 不在此渲染，由 HeroMap 通用处理
}

export function renderEasterEggs(
  configs: EasterEggConfig[],
  scope: 'map' | 'quote' | 'timeline',
  resolvePosition?: (cityName: string) => [number, number] | undefined,
) {
  return configs
    .filter(c => SCOPE_MAP[c.type] === scope)
    .map(c => {
      const C = easterEggComponents[c.id]
      if (!C) return null
      const position = c.target ? resolvePosition?.(c.target) : undefined
      return <C key={c.id} target={c.target} position={position} />
    })
}
```

两个代表性彩蛋完整实现：

`src/themes/easter-eggs/CatchMoon.tsx`（当涂江面水中捉月：月影随鼠标轻晃；position 由 HeroMap 经 project() 解析传入）:

```tsx
import { useState } from 'react'

export function CatchMoon({ position }: { position?: [number, number] }) {
  const [offset, setOffset] = useState(0)
  if (!position) return null
  const [x, y] = position
  return (
    <g onMouseMove={e => setOffset(((e.clientX % 40) - 20) / 10)} className="catch-moon">
      <ellipse cx={x + offset * 3} cy={y + 34} rx={26} ry={7} fill="#d4af37" opacity={0.5}>
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <circle cx={x + offset * 3} cy={y} r={14} fill="#e8e4d8" stroke="#b8860b" strokeWidth={1.5} opacity={0.9} />
      <title>当涂 · 捉月传说</title>
    </g>
  )
}
```

`src/themes/easter-eggs/LakeLevel.tsx`（孟浩然「八月湖水平」，岳阳点呼吸水波）:

```tsx
export function LakeLevel({ position }: { position?: [number, number] }) {
  if (!position) return null
  const [x, y] = position
  return (
    <ellipse cx={x} cy={y + 18} rx={30} ry={6} fill="none" stroke="#7a9b62" strokeWidth={1.5} className="lake-level" />
  )
}
```

（配 base.css `.lake-level { animation: lake-breathe 4s ease-in-out infinite } @keyframes lake-breathe { 0%,100% { opacity: .4 } 50% { opacity: .8 } }`；金色/烽烟轨迹已由 HeroMap 的 `trajectory-style` 彩蛋类型通用处理，不再单独设组件。）

其余彩蛋均为轻量 CSS/SVG 装饰组件，模式相同（每个 ≤ 15 行，需要位置的同样用 `position` prop）:

- `WestwardSuiye.tsx`: `<text x={60} y={560} className="westward-suiye">西域万里 · 碎叶 →</text>`（配 base.css `.westward-suiye { font-size: 18px; fill: var(--accent); opacity: .7 }`）
- `HanlinSeal.tsx`: `<g>` 内 `<rect width={64} height={64} rx={8} fill="var(--seal)"/> + <text>` 翰林供奉（竖排两字两行，class `hanlin-seal`），仅当 `usePoetState().year >= Number(target)` 时渲染
- `StrawHutHover.tsx`: `<path d="M-10,0 L0,-12 L10,0 Z" className="straw-hut"/>` 置于 `position` 传入的成都点，hover 时 CSS `transform: rotateX(60deg)` 掀顶动画
- `BambooSway.tsx`: 两组 `<path>` 竹节（同 MotifIcon bamboo 路径放大 3 倍）置于 `position` 传入的辋川点，CSS `@keyframes sway { 0%,100% { transform: rotate(-2deg) } 50% { transform: rotate(2deg) } }`，`transform-origin: bottom center`，4s 循环
- `MountainRipple.tsx`: `<circle>` 于 `position` 传入的辋川点，`onClick` 时添加 `.rippling` class（CSS `@keyframes ripple { from { r: 10; opacity: .6 } to { r: 80; opacity: 0 } }`），800ms 后移除
- `FallingPetals.tsx`: 6 个 `<span className="petal">` 绝对定位于 QuotesSection 容器，CSS `@keyframes fall { to { transform: translateY(120px) rotate(40deg); opacity: 0 } }`，各自 animation-delay 0-3s
- `LuteNotes.tsx`: 3 个 `<text>♪</text>` 于 `position` 传入的浔阳点，CSS `@keyframes float-note { to { transform: translateY(-30px); opacity: 0 } }`，3s 循环错位

`HeroMap.tsx` 在 `<Trajectory>` 后插入 `{renderEasterEggs(theme.easterEggs, 'map', city => { const c = bundle.cities[city]; return c ? project(c.lon, c.lat) : undefined })}`；`QuotesSection.tsx` 与 `TimelineSection.tsx` 各新增 `poetId` prop（PoetPage 传入），容器内分别插入 `{renderEasterEggs(poetThemes[poetId].easterEggs, 'quote')}` 与 `{renderEasterEggs(poetThemes[poetId].easterEggs, 'timeline')}`。

- [ ] **Step 4: 测试通过 + 视觉验证**

Run: `pnpm vitest run src/themes/easter-eggs/registry.test.tsx` → PASS
视觉验证：sample 数据（theme=libai）访问人物页，playwright-cli 截图确认水中捉月与金色轨迹（`/tmp/pm/task9-eggs.png`）

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 意象符号库 + 彩蛋框架 + 五人物彩蛋

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 10: 总览页 + 移动端 + 水墨质感细节

**Files:**
- Modify: `src/pages/OverviewPage.tsx`（替换占位）, `src/themes/base.css`（纸纹滤镜/托裱卡片/parallax/移动端）
- Create: `src/components/PaperTexture.tsx`

**Interfaces:**
- Consumes: `public/data/index.json`（`PoetIndexEntry[]`）、`MotifIcon`、`poetThemes`
- Produces: 完整总览页

- [ ] **Step 1: 实现总览页**

`src/components/PaperTexture.tsx`:

```tsx
export function PaperTexture() {
  return (
    <svg className="paper-texture-svg" aria-hidden="true">
      <filter id="paper-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.85, 0 0 0 0 0.8, 0 0 0 0 0.7, 0 0 0 0.06 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-noise)" />
    </svg>
  )
}
```

`src/pages/OverviewPage.tsx` 替换占位为:

```tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PoetIndexEntry } from '../data/types'
import { MotifIcon } from '../themes/motifs/MotifIcon'
import { poetThemes } from '../themes'
import { PaperTexture } from '../components/PaperTexture'

export function OverviewPage() {
  const [index, setIndex] = useState<PoetIndexEntry[]>([])
  useEffect(() => {
    fetch('/data/index.json').then(r => r.json()).then(setIndex).catch(() => setIndex([]))
  }, [])
  return (
    <main className="overview">
      <PaperTexture />
      <h1 className="site-title font-calligraphy">文人生命轨迹地图</h1>
      <nav className="dynasty-switcher">
        <span className="dynasty active">唐</span>
        {['宋', '元', '明', '清'].map(d => (
          <span key={d} className="dynasty disabled" title="敬请期待">{d}</span>
        ))}
      </nav>
      <div className="poet-wall">
        {index.map(p => (
          <Link key={p.id} to={`/poets/${p.dynasty}/${p.id}`} className="poet-card mounted-card">
            <MotifIcon name={poetThemes[p.theme]?.motifs[0] ?? 'moon'} size={48} />
            <span className="poet-name font-calligraphy">{p.name}</span>
            <span className="poet-years">{p.birthYear} — {p.deathYear}</span>
            <span className="poet-quote">{p.representativeLine}</span>
          </Link>
        ))}
      </div>
      <footer className="project-note">
        生平依据正史本传与权威年谱；地名坐标据谭其骧《中国历史地图集》复核；
        标「存疑」者为学界尚有争议之点位，宁缺毋滥。
      </footer>
    </main>
  )
}
```

`src/themes/base.css` 追加:

```css
.paper-texture-svg { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.overview, .poet-page { position: relative; z-index: 1; }
.site-title { font-size: 44px; letter-spacing: 14px; text-align: center; margin: 40px 0 24px; }
.dynasty-switcher { display: flex; gap: 24px; justify-content: center; margin-bottom: 40px; }
.dynasty { font-size: 24px; padding: 4px 16px; }
.dynasty.active { border-bottom: 3px solid var(--seal); font-weight: bold; }
.dynasty.disabled { opacity: .35; cursor: not-allowed; }
.poet-wall { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 0 40px 40px; }
.poet-card { display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none; color: var(--ink); }
.poet-name { font-size: 32px; }
.poet-years { opacity: .6; font-size: 14px; }
.poet-quote { font-size: 15px; opacity: .75; }
.project-note { text-align: center; font-size: 13px; opacity: .55; padding: 24px 40px 48px; line-height: 1.8; }
.time-slider-wrap { display: flex; align-items: center; gap: 16px; padding: 8px 40px; }
.time-slider { flex: 1; accent-color: var(--accent); }
.time-slider-year { font-size: 28px; min-width: 90px; }
.timeline-section ol { list-style: none; padding: 0 40px; }
.timeline-section li { display: flex; gap: 16px; padding: 10px 12px; border-left: 3px solid transparent; cursor: pointer; }
.timeline-section li.active, .timeline-section li:hover { border-left-color: var(--accent); background: rgba(0,0,0,.04); }
.tl-year { min-width: 64px; font-size: 22px; color: var(--seal); }
.tl-role { margin-left: auto; opacity: .6; font-size: 14px; }
.tl-uncertain { color: var(--seal); font-size: 12px; border: 1px dashed var(--seal); padding: 0 4px; border-radius: 3px; }
.stats { display: flex; gap: 32px; padding: 0 40px 24px; }
.stat-value { font-size: 40px; color: var(--accent); }
.stat-label { font-size: 14px; opacity: .6; }
.review { padding: 0 40px 24px; line-height: 2; max-width: 78ch; }
.quotes { display: flex; gap: 48px; padding: 0 40px 32px; min-height: 260px; align-items: flex-start; }
.quote cite { display: block; margin-top: 12px; font-size: 13px; opacity: .5; }
.works-section { padding: 0 40px 64px; }
.hero-map .ink-map { width: 100%; height: 78vh; display: block; }
@media (max-width: 768px) {
  .hero-map .ink-map { height: 60vh; }
  .site-title { font-size: 30px; letter-spacing: 8px; }
  .quotes { gap: 20px; overflow-x: auto; }
  .stats { flex-wrap: wrap; gap: 16px; }
}
```

- [ ] **Step 2: 视觉验证**

Run: `pnpm build:data && pnpm dev`，playwright-cli 截图总览页桌面 + 移动视口（`/tmp/pm/task10-overview.png`、`/tmp/pm/task10-mobile.png`），确认卡片墙、纸纹、移动端布局

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: 总览页 + 纸纹/托裱质感 + 移动端适配

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 11: 李白数据（三轮考证 + 校对表 + 用户抽查）

**Files:**
- Create: `data/poets/tang/libai.yaml`, `docs/proofread/libai.md`

**Interfaces:**
- Consumes: `data/geo/tang/cities.yaml`、`PoetSchema`、spec 第 8 节考证流程
- Produces: 通过 `pnpm build:data` 的完整李白数据 + 校对表

- [ ] **Step 1: 骨架轮——正史本传 + 年谱提炼生平节点（15-25 个）**

资料源：《旧唐书·文苑传下》《新唐书·文艺传中》本传（ctext.org 核原文）、詹瑛《李白诗文系年》、郁贤皓《李太白全集校注》。已知锚点（须逐条与资料核对，不得照抄）：701 生碎叶；705 迁绵州昌隆；724 出蜀经渝州；725 江陵/金陵；726 扬州；727 安陆（寓家）;735 初游长安（一说，可标 uncertain）;742 供奉翰林；744 赐金放还、洛阳会杜甫；745-755 漫游梁宋/东鲁（兖州）/吴越（越州、天姥山）/幽燕（幽州）;755 安史乱起避地庐山（浔阳）;757 从永王李璘、下浔阳狱；758 长流夜郎；759 夔州（白帝城）遇赦；760-761 江夏/金陵/宣城；762 卒于当涂。

- [ ] **Step 2: 作品轮——15-30 首代表作逐首系年系地**

候选（须逐首核对系年依据，无法定位到城市者不收）：《访戴天山道士不遇》（绵州）、《峨眉山月歌》（渝州出蜀途中）、《渡荆门送别》（江陵）、《静夜思》（扬州）、《黄鹤楼送孟浩然之广陵》（江夏）、《清平调三首》（长安）、《蜀道难》（长安，系年有说可标 uncertain）、《行路难》（长安）、《梁甫吟》（梁宋）、《梦游天姥吟留别》（越州/东鲁）、《宣州谢朓楼饯别校书叔云》（宣城）、《秋浦歌》（秋浦）、《永王东巡歌》（浔阳）、《早发白帝城》（夔州）、《望庐山瀑布》（浔阳）、《赠汪伦》（宣城）、《将进酒》（嵩山/梁宋，系年有说可标 uncertain）、《闻王昌龄左迁龙标遥有此寄》（江南漫游途中，可标 uncertain）。

- [ ] **Step 3: 校验轮——写 YAML + 时间线自洽 + 构建校验**

写 `data/poets/tang/libai.yaml`（含 summary.review 评传初稿、stats）。
自查：行程速度合理性（如 758 浔阳→夜郎、759 夜郎→夔州的水路走向）；无同年瞬移两地。
Run: `pnpm build:data` → `✓ 唐·李白 → public/data/tang/libai.json`，退出码 0。

- [ ] **Step 4: 写校对表**

`docs/proofread/libai.md`：两张表——生平节点表（年份/城市/事件/官职/出处/存疑说明）；作品表（题名/年份/城市/系年依据/出处）。

- [ ] **Step 5: 用户抽查 gate**

主 agent 把校对表呈现给用户抽查。用户打回 → 重做该人物；通过 → 进入 Task 12。

- [ ] **Step 6: Commit**

```bash
git add data/poets/tang/libai.yaml docs/proofread/libai.md
git commit -m "data: 李白生平 21 节点 + 代表作 18 首（三轮考证）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 12: 杜甫数据（三轮考证 + 校对表 + 用户抽查）

**Files:**
- Create: `data/poets/tang/dufu.yaml`, `docs/proofread/dufu.md`

**Interfaces:**
- Consumes: 同 Task 11
- Produces: 通过 `pnpm build:data` 的完整杜甫数据 + 校对表

- [ ] **Step 1: 骨架轮**

资料源：《旧唐书·杜甫传》《新唐书·杜甫传》、仇兆鳌《杜诗详注》。已知锚点（须逐条核对）：712 生巩县；731-741 漫游吴越（金陵、越州）与齐赵（泰山、兖州）;746 长安应试不第（李林甫「野无遗贤」）;751 献三大礼赋；755 授河西尉不赴、改右卫率府胄曹参军；755 安史乱起；756 长安陷贼；757 奔凤翔授左拾遗；758 贬华州司功参军；759 弃官，秦州→同谷→成都；760 营草堂于成都；762-764 避乱梓州/阆州；765 严武荐检校工部员外郎；766-768 居夔州；768 出峡，江陵→岳阳；769 潭州；770 卒于潭岳间舟中（耒阳，卒地有说可标 uncertain）。

- [ ] **Step 2: 作品轮**

候选：《望岳》（泰山）、《兵车行》（长安）、《丽人行》（长安）、《自京赴奉先县咏怀五百字》（长安/奉先）、《春望》（长安）、《石壕吏》（华州途中）、《茅屋为秋风所破歌》（成都）、《蜀相》（成都）、《春夜喜雨》（成都）、《闻官军收河南河北》（梓州）、《登高》（夔州）、《秋兴八首》（夔州）、《登岳阳楼》（岳阳）、《旅夜书怀》（出峡舟中）、《江南逢李龟年》（潭州）。

- [ ] **Step 3: 校验轮**

写 `data/poets/tang/dufu.yaml` + 时间线自洽 + `pnpm build:data` 通过。

- [ ] **Step 4: 写校对表 `docs/proofread/dufu.md`**

- [ ] **Step 5: 用户抽查 gate（同 Task 11 流程）**

- [ ] **Step 6: Commit**

```bash
git add data/poets/tang/dufu.yaml docs/proofread/dufu.md
git commit -m "data: 杜甫生平节点 + 代表作（三轮考证）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 13: 王维数据（三轮考证 + 校对表 + 用户抽查）

**Files:**
- Create: `data/poets/tang/wangwei.yaml`, `docs/proofread/wangwei.md`

**Interfaces:** 同 Task 11

- [ ] **Step 1: 骨架轮**

资料源：《旧唐书·王维传》《新唐书·王维传》、赵殿成《王右丞集笺注》、陈铁民《王维年谱》。已知锚点（须逐条核对）：701 生蒲州；721 进士及第、调太乐丞；722 贬济州司仓参军；728 归长安；735 张九龄荐右拾遗；737 监察御史、出使凉州；740 归朝、殿中侍御史；744-745 居辋川（得宋之问别业）;750 丁母忧；752 起复吏部郎中；755 安禄山陷长安、迫受伪职；757 两京收复、授太子中允；758-761 尚书右丞；761 卒于辋川。

- [ ] **Step 2: 作品轮**

候选：《九月九日忆山东兄弟》（长安，年少作）、《送元二使安西》（长安/渭城）、《使至塞上》（凉州）、《山居秋暝》（辋川）、《鹿柴》（辋川）、《竹里馆》（辋川）、《辛夷坞》（辋川）、《终南山》（终南山）、《酬张少府》（辋川）、《积雨辋川庄作》（辋川）、《相思》（江南）、《送沈子福归江东》（长江）。

- [ ] **Step 3: 校验轮**

写 `data/poets/tang/wangwei.yaml` + 时间线自洽 + `pnpm build:data` 通过。

- [ ] **Step 4: 写校对表 `docs/proofread/wangwei.md`**

- [ ] **Step 5: 用户抽查 gate（同 Task 11 流程）**

- [ ] **Step 6: Commit**

```bash
git add data/poets/tang/wangwei.yaml docs/proofread/wangwei.md
git commit -m "data: 王维生平节点 + 代表作（三轮考证）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 14: 孟浩然数据（三轮考证 + 校对表 + 用户抽查）

**Files:**
- Create: `data/poets/tang/menghaoran.yaml`, `docs/proofread/menghaoran.md`

**Interfaces:** 同 Task 11

- [ ] **Step 1: 骨架轮**

资料源：《旧唐书·文苑传》《新唐书·孟浩然传》、佟培基《孟浩然年谱》研究。已知锚点（须逐条核对）：689 生襄阳；712-716 隐居鹿门山（襄阳）;727 入京应试不第；728-729 洛阳/长安干谒（「不才明主弃」忤旨放还）;730-733 漫游吴越（钱塘、越州、天台山）;737 韩朝宗约荐不赴；740 王昌龄过襄阳、食鲜疾发卒于襄阳。

- [ ] **Step 2: 作品轮**

候选：《春晓》（襄阳）、《宿建德江》（钱塘）、《望洞庭湖赠张丞相》（岳阳）、《过故人庄》（襄阳）、《早寒江上有怀》（江上）、《夜归鹿门山歌》（鹿门山/襄阳）、《宿桐庐江寄广陵旧游》（钱塘/越州途中）、《与诸子登岘山》（襄阳）、《留别王维》（长安）。

- [ ] **Step 3: 校验轮**

写 `data/poets/tang/menghaoran.yaml` + 时间线自洽 + `pnpm build:data` 通过。

- [ ] **Step 4: 写校对表 `docs/proofread/menghaoran.md`**

- [ ] **Step 5: 用户抽查 gate（同 Task 11 流程）**

- [ ] **Step 6: Commit**

```bash
git add data/poets/tang/menghaoran.yaml docs/proofread/menghaoran.md
git commit -m "data: 孟浩然生平节点 + 代表作（三轮考证）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 15: 白居易数据（三轮考证 + 校对表 + 用户抽查）

**Files:**
- Create: `data/poets/tang/baijuyi.yaml`, `docs/proofread/baijuyi.md`

**Interfaces:** 同 Task 11

- [ ] **Step 1: 骨架轮**

资料源：《旧唐书·白居易传》《新唐书·白居易传》、朱金城《白居易集笺校》《白居易年谱》。已知锚点（须逐条核对）：772 生新郑；782-787 避乱江南（宿州符离、越中）;800 进士及第（长安）;803 校书郎；806 盩厔县尉；807 翰林学士、左拾遗；810 丁母忧居下邽；815 贬江州司马（浔阳）;818 移忠州刺史；820 还朝；822 出为杭州刺史（钱塘）;825 苏州刺史；827 秘书监还朝；829 太子宾客分司东都（洛阳）;846 卒于洛阳香山。

- [ ] **Step 2: 作品轮**

候选：《赋得古原草送别》（长安，少年作可标 uncertain）、《卖炭翁》（长安）、《长恨歌》（盩厔）、《琵琶行》（浔阳）、《钱塘湖春行》（杭州）、《忆江南》（苏州/洛阳）、《问刘十九》（洛阳）、《暮江吟》（杭州途中）、《大林寺桃花》（浔阳）、《观刈麦》（盩厔）。

- [ ] **Step 3: 校验轮**

写 `data/poets/tang/baijuyi.yaml` + 时间线自洽 + `pnpm build:data` 通过。

- [ ] **Step 4: 写校对表 `docs/proofread/baijuyi.md`**

- [ ] **Step 5: 用户抽查 gate（同 Task 11 流程）**

- [ ] **Step 6: Commit**

```bash
git add data/poets/tang/baijuyi.yaml docs/proofread/baijuyi.md
git commit -m "data: 白居易生平节点 + 代表作（三轮考证）

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 16: 最终视觉走查 + 构建验收

**Files:**
- Modify: 走查中发现的样式问题文件
- Create: `docs/screenshots/`（验收截图存档）

- [ ] **Step 1: 全量构建**

Run: `pnpm build:data && pnpm build` → 全部通过，`dist/` 产物生成，`public/data/` 含 index.json + 五人 JSON。

- [ ] **Step 2: 五人物页逐一 playwright 截图走查**

对每人执行（以 libai 为例，其余四人替换 poetId）:

```bash
pnpm dev &
playwright-cli -s=walkthrough open "http://localhost:5173/poets/tang/libai"
playwright-cli -s=walkthrough screenshot --filename=docs/screenshots/libai-hero.png
playwright-cli -s=walkthrough screenshot --filename=docs/screenshots/libai-full.png --full-page
playwright-cli -s=walkthrough close
```

走查清单（每页逐项核对）:①水墨底图完整无破版 ②轨迹线按时序正确连接 ③存疑节点为空心印点 ④时间轴拖动轨迹渐进 ⑤年表 hover 地图联动 ⑥主题色与书法字体契合人物 ⑦彩蛋触发正常 ⑧四大板块数据完整 ⑨移动端视口（--viewport-size=390,844）布局不破。

- [ ] **Step 3: 修复走查发现的问题并复验**

每修复一项复跑一次对应截图，直至清单全过。

- [ ] **Step 4: Commit + 打 tag**

```bash
git add -A
git commit -m "chore: MVP 视觉走查与构建验收

Co-Authored-By: Claude <noreply@anthropic.com>"
git tag v0.1.0
```

---

## Self-Review 记录

- **Spec coverage**:spec 第 3 节架构（Task 1/2）、第 4 节数据模型（Task 2/3）、第 5 节底图与交互（Task 4/5）、第 6 节页面结构（Task 6/7/10）、第 7 节主题系统（Task 8/9）、第 8 节考证流程（Task 11-15）、第 9 节错误处理（Task 2 构建校验 + Task 6 error 态降级 + Task 10 字体 fallback + Task 16 走查）、第 10 节测试策略（各任务 TDD + Task 16 验收）——全覆盖。
- **类型一致性**:`src/themes/types.ts` 在 Task 6 创建（PoetTheme/EasterEggConfig/DynastyInfo）,Task 6 占位 index.ts 与 Task 8 完整实现共用同一类型源；`PoetBundle`（Task 2）→ HeroMap/PoetPage（Task 6）一致；`EasterEggConfig`（Task 6）→ registry（Task 9）一致；`PoetIndexEntry`（Task 2 build-data 产出）→ OverviewPage（Task 10）一致。
- **Critic 复审修订（2026-07-24,critic-glm CONCERN + critic-claude 发现已逐条裁决）**:①types.ts 挪入 Task 6 消除先后断裂；②DynastyEntrySchema 增加 projection/viewBox,HeroMap 改为 `import.meta.glob` 朝代数据驱动（D10 零改动承诺成立）;③extract-basemap.py 只输出 SVG 片段，消除非法嵌套；④InkMap 补 d3-zoom cleanup;⑤彩蛋位置由 HeroMap 经 project() 动态解析，禁止硬编码坐标；⑥PoetStateProvider 加 key={poetId} 强制重置；⑦themes/index.ts 改 glob 自动发现；⑧轨迹样式改 trajectory-style 配置类型；⑨作品联动改 openWork Context;⑩usePoetBundle 三态 + 重试降级;⑪删除 `pnpm dlx tailwindcss init -p`(dlx 拉 v4 无 init);⑫PaperTexture numOctaves 降为 2;⑬build-data 城市查找表提到朝代层 + 输出 dynasties.json;⑭杜甫锚点拆分 756 陷贼/757 授左拾遗；⑮每个 Task 末尾强制 `pnpm build`。

