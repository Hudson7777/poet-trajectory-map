# 文人生命轨迹地图

中国历代文人生命轨迹地图：纯静态前端，在大地图上按时间线连接诗人一生的行迹，作品通过「地理 + 时间」双重定位标注在地图上。古风水墨视觉语言，每位诗人一套独立主题色与笔触。

当前收录**唐朝 5 人**：李白、杜甫、王维、孟浩然、白居易。

当前版本 **v0.4**（已打 tag）。

> 验收截图见 [`docs/screenshots/`](docs/screenshots/)（v0.1）、[`docs/screenshots/v02/`](docs/screenshots/v02/)（v0.2 视觉重设计，14 张）、[`docs/screenshots/v03/`](docs/screenshots/v03/)（v0.3 动效与彩蛋走查，4 张）与 [`docs/screenshots/v04/`](docs/screenshots/v04/)（v0.4 UI 打磨走查，21 张）。

## 功能特性

- **水墨地图**：纯手绘 SVG 底图 + d3-zoom 缩放拖拽（按住 ⌘/Ctrl 滚动缩放，普通滚轮仍滚动页面），托裱边框，地图题字与朱印；右下角姓名/朝代印章放大 100%（移动端 1.5×）。
- **生平轨迹**：Catmull-Rom 样条曲线精确穿过每一个城市点，五人各一套笔触——李白洒金游丝、杜甫焦墨枯笔（755 后加粗）、王维青绿渐隐、孟浩然淡墨疏朗、白居易春水杏粉；默认起始年为出生年，拖动时间轴轨迹从人生起点向前生长。
- **四板块人物页**：①全屏 Hero 地图 + 底部时间轴拖动渐进绘制 ②生平年表（年谱版式，与地图双向联动；悬浮小地图仅在年表区浮现）③人物评传 + 生涯数字（15/35/35/15 宽窄排布）④精华名句（竖排书法，`signature` 字段每人 5 句各属不同作品，构建期校验一句一作）+ 作品集（册页卷轴按年份分卷、卷一自出生年起、每首标注虚岁时年、滚动渐入 + 展卷展开）。
- **主题化时间轴**：朱砂印拇指 + 水墨轨道 + 主题色填充已过岁月；拖动时散出诗人意象微粒子（李白墨点、杜甫落木、王维雾丝、孟浩然花瓣、白居易草屑）；键盘 ←/→/Home/End 可达。
- **五人主题流转**：切人物整页色调 0.6s 流转，纸色、分隔带（淡墨山水横卷）、题字、motif 小印各人定制；书法字体按「契合其人其时代」分配（李白流江毛草、杜甫龙藏、王维马善政、孟浩然志莽行书、白居易霞鹜文楷），导航诗人名各自锁字、朝代亦有专属字体（唐=马善政，`dynasties.yaml` 数据驱动）；总览页每张卡片固定专属书法字体（`resetPoetTheme` 复位根变量，杜绝字体串色）。彩蛋收敛于名句区与年表——五人 quote-hover 彩蛋（李白月升、杜甫落木、王维空山云雾、孟浩然花瓣、白居易草摇）+ 李白 742 翰林印章。
- **人物页导航**：顶部「← 返回总览」+ 同朝诗人切换条 + 朝代下拉（空朝代禁用态），切人自动回顶并流转主题色；总览页按出生年排序、卡片 hover 动效；朝代切换器数据驱动（按 D10 移除硬编码占位）。
- **入场与行笔动效**：人物页地图晕染聚焦 → 题字逐字浮现 → 朱印盖下，年表卷轴自上而下 stagger 展开，轨迹以 SVG mask + WAAPI dashoffset 向前生长（保留五人笔触纹理），总览卡片 stagger 入场；`prefers-reduced-motion` 全局兜底直出。
- **存疑处理**：争议点位空心虚线印点，tooltip 附主流说法。
- **数据考证**：每个节点/作品带 `source` 出处（正史本传 + 权威年谱），三级资料（百科等）仅作线索不作依据；五人校对表见 [`docs/proofread/`](docs/proofread/)。

## 快速开始

```bash
pnpm install
pnpm build:data   # 构建数据：zod 校验 + 规则校验，生成 public/data/*.json
pnpm dev          # 开发服务器（5173 被占用时用 pnpm dev --port=5180）
pnpm test         # vitest run，15 文件 75 测试
```

> 无 TTY 环境（CI、agent 子进程等）下 `pnpm test/lint` 会触发 deps 检查报 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`，直接调二进制即可：`./node_modules/.bin/vitest run`、`./node_modules/.bin/oxlint`、`./node_modules/.bin/tsc -b`、`./node_modules/.bin/tsx scripts/build-data.ts`。

构建产物 `dist/` 为纯静态文件，可直接部署到任意静态托管（GitHub Pages / Vercel / Netlify / Nginx），无需后端与数据库。

## 数据目录结构

```
data/
  dynasties.yaml              # 朝代注册表
  geo/tang/
    basemap.svg               # 唐朝底图（手绘水墨）
    cities.yaml               # 48 城坐标表（古地名 → 今名/经纬度/所属道）
  poets/tang/
    libai.yaml                # 一人一文件：stops（生平节点）+ works（作品）
    dufu.yaml
    wangwei.yaml
    menghaoran.yaml
    baijuyi.yaml
```

数据流：YAML 源文件 → `pnpm build:data`（zod schema + `validatePoet` 规则校验）→ `public/data/*.json` → 前端运行时 fetch。校验不过则退出码非零。

**朝代一等公民**：新增朝代只需在 `dynasties.yaml` 加一行 + 新增 `data/geo/<dynasty>/` 和 `data/poets/<dynasty>/`，代码零改动。

## 技术栈

Vite 8 · React 19 · TypeScript · Tailwind 3 · d3-zoom · zod · pnpm 9

## 相关文档

- 关键决策 D1-D13：[`docs/decisions.md`](docs/decisions.md)
- 设计 spec：[`docs/superpowers/specs/`](docs/superpowers/specs/)
- 实施计划：[`docs/superpowers/plans/`](docs/superpowers/plans/)
- 五人校对表：[`docs/proofread/`](docs/proofread/)
