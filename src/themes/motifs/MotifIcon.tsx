const PATHS: Record<string, string> = {
  moon: 'M20 4 A16 16 0 1 0 20 36 A12.8 12.8 0 1 1 20 4 Z',
  wine: 'M10 8 h20 l-4 12 a6 6 0 0 1 -12 0 Z M20 26 v8 M14 36 h12',
  lotus: 'M20 6 C14 14 10 20 20 30 C30 20 26 14 20 6 Z M8 22 C12 28 16 32 20 34 C24 32 28 28 32 22',
  sword: 'M12 4 l4 16 -2 10 6 2 6 -2 -2 -10 4 -16 M10 30 h20',
  beacon: 'M14 36 h12 M16 36 V18 h8 V36 M14 14 h12 M18 10 h4 M20 4 v4',
  hut: 'M8 20 L20 8 L32 20 M12 20 v14 h16 v-14',
  boat: 'M6 26 C14 32 26 32 34 26 L30 22 H10 Z M20 6 v14 M20 8 l8 8',
  bamboo: 'M14 36 V6 M14 12 h6 M14 22 h-5 M26 36 V8 M26 16 h-6 M26 26 h5',
  mountain: 'M4 32 L14 12 L20 24 L26 10 L36 32 Z',
  qin: 'M6 28 h28 v4 H6 Z M10 28 v-6 M30 28 v-6 M14 24 h12',
  peach: 'M20 10 C10 14 8 24 14 30 C18 34 26 34 30 28 C34 20 30 10 20 10 Z M20 10 C20 6 24 4 28 4',
  'spring-rain': 'M10 10 l-3 6 M20 10 l-3 6 M30 10 l-3 6 M8 24 l-3 6 M18 24 l-3 6 M28 24 l-3 6',
  apricot: 'M20 8 a5 5 0 0 1 5 5 a5 5 0 0 1 -2 4 a5 5 0 0 1 -6 5 a5 5 0 0 1 -6 -5 a5 5 0 0 1 -2 -4 a5 5 0 0 1 5 -5 a5 5 0 0 1 6 0 Z M20 22 v12',
  lute: 'M20 6 C14 12 14 18 20 22 C14 26 14 32 20 36 C26 32 26 26 20 22 C26 18 26 12 20 6 Z',
  'incense-peak': 'M10 32 C14 20 18 12 20 8 C22 12 26 20 30 32 Z M16 32 h8',
}

export function MotifIcon({ name, size = 40 }: { name: string; size?: number }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
