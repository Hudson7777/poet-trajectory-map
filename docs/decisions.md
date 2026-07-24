# 文人生命轨迹地图 · 关键决策记录

> 本文件记录 brainstorming 阶段用户逐条确认的决策，是后续 spec/plan 的唯一事实源。
> 状态：进行中（第 1-2 节已确认，第 3-5 节待确认）

## 项目一句话

中国历代文人生命轨迹地图：大地图 + 朝代切换 + 人物切换，生平轨迹按时间线连接，作品通过地理+时间双重定位标注在地图上，古风（纯手绘水墨）设计语言。

## 已确认决策

- **D1 内容范围（MVP）**：只做唐朝一代做透，5-8 人（李白/杜甫/王维/孟浩然/白居易等），验证数据管线和技术方案后再横向扩展其他朝代。
- **D2 交付形态**：工程化前端项目。独立仓库 `~/Desktop/poet-trajectory-map`，Vite + React 18 + TypeScript + Tailwind + pnpm（与 personal-website frontend 栈完全对齐）。可维护、可拓展，为日后集成进个人网站做准备（路由 `/poets` 命名空间、主题 CSS 变量隔离、产物纯静态 + 数据按人物分包）。
- **D3 底图方案**：纯手绘水墨风 SVG（方案B）。疆域/州界写意不追求几何精确，**城市点位仍按精确经纬度考证**。
- **D4 地图交互**：自绘 SVG + d3-zoom 缩放/拖拽，标签与作品标记随缩放显隐。不用 Leaflet。
- **D5 数据深度**：每人生平 15-25 个关键节点（可考年份+地点+事件+身份官职），作品 15-30 首有明确系年系地的代表作。
- **D6 主题设计**：统一水墨基底与布局框架，每人一套主题色 + 意象元素（李白=青莲月白+酒金、杜甫=沉郁赭石+烽烟、王维=辋川青绿+竹、白居易=江南杏花+浅绯），切换人物整页色调流转。
- **D7 页面板块**（全选）：①生平年表（与地图双向联动，点击年份飞到对应城市）②人物总结 + 生涯数字（评传式总结 + 行迹城市数/存世作品数/仕途最高/寿命）③精华名句（3-5 句，竖排书法/卷轴）④作品集（按城市/时期筛选，全文+创作背景）。
- **D8 争议处理**：存疑点位明确标注「存疑」徽记并给出主流说法，不硬凑。宁缺毋滥。
- **D9 数据组织**：静态 YAML 源文件（一人物一文件，`data/poets/`）→ 构建脚本 schema 校验编译 → JSON（一人物一包）。构建期校验不过则构建失败。目录/产物按「将来运行时按需加载」的形状设计，可无缝迁移。
- **D10 朝代扩展性**：朝代一等公民。`data/dynasties.yaml` 注册表（id/name/era/divisionName/basemap/cities/**projection/viewBox**——critic 复审后增补，渲染层也数据驱动）；地理数据按朝代分桶 `data/geo/<dynasty>/`；人物数据按朝代分桶 `data/poets/<dynasty>/`；作品有 `genre` 字段（诗/词/文/赋/曲）；生平节点公元年份为键 + 可选年号 eraName 仅展示；扩新朝代 = 新增地理文件 + 人物文件 + 注册表一行，代码零改动。

## 数据模型要点（D9/D10 细化）

- 人物 YAML：id/name/courtesyName/dynasty/birth/death/theme/summary(review+stats)/stops/works
- stop：year/city/event/role/works[]/uncertain?
- work：title/year/city/genre/text/background/famous[]/source
- 城市坐标表按朝代独立：`data/geo/tang/cities.yaml` = 唐代地名 → {今名, 经纬度, 所属道}
- 构建校验：stops 按年升序；city 必须注册于本朝坐标表；work.year ∈ 人物生卒年且 ∈ 朝代 era；famous 是 text 子串；uncertain 节点 UI 显示存疑标识

## 底图 mockup（已生成并验证）

- 对比页：~/Documents/claude-outputs/文人轨迹地图-方案对比.html
- 方案A（数据古风）：~/Documents/claude-outputs/文人轨迹地图-方案A-数据古风渲染.html
- 方案B（手绘水墨，已选定）：~/Documents/claude-outputs/文人轨迹地图-方案B-手绘水墨风.html
- 生成脚本在 /tmp/pm/（geometry.py + gen_a.py + gen_b.py，GeoJSON 来自阿里云 DataV 占位，正式底图需重新手绘）

## 待确认（设计呈现后续章节）

（全部确认完毕，进入 spec 写作）

## 第 5 节确认：数据考证流程（D13）

- 资料三级：一级=正史本传（旧/新唐书，ctext.org 核原文）+权威年谱系年（詹瑛《李白诗文系年》、郁贤皓《李太白全集校注》、仇兆鳌《杜诗详注》、赵殿成《王右丞集笺注》、朱金城《白居易集笺校》）；二级=谭其骧《中国历史地图集》、CBDB、CHGIS（地名今释与坐标复核）；三级=百科/自媒体禁作依据仅可找线索
- 每人三轮：①骨架轮（生平节点+出处）②作品轮（逐首系年系地+依据，无法定位者不收）③校验轮（时间线自洽+坐标复核+YAML 构建校验）
- 每个 stop/work 带 source 出处必填；uncertain 写明各方说法；每人产出后给用户一份校对表（年份/地点/事件/出处）抽查，打回重做不进入下一人
- 检索纪律：super-search（禁 WebSearch）、article-reader 读全文、citadel 读学城；写入 subagent prompt
- 评传总结由 Claude 基于正史撰写随校对表送审；传说类内容（如捉月）必须标明「传说」

## 第 3 节确认：页面结构与交互（D11）

- 两页：总览页 `/poets`（朝代切换器 + 人物卷轴卡片墙 + 项目说明）；人物页 `/poets/tang/:poetId` 纵向四段式
- 四段：①Hero 全屏水墨地图（d3-zoom、轨迹线、朱砂印点、作品卷轴标记、题字、底部可拖动时间轴）②生平年表（与地图双向联动）③人物总结+生涯数字 ④精华名句（竖排书法）+作品集（全文+背景+地图定位）
- 核心交互：时间轴拖动→轨迹渐进绘制+地图飞行；年表 hover/click ↔ 地图高亮/flyTo；存疑=空心印点+说明；切人不刷新页面、主题色流转、URL 同步；移动端时间轴简化横滑

## 第 4 节确认（修订版）：主题系统与水墨质感（D12）

- 字体：引入 Google Fonts 开源书法字体按人物分配（刘健毛草=李白、龙藏=杜甫、马善政=王维、志莽行书=孟浩然/白居易），unicode-range 分包加载，fallback 系统楷体栈；正文宋体系；名句竖排
- 水墨强化：SVG 纸纹滤镜；板块分隔带=淡墨山水横卷且每人不同；卡片"托裱"效果；数字衬淡墨晕染；极淡山水 parallax（纯 transform）
- 主题三层架构：全局水墨基底 base.css → 朝代基底 tang.css → 个人主题 themes/poets/*.ts（七类 token：accent/accentSoft/inkTone/paperTone/seal/motifs/calligraphy），`data-poet` 属性切换 + 0.6s 色调流转动画
- 主题必须契合人物生平/作品风格并写明出处（谪仙·明月=李白、诗史·烽燧=杜甫、辋川·空山=王维、鹿门·春晓=孟浩然、江南·香山=白居易），不千篇一律
- 彩蛋系统：每人 3-5 个专属彩蛋（如李白水中捉月/洒金轨迹，杜甫 755 烽烟轨迹/草堂掀顶，王维竹影摇曳/空山涟漪，孟浩然花瓣缓落，白居易浔阳琵琶音符），配置驱动 `theme.easterEggs`，组件化 opt-in
- 主题/意象视觉设计阶段调用 frontend-design skill 做审美评审
