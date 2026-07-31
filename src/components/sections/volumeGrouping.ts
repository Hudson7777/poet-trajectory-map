import type { Work } from '../../data/schemas'

export interface Volume {
  title: string
  startYear: number
  endYear: number
  works: Work[]
}

const CHINESE_NUMERALS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

function volumeTitle(index: number): string {
  // index 1-based；支持到卷十
  const n = index <= 10 ? CHINESE_NUMERALS[index] : String(index)
  return `卷${n}`
}

const MAX_VOLUME_SIZE = 6
const YEAR_GAP_THRESHOLD = 6

/**
 * 按年份升序遍历作品，相邻作品年份差 >6 或当前卷已满 6 首即开新卷。
 * 卷号用中文数字（卷一/卷二/卷三…，支持到卷十）。
 * birthYear 传入时卷一 startYear 取出生年。
 */
export function groupIntoVolumes(works: Work[], birthYear?: number): Volume[] {
  if (works.length === 0) return []
  const sorted = [...works].sort((a, b) => a.year - b.year)

  const volumes: Volume[] = []
  let current: Volume = {
    title: volumeTitle(1),
    startYear: birthYear ?? sorted[0].year,
    endYear: sorted[0].year,
    works: [],
  }

  for (const w of sorted) {
    const gap = w.year - current.endYear
    const volumeFull = current.works.length >= MAX_VOLUME_SIZE
    if (current.works.length > 0 && (gap > YEAR_GAP_THRESHOLD || volumeFull)) {
      volumes.push(current)
      current = {
        title: volumeTitle(volumes.length + 1),
        startYear: w.year,
        endYear: w.year,
        works: [],
      }
    }
    current.works.push(w)
    current.endYear = w.year
  }
  volumes.push(current)
  return volumes
}
