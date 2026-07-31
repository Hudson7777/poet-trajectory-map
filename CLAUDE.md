# 文人生命轨迹地图 · AI Agent 背景文件

> 本文件面向在此仓库工作的 AI agent，提供项目背景、命令、数据纪律与关键约束。事实源见文末「文档地图」。

## 项目一句话

中国历代文人生命轨迹地图：纯静态前端，大地图 + 朝代切换 + 人物切换，生平轨迹按时间线连接，作品通过地理+时间双重定位标注在地图上，古风水墨视觉语言。当前内容为唐朝 5 人（李白/杜甫/王维/孟浩然/白居易），v0.3.0 已发布并打 tag：导航（返回总览 + 同朝切换条 + 朝代切换器数据驱动）、字体泄漏修复（resetPoetTheme + 卡片 inline 锁字）、signature 精华名句字段（显式声明 5 句 + 构建期校验一句一作）、默认起始年改为出生年、动效（年表卷轴展开 / 轨迹生长 / 人物页入场 / quote-hover 彩蛋补齐三人）。v0.4：小地图年表区收拢浮现（heroOut && tlInView 双 IntersectionObserver）、导航诗人名/朝代 toggle 各自书法体锁字、时间轴定制滑块（朱砂印拇指 + 拖动粒子 + 键盘 ←/→/Home/End）、作品卡「时年 N 岁」+ 卷一自出生年起始、地图彩蛋全删（去碎叶西迁/捉月残留）、名句区五人彩蛋观感调参（月升/落木/云雾/落英/草摇）。

## 技术栈

- Vite 8 + React 19 + TypeScript 6 + Tailwind 3 + pnpm 9
- d3-zoom / d3-selection / d3-transition（地图缩放与轨迹）
- react-router-dom 7（`/poets` 总览、`/poets/:dynasty/:poetId` 人物页）
- zod 4（构建期数据 schema 校验）
- vitest 4（单测，当前 75 个全过，15 文件）+ oxlint
- 纯静态产物 `dist/`，无后端无数据库

## 常用命令

```bash
pnpm install
pnpm build:data      # zod + validatePoet 规则校验，不过则退出码非零
pnpm dev             # 开发服务器，默认端口 5173
pnpm dev --port=5180 # 5173 常被本机另一应用占用，视觉验证用 5180
pnpm test            # vitest run，15 文件 75 测试（PoetPage.test 读真实 public/data 产物，跑前需先 build:data）
pnpm build           # tsc -b && vite build，产物 dist/
pnpm lint            # oxlint
```

⚠️ **无 TTY 环境坑**：`pnpm test/lint` 会触发 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` 误清 node_modules。验证命令直调 `./node_modules/.bin/` 下二进制：`./node_modules/.bin/vitest run`、`./node_modules/.bin/tsc -b`、`./node_modules/.bin/oxlint`、`./node_modules/.bin/tsx scripts/build-data.ts`。

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
  components/map/             # InkMap(d3-zoom) / Trajectory(Catmull-Rom) / MiniMap / CityMarker / WorkMarker / projection / flyTo / basemaps / usePoetIndex / useDynasty(+useDynasties) / usePoetBundle / trajectory.test
  components/sections/         # Timeline / Summary / Quotes / Works 四板块 + TimeSlider + volumeGrouping + volumeNames
  pages/                       # OverviewPage / PoetPage + poet-state（PoetStateProvider key={poetId} 强制重置）
  themes/                      # base.css → tang → poets/*（applyPoetTheme/resetPoetTheme 切/复位 CSS 变量，brush/divider/inscription 各人定制）+ easter-eggs（含 MoonRise/FallingLeaves/MistDrift）+ motifs
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
6. **端口**：5173 被本机另一应用占用，dev 用 `--port=5180`；v0.3 视觉走查实际用的是 5174——任选空闲端口即可，不要写死。
7. **vite.config.ts** 含 `build.cssMinify: 'esbuild'`——绕开 pnpm 不装 `lightningcss-darwin-arm64` 的 bug，勿删。

## 文档地图

| 内容 | 位置 |
|------|------|
| 设计 spec（v0.1） | `docs/superpowers/specs/2026-07-24-poet-trajectory-map-design.md` |
| 设计 spec（v0.2 视觉重设计） | `docs/superpowers/specs/2026-07-27-poet-map-v02-redesign.md` |
| 实施计划（v0.1） | `docs/superpowers/plans/2026-07-24-poet-trajectory-map.md` |
| 实施计划（v0.2） | `docs/superpowers/plans/2026-07-27-poet-map-v02.md` |
| 实施计划（v0.3） | `docs/superpowers/plans/2026-07-29-poet-map-v03.md` |
| 关键决策 D1-D14 | `docs/decisions.md` |
| 五人校对表（事实源） | `docs/proofread/{libai,dufu,wangwei,menghaoran,baijuyi}.md` |
| 验收截图 | `docs/screenshots/`（v0.1）与 `docs/screenshots/v02/`（v0.2，14 张）与 `docs/screenshots/v03/`（v0.3，4 张）与 `docs/screenshots/v04/`（v0.4，21 张） |
| 执行 ledger | `.superpowers/sdd/progress.md` |

## 遗留 Minor 与扩展注意

以下为执行过程中记录、留待后续 triage 的 Minor 与已知项（摘自 `.superpowers/sdd/progress.md`，非新编）：

- **InkMap useEffect 依赖**：仅依赖 `[year]`，`visible/controllerRef/project` 入闭包（Task4/Task5/Task6/Task8 复查项）。
- **WorkMarker 无单测**；**Trajectory 未防御城市缺失**（Task5）。
- **同名作品 DOM id 重复**：brief 自带，留后续（Task7）。
- **glob `Object.values[0]` 取值 / 文件名即 id / applyPoetTheme 测试只断言 1 变量**（Task8）。
- ~~**SlowEnding 位置任意 / 缺 slow-dot CSS / CatchMoon 单测假月**（Task9）。~~（v0.4 Task3 删尽地图彩蛋 + Task10 调参名句彩蛋，三项已清）
- **translateExtent 会 clamp flyTo 越界 transform**：扩展数据（新朝代/新城市）时需回归验证（R2）。
- **当前仅唐朝 5 人 48 城**，横向扩展其他朝代时按 D10 流程，零代码改动。
- **v0.3 终审 triage 保留项**：① 4 个 fetch hook（usePoetIndex/useDynasties/usePoetBundle/useDynasty）同构可 DRY 合并；② MiniMap 与 HeroMap 各自计算 mask 路径长度（双份）；③ `seal-stamp` 与 `seal-stamp-dim` 双 keyframes（前者盖印入场、后者维持 .85 不透，语义不同保留）；④ F1 `opacity:0` 默认窗口（reduced-motion 全局块已兜底）。均有保留理由，详见 `.superpowers/sdd/progress.md`。
