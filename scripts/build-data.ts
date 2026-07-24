#!/usr/bin/env tsx
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { CitiesFileSchema, DynastyEntrySchema, PoetSchema } from '../src/data/schemas'
import { validatePoet } from './validate'
import type { PoetBundle, PoetIndexEntry } from '../src/data/types'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = DynastyEntrySchema.array().parse(
  parse(readFileSync(join(root, 'data/dynasties.yaml'), 'utf8')),
)

const index: PoetIndexEntry[] = []
let failed = false

for (const dynasty of registry) {
  const citiesFile = CitiesFileSchema.parse(
    parse(readFileSync(join(root, 'data', dynasty.cities), 'utf8')),
  )
  const cityMap = Object.fromEntries(citiesFile.cities.map(c => [c.name, c]))
  const poetsDir = join(root, 'data/poets', dynasty.id)
  let files: string[] = []
  try {
    files = readdirSync(poetsDir).filter(f => f.endsWith('.yaml') && !f.startsWith('_'))
  } catch { continue }
  const outDir = join(root, 'public/data', dynasty.id)
  mkdirSync(outDir, { recursive: true })
  for (const file of files) {
    const poet = PoetSchema.parse(parse(readFileSync(join(poetsDir, file), 'utf8')))
    if (poet.dynasty !== dynasty.id) {
      console.error(`${file}: dynasty 字段「${poet.dynasty}」与目录「${dynasty.id}」不符`)
      failed = true
      continue
    }
    const errors = validatePoet(poet, citiesFile.cities, dynasty)
    if (errors.length) {
      errors.forEach(e => console.error(`${file}: ${e}`))
      failed = true
      continue
    }
    const bundle: PoetBundle = {
      poet,
      cities: cityMap,
    }
    writeFileSync(join(outDir, `${poet.id}.json`), JSON.stringify(bundle, null, 2))
    index.push({
      id: poet.id, dynasty: dynasty.id, name: poet.name,
      birthYear: poet.birth.year, deathYear: poet.death.year,
      representativeLine: poet.works[0]?.famous[0] ?? '', theme: poet.theme,
    })
    console.log(`✓ ${dynasty.name}·${poet.name} → public/data/${dynasty.id}/${poet.id}.json`)
  }
}

if (!failed) {
  writeFileSync(join(root, 'public/data/index.json'), JSON.stringify(index, null, 2))
  writeFileSync(join(root, 'public/data/dynasties.json'), JSON.stringify(registry, null, 2))
  console.log(`✓ index.json（${index.length} 人）+ dynasties.json`)
} else {
  console.error('数据校验失败')
  process.exit(1)
}
