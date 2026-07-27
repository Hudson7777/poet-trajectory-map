interface SectionDividerProps {
  /** 1200×72 SVG 片段（inner markup），由各主题 divider 提供 */
  svg: string
}

/** 山水横卷分隔带：1200×72 容器，渲染主题 divider 的水墨笔触，opacity .5 */
export function SectionDivider({ svg }: SectionDividerProps) {
  return (
    <div className="section-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 72" preserveAspectRatio="xMidYMid meet" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}
