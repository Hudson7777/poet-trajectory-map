# 文人生命轨迹地图

中国历代文人生命轨迹地图：纯静态前端，在大地图上按时间线连接诗人一生的行迹，作品通过「地理 + 时间」双重定位标注在地图上。古风水墨视觉语言，每位诗人一套独立主题色与笔触。

当前收录**唐朝 5 人**：李白、杜甫、王维、孟浩然、白居易。

> 验收截图见 [`docs/screenshots/`](docs/screenshots/)（v0.1）与 [`docs/screenshots/v02/`](docs/screenshots/v02/)（v0.2 视觉重设计，14 张）。

## 功能特性

- **水墨地图**：纯手绘 SVG 底图 + d3-zoom 缩放拖拽（按住 ⌘/Ctrl 滚动缩放，普通滚轮仍滚动页面），托裱边框，地图题字与朱印。
- **生平轨迹**：Catmull-Rom 样条曲线精确穿过每一个城市点，五人各一套笔触——李白洒金游丝、杜甫焦墨枯笔（755 后加粗）、王维青绿渐隐、孟浩然淡墨疏朗、白居易春水杏粉。
- **四板块人物页**：①全屏 Hero 地图 + 底部时间轴拖动渐进绘制 ②生平年表（年谱版式，与地图双向联动）③人物评传 + 生涯数字 ④精华名句（竖排书法）+ 作品集（册页卷轴，按年份分卷，竖排诗题）。
- **五人主题流转**：切人物整页色调 0.6s 流转，纸色、分隔带（淡墨山水横卷）、题字、motif 小印各人定制；每人 3-5 个专属彩蛋（李白水中捉月、杜甫 755 烽烟、王维竹影、孟浩然花瓣、白居易琵琶音符）。
- **存疑处理**：争议点位空心虚线印点 +「存疑」白文小印章，tooltip 附主流说法。
- **数据考证**：每个节点/作品带 `source` 出处（正史本传 + 权威年谱），三级资料（百科等）仅作线索不作依据；五人校对表见 [`docs/proofread/`](docs/proofread/)。

## 快速开始

```bash
pnpm install
pnpm build:data   # 构建数据：zod 校验 + 规则校验，生成 public/data/*.json
pnpm dev          # 开发服务器（5173 被占用时用 pnpm dev --port=5180）
```

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
