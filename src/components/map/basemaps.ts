const basemapModules = import.meta.glob('../../../data/geo/*/basemap.svg', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

export function getBasemapRaw(dynastyId: string): string {
  return basemapModules[`../../../data/geo/${dynastyId}/basemap.svg`] ?? ''
}
