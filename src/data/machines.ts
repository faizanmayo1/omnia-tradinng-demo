// Inventory — the machines Omnia has available, owned and brokered.
//
// The hand-written records below carry the demo narrative (the hero cluster, the units
// referenced by the Inquiry Desk, the Opportunity Engine and the comps book). Everything
// else is generated in catalog.ts so the working set reflects Omnia's real scale:
// ~1,800 machines across 60+ scattered locations, not 18 in five yards.
//
// Types and the generator live in ./catalog. They are re-exported here because every screen
// already imports Machine, Category and friends from this module.

import {
  CATALOG,
  CATEGORIES,
  STATUS_LABEL,
  VERTICAL_OF,
  generateMachines,
  type Category,
  type Machine,
  type MachineLocation,
  type MStatus,
  type Ownership,
  type Tier,
  type Vertical,
} from './catalog'

export { CATALOG, CATEGORIES, STATUS_LABEL, VERTICAL_OF }
export type { Category, Machine, MachineLocation, MStatus, Ownership, Tier, Vertical }

const ROTTERDAM: MachineLocation = { site: 'Omnia Rotterdam', city: 'Rotterdam', country: 'Netherlands', flag: '🇳🇱', region: 'Europe' }
const ANTWERP: MachineLocation = { site: 'Omnia Antwerp', city: 'Antwerp', country: 'Belgium', flag: '🇧🇪', region: 'Europe' }
const BILLINGHAM: MachineLocation = { site: 'Omnia Billingham', city: 'Billingham', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe' }
const MIAMI: MachineLocation = { site: 'Omnia Miami', city: 'Miami, FL', country: 'United States', flag: '🇺🇸', region: 'North America' }

/**
 * Hand-written records that the rest of the demo refers to by id. Pinned above generated
 * stock everywhere they are listed.
 *
 * The hero cluster is mobile screening plant, not excavators: Sam was explicit that Omnia
 * trades aggregate, road construction and lifting equipment rather than the CAT/Komatsu
 * earthmoving catalogue the first demo showcased.
 */
export const FEATURED: Machine[] = [
  // --- Hero cluster: mobile screening plant, surging West Africa aggregate demand ---
  {
    id: 'OM-4471', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', vertical: 'Aggregate & Recycling',
    year: 2016, hours: 4200, ownership: 'owned', location: ROTTERDAM,
    acqCost: 68000, askPrice: 92500, predResale: 112000, predRegion: 'Tema, Ghana',
    inspection: 91, status: 'ready', daysListed: 12, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4472', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', vertical: 'Aggregate & Recycling',
    year: 2015, hours: 5400, ownership: 'owned', location: ANTWERP,
    acqCost: 61500, askPrice: 84000, predResale: 101500, predRegion: 'Tema, Ghana',
    inspection: 87, status: 'ready', daysListed: 19, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4473', make: 'Powerscreen', model: 'Chieftain 2100X', category: 'Screener', vertical: 'Aggregate & Recycling',
    year: 2017, hours: 3100, ownership: 'owned', location: ROTTERDAM,
    acqCost: 74000, askPrice: 99000, predResale: 119500, predRegion: 'Apapa, Nigeria',
    inspection: 93, status: 'ready', daysListed: 8, tier: 'hot', featured: true,
  },

  // --- Crushing plant ---
  {
    id: 'OM-4390', make: 'Metso', model: 'Lokotrack LT106', category: 'Crusher', vertical: 'Aggregate & Recycling',
    year: 2014, hours: 9800, ownership: 'owned', location: ANTWERP,
    acqCost: 142000, askPrice: 189000, predResale: 214000, predRegion: 'Mombasa, Kenya',
    inspection: 84, status: 'ready', daysListed: 34, tier: 'warm', featured: true,
  },
  {
    id: 'OM-4402', make: 'Sandvik', model: 'QJ341', category: 'Crusher', vertical: 'Aggregate & Recycling',
    year: 2016, hours: 7600, ownership: 'brokered', location: { site: 'Delacroix Aggregates', city: 'Lyon', country: 'France', flag: '🇫🇷', region: 'Europe' },
    vendor: 'Delacroix Aggregates', askPrice: 198000, commissionPct: 0.06, predResale: 228000, predRegion: 'Callao, Peru',
    inspection: 89, status: 'reserved', daysListed: 21, tier: 'warm', featured: true,
  },
  {
    id: 'OM-4418', make: 'Kleemann', model: 'MC 110 Zi EVO', category: 'Crusher', vertical: 'Aggregate & Recycling',
    year: 2017, hours: 5900, ownership: 'brokered', location: { site: 'Nordhaus Machinery', city: 'Dortmund', country: 'Germany', flag: '🇩🇪', region: 'Europe' },
    vendor: 'Nordhaus Machinery', askPrice: 246000, commissionPct: 0.055, predResale: 279000, predRegion: 'Jebel Ali, UAE',
    inspection: 92, status: 'ready', daysListed: 15, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4351', make: 'Terex Finlay', model: '883+', category: 'Screener', vertical: 'Aggregate & Recycling',
    year: 2011, hours: 13400, ownership: 'brokered', location: { site: 'Kelly Plant Hire', city: 'Cork', country: 'Ireland', flag: '🇮🇪', region: 'Europe' },
    vendor: 'Kelly Plant Hire', askPrice: 58000, commissionPct: 0.075, predResale: 66500, predRegion: 'Dar es Salaam, Tanzania',
    inspection: 74, status: 'inspection', daysListed: 118, tier: 'cool', featured: true,
  },

  // --- Lifting ---
  {
    id: 'OM-4210', make: 'Liebherr', model: 'LTM 1090-4.2', category: 'Mobile Crane', vertical: 'Heavy Lifting',
    year: 2012, hours: 9800, ownership: 'owned', location: ANTWERP,
    acqCost: 168000, askPrice: 224000, predResale: 251000, predRegion: 'Jebel Ali, UAE',
    inspection: 88, status: 'ready', daysListed: 41, tier: 'warm', featured: true,
  },
  {
    id: 'OM-4224', make: 'Tadano', model: 'Faun HK 40', category: 'Mobile Crane', vertical: 'Heavy Lifting',
    year: 2014, hours: 11450, ownership: 'brokered', location: { site: 'Reinhardt Heavy Equipment', city: 'Hamburg', country: 'Germany', flag: '🇩🇪', region: 'Europe' },
    vendor: 'Reinhardt Heavy Equipment', askPrice: 128000, commissionPct: 0.06, predResale: 141000, predRegion: 'Nhava Sheva, India',
    inspection: 85, status: 'ready', daysListed: 28, tier: 'warm', featured: true,
  },
  {
    id: 'OM-4238', make: 'Grove', model: 'GMK5150', category: 'Mobile Crane', vertical: 'Heavy Lifting',
    year: 2010, hours: 14200, ownership: 'brokered', location: { site: 'Moreno Equipment Ltd', city: 'Houston, TX', country: 'United States', flag: '🇺🇸', region: 'North America' },
    vendor: 'Moreno Equipment Ltd', askPrice: 159000, commissionPct: 0.05, predResale: 172000, predRegion: 'Callao, Peru',
    inspection: 81, status: 'in-transit', daysListed: 3, tier: 'cool', featured: true,
  },

  // --- Road construction ---
  {
    id: 'OM-4120', make: 'Wirtgen', model: 'W 200', category: 'Cold Planer', vertical: 'Road Construction',
    year: 2013, hours: 12900, ownership: 'owned', location: ROTTERDAM,
    acqCost: 128000, askPrice: 172000, predResale: 196000, predRegion: 'Apapa, Nigeria',
    inspection: 86, status: 'ready', daysListed: 24, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4132', make: 'Vögele', model: 'Super 1800-3i', category: 'Asphalt Paver', vertical: 'Road Construction',
    year: 2016, hours: 6800, ownership: 'brokered', location: { site: 'Van der Berg Contracting', city: 'Utrecht', country: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
    vendor: 'Van der Berg Contracting', askPrice: 164000, commissionPct: 0.055, predResale: 186000, predRegion: 'Tema, Ghana',
    inspection: 90, status: 'reserved', daysListed: 11, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4060', make: 'Hamm', model: 'HD+ 120i VV', category: 'Roller', vertical: 'Road Construction',
    year: 2014, hours: 10100, ownership: 'brokered', location: { site: 'Bertoli Groundworks', city: 'Verona', country: 'Italy', flag: '🇮🇹', region: 'Europe' },
    vendor: 'Bertoli Groundworks', askPrice: 61500, commissionPct: 0.07, predResale: 69800, predRegion: 'Mombasa, Kenya',
    inspection: 88, status: 'ready', daysListed: 18, tier: 'warm', featured: true,
  },
  {
    id: 'OM-4074', make: 'Bomag', model: 'BW 174 AP', category: 'Roller', vertical: 'Road Construction',
    year: 2013, hours: 13300, ownership: 'brokered', location: { site: 'Hargreaves Plant Sales', city: 'Leeds', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
    vendor: 'Hargreaves Plant Sales', askPrice: 51900, commissionPct: 0.075, predResale: 57400, predRegion: 'Dar es Salaam, Tanzania',
    inspection: 82, status: 'ready', daysListed: 96, tier: 'cool', featured: true,
  },
  {
    id: 'OM-4015', make: 'Hamm', model: '3411', category: 'Roller', vertical: 'Road Construction',
    year: 2015, hours: 5400, ownership: 'owned', location: BILLINGHAM,
    acqCost: 28900, askPrice: 39500, predResale: 45200, predRegion: 'Tema, Ghana',
    inspection: 91, status: 'ready', daysListed: 9, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4022', make: 'Caterpillar', model: '140M', category: 'Motor Grader', vertical: 'Road Construction',
    year: 2013, hours: 11700, ownership: 'brokered', location: { site: 'Sanderson Civil Engineering', city: 'Atlanta, GA', country: 'United States', flag: '🇺🇸', region: 'North America' },
    vendor: 'Sanderson Civil Engineering', askPrice: 86500, commissionPct: 0.06, predResale: 96800, predRegion: 'Apapa, Nigeria',
    inspection: 85, status: 'inspection', daysListed: 31, tier: 'warm', featured: true,
  },

  // --- Quarry & mining ---
  {
    id: 'OM-3980', make: 'Sandvik', model: 'DD421', category: 'Drill Rig', vertical: 'Quarry & Mining',
    year: 2014, hours: 8900, ownership: 'owned', location: MIAMI,
    acqCost: 132000, askPrice: 178000, predResale: 194000, predRegion: 'Jebel Ali, UAE',
    inspection: 87, status: 'ready', daysListed: 128, tier: 'cool', featured: true,
  },
  {
    id: 'OM-3994', make: 'Sennebogen', model: '830 M', category: 'Material Handler', vertical: 'Quarry & Mining',
    year: 2015, hours: 9500, ownership: 'brokered', location: { site: 'Ostrowski Trading BV', city: 'Poznań', country: 'Poland', flag: '🇵🇱', region: 'Europe' },
    vendor: 'Ostrowski Trading BV', askPrice: 104000, commissionPct: 0.065, predResale: 114500, predRegion: 'Nhava Sheva, India',
    inspection: 89, status: 'ready', daysListed: 22, tier: 'warm', featured: true,
  },
  {
    id: 'OM-4444', make: 'Telestack', model: 'TS 542', category: 'Conveyor', vertical: 'Aggregate & Recycling',
    year: 2018, hours: 2900, ownership: 'brokered', location: { site: 'Brennan Quarry Services', city: 'Dublin', country: 'Ireland', flag: '🇮🇪', region: 'Europe' },
    vendor: 'Brennan Quarry Services', askPrice: 38500, commissionPct: 0.07, predResale: 44200, predRegion: 'Tema, Ghana',
    inspection: 93, status: 'ready', daysListed: 6, tier: 'hot', featured: true,
  },
  {
    id: 'OM-4455', make: 'Liebherr', model: 'LR 1100', category: 'Crawler Crane', vertical: 'Heavy Lifting',
    year: 2011, hours: 15800, ownership: 'brokered', location: { site: 'Falkenberg Machinery', city: 'Gothenburg', country: 'Sweden', flag: '🇸🇪', region: 'Europe' },
    vendor: 'Falkenberg Machinery', askPrice: 385000, commissionPct: 0.045, predResale: 428000, predRegion: 'Jebel Ali, UAE',
    inspection: 79, status: 'ready', daysListed: 142, tier: 'cool', featured: true,
  },
]

/**
 * The full book. Sam's own figure for what Omnia has available is 1,000–2,000 pieces
 * across scattered locations, so the generated tail is sized to land in that range.
 */
export const MACHINES: Machine[] = [...FEATURED, ...generateMachines(1827)]

// --- Derived helpers ------------------------------------------------------------------
//
// Owned and brokered machines earn money in completely different ways, so every figure
// below has to branch. Treating a brokered listing as if Omnia had bought it would
// overstate both book value and margin by an order of magnitude.

export const isOwned = (m: Machine) => m.ownership === 'owned'

/** What Omnia earns on the deal: trading margin on owned stock, commission on brokered. */
export function margin(m: Machine) {
  if (m.ownership === 'owned') return m.predResale - (m.acqCost ?? 0)
  return Math.round(m.predResale * (m.commissionPct ?? 0))
}

/**
 * Return as a percentage. For owned stock that is margin over cost; for brokered stock it
 * is simply the commission rate — there is no cost base to measure against.
 */
export function marginPct(m: Machine) {
  if (m.ownership === 'owned') {
    const cost = m.acqCost ?? 0
    return cost > 0 ? (margin(m) / cost) * 100 : 0
  }
  return (m.commissionPct ?? 0) * 100
}

/** Capital Omnia actually has tied up — owned stock only. */
export const bookValueOf = (ms: Machine[]) =>
  ms.reduce((s, m) => s + (m.ownership === 'owned' ? m.acqCost ?? 0 : 0), 0)

/** Value of everything on the market under Omnia's name, owned and brokered alike. */
export const listedValueOf = (ms: Machine[]) => ms.reduce((s, m) => s + m.askPrice, 0)

const owned = MACHINES.filter(isOwned)
const brokered = MACHINES.filter((m) => !isOwned(m))

// Portfolio roll-ups used across screens.
export const INV_STATS = {
  units: MACHINES.length,
  ownedUnits: owned.length,
  brokeredUnits: brokered.length,
  /** Acquisition cost of owned stock — the capital at risk. */
  bookValue: bookValueOf(MACHINES),
  /** Combined asking value of the whole book. */
  listedValue: listedValueOf(MACHINES),
  /** Predicted resale of owned stock, comparable against bookValue. */
  predictedValue: owned.reduce((s, m) => s + m.predResale, 0),
  /** Commission earned if the brokered book cleared at predicted prices. */
  commissionPipeline: brokered.reduce((s, m) => s + margin(m), 0),
  hotUnits: MACHINES.filter((m) => m.tier === 'hot').length,
  /** Stale listings. 90 days is the threshold Omnia's desk would act on at this volume. */
  agingUnits: MACHINES.filter((m) => m.daysListed >= 90).length,
  locations: new Set(MACHINES.map((m) => m.location.city)).size,
  countries: new Set(MACHINES.map((m) => m.location.country)).size,
  vendors: new Set(MACHINES.filter((m) => m.vendor).map((m) => m.vendor)).size,
}

/** Machines added recently — the input to a weekly outreach campaign. */
export const newThisWeek = MACHINES.filter((m) => m.daysListed <= 7)

export const byId = (id: string) => MACHINES.find((m) => m.id === id)

// --- display helpers ------------------------------------------------------------------
//
// A brokered listing has no acquisition cost, so screens must not print an empty or zero
// "cost" against one. These give each ownership type its own honest line.

/** Label for the cost row: what Omnia paid, or what it earns for placing the machine. */
export const costLabel = (m: Machine) =>
  m.ownership === 'owned' ? 'Acquisition cost' : 'Commission rate'

/** Value for that row — euros for owned stock, a percentage for brokered. */
export const costValue = (m: Machine) =>
  m.ownership === 'owned'
    ? `\u20AC${Math.round(m.acqCost ?? 0).toLocaleString('en-US')}`
    : `${((m.commissionPct ?? 0) * 100).toFixed(1)}%`

/** Label for what Omnia earns — margin on owned stock, commission on brokered. */
export const earnLabel = (m: Machine) =>
  m.ownership === 'owned' ? 'Predicted margin' : 'Commission earned'

export const OWNERSHIP_LABEL: Record<Ownership, string> = {
  owned: 'Omnia stock',
  brokered: 'Listed for vendor',
}

/** Capital tied up in a set of machines — owned only. */
export const costBasisOf = (ms: Machine[]) =>
  ms.reduce((s, m) => s + (m.ownership === 'owned' ? m.acqCost ?? 0 : 0), 0)
