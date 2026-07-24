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

export type { CityEntry, DynastyEntry, Poet, Stop, Work } from './schemas'
