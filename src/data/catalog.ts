// Catalogue definitions and the deterministic machine generator.
//
// Two things changed after Sam Brown's review of the first demo, and both live here:
//
// 1. SCALE. The demo shipped 18 machines in 5 Omnia yards. Sam has "1000-2000 pieces of
//    equipment available in scattered locations across Europe / North America". So the
//    working set is generated, not hand-written — see generateMachines().
//
// 2. OWNERSHIP. Omnia "either buy them for our own inventory or advertise them on our
//    website, a bit like a real estate agent, and then charge a commission on the sale".
//    Most of the book is brokered stock sitting on someone else's site. A machine is
//    therefore `owned` (margin = resale - cost) or `brokered` (revenue = commission).
//
// The catalogue itself is also rebalanced. Sam: "we don't really do so much JCB and CAT and
// Komatsu, it's more like Aggregate Equipment, Road Construction Equipment, Cranes."
// Earthmoving is deliberately the minority here.
//
// Generation is seeded and deterministic — never Math.random(). The demo must show the same
// figures on every reload, or numbers shift mid-conversation.

export type Category =
  // Aggregate & recycling — the core of Omnia's actual catalogue
  | 'Crusher'
  | 'Screener'
  | 'Conveyor'
  // Road construction
  | 'Asphalt Paver'
  | 'Cold Planer'
  | 'Roller'
  | 'Motor Grader'
  // Lifting
  | 'Mobile Crane'
  | 'Crawler Crane'
  | 'Tower Crane'
  // Earthmoving and other — the minority
  | 'Excavator'
  | 'Wheel Loader'
  | 'Material Handler'
  | 'Drill Rig'

export type Vertical =
  | 'Aggregate & Recycling'
  | 'Road Construction'
  | 'Heavy Lifting'
  | 'Earthmoving'
  | 'Quarry & Mining'

export type MStatus = 'ready' | 'inspection' | 'reserved' | 'in-transit'
export type Tier = 'hot' | 'warm' | 'cool'

/** Owned = Omnia bought it. Brokered = listed on someone else's behalf for commission. */
export type Ownership = 'owned' | 'brokered'

/**
 * Where the machine physically sits. For owned stock this is an Omnia yard; for brokered
 * stock it is the vendor's own site, which is what "scattered locations" means.
 */
export type MachineLocation = {
  site: string
  city: string
  country: string
  flag: string
  region: 'Europe' | 'North America'
}

export type Machine = {
  id: string
  make: string
  model: string
  category: Category
  vertical: Vertical
  year: number
  hours: number
  ownership: Ownership
  location: MachineLocation
  /** Vendor whose site it sits on. Brokered only — owned stock sits in an Omnia yard. */
  vendor?: string
  /** What the machine is advertised at. Present on every machine. */
  askPrice: number
  /** What Omnia paid. Owned only — undefined on brokered listings. */
  acqCost?: number
  /** Commission rate on a brokered sale. Brokered only. */
  commissionPct?: number
  /** Anvil's predicted achievable price in the best destination market. */
  predResale: number
  predRegion: string
  inspection: number // 0-100 Omnia standard score
  status: MStatus
  daysListed: number
  tier: Tier
  /** Hand-written records that carry the demo narrative; pinned above generated stock. */
  featured?: boolean
}

export const CATEGORIES: Category[] = [
  'Crusher', 'Screener', 'Conveyor',
  'Asphalt Paver', 'Cold Planer', 'Roller', 'Motor Grader',
  'Mobile Crane', 'Crawler Crane', 'Tower Crane',
  'Excavator', 'Wheel Loader', 'Material Handler', 'Drill Rig',
]

export const VERTICAL_OF: Record<Category, Vertical> = {
  Crusher: 'Aggregate & Recycling',
  Screener: 'Aggregate & Recycling',
  Conveyor: 'Aggregate & Recycling',
  'Asphalt Paver': 'Road Construction',
  'Cold Planer': 'Road Construction',
  Roller: 'Road Construction',
  'Motor Grader': 'Road Construction',
  'Mobile Crane': 'Heavy Lifting',
  'Crawler Crane': 'Heavy Lifting',
  'Tower Crane': 'Heavy Lifting',
  Excavator: 'Earthmoving',
  'Wheel Loader': 'Earthmoving',
  'Material Handler': 'Quarry & Mining',
  'Drill Rig': 'Quarry & Mining',
}

export const STATUS_LABEL: Record<MStatus, string> = {
  ready: 'Ready to sell',
  inspection: 'In inspection',
  reserved: 'Reserved',
  'in-transit': 'In transit',
}

/**
 * Model catalogue per category, with a realistic used price band in EUR.
 * `weight` sets how much of the generated book falls in each category — aggregate, road
 * and lifting dominate; earthmoving is intentionally thin.
 */
type CatalogEntry = {
  category: Category
  weight: number
  low: number
  high: number
  models: { make: string; model: string }[]
}

export const CATALOG: CatalogEntry[] = [
  {
    category: 'Crusher', weight: 14, low: 88_000, high: 320_000,
    models: [
      { make: 'Metso', model: 'Lokotrack LT106' },
      { make: 'Metso', model: 'Lokotrack LT1213S' },
      { make: 'Sandvik', model: 'QJ341' },
      { make: 'Sandvik', model: 'QI341' },
      { make: 'Terex Finlay', model: 'J-1175' },
      { make: 'Terex Finlay', model: 'I-140' },
      { make: 'Kleemann', model: 'MC 110 Zi EVO' },
      { make: 'Kleemann', model: 'MCO 9i EVO' },
      { make: 'McCloskey', model: 'J50' },
      { make: 'Rubble Master', model: 'RM 100GO!' },
      { make: 'Keestrack', model: 'B4' },
    ],
  },
  {
    category: 'Screener', weight: 13, low: 42_000, high: 155_000,
    models: [
      { make: 'Powerscreen', model: 'Chieftain 2100X' },
      { make: 'Powerscreen', model: 'Warrior 1800' },
      { make: 'Terex Finlay', model: '883+' },
      { make: 'McCloskey', model: 'S190' },
      { make: 'Keestrack', model: 'K4' },
      { make: 'Anaconda', model: 'DF410' },
      { make: 'Kleemann', model: 'MS 953 EVO' },
    ],
  },
  {
    category: 'Conveyor', weight: 7, low: 11_000, high: 48_000,
    models: [
      { make: 'Telestack', model: 'TS 542' },
      { make: 'Powerscreen', model: 'TC-80' },
      { make: 'Superior', model: 'TeleStacker 110' },
      { make: 'Edge', model: 'TS80' },
    ],
  },
  {
    category: 'Asphalt Paver', weight: 9, low: 58_000, high: 195_000,
    models: [
      { make: 'Vögele', model: 'Super 1800-3i' },
      { make: 'Vögele', model: 'Super 1300-3i' },
      { make: 'Dynapac', model: 'F1800W' },
      { make: 'Caterpillar', model: 'AP555F' },
      { make: 'Bomag', model: 'BF 600 P' },
    ],
  },
  {
    category: 'Cold Planer', weight: 8, low: 68_000, high: 285_000,
    models: [
      { make: 'Wirtgen', model: 'W 200' },
      { make: 'Wirtgen', model: 'W 100 F' },
      { make: 'Wirtgen', model: 'W 210 Fi' },
      { make: 'Caterpillar', model: 'PM620' },
      { make: 'Bomag', model: 'BM 1200/35' },
    ],
  },
  {
    category: 'Roller', weight: 10, low: 16_000, high: 78_000,
    models: [
      { make: 'Hamm', model: 'HD+ 120i VV' },
      { make: 'Hamm', model: '3411' },
      { make: 'Bomag', model: 'BW 213 D-5' },
      { make: 'Bomag', model: 'BW 174 AP' },
      { make: 'Dynapac', model: 'CA2500D' },
      { make: 'Caterpillar', model: 'CS11 GC' },
    ],
  },
  {
    category: 'Motor Grader', weight: 5, low: 44_000, high: 135_000,
    models: [
      { make: 'Caterpillar', model: '140M' },
      { make: 'Volvo', model: 'G940' },
      { make: 'New Holland', model: 'F156.6A' },
      { make: 'Champion', model: 'C70B' },
    ],
  },
  {
    category: 'Mobile Crane', weight: 9, low: 78_000, high: 430_000,
    models: [
      { make: 'Liebherr', model: 'LTM 1090-4.2' },
      { make: 'Liebherr', model: 'LTM 1050-3.1' },
      { make: 'Tadano', model: 'Faun ATF 60G-3' },
      { make: 'Tadano', model: 'Faun HK 40' },
      { make: 'Grove', model: 'GMK5150' },
      { make: 'Terex Demag', model: 'AC 100/4L' },
    ],
  },
  {
    category: 'Crawler Crane', weight: 5, low: 115_000, high: 660_000,
    models: [
      { make: 'Liebherr', model: 'LR 1100' },
      { make: 'Sennebogen', model: '673 R' },
      { make: 'Manitowoc', model: '999' },
      { make: 'Kobelco', model: 'CKE1350' },
    ],
  },
  {
    category: 'Tower Crane', weight: 4, low: 42_000, high: 185_000,
    models: [
      { make: 'Potain', model: 'MDT 219' },
      { make: 'Liebherr', model: '154 EC-H 6' },
      { make: 'Terex', model: 'CTT 181' },
    ],
  },
  // --- earthmoving and other: deliberately the minority of the book ---
  {
    category: 'Excavator', weight: 6, low: 21_000, high: 98_000,
    models: [
      { make: 'Volvo', model: 'EC220DL' },
      { make: 'Hitachi', model: 'ZX350LC-6' },
      { make: 'Doosan', model: 'DX255LC-5' },
      { make: 'Liebherr', model: 'R 926' },
      { make: 'Case', model: 'CX250D' },
    ],
  },
  {
    category: 'Wheel Loader', weight: 5, low: 24_000, high: 98_000,
    models: [
      { make: 'Volvo', model: 'L120F' },
      { make: 'Liebherr', model: 'L 538' },
      { make: 'Hyundai', model: 'HL757-9' },
      { make: 'Doosan', model: 'DL300-5' },
    ],
  },
  {
    category: 'Material Handler', weight: 3, low: 52_000, high: 158_000,
    models: [
      { make: 'Sennebogen', model: '830 M' },
      { make: 'Fuchs', model: 'MHL350' },
      { make: 'Liebherr', model: 'LH 26 M' },
    ],
  },
  {
    category: 'Drill Rig', weight: 2, low: 88_000, high: 265_000,
    models: [
      { make: 'Sandvik', model: 'DD421' },
      { make: 'Atlas Copco', model: 'ROC D7' },
      { make: 'Epiroc', model: 'FlexiROC T35' },
    ],
  },
]

/**
 * Where the stock actually sits. Omnia's own yards are a handful of sites; everything else
 * is a vendor's own location. This spread is the answer to "scattered locations across
 * Europe / North America" — 60+ sites, not 5 yards.
 */
export const OMNIA_YARDS: MachineLocation[] = [
  { site: 'Omnia Billingham', city: 'Billingham', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { site: 'Omnia Rotterdam', city: 'Rotterdam', country: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { site: 'Omnia Antwerp', city: 'Antwerp', country: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { site: 'Omnia Miami', city: 'Miami, FL', country: 'United States', flag: '🇺🇸', region: 'North America' },
]

const EU_CITIES: [string, string, string][] = [
  ['Manchester', 'United Kingdom', '🇬🇧'], ['Leeds', 'United Kingdom', '🇬🇧'],
  ['Glasgow', 'United Kingdom', '🇬🇧'], ['Bristol', 'United Kingdom', '🇬🇧'],
  ['Dublin', 'Ireland', '🇮🇪'], ['Cork', 'Ireland', '🇮🇪'],
  ['Hamburg', 'Germany', '🇩🇪'], ['Munich', 'Germany', '🇩🇪'], ['Dortmund', 'Germany', '🇩🇪'],
  ['Leipzig', 'Germany', '🇩🇪'], ['Bremen', 'Germany', '🇩🇪'],
  ['Lyon', 'France', '🇫🇷'], ['Bordeaux', 'France', '🇫🇷'], ['Lille', 'France', '🇫🇷'],
  ['Milan', 'Italy', '🇮🇹'], ['Verona', 'Italy', '🇮🇹'], ['Bari', 'Italy', '🇮🇹'],
  ['Madrid', 'Spain', '🇪🇸'], ['Valencia', 'Spain', '🇪🇸'], ['Seville', 'Spain', '🇪🇸'],
  ['Porto', 'Portugal', '🇵🇹'], ['Lisbon', 'Portugal', '🇵🇹'],
  ['Utrecht', 'Netherlands', '🇳🇱'], ['Eindhoven', 'Netherlands', '🇳🇱'],
  ['Ghent', 'Belgium', '🇧🇪'], ['Liège', 'Belgium', '🇧🇪'],
  ['Vienna', 'Austria', '🇦🇹'], ['Graz', 'Austria', '🇦🇹'],
  ['Zurich', 'Switzerland', '🇨🇭'], ['Warsaw', 'Poland', '🇵🇱'], ['Poznań', 'Poland', '🇵🇱'],
  ['Prague', 'Czechia', '🇨🇿'], ['Brno', 'Czechia', '🇨🇿'],
  ['Copenhagen', 'Denmark', '🇩🇰'], ['Aarhus', 'Denmark', '🇩🇰'],
  ['Gothenburg', 'Sweden', '🇸🇪'], ['Malmö', 'Sweden', '🇸🇪'],
  ['Oslo', 'Norway', '🇳🇴'], ['Helsinki', 'Finland', '🇫🇮'], ['Tampere', 'Finland', '🇫🇮'],
  ['Budapest', 'Hungary', '🇭🇺'], ['Bucharest', 'Romania', '🇷🇴'], ['Sofia', 'Bulgaria', '🇧🇬'],
  ['Zagreb', 'Croatia', '🇭🇷'], ['Ljubljana', 'Slovenia', '🇸🇮'], ['Bratislava', 'Slovakia', '🇸🇰'],
]

const NA_CITIES: [string, string, string][] = [
  ['Houston, TX', 'United States', '🇺🇸'], ['Dallas, TX', 'United States', '🇺🇸'],
  ['Atlanta, GA', 'United States', '🇺🇸'], ['Charlotte, NC', 'United States', '🇺🇸'],
  ['Jacksonville, FL', 'United States', '🇺🇸'], ['Savannah, GA', 'United States', '🇺🇸'],
  ['Chicago, IL', 'United States', '🇺🇸'], ['Denver, CO', 'United States', '🇺🇸'],
  ['Phoenix, AZ', 'United States', '🇺🇸'], ['Sacramento, CA', 'United States', '🇺🇸'],
  ['Seattle, WA', 'United States', '🇺🇸'], ['Newark, NJ', 'United States', '🇺🇸'],
  ['Baltimore, MD', 'United States', '🇺🇸'], ['Nashville, TN', 'United States', '🇺🇸'],
  ['Toronto, ON', 'Canada', '🇨🇦'], ['Calgary, AB', 'Canada', '🇨🇦'],
  ['Montreal, QC', 'Canada', '🇨🇦'], ['Vancouver, BC', 'Canada', '🇨🇦'],
]

const VENDOR_PREFIX = [
  'Kelly', 'Van der Berg', 'Nordhaus', 'Brennan', 'Delacroix', 'Falkenberg', 'Moreno',
  'Ostrowski', 'Lindqvist', 'Bertoli', 'Hargreaves', 'Dupont', 'Van Loon', 'Reinhardt',
  'Costa', 'Novák', 'Whitmore', 'Aalto', 'Ferreira', 'Kowalczyk', 'Sanderson', 'Beaumont',
]
const VENDOR_SUFFIX = [
  'Plant Sales', 'Plant Hire', 'Aggregates', 'Machinery', 'Equipment Ltd', 'Quarry Services',
  'Contracting', 'Civil Engineering', 'Crushing & Screening', 'Groundworks', 'Trading BV',
  'Heavy Equipment', 'Asphalt Services', 'Demolition', 'Plant Solutions',
]

/** Export destinations Anvil predicts into — kept in step with demand.ts REGIONS. */
const DEST_MARKETS = [
  'Tema, Ghana', 'Apapa, Nigeria', 'Mombasa, Kenya', 'Dar es Salaam, Tanzania',
  'Durban, South Africa', 'Jebel Ali, UAE', 'Nhava Sheva, India', 'Callao, Peru',
]

// --- deterministic random -------------------------------------------------------------

/** mulberry32 — small, fast, seeded. Same seed always yields the same book. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = () => number
export const pick = <T,>(r: Rng, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
export const between = (r: Rng, lo: number, hi: number) => lo + r() * (hi - lo)
export const intBetween = (r: Rng, lo: number, hi: number) => Math.floor(between(r, lo, hi + 1))
export const round = (n: number, to: number) => Math.round(n / to) * to

/** Export destinations, shared with the closed-sales book so comps land in real corridors. */
export const DESTINATIONS: { dest: string; flag: string }[] = [
  { dest: 'Tema, Ghana', flag: '\u{1F1EC}\u{1F1ED}' },
  { dest: 'Apapa, Nigeria', flag: '\u{1F1F3}\u{1F1EC}' },
  { dest: 'Mombasa, Kenya', flag: '\u{1F1F0}\u{1F1EA}' },
  { dest: 'Dar es Salaam, Tanzania', flag: '\u{1F1F9}\u{1F1FF}' },
  { dest: 'Durban, South Africa', flag: '\u{1F1FF}\u{1F1E6}' },
  { dest: 'Jebel Ali, UAE', flag: '\u{1F1E6}\u{1F1EA}' },
  { dest: 'Nhava Sheva, India', flag: '\u{1F1EE}\u{1F1F3}' },
  { dest: 'Callao, Peru', flag: '\u{1F1F5}\u{1F1EA}' },
]

/** Category lookup weighted by CATALOG[].weight, so the mix reflects what Omnia trades. */
function weightedCategory(r: Rng): CatalogEntry {
  const total = CATALOG.reduce((s, c) => s + c.weight, 0)
  let n = r() * total
  for (const entry of CATALOG) {
    n -= entry.weight
    if (n <= 0) return entry
  }
  return CATALOG[0]
}

function makeLocation(r: Rng, ownership: Ownership): { location: MachineLocation; vendor?: string } {
  // Owned stock sits in an Omnia yard. Brokered stock sits wherever the vendor is.
  if (ownership === 'owned') return { location: pick(r, OMNIA_YARDS) }

  const inEurope = r() < 0.72 // Omnia's book leans European
  const [city, country, flag] = pick(r, inEurope ? EU_CITIES : NA_CITIES)
  const vendor = `${pick(r, VENDOR_PREFIX)} ${pick(r, VENDOR_SUFFIX)}`
  return {
    location: { site: vendor, city, country, flag, region: inEurope ? 'Europe' : 'North America' },
    vendor,
  }
}

/**
 * Build the working book. Deterministic for a given seed — reload the demo and every
 * figure is identical.
 */
export function generateMachines(count: number, seed = 0x4f4d4e49 /* "OMNI" */): Machine[] {
  const r = mulberry32(seed)
  const out: Machine[] = []

  for (let i = 0; i < count; i++) {
    const entry = weightedCategory(r)
    const { make, model } = pick(r, entry.models)

    // ~7% of the book is owned stock; the rest is brokered listings. That matches a desk
    // that adds ~200 machines a month but only buys a fraction of them outright.
    const ownership: Ownership = r() < 0.07 ? 'owned' : 'brokered'

    const year = intBetween(r, 2010, 2021)
    const age = 2026 - year
    // Older machines carry more hours, with spread.
    const hours = round(intBetween(r, 400, 1400) * age + intBetween(r, 0, 2500), 50)

    // Condition places the machine WITHIN its category's used-price band rather than
    // scaling the band down. Scaling produced absurdities — a Volvo EC220DL at €7,200 —
    // because the band already represents used prices, not new list.
    const wear = age * 0.055 + (hours / 26_000) * 0.30
    const condition = Math.min(1, Math.max(0, 1 - wear + between(r, -0.08, 0.08)))
    const askPrice = round(entry.low + (entry.high - entry.low) * condition, 500)

    const inspection = Math.round(
      Math.min(97, Math.max(56, 97 - age * 1.15 - (hours / 24_000) * 11 + between(r, -4, 4))),
    )

    const { location, vendor } = makeLocation(r, ownership)
    // Skewed young: most listings are fresh, with a long stale tail. A uniform spread put
    // 44% of the book past 90 days, which is not what a working desk looks like.
    const daysListed = Math.max(1, Math.floor(Math.pow(r(), 3) * 190))

    // Anvil's predicted achievable price into the best export market. Export demand carries
    // a premium over the European asking price for well-inspected units.
    const uplift = between(r, 1.04, 1.29) + (inspection - 78) / 420
    const predResale = round(askPrice * uplift, 100)

    // Demand tier blends condition with how long the listing has been sitting, so the
    // split stays meaningful across a book this size rather than collapsing to a handful.
    // Thresholds are tuned against the actual distribution (inspection p10/p50/p90 of
    // 72/80/88), so the split lands near 20/50/30 rather than calling half the book hot.
    const conditionScore = (inspection - 68) / 26
    const recencyScore = 1 - Math.min(1, daysListed / 120)
    const heat = 0.5 * conditionScore + 0.5 * recencyScore + between(r, -0.07, 0.07)
    const tier: Tier = heat > 0.78 ? 'hot' : heat < 0.5 ? 'cool' : 'warm'

    const status: MStatus =
      r() < 0.06 ? 'reserved' : r() < 0.1 ? 'inspection' : r() < 0.14 ? 'in-transit' : 'ready'

    const machine: Machine = {
      id: `OM-${5000 + i}`,
      make,
      model,
      category: entry.category,
      vertical: VERTICAL_OF[entry.category],
      year,
      hours,
      ownership,
      location,
      askPrice,
      predResale,
      predRegion: pick(r, DEST_MARKETS),
      inspection,
      status,
      daysListed,
      tier,
    }

    if (ownership === 'owned') {
      // Bought below the asking price — that spread is the margin on owned stock.
      machine.acqCost = round(askPrice * between(r, 0.63, 0.79), 100)
    } else {
      machine.vendor = vendor
      // Brokerage on used plant of this size typically runs mid-single-digit percent.
      machine.commissionPct = Number(between(r, 0.045, 0.085).toFixed(3))
    }

    out.push(machine)
  }

  return out
}
