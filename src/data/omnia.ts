// Central client + product constants for the Omnia Machinery demo.
// The AI layer is named "Anvil": it forges trades from raw inputs — inventory,
// inspection history, buyer demand signals, logistics — sequencing procurement
// and resale so margin and deal-cycle time are protected across regions.

export const CLIENT = {
  name: 'Omnia Machinery',
  legal: 'Omnia Machinery Group',
  short: 'Omnia',
  product: 'Anvil',
  productFull: 'Anvil · Equipment Trading Intelligence',
  ai: 'Anvil',
  principal: 'Sam Brown',
  principalTitle: 'Owner & Director',
  rep: 'Salman',
  firm: 'CodeUpscale',
  hqCity: 'Billingham, Teesside (UK)',
  usOffice: 'Miami, FL',
  desk: 'H. Osei',
  deskRole: 'Trading Desk Lead',
  today: 'Thursday, July 23, 2026',
  now: '15:20',
  tz: 'BST',
  // Real Omnia operating scale (public: exported to 49 countries / 6 continents last year)
  countries: 49,
  continents: 6,
  liveListings: 316,
  yards: 5,
}

/** Euros, compact for headline figures: 41200 -> "€41.2K", 1620000 -> "€1.62M". */
export function eurC(n: number) {
  if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`
  if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}K`
  return `€${n.toLocaleString('en-US')}`
}

/** Full euros: 41200 -> "€41,200". */
export function eur(n: number) {
  return `€${Math.round(n).toLocaleString('en-US')}`
}

/** Signed euros, compact: +14200 -> "+€14.2K". */
export function eurDelta(n: number) {
  const s = n > 0 ? '+' : n < 0 ? '-' : ''
  return `${s}${eurC(Math.abs(n))}`
}

export function pct(n: number, d = 0) {
  return `${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}%`
}

export function pctDelta(n: number, d = 0) {
  const s = n > 0 ? '+' : ''
  return `${s}${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}%`
}

export function num(n: number) {
  return n.toLocaleString('en-US')
}

/** Hours reading, e.g. 10400 -> "10,400 h". */
export function hrs(n: number) {
  return `${n.toLocaleString('en-US')} h`
}
