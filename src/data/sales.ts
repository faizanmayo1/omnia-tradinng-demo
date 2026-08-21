// Closed transactions — Omnia's own sales book.
//
// Automated pricing is genuinely hard for this catalogue. Sam put it plainly on the call:
// "a lot of the equipment that we sell is quite niche… the prices of them aren't published
// online too often. There's not a lot of auction results that you can use." Asked whether
// European finance data exists, he answered himself: "I don't think it exists, to be honest."
//
// So Anvil does not pretend to read the open market. It values a unit against what Omnia
// itself has achieved for comparable machines into comparable destinations — data the
// business already owns.
//
// The book is deliberately UNEVEN. Some model families have a dozen closed sales behind
// them, some have two, and some have none at all. That is the truth of a niche catalogue,
// and it is what lets the platform say "I don't know" instead of inventing a number.

import {
  CATALOG,
  DESTINATIONS,
  between,
  intBetween,
  mulberry32,
  pick,
  round,
  type Category,
  type Machine,
} from './catalog'

export type Sale = {
  id: string
  make: string
  model: string
  category: Category
  year: number
  hours: number
  dest: string
  flag: string
  price: number // achieved, landed
  soldOn: string
  daysToSell: number
  buyer: string
}

const MONTHS = ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026']

const BUYER_PREFIX = [
  'Adinkra', 'Volta Basin', 'Lekki', 'Northgate', 'Rift Valley', 'Coastal', 'Gulf',
  'Andes', 'Konkan', 'Sahel', 'Tema Port', 'Accra', 'Kaduna', 'Mombasa', 'Zanzibar',
  'Emirates', 'Sharjah', 'Deccan', 'Lima', 'Atacama', 'Cape', 'Kilimanjaro',
]
const BUYER_SUFFIX = [
  'Civil Works', 'Contractors', 'Aggregates', 'Infrastructure Ltd', 'Plant Hire',
  'Quarries', 'Construction', 'Roads Consortium', 'Mining Supply', 'Heavy Movers',
  'Lifting Services', 'Trading Co', 'Engineering',
]

/**
 * Hand-written sales behind the hero cluster. The Chieftain family is one Omnia trades
 * often, so it is the dense end of the book — the case where Anvil can price with
 * confidence and show its working.
 */
const FEATURED_SALES: Sale[] = [
  { id: 'S-7712', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2015, hours: 5600, dest: 'Tema, Ghana', flag: '🇬🇭', price: 104_500, soldOn: 'Jun 2026', daysToSell: 16, buyer: 'Adinkra Civil Works' },
  { id: 'S-7688', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2014, hours: 7100, dest: 'Apapa, Nigeria', flag: '🇳🇬', price: 96_200, soldOn: 'May 2026', daysToSell: 23, buyer: 'Lekki Infrastructure Ltd' },
  { id: 'S-7641', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2017, hours: 3400, dest: 'Tema, Ghana', flag: '🇬🇭', price: 118_400, soldOn: 'Apr 2026', daysToSell: 11, buyer: 'Volta Basin Contractors' },
  { id: 'S-7590', make: 'Powerscreen', model: 'Chieftain 1400', category: 'Screener', year: 2013, hours: 9200, dest: 'Apapa, Nigeria', flag: '🇳🇬', price: 78_900, soldOn: 'Mar 2026', daysToSell: 31, buyer: 'Kaduna Quarries' },
  { id: 'S-7734', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2016, hours: 4800, dest: 'Mombasa, Kenya', flag: '🇰🇪', price: 109_800, soldOn: 'Jul 2026', daysToSell: 19, buyer: 'Rift Valley Aggregates' },
  { id: 'S-7756', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2016, hours: 6100, dest: 'Jebel Ali, UAE', flag: '🇦🇪', price: 106_700, soldOn: 'Jul 2026', daysToSell: 14, buyer: 'Emirates Aggregates' },
  { id: 'S-7601', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2014, hours: 8300, dest: 'Dar es Salaam, Tanzania', flag: '🇹🇿', price: 91_400, soldOn: 'Apr 2026', daysToSell: 38, buyer: 'Kilimanjaro Quarries' },
  { id: 'S-7669', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', year: 2018, hours: 2200, dest: 'Tema, Ghana', flag: '🇬🇭', price: 126_300, soldOn: 'May 2026', daysToSell: 9, buyer: 'Tema Port Construction' },
]

/**
 * Density of the closed-sales book per model family:
 *   dense — Omnia trades this often, comps are plentiful
 *   thin  — a couple of sales, enough to indicate but not to be confident about
 *   none  — never sold one, so Anvil should decline to value it
 */
function generateSales(seed = 0x53414c45 /* "SALE" */): Sale[] {
  const r = mulberry32(seed)
  const out: Sale[] = []
  let n = 7000

  for (const entry of CATALOG) {
    for (const { make, model } of entry.models) {
      // Skip the hero family — it is hand-written above.
      if (model === 'Chieftain 2100X') continue

      const roll = r()
      const count = roll < 0.28 ? intBetween(r, 6, 14) : roll < 0.72 ? intBetween(r, 1, 3) : 0
      if (!count) continue

      for (let i = 0; i < count; i++) {
        const year = intBetween(r, 2009, 2020)
        const age = 2026 - year
        const hours = round(intBetween(r, 500, 1500) * age, 100)
        const condition = Math.max(0.3, 1 - age * 0.05 - (hours / 26_000) * 0.2)
        // Achieved landed prices run above the European asking band — export premium.
        const price = round(between(r, entry.low, entry.high) * condition * between(r, 1.06, 1.24), 100)
        const { dest, flag } = pick(r, DESTINATIONS)

        out.push({
          id: `S-${(n += 1)}`,
          make,
          model,
          category: entry.category,
          year,
          hours,
          dest,
          flag,
          price,
          soldOn: pick(r, MONTHS),
          daysToSell: intBetween(r, 8, 74),
          buyer: `${pick(r, BUYER_PREFIX)} ${pick(r, BUYER_SUFFIX)}`,
        })
      }
    }
  }

  return out
}

export const SALES: Sale[] = [...FEATURED_SALES, ...generateSales()]

export type Comps = {
  comps: Sale[]
  low: number
  high: number
  /** 'None' means Omnia has never sold anything comparable — say so rather than guess. */
  confidence: 'High' | 'Medium' | 'Low' | 'None'
  basis: 'model' | 'category' | 'none'
  /** How many closed sales stand behind the estimate. Shown to the trader verbatim. */
  sampleSize: number
  /** Sales in the same category — context for a None result, never used to price. */
  categorySeen: number
}

/**
 * Normalise a model string so Chieftain 2100X and Chieftain 2100 count as the same family.
 * Omnia's book is thin enough that being strict about trim codes would leave most units
 * with no comparables at all.
 */
function family(model: string) {
  return model.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(LC|PX|DL|D|M|F|I|X|S)?\d?$/, '')
}

/**
 * Value a unit against Omnia's own achieved prices. Each comparable is nudged for hours
 * (~1% per 1,000 hours) and age (~2% per year) before the range is taken, so a low-hour
 * unit is not priced off a worn one.
 *
 * Where the book has nothing comparable this returns confidence 'None' and no range. That
 * is the honest answer for niche plant, and it is more useful to a trader than a confident
 * number with nothing behind it.
 */
export function compsFor(m: Machine): Comps {
  const byModel = SALES.filter((s) => family(s.model) === family(m.model))
  const byCategory = SALES.filter((s) => s.category === m.category)

  // Evidence means like-for-like. "We have sold twelve other screeners" does not price a
  // model Omnia has never traded, so a model family with no closed sales returns None and
  // the screen says so. On a niche catalogue that honesty is worth more than a number —
  // Sam has already told us the public data he would check it against does not exist.
  if (!byModel.length) {
    return {
      comps: [],
      low: 0,
      high: 0,
      confidence: 'None',
      basis: 'none',
      sampleSize: 0,
      categorySeen: byCategory.length,
    }
  }

  const basis: Comps['basis'] = 'model'
  const comps = byModel

  const adjusted = comps.map((s) => {
    const hoursAdj = (s.price * (s.hours - m.hours)) / 100_000
    const yearAdj = s.price * (m.year - s.year) * 0.02
    return s.price + hoursAdj + yearAdj
  })

  const r2 = (n: number) => Math.round(n / 100) * 100
  const low = r2(Math.min(...adjusted))
  const high = r2(Math.max(...adjusted))

  const confidence: Comps['confidence'] =
    comps.length >= 6 ? 'High' : comps.length >= 3 ? 'Medium' : 'Low'

  return {
    comps: comps.slice(0, 4),
    low,
    high,
    confidence,
    basis,
    sampleSize: comps.length,
    categorySeen: byCategory.length,
  }
}

export const SALES_STATS = {
  closed: SALES.length,
  window: '6 months',
  avgDaysToSell: Math.round(SALES.reduce((s, x) => s + x.daysToSell, 0) / SALES.length),
  /** Model families Omnia has actually closed a sale on — the reach of the comps book. */
  familiesCovered: new Set(SALES.map((s) => family(s.model))).size,
}
