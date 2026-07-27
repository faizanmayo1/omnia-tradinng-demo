// Closed transactions — Omnia's own sales book.
//
// Automated pricing is genuinely hard for this catalogue: public auction
// results and manufacturer spec data are thin for used heavy plant in these
// classes. So Anvil does not pretend to read the open market. It values a unit
// against what Omnia itself has actually achieved for comparable machines into
// comparable destinations — data the business already owns.

import type { Category, Machine } from './machines'

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

export const SALES: Sale[] = [
  // --- Komatsu PC210 class: the corridor Omnia moves most often ---
  { id: 'S-7712', make: 'Komatsu', model: 'PC210LC-8', category: 'Excavator', year: 2013, hours: 11200, dest: 'Tema, Ghana', flag: '🇬🇭', price: 40600, soldOn: 'Jun 2026', daysToSell: 16, buyer: 'Adinkra Civil Works' },
  { id: 'S-7688', make: 'Komatsu', model: 'PC210LC-8', category: 'Excavator', year: 2012, hours: 13100, dest: 'Apapa, Nigeria', flag: '🇳🇬', price: 38200, soldOn: 'May 2026', daysToSell: 23, buyer: 'Lekki Infrastructure Ltd' },
  { id: 'S-7641', make: 'Komatsu', model: 'PC210LC-8', category: 'Excavator', year: 2014, hours: 9400, dest: 'Tema, Ghana', flag: '🇬🇭', price: 43400, soldOn: 'Apr 2026', daysToSell: 11, buyer: 'Volta Basin Contractors' },
  { id: 'S-7590', make: 'Komatsu', model: 'PC210-8', category: 'Excavator', year: 2011, hours: 14800, dest: 'Apapa, Nigeria', flag: '🇳🇬', price: 34900, soldOn: 'Mar 2026', daysToSell: 31, buyer: 'Northgate Plant Hire' },

  // --- Other excavators ---
  { id: 'S-7703', make: 'Caterpillar', model: '320D', category: 'Excavator', year: 2011, hours: 16100, dest: 'Dar es Salaam, Tanzania', flag: '🇹🇿', price: 32400, soldOn: 'Jun 2026', daysToSell: 44, buyer: 'Coastal Plant Tanzania' },
  { id: 'S-7655', make: 'Caterpillar', model: '336DL', category: 'Excavator', year: 2012, hours: 14600, dest: 'Mombasa, Kenya', flag: '🇰🇪', price: 63800, soldOn: 'May 2026', daysToSell: 29, buyer: 'Rift Valley Aggregates' },
  { id: 'S-7612', make: 'Volvo', model: 'EC220DL', category: 'Excavator', year: 2014, hours: 9800, dest: 'Callao, Peru', flag: '🇵🇪', price: 58600, soldOn: 'Apr 2026', daysToSell: 26, buyer: 'Andes Mining Supply' },
  { id: 'S-7561', make: 'Hitachi', model: 'ZX350LC-6', category: 'Excavator', year: 2015, hours: 8200, dest: 'Jebel Ali, UAE', flag: '🇦🇪', price: 71900, soldOn: 'Feb 2026', daysToSell: 19, buyer: 'Gulf Plant Trading' },

  // --- Cranes ---
  { id: 'S-7698', make: 'Liebherr', model: 'LTM 1090-4.2', category: 'Crane', year: 2011, hours: 10600, dest: 'Jebel Ali, UAE', flag: '🇦🇪', price: 243000, soldOn: 'Jun 2026', daysToSell: 52, buyer: 'Gulf Lifting Services' },
  { id: 'S-7602', make: 'Tadano', model: 'Faun HK 40', category: 'Crane', year: 2013, hours: 12300, dest: 'Nhava Sheva, India', flag: '🇮🇳', price: 136500, soldOn: 'Apr 2026', daysToSell: 38, buyer: 'Konkan Heavy Movers' },
  { id: 'S-7548', make: 'Grove', model: 'GMK5150', category: 'Crane', year: 2009, hours: 15400, dest: 'Callao, Peru', flag: '🇵🇪', price: 164000, soldOn: 'Feb 2026', daysToSell: 61, buyer: 'Pacífico Izaje SAC' },

  // --- Dozers ---
  { id: 'S-7674', make: 'Caterpillar', model: 'D6R', category: 'Dozer', year: 2011, hours: 13800, dest: 'Apapa, Nigeria', flag: '🇳🇬', price: 84500, soldOn: 'May 2026', daysToSell: 21, buyer: 'Lekki Infrastructure Ltd' },
  { id: 'S-7583', make: 'Komatsu', model: 'D65PX-17', category: 'Dozer', year: 2015, hours: 7600, dest: 'Tema, Ghana', flag: '🇬🇭', price: 104200, soldOn: 'Mar 2026', daysToSell: 18, buyer: 'Sahel Roads Consortium' },

  // --- Wheel loaders ---
  { id: 'S-7667', make: 'Komatsu', model: 'WA380-6', category: 'Wheel Loader', year: 2013, hours: 11400, dest: 'Mombasa, Kenya', flag: '🇰🇪', price: 66300, soldOn: 'May 2026', daysToSell: 24, buyer: 'Rift Valley Aggregates' },
  { id: 'S-7574', make: 'Volvo', model: 'L120F', category: 'Wheel Loader', year: 2012, hours: 14200, dest: 'Dar es Salaam, Tanzania', flag: '🇹🇿', price: 54100, soldOn: 'Mar 2026', daysToSell: 41, buyer: 'Coastal Plant Tanzania' },

  // --- Road construction ---
  { id: 'S-7686', make: 'Bomag', model: 'BW 213 D-5', category: 'Roller', year: 2014, hours: 6100, dest: 'Tema, Ghana', flag: '🇬🇭', price: 43800, soldOn: 'May 2026', daysToSell: 14, buyer: 'Sahel Roads Consortium' },
  { id: 'S-7539', make: 'Caterpillar', model: '140M', category: 'Motor Grader', year: 2012, hours: 12400, dest: 'Apapa, Nigeria', flag: '🇳🇬', price: 92700, soldOn: 'Feb 2026', daysToSell: 33, buyer: 'Federal Roads Contractor' },

  // --- Specialist ---
  { id: 'S-7625', make: 'Sandvik', model: 'DD421', category: 'Drill Rig', year: 2013, hours: 9600, dest: 'Jebel Ali, UAE', flag: '🇦🇪', price: 186000, soldOn: 'Apr 2026', daysToSell: 68, buyer: 'Emirates Tunnelling' },
  { id: 'S-7597', make: 'Sennebogen', model: '830 M', category: 'Material Handler', year: 2014, hours: 10200, dest: 'Nhava Sheva, India', flag: '🇮🇳', price: 109800, soldOn: 'Mar 2026', daysToSell: 35, buyer: 'Konkan Heavy Movers' },
]

export type Comps = {
  comps: Sale[]
  low: number
  high: number
  confidence: 'High' | 'Medium' | 'Low'
  basis: 'model' | 'category'
}

/**
 * Normalise a model string so PC210LC-8 and PC210-8 count as the same family.
 * Omnia's book is small enough that being strict about trim codes would leave
 * most units with no comparables at all.
 */
function family(model: string) {
  return model.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(LC|PX|DL|D|M|F)?\d?$/, '')
}

/**
 * Value a unit against Omnia's own achieved prices. Each comparable is nudged
 * for hours (~1% per 1,000 hours) and age (~2% per year) before the range is
 * taken, so a low-hour unit is not priced off a worn one.
 */
export function compsFor(m: Machine): Comps {
  const byModel = SALES.filter((s) => family(s.model) === family(m.model))
  const basis: Comps['basis'] = byModel.length >= 2 ? 'model' : 'category'
  const comps = basis === 'model' ? byModel : SALES.filter((s) => s.category === m.category)

  if (!comps.length) {
    return { comps: [], low: m.predResale, high: m.predResale, confidence: 'Low', basis }
  }

  const adjusted = comps.map((s) => {
    const hoursAdj = (s.price * (s.hours - m.hours)) / 100_000
    const yearAdj = s.price * (m.year - s.year) * 0.02
    return s.price + hoursAdj + yearAdj
  })

  const round = (n: number) => Math.round(n / 100) * 100
  const low = round(Math.min(...adjusted))
  const high = round(Math.max(...adjusted))

  let confidence: Comps['confidence'] = comps.length >= 4 ? 'High' : comps.length >= 2 ? 'Medium' : 'Low'
  if (basis === 'category' && confidence !== 'Low') {
    confidence = confidence === 'High' ? 'Medium' : 'Low'
  }

  return { comps: comps.slice(0, 4), low, high, confidence, basis }
}

export const SALES_STATS = {
  closed: SALES.length,
  window: '6 months',
  avgDaysToSell: Math.round(SALES.reduce((s, x) => s + x.daysToSell, 0) / SALES.length),
}
