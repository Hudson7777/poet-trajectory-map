# 文人生命轨迹地图 v0.2 · 视觉/交互重设计 Spec

> 日期：2026-07-27
> 状态：用户已批准（brainstorming 四问确认：滚轮=Ctrl/⌘ 缩放、轨迹=每人一套笔触、差异化=重度、作品集=册页卷轴）
> 背景：v0.1.0 用户走查提出 7 个问题：①地名标注堆叠 ②轨迹线丑且漂移 ③五人设计语言 95% 一致 ④国风细节欠缺 ⑤作品集像在线表格 ⑥地图滚轮劫持页面滚动、地图无边界无附加信息 ⑦地名标注不古风、图标偏大遮挡

## 1. 范围

纯视觉/交互层重设计。数据层（YAML/build-data/校验）零改动；路由与页面结构不变；五人真实数据不变。

## 2. 标注系统重构（问题 1、7）

- CityMarker 默认态：朱砂印点缩小（r=4.5，高亮 8）+ 城市名（书法体小号，paint-order stroke 宣纸色衬底防压线）。年份/事件/官职全部不再默认渲染
- hover → 卷轴式 tooltip（宣纸底+褐绫边 SVG 浮层）：年份朱文 + 事件 + 官职 + 出处；存疑节点附争议全文。click 锁定，再点/点空白关闭（PoetState 加 lockedStop）
- 同城多节点合并为一个印点（HeroMap 按 city 分组），tooltip 内按年份列出全部事件
- 标签避让：城市名位置按标记序号在 右→上→左→下 四方位轮换；缩放 k<0.9 时只显示高亮点与高等级城市名，k≥0.9 全显
- 存疑节点保持空心虚线印点 + 「存疑」白文小印章

## 3. 轨迹线（问题 2）

- 算法：buildTrajectoryPath 的 smooth 模式改为 Catmull-Rom 样条转三次贝塞尔，**曲线精确穿过每一个城市点**（根治漂移）。非 smooth 折线模式不变
- 视觉：双层线条——底层宽淡墨晕染（低 opacity 宽 stroke）+ 上层主线条（不规则 dash 模拟运笔）
- 五人笔触（PoetTheme 新增必填 `brush` token）：
  - 李白 `gold`：洒金游丝——金色渐变 + 金粉颗粒（feTurbulence 位移滤镜），细而飘逸
  - 杜甫 `dry`：焦墨枯笔——深赭粗线 + 飞白断续；755 年起加粗加深（trajectory-style 彩蛋逻辑并入 brush 两段式）
  - 王维 `fade`：青绿细线，末端渐隐
  - 孟浩然 `plain`：淡墨疏朗，低 opacity
  - 白居易 `spring`：春水绿-杏粉温润渐变
- 时间轴渐进点亮保留（按 year 截断）

## 4. 人物差异化·重度（问题 3）

- 底图纸色五变体：basemap.svg 的底色 rect 改为 `fill="var(--paper, #f6f1e3)"`，由 applyPoetTheme 已设置的 --paper（各人物 paperTone）驱动
- 板块分隔带：PoetTheme 新增必填 `divider`（淡墨山水横卷 SVG 片段）：李白=长江月影、杜甫=秦陇烽台、王维=辋川青绿、孟浩然=江南春山、白居易=钱塘春景；PoetPage 在四大板块之间渲染 SectionDivider
- 地图题字：HeroMap 叠加层——左上竖排代表诗句+姓名生卒（PoetTheme 新增必填 `inscription`），右下姓名朱印（各人 seal 色）+「唐」朝代印
- 板块标题旁带各人 motif 小印（MotifIcon 首意象）
- 年表年份、作品卡绫边、生涯数字全部 accent 化

## 5. 国风全局（问题 4）

- 纸纹从总览页提升到全局（PoetPage 同样覆盖）
- 所有卡片统一托裱（mounted-card 扩展到年表、stats、tooltip）
- 年份数字全站书法体；作品分卷用「卷一/卷二」中文编号
- 存疑标签改白文小印章样式（微旋转）
- 年表改年谱版式：左侧竖线 + 朱砂节点

## 6. 作品集·册页（问题 5）

- 按年份自动分卷：连续年份间隔 >6 年或每卷满 6 首即分卷；卷首题签「卷一 7XX—7XX」（卷号中文数字+起止年）
- 作品卡改册页：笺纸底+绫边托裱；右侧竖排诗题（writing-mode: vertical-rl）；年号+系地朱文小字；点开横排全文+背景+出处；卡间留「隔水」间距；hover 微抬升+绫边加深

## 7. 地图框架与缩放（问题 6）

- InkMap 加 zoom filter：wheel 事件仅 ctrlKey/metaKey 时缩放；拖拽/触摸/双指不变；普通滚轮还给人页面滚动
- translateExtent 限制在 viewBox 范围内，防拖丢
- 地图右下淡灰小字「按住 ⌘ 滚动缩放」
- 地图容器加托裱边框（绫边+宣纸框），视觉边界=交互边界
- 左下图例：实心印点=生平节点 / 卷轴标=作品 / 空心=存疑

## 8. 接口变更汇总

- `PoetTheme` 新增必填：`brush`（{ kind: 'gold'|'dry'|'fade'|'plain'|'spring', colors: [string, string], width: number }）、`divider`（SVG 片段字符串）、`inscription`（{ line: string, sub: string }）
- `PoetState` 新增 `lockedStop / setLockedStop`
- `Trajectory` 的 props：`style` 改为 `brush: BrushStyle` + `intense?: boolean`（杜甫 755 后）；原 easterEgg trajectory-style 类型从主题与 registry 中移除（逻辑并入 brush）
- `CityMarker` props 重构：{ group: Stop[], position, highlighted, labelSide, showLabel, onHover, onLock }
- `InkMap` 新增 `framed?: boolean`（托裱边框与附加信息由 HeroMap 叠加层承载）

## 9. 测试与验收

- buildTrajectoryPath 新测试：断言曲线穿过每个输入点（每个中间点作为某个 C 段的终点出现）
- zoom filter 测试：wheel 无修饰键返回 false、有 ctrl/meta 返回 true、drag 返回 true
- 标注合并测试：同城多 stop 合并为一个 marker
- 主题测试：brush/divider/inscription 三 token 必填校验
- 最终走查：五人页 playwright 截图逐项核对原 7 问题全闭合（标注不堆叠/轨迹穿点且有笔触/五人差异可见/国风细节/册页作品集/滚轮滚页面+⌘缩放/标注古风无遮挡），截图存档 docs/screenshots/v02/
