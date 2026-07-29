import type { CityEntry, DynastyEntry, Poet } from '../src/data/schemas'

export function validatePoet(poet: Poet, cities: CityEntry[], dynasty: DynastyEntry): string[] {
  const errors: string[] = []
  const cityNames = new Set(cities.map(c => c.name))

  for (let i = 1; i < poet.stops.length; i++) {
    if (poet.stops[i].year < poet.stops[i - 1].year) {
      errors.push(`stops[${i}] 年份 ${poet.stops[i].year} 未按升序（前一站 ${poet.stops[i - 1].year}）`)
    }
  }
  for (const stop of poet.stops) {
    if (!cityNames.has(stop.city)) errors.push(`stop ${stop.year}: 城市「${stop.city}」未注册于 ${dynasty.id} 坐标表`)
  }
  const [eraStart, eraEnd] = dynasty.era
  for (const work of poet.works) {
    if (work.year < poet.birth.year || work.year > poet.death.year) {
      errors.push(`作品「${work.title}」年份 ${work.year} 超出 ${poet.name} 生卒年`)
    }
    if (work.year < eraStart || work.year > eraEnd) {
      errors.push(`作品「${work.title}」年份 ${work.year} 超出朝代「${dynasty.name}」纪元`)
    }
    if (!cityNames.has(work.city)) errors.push(`作品「${work.title}」城市「${work.city}」未注册`)
    for (const line of work.famous) {
      if (!work.text.includes(line)) errors.push(`作品「${work.title}」名句「${line}」不在原文中`)
    }
  }
  const sigOwners = new Set<number>()
  for (const line of poet.signature) {
    const idx = poet.works.findIndex(w => w.famous.includes(line))
    if (idx === -1) {
      errors.push(`signature 句「${line}」不属于任何作品的 famous`)
    } else if (sigOwners.has(idx)) {
      errors.push(`signature 多句出自同一作品「${poet.works[idx].title}」`)
    } else {
      sigOwners.add(idx)
    }
  }
  return errors
}
