# v0.4 设计 spec · UI 打磨十一项（2026-07-31）

> 源起：用户对 v0.3.2 走查后提出 6 + 5 共 11 项改进。基线：HEAD `bf17554`，68 测试全过。
> 字决策总原则：**字体不求每人独特，求契合其人其时代**（用户 2026-07-31 明确放宽独占约束）。

## A. 小地图收拢到年表区

现状：`showMini = hero 滚出视口`，一旦出现直到页底。
改动：TimeSlider + TimelineSection 外包一个 wrapper div（拖滑块时需看小地图联动，滑块区属年表语境），挂第二个 IntersectionObserver；`showMini = heroOut && timelineWrapVisible`。滚入「其人」及以下小地图消失。
切换 poet 时两个 state 都重置（现有 `useEffect(..., [poetId])` 扩展）。

## B. 其人四组件宽度

`.stats` 由 `flex: 1` 等宽改 `display: grid; grid-template-columns: 15% 35% 35% 15%`。
DOM 顺序不变：行迹城市 15 / 存世作品 35 / 仕途最高 35 / 享年 15。移动端媒体查询退化为两列。

## C. 地图彩蛋全删

删配置 10 个（libai: catch-moon/westward-suiye；dufu: straw-hut-hover/snow-mountain；wangwei: bamboo-sway/mountain-ripple/zen-whitespace；baijuyi: lute-notes/slow-ending；menghaoran: lake-level）。
删组件 10 个：CatchMoon / WestwardSuiye / StrawHutHover / BambooSway / MountainRipple / LuteNotes / LakeLevel / SnowMountain / ZenWhitespace / SlowEnding。
删 registry 的 map scope（SCOPE_MAP 中 map-node/decoration 条目）、InkMap/HeroMap 里 `renderEasterEggs(..., 'map', ...)` 调用与 `resolvePosition` 链路、相关 CSS。
**保留**：名句区 5 个 quote-hover 彩蛋（falling-petals/moon-rise/falling-leaves/mist-drift/grass-sway）+ 李白 742 翰林印章（hanlin-seal, timeline scope）。
孤儿清理：被删组件的测试（registry.test 等）、未再引用的 import 一并删。

## D. 名句区彩蛋打磨

以孟浩然 falling-petals 为水准基准（低透明度、慢节奏、局部不遮字），对 moon-rise（李白）/ falling-leaves（杜甫）/ mist-drift（王维）/ grass-sway（白居易）做视觉走查调参。只调参不重写；playwright 悬停截图验收。

## E. 字体：契合其人其时代

| 对象 | 字体 | 说明 |
|------|------|------|
| 李白 | Liu Jian Mao Cao（不动） | 狂草豪放 |
| 杜甫 | Long Cang（不动） | 沉郁手迹 |
| 王维 | Ma Shan Zheng（不动） | 楷正端严 |
| 孟浩然 | Zhi Mang Xing（不动） | 行书自然 |
| 白居易 | **霞鹜文楷 LXGW WenKai** | 平易温润；`types.ts` calligraphy 联合类型加 `'wenkai'`，`CALLIGRAPHY_FONTS` 加 `"LXGW WenKai"`，index.html 加 CDN link（jsdelivr lxgw-wenkai-webfont） |
| 朝代·唐 | **Ma Shan Zheng**（与王维共用，时代契合优先） | dynasties.yaml 新增 `calligraphy: mashan` 字段；schemas.ts 加可选校验；build-data 输出进 dynasties.json；前端朝代 toggle 与下拉项按此渲染（D10 数据驱动，未来朝代注册即得） |

导航诗人切换条：每个名字 inline `fontFamily: CALLIGRAPHY_FONTS[poetThemes[p.id].calligraphy]` + 楷体 fallback，不再跟随当前页 `--font-calligraphy`（对齐 OverviewPage 现有做法）。

## F. 宋体收敛

四个大标题（`.section-title`：生平年表/其人/精华名句/作品集）+ 卷名（`.volume-subtitle`，VOLUME_NAMES）加 `font-calligraphy`。
不动：作品正文、评传、stat-label、cite 等长文/标签保持宋体（可读性）。

## G. 首页排序按出生年

build-data 输出 index.json 时按 birthYear 升序（当前字母序）。副效果：PoetPage 同朝切换条也变时间序（李白→杜甫/王维→孟浩然→白居易），符合预期。
测试注意：交接文档已警示「index.json 顺序勿硬编码断言，从 mock 动态取」——涉及测试同步改。

## H. 首页 hover 动效

poet-card hover：微微抬升（translateY -4px）+ 阴影加深 + accent 细描边晕开 + 该卡 motif 图标触发一次性小动画（月升/竹摇级 CSS keyframe，hover 进触发、出复位）。
入场 stagger（animationDelay i*90ms）保留。reduced-motion 全局块已兜底，新动画同样受其约束。

## I. 时间轴主题化 + 拖动粒子

TimeSlider 重做（纯 CSS/SVG，不引库）：
- 轨道：水墨细线，已过岁月段以诗人 `--accent` 渐变填充
- 拇指：该诗人朱砂印章（`--seal` 色方印）或 motif 图标，拖动手感有阻尼
- 年份数字保持书法体（现状已有）
- 拖动时拇指散出该诗人意象微粒子，淡出即消：李白墨点 / 杜甫落木 / 王维雾丝 / 孟浩然花瓣 / 白居易草屑
- 与 MiniMap/年表联动逻辑（usePoetState year）不变，只换皮加效

## J. 作品年龄 + 卷一起始年

- album-meta 增加「时年 N 岁」：**虚岁**（`year - birthYear + 1`，与 summary stats.age 口径一致——李白 762 年 62 岁即虚岁）。
- 卷一 startYear 取出生年而非首作年：`groupIntoVolumes(works, birthYear?)`，仅首卷 startYear 用 birthYear 覆盖；其余卷逻辑不变。
- WorksSection 增加 `birthYear` prop（PoetPage 传 `bundle.poet.birth.year`）；volumeGrouping.test 更新。

## K. 作品集动效

① 滚动渐入：每张 album-card 进视口时 translateY+opacity 渐入，IO + 按序 stagger（一次性，触发后不再隐藏）。
② 展卷：点开作品详情自上而下展开（max-height/transform-origin top transition）+ 顶部一道卷杆阴影扫过。
纯 CSS transition，不引库；reduced-motion 兜底。

## 验证计划

1. 测试更新：themes.test（wenkai）、registry.test（map scope 移除）、volumeGrouping.test（birthYear）、MiniMap/PoetPage.test（showMini 双条件）、sections.test（font-calligraphy class、时年断言）、排序断言改动态取。
2. `./node_modules/.bin/tsx scripts/build-data.ts && ./node_modules/.bin/vitest run && ./node_modules/.bin/tsc -b && ./node_modules/.bin/oxlint` 全绿。
3. playwright 逐项截图走查 11 项：小地图滚动边界（年表内出现/其人处消失）、其人宽度比、地图无彩蛋残留、名句 hover 彩蛋观感×5、导航字体混排（唐+五诗人各自字体）、大标题/卷名书法体、首页排序与 hover、时间轴印章滑块+拖动粒子、作品时年/卷一起始、滚动渐入+展卷。
4. 窄屏（375px）走查 stats 两列退化与小地图。

## 非目标

- 不扩朝代/文人；不改数据内容（除 dynasties.yaml 的 calligraphy 字段）
- 不为时间轴/作品集动效引入动画库
- 不处理遗留 Minor 清单（4 fetch hook DRY 等）
