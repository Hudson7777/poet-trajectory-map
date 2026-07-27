# 文人生命轨迹地图 · AI Agent 背景文件

> 本文件面向在此仓库工作的 AI agent，提供项目背景、命令、数据纪律与关键约束。事实源见文末「文档地图」。

## 项目一句话

中国历代文人生命轨迹地图：纯静态前端，大地图 + 朝代切换 + 人物切换，生平轨迹按时间线连接，作品通过地理+时间双重定位标注在地图上，古风水墨视觉语言。当前内容为唐朝 5 人（李白/杜甫/王维/孟浩然/白居易），v0.2.0 视觉重设计已完成。

## 技术栈

- Vite 8 + React 19 + TypeScript 6 + Tailwind 3 + pnpm 9
- d3-zoom / d3-selection / d3-transition（地图缩放与轨迹）
- react-router-dom 7（`/poets` 总览、`/poets/:dynasty/:poetId` 人物页）
- zod 4（构建期数据 schema 校验）
- vitest 4（单测，当前 55 个全过）+ oxlint
- 纯静态产物 `dist/`，无后端无数据库

## 常用命令

```bash
pnpm install
pnpm build:data      # zod + validatePoet 规则校验，不过则退出码非零
pnpm dev             # 开发服务器，默认端口 5173
pnpm dev --port=5180 # 5173 常被本机另一应用占用，视觉验证用 5180
pnpm test            # vitest run，10 文件 55 测试
pnpm build           # tsc -b && vite build，产物 dist/
pnpm lint            # oxlint
```

视觉验证流程：`pnpm dev --port=5180` 起服务，再用 playwright-cli 截图核对。

## 目录结构

```
data/
  dynasties.yaml              # 朝代注册表（id/name/era/divisionName/basemap/cities/projection/viewBox）
  geo/tang/{basemap.svg,cities.yaml}   # 朝代地理：底图 + 城市坐标表（48 城）
  poets/tang/*.yaml           # 一人一文件（libai/dufu/wangwei/menghaoran/baijuyi + _sample）
scripts/
  build-data.ts               # 构建：schema 校验 + validatePoet → public/data/*.json
src/
  components/map/             # InkMap(d3-zoom) / Trajectory(Catmull-Rom) / CityMarker / WorkMarker / projection / flyTo
  components/sections/         # Timeline / Summary / Quotes / Works 四板块 + TimeSlider + volumeGrouping
  pages/                       # OverviewPage / PoetPage + poet-state（PoetStateProvider key={poetId} 强制重置）
  themes/                      # base.css → tang → poets/*（applyPoetTheme 切 CSS 变量，brush/divider/inscription 各人定制）+ easter-eggs + motifs
  data/{schemas.ts,types.ts}
public/data/*.json            # 构建产物，前端运行时 fetch
```

## 数据管线与考证纪律

**数据流**：`data/dynasties.yaml` + `data/geo/<dynasty>/` + `data/poets/<dynasty>/*.yaml` → `pnpm build:data`（zod schema + validatePoet 规则，不过则退出码非零）→ `public/data/*.json` → 前端 fetch。

**考证纪律（D13）**：
- 资料三级：一级=正史本传（旧/新唐书，ctext.org 核原文）+ 权威年谱系年；二级=谭其骧《中国历史地图集》、CBDB、CHGIS；**三级（百度百科等）禁作 source 依据，仅可找线索**
- 每个 stop/work 的 `source` 必填；争议点位 `uncertain` 标注并附各方说法；无法系年系地到城市的作品不收（宁缺毋滥）
- 传说类内容（如李白捉月）必须标明「传说」
- 评传由 Claude 基于正史撰写，随校对表送审；五人校对表见 `docs/proofread/`

**校对表节点数**（以 `docs/proofread/` 为准）：李白 25 / 杜甫 21 / 王维 16 / 孟浩然 18 / 白居易 17 节点。

## 关键约束

1. **底图投影常量全项目唯一**：`lon0=72, lat0=54.5, s=25, sy=29`。`src/components/map/projection.ts` 的 `TANG_PROJECTION` 与 `data/dynasties.yaml` 的 `projection` 字段必须一致，改动一处必同改另一处。
2. **朝代一等公民（D10）**：新增朝代 = `data/dynasties.yaml` 注册表加一行 + 新增 `data/geo/<dynasty>/` 和 `data/poets/<dynasty>/`，代码零改动。HeroMap 等组件不得出现 `tang` 字面量，朝代信息一律数据驱动。
3. **构建期校验不可绕过**：`pnpm build:data` 退出码非零时禁止提交数据。
4. **提交信息**结尾带 `Co-Authored-By: Claude <noreply@anthropic.com>`；**push 前必须经用户确认**。
5. **联网搜索**：本环境（mcli 代理）下 WebSearch 始终返回空，任何网络信息检索必须调用 `super-search` skill，禁止用 WebSearch；WebFetch 仅用于已知 URL 的内容提取。
6. **端口**：5173 被本机另一应用占用，dev 用 `--port=5180`。
7. **vite.config.ts** 含 `build.cssMinify: 'esbuild'`——绕开 pnpm 不装 `lightningcss-darwin-arm64` 的 bug，勿删。

## 文档地图

| 内容 | 位置 |
|------|------|
| 设计 spec（v0.1） | `docs/superpowers/specs/2026-07-24-poet-trajectory-map-design.md` |
| 设计 spec（v0.2 视觉重设计） | `docs/superpowers/specs/2026-07-27-poet-map-v02-redesign.md` |
| 实施计划（v0.1） | `docs/superpowers/plans/2026-07-24-poet-trajectory-map.md` |
| 实施计划（v0.2） | `docs/superpowers/plans/2026-07-27-poet-map-v02.md` |
| 关键决策 D1-D13 | `docs/decisions.md` |
| 五人校对表（事实源） | `docs/proofread/{libai,dufu,wangwei,menghaoran,baijuyi}.md` |
| 验收截图 | `docs/screenshots/`（v0.1）与 `docs/screenshots/v02/`（v0.2，14 张） |
| 执行 ledger | `.superpowers/sdd/progress.md` |

## 遗留 Minor 与扩展注意

以下为执行过程中记录、留待后续 triage 的 Minor 与已知项（摘自 `.superpowers/sdd/progress.md`，非新编）：

- **InkMap useEffect 依赖**：仅依赖 `[year]`，`visible/controllerRef/project` 入闭包（Task4/Task5/Task6/Task8 复查项）。
- **WorkMarker 无单测**；**Trajectory 未防御城市缺失**（Task5）。
- **同名作品 DOM id 重复**：brief 自带，留后续（Task7）。
- **glob `Object.values[0]` 取值 / 文件名即 id / applyPoetTheme 测试只断言 1 变量**（Task8）。
- **SlowEnding 位置任意 / 缺 slow-dot CSS / CatchMoon 单测假月**（Task9）。
- **translateExtent 会 clamp flyTo 越界 transform**：扩展数据（新朝代/新城市）时需回归验证（R2）。
- **当前仅唐朝 5 人 48 城**，横向扩展其他朝代时按 D10 流程，零代码改动。
