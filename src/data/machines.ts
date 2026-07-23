// Inventory — used heavy plant Omnia holds across its yards, with the AI
// (Anvil) resale prediction attached to each unit. Figures are illustrative but
// modelled on Omnia's real catalogue (Komatsu, Caterpillar, Volvo, Hitachi,
// Liebherr, Tadano, Sandvik, Bomag) and realistic used-market economics (EUR).

export type Category =
  | 'Excavator'
  | 'Crane'
  | 'Dozer'
  | 'Wheel Loader'
  | 'Motor Grader'
  | 'Roller'
  | 'Drill Rig'
  | 'Material Handler'

export type MStatus = 'ready' | 'inspection' | 'reserved' | 'in-transit'
export type Tier = 'hot' | 'warm' | 'cool'

export type Machine = {
  id: string
  make: string
  model: string
  category: Category
  vertical: 'Road Construction' | 'Quarry & Mining' | 'Heavy Lifting' | 'Piling' | 'Earthmoving'
  year: number
  hours: number
  yard: string // where it physically sits
  yardRegion: 'Europe' | 'North America'
  acqCost: number // acquired for
  listPrice: number // current asking
  predResale: number // Anvil predicted achievable in best destination market
  predRegion: string // best destination market
  inspection: number // 0-100 Omnia standard score
  status: MStatus
  daysInYard: number
  tier: Tier // demand tier Anvil assigns
}

export const MACHINES: Machine[] = [
  // --- Hero cluster: Komatsu PC210 crawler excavators, surging West Africa demand ---
  {
    id: 'OM-4471', make: 'Komatsu', model: 'PC210LC-8', category: 'Excavator', vertical: 'Earthmoving',
    year: 2013, hours: 10400, yard: 'Rotterdam', yardRegion: 'Europe',
    acqCost: 25800, listPrice: 34500, predResale: 41200, predRegion: 'Tema, Ghana',
    inspection: 91, status: 'ready', daysInYard: 12, tier: 'hot',
  },
  {
    id: 'OM-4472', make: 'Komatsu', model: 'PC210LC-8', category: 'Excavator', vertical: 'Earthmoving',
    year: 2012, hours: 12250, yard: 'Hamburg', yardRegion: 'Europe',
    acqCost: 24200, listPrice: 32900, predResale: 39800, predRegion: 'Tema, Ghana',
    inspection: 87, status: 'ready', daysInYard: 19, tier: 'hot',
  },
  {
    id: 'OM-4473', make: 'Komatsu', model: 'PC210LC-8', category: 'Excavator', vertical: 'Earthmoving',
    year: 2014, hours: 9100, yard: 'Rotterdam', yardRegion: 'Europe',
    acqCost: 27600, listPrice: 36800, predResale: 43100, predRegion: 'Apapa, Nigeria',
    inspection: 93, status: 'ready', daysInYard: 8, tier: 'hot',
  },
  // --- Excavators ---
  {
    id: 'OM-4390', make: 'Caterpillar', model: '336DL', category: 'Excavator', vertical: 'Quarry & Mining',
    year: 2013, hours: 13800, yard: 'Antwerp', yardRegion: 'Europe',
    acqCost: 42500, listPrice: 58900, predResale: 66400, predRegion: 'Mombasa, Kenya',
    inspection: 84, status: 'ready', daysInYard: 34, tier: 'warm',
  },
  {
    id: 'OM-4402', make: 'Volvo', model: 'EC220DL', category: 'Excavator', vertical: 'Earthmoving',
    year: 2015, hours: 8600, yard: 'Miami', yardRegion: 'North America',
    acqCost: 39800, listPrice: 52400, predResale: 61200, predRegion: 'Callao, Peru',
    inspection: 89, status: 'reserved', daysInYard: 21, tier: 'warm',
  },
  {
    id: 'OM-4418', make: 'Hitachi', model: 'ZX350LC-6', category: 'Excavator', vertical: 'Quarry & Mining',
    year: 2016, hours: 7400, yard: 'Rotterdam', yardRegion: 'Europe',
    acqCost: 51200, listPrice: 68500, predResale: 74800, predRegion: 'Jebel Ali, UAE',
    inspection: 92, status: 'ready', daysInYard: 15, tier: 'hot',
  },
  {
    id: 'OM-4351', make: 'Caterpillar', model: '320D', category: 'Excavator', vertical: 'Earthmoving',
    year: 2011, hours: 15600, yard: 'Southampton', yardRegion: 'Europe',
    acqCost: 22400, listPrice: 29900, predResale: 33200, predRegion: 'Dar es Salaam, Tanzania',
    inspection: 78, status: 'inspection', daysInYard: 47, tier: 'warm',
  },
  // --- Cranes (Heavy Lifting) ---
  {
    id: 'OM-4210', make: 'Liebherr', model: 'LTM 1090-4.2', category: 'Crane', vertical: 'Heavy Lifting',
    year: 2012, hours: 9800, yard: 'Antwerp', yardRegion: 'Europe',
    acqCost: 168000, listPrice: 224000, predResale: 251000, predRegion: 'Jebel Ali, UAE',
    inspection: 88, status: 'ready', daysInYard: 41, tier: 'warm',
  },
  {
    id: 'OM-4224', make: 'Tadano', model: 'Faun HK 40', category: 'Crane', vertical: 'Heavy Lifting',
    year: 2014, hours: 11450, yard: 'Hamburg', yardRegion: 'Europe',
    acqCost: 92000, listPrice: 128000, predResale: 141000, predRegion: 'Nhava Sheva, India',
    inspection: 85, status: 'ready', daysInYard: 28, tier: 'warm',
  },
  {
    id: 'OM-4238', make: 'Grove', model: 'GMK5150', category: 'Crane', vertical: 'Heavy Lifting',
    year: 2010, hours: 14200, yard: 'Miami', yardRegion: 'North America',
    acqCost: 118000, listPrice: 159000, predResale: 172000, predRegion: 'Callao, Peru',
    inspection: 81, status: 'in-transit', daysInYard: 3, tier: 'cool',
  },
  // --- Dozers ---
  {
    id: 'OM-4120', make: 'Caterpillar', model: 'D6R', category: 'Dozer', vertical: 'Earthmoving',
    year: 2012, hours: 12900, yard: 'Rotterdam', yardRegion: 'Europe',
    acqCost: 58000, listPrice: 78500, predResale: 88200, predRegion: 'Apapa, Nigeria',
    inspection: 86, status: 'ready', daysInYard: 24, tier: 'hot',
  },
  {
    id: 'OM-4132', make: 'Komatsu', model: 'D65PX-17', category: 'Dozer', vertical: 'Road Construction',
    year: 2016, hours: 6800, yard: 'Antwerp', yardRegion: 'Europe',
    acqCost: 74500, listPrice: 98000, predResale: 108500, predRegion: 'Tema, Ghana',
    inspection: 90, status: 'reserved', daysInYard: 11, tier: 'hot',
  },
  // --- Wheel Loaders ---
  {
    id: 'OM-4060', make: 'Komatsu', model: 'WA380-6', category: 'Wheel Loader', vertical: 'Quarry & Mining',
    year: 2014, hours: 10100, yard: 'Hamburg', yardRegion: 'Europe',
    acqCost: 46000, listPrice: 61500, predResale: 69800, predRegion: 'Mombasa, Kenya',
    inspection: 88, status: 'ready', daysInYard: 18, tier: 'warm',
  },
  {
    id: 'OM-4074', make: 'Volvo', model: 'L120F', category: 'Wheel Loader', vertical: 'Earthmoving',
    year: 2013, hours: 13300, yard: 'Southampton', yardRegion: 'Europe',
    acqCost: 38500, listPrice: 51900, predResale: 57400, predRegion: 'Dar es Salaam, Tanzania',
    inspection: 82, status: 'ready', daysInYard: 39, tier: 'cool',
  },
  // --- Road Construction ---
  {
    id: 'OM-4015', make: 'Bomag', model: 'BW 213 D-5', category: 'Roller', vertical: 'Road Construction',
    year: 2015, hours: 5400, yard: 'Rotterdam', yardRegion: 'Europe',
    acqCost: 28900, listPrice: 39500, predResale: 45200, predRegion: 'Tema, Ghana',
    inspection: 91, status: 'ready', daysInYard: 9, tier: 'hot',
  },
  {
    id: 'OM-4022', make: 'Caterpillar', model: '140M', category: 'Motor Grader', vertical: 'Road Construction',
    year: 2013, hours: 11700, yard: 'Miami', yardRegion: 'North America',
    acqCost: 64000, listPrice: 86500, predResale: 96800, predRegion: 'Apapa, Nigeria',
    inspection: 85, status: 'inspection', daysInYard: 31, tier: 'warm',
  },
  // --- Quarry & Mining ---
  {
    id: 'OM-3980', make: 'Sandvik', model: 'DD421', category: 'Drill Rig', vertical: 'Quarry & Mining',
    year: 2014, hours: 8900, yard: 'Antwerp', yardRegion: 'Europe',
    acqCost: 132000, listPrice: 178000, predResale: 194000, predRegion: 'Jebel Ali, UAE',
    inspection: 87, status: 'ready', daysInYard: 52, tier: 'warm',
  },
  {
    id: 'OM-3994', make: 'Sennebogen', model: '830 M', category: 'Material Handler', vertical: 'Quarry & Mining',
    year: 2015, hours: 9500, yard: 'Hamburg', yardRegion: 'Europe',
    acqCost: 78000, listPrice: 104000, predResale: 114500, predRegion: 'Nhava Sheva, India',
    inspection: 89, status: 'ready', daysInYard: 22, tier: 'warm',
  },
]

// --- Derived helpers ---

export function margin(m: Machine) {
  return m.predResale - m.acqCost
}
export function marginPct(m: Machine) {
  return (margin(m) / m.acqCost) * 100
}

export const CATEGORIES: Category[] = [
  'Excavator', 'Crane', 'Dozer', 'Wheel Loader', 'Motor Grader', 'Roller', 'Drill Rig', 'Material Handler',
]

export const STATUS_LABEL: Record<MStatus, string> = {
  ready: 'Ready to sell',
  inspection: 'In inspection',
  reserved: 'Reserved',
  'in-transit': 'In transit',
}

// Portfolio roll-ups used across screens
export const INV_STATS = {
  units: MACHINES.length,
  bookValue: MACHINES.reduce((s, m) => s + m.acqCost, 0),
  predictedValue: MACHINES.reduce((s, m) => s + m.predResale, 0),
  hotUnits: MACHINES.filter((m) => m.tier === 'hot').length,
  agingUnits: MACHINES.filter((m) => m.daysInYard >= 40).length,
}
