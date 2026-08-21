// Sourcing network — where Omnia buys stock: European & North American
// auctions, dealers and fleet disposals. Anvil scores each source on reliability
// and surfaces incoming lots worth bidding. Illustrative.

export type Supplier = {
  id: string
  name: string
  type: 'Auction' | 'Dealer' | 'Fleet disposal' | 'Rental return'
  country: string
  flag: string
  unitsYtd: number
  reliability: number // 0-100 (title/condition accuracy on arrival)
  avgLeadDays: number
  activeLots: number
  note: string
}

export const SUPPLIERS: Supplier[] = [
  { id: 'SUP-01', name: 'Ritchie Bros · Meppen', type: 'Auction', country: 'Germany', flag: '🇩🇪', unitsYtd: 41, reliability: 92, avgLeadDays: 9, activeLots: 6, note: 'Deep crushing & screening flow; strong condition reports' },
  { id: 'SUP-02', name: 'Euro Auctions · Leeds', type: 'Auction', country: 'UK', flag: '🇬🇧', unitsYtd: 33, reliability: 88, avgLeadDays: 5, activeLots: 4, note: 'Local, fast collection; mixed grade' },
  { id: 'SUP-03', name: 'Van der Berg Plant', type: 'Dealer', country: 'Netherlands', flag: '🇳🇱', unitsYtd: 27, reliability: 95, avgLeadDays: 4, activeLots: 3, note: 'Premium low-hour units; reliable titles' },
  { id: 'SUP-04', name: 'Bidadoo · Online (US)', type: 'Auction', country: 'USA', flag: '🇺🇸', unitsYtd: 19, reliability: 84, avgLeadDays: 14, activeLots: 5, note: 'Feeds Miami yard; watch inland freight' },
  { id: 'SUP-05', name: 'Kier Fleet Disposal', type: 'Fleet disposal', country: 'UK', flag: '🇬🇧', unitsYtd: 22, reliability: 90, avgLeadDays: 7, activeLots: 2, note: 'Full service history; road-construction spec' },
  { id: 'SUP-06', name: 'Boels Rental Returns', type: 'Rental return', country: 'Belgium', flag: '🇧🇪', unitsYtd: 16, reliability: 86, avgLeadDays: 6, activeLots: 3, note: 'High-hour but well-maintained; good value' },
]

// Incoming lots Anvil is watching (procurement radar)
export type Lot = {
  id: string
  make: string
  model: string
  source: string
  closes: string
  estHammer: string
  predResale: string
  roi: number
  flag: string
  score: number // Anvil buy score 0-100
}

export const LOTS: Lot[] = [
  { id: 'LOT-771', make: 'Metso', model: 'Lokotrack LT106 (×2)', source: 'Ritchie Bros · Meppen', closes: 'Aug 3', estHammer: '€148-162K', predResale: '€215.4K', roi: 41, flag: '🇩🇪', score: 91 },
  { id: 'LOT-768', make: 'Powerscreen', model: 'Warrior 1800', source: 'Van der Berg Plant', closes: 'Jul 30', estHammer: '€58K', predResale: '€81.5K', roi: 40, flag: '🇳🇱', score: 88 },
  { id: 'LOT-765', make: 'Volvo', model: 'A30G hauler', source: 'Euro Auctions · Leeds', closes: 'Jul 31', estHammer: '€58K', predResale: '€79K', roi: 36, flag: '🇬🇧', score: 82 },
  { id: 'LOT-760', make: 'Liebherr', model: 'LTM 1070', source: 'Bidadoo · Online (US)', closes: 'Aug 5', estHammer: '€142K', predResale: '€188K', roi: 32, flag: '🇺🇸', score: 79 },
  { id: 'LOT-758', make: 'Bomag', model: 'BW 213 (×3)', source: 'Boels Rental Returns', closes: 'Aug 4', estHammer: '€26K', predResale: '€44K', roi: 69, flag: '🇧🇪', score: 90 },
]
