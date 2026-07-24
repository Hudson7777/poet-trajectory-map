import { z } from 'zod'

export const CityEntrySchema = z.object({
  name: z.string().min(1),
  modernName: z.string().min(1),
  lon: z.number().min(70).max(140),
  lat: z.number().min(10).max(55),
  region: z.string().min(1),
})
export const CitiesFileSchema = z.object({
  dynasty: z.string().min(1),
  cities: z.array(CityEntrySchema),
})
export const DynastyEntrySchema = z.object({
  id: z.string().regex(/^[a-z]+$/),
  name: z.string().min(1),
  era: z.tuple([z.number().int(), z.number().int()]),
  divisionName: z.string().min(1),
  basemap: z.string().min(1),
  cities: z.string().min(1),
  projection: z.object({
    lon0: z.number(),
    lat0: z.number(),
    s: z.number(),
    sy: z.number(),
  }),
  viewBox: z.string().regex(/^\d+ \d+ \d+ \d+$/),
})
export const StopSchema = z.object({
  year: z.number().int(),
  city: z.string().min(1),
  event: z.string().min(1),
  role: z.string().min(1),
  eraName: z.string().optional(),
  works: z.array(z.string()).optional(),
  source: z.string().min(1),
  uncertain: z.string().optional(),
})
export const WorkSchema = z.object({
  title: z.string().min(1),
  year: z.number().int(),
  city: z.string().min(1),
  genre: z.enum(['诗', '词', '文', '赋', '曲']),
  text: z.string().min(1),
  background: z.string().min(1),
  famous: z.array(z.string()),
  source: z.string().min(1),
})
export const PoetSchema = z.object({
  id: z.string().regex(/^[a-z]+$/),
  name: z.string().min(1),
  courtesyName: z.string(),
  dynasty: z.string().min(1),
  birth: z.object({ year: z.number().int(), place: z.string() }),
  death: z.object({ year: z.number().int(), place: z.string() }),
  theme: z.string().min(1),
  summary: z.object({
    review: z.string().min(1),
    stats: z.object({
      cities: z.number().int().positive(),
      works: z.string().min(1),
      topOffice: z.string().min(1),
      age: z.number().int().positive(),
    }),
  }),
  stops: z.array(StopSchema).min(1),
  works: z.array(WorkSchema),
})

export type CityEntry = z.infer<typeof CityEntrySchema>
export type CitiesFile = z.infer<typeof CitiesFileSchema>
export type DynastyEntry = z.infer<typeof DynastyEntrySchema>
export type Stop = z.infer<typeof StopSchema>
export type Work = z.infer<typeof WorkSchema>
export type Poet = z.infer<typeof PoetSchema>
