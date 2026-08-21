// Demand intelligence — regional buyer-demand signals Anvil aggregates from
// inbound inquiries, marketplace search, tender feeds and dealer chatter, plus
// the live buyer inquiry queue. Illustrative, modelled on Omnia's real export
// footprint (Africa, Middle East, South Asia, South America).

export type Region = {
  hub: string
  country: string
  flag: string
  continent: 'Africa' | 'Asia' | 'Middle East' | 'South America'
  index: number // 0-100 demand index
  trend: number // % vs prior 30d
  inquiries: number // last 30d
  topCategories: string[]
  note: string
  // rough plot coords on the stylized world (0-100 both axes)
  x: number
  y: number
}

export const REGIONS: Region[] = [
  { hub: 'Tema', country: 'Ghana', flag: '🇬🇭', continent: 'Africa', index: 94, trend: 22, inquiries: 61, topCategories: ['Screener', 'Crusher', 'Roller'], note: 'Road & port expansion driving mobile aggregate plant demand', x: 49, y: 62 },
  { hub: 'Apapa', country: 'Nigeria', flag: '🇳🇬', continent: 'Africa', index: 91, trend: 18, inquiries: 74, topCategories: ['Asphalt Paver', 'Cold Planer', 'Motor Grader'], note: 'Federal road contracts; buyers favour Wirtgen & Vögele', x: 48, y: 60 },
  { hub: 'Mombasa', country: 'Kenya', flag: '🇰🇪', continent: 'Africa', index: 82, trend: 12, inquiries: 43, topCategories: ['Crusher', 'Screener', 'Wheel Loader'], note: 'Quarry & aggregate sector steady growth', x: 57, y: 64 },
  { hub: 'Dar es Salaam', country: 'Tanzania', flag: '🇹🇿', continent: 'Africa', index: 76, trend: 9, inquiries: 31, topCategories: ['Screener', 'Roller'], note: 'Price-sensitive; older units clear well here', x: 57, y: 67 },
  { hub: 'Durban', country: 'South Africa', flag: '🇿🇦', continent: 'Africa', index: 68, trend: -4, inquiries: 26, topCategories: ['Mobile Crane', 'Material Handler'], note: 'Softer quarter; heavy lifting still active', x: 55, y: 78 },
  { hub: 'Jebel Ali', country: 'UAE', flag: '🇦🇪', continent: 'Middle East', index: 88, trend: 15, inquiries: 52, topCategories: ['Mobile Crane', 'Crusher', 'Drill Rig'], note: 'Re-export gateway; premium for low-hour, high-inspection', x: 63, y: 55 },
  { hub: 'Nhava Sheva', country: 'India', flag: '🇮🇳', continent: 'Asia', index: 84, trend: 14, inquiries: 47, topCategories: ['Crawler Crane', 'Material Handler'], note: 'Infrastructure push; strong on cranes & handlers', x: 70, y: 57 },
  { hub: 'Callao', country: 'Peru', flag: '🇵🇪', continent: 'South America', index: 71, trend: 7, inquiries: 22, topCategories: ['Crusher', 'Mobile Crane'], note: 'Mining supply chain; RoRo via Miami preferred', x: 27, y: 70 },
]

// Source markets Omnia buys from (map origin nodes)
export const SOURCES = [
  { hub: 'Rotterdam', flag: '🇳🇱', x: 46, y: 40 },
  { hub: 'Antwerp', flag: '🇧🇪', x: 45.5, y: 41 },
  { hub: 'Hamburg', flag: '🇩🇪', x: 48.5, y: 39 },
  { hub: 'Southampton', flag: '🇬🇧', x: 44, y: 40 },
  { hub: 'Miami', flag: '🇺🇸', x: 22, y: 55 },
]

// Buyer inquiry queue (inbound) — what Anvil is matching against stock
export type Inquiry = {
  id: string
  buyer: string
  country: string
  flag: string
  wants: string
  budget: string
  received: string
  matchId?: string // matched inventory unit
  matchScore: number // 0-100 Anvil match confidence
  status: 'new' | 'matched' | 'quoted' | 'negotiating'
}

export const INQUIRIES: Inquiry[] = [
  { id: 'INQ-2207', buyer: 'Adinkra Civil Works', country: 'Ghana', flag: '🇬🇭', wants: 'Mobile screening plant, <8k hrs', budget: '€95-120K', received: '2h ago', matchId: 'OM-4471', matchScore: 96, status: 'matched' },
  { id: 'INQ-2206', buyer: 'Lekki Infrastructure Ltd', country: 'Nigeria', flag: '🇳🇬', wants: '2× cold planers for federal road contract', budget: '€180-210K', received: '5h ago', matchId: 'OM-4120', matchScore: 92, status: 'matched' },
  { id: 'INQ-2205', buyer: 'Gulf Lifting Services', country: 'UAE', flag: '🇦🇪', wants: 'AT crane 90-100t, low hours', budget: '€230-260K', received: 'Yesterday', matchId: 'OM-4210', matchScore: 89, status: 'quoted' },
  { id: 'INQ-2204', buyer: 'Rift Valley Aggregates', country: 'Kenya', flag: '🇰🇪', wants: 'Tracked jaw crusher, 250 tph', budget: '€185-230K', received: 'Yesterday', matchId: 'OM-4060', matchScore: 90, status: 'matched' },
  { id: 'INQ-2203', buyer: 'Sahel Roads Consortium', country: 'Ghana', flag: '🇬🇭', wants: 'Tandem roller 12-13t', budget: '€40-48K', received: '2d ago', matchId: 'OM-4015', matchScore: 94, status: 'negotiating' },
  { id: 'INQ-2202', buyer: 'Konkan Heavy Movers', country: 'India', flag: '🇮🇳', wants: 'Material handler, port spec', budget: '€105-120K', received: '3d ago', matchId: 'OM-3994', matchScore: 87, status: 'quoted' },
  { id: 'INQ-2201', buyer: 'Andes Mining Supply', country: 'Peru', flag: '🇵🇪', wants: 'Jaw crusher, mining spec', budget: '€190-225K', received: '3d ago', matchId: 'OM-4402', matchScore: 85, status: 'matched' },
  { id: 'INQ-2200', buyer: 'Coastal Plant Tanzania', country: 'Tanzania', flag: '🇹🇿', wants: 'Budget screener, hours flexible', budget: '€55-70K', received: '4d ago', matchId: 'OM-4351', matchScore: 79, status: 'new' },
]

// Category demand trend for the desk chart (index over 6 months)
export const CATEGORY_TREND = [
  { m: 'Feb', Crusher: 71, Screener: 64, Roller: 68, Crane: 60 },
  { m: 'Mar', Crusher: 74, Screener: 66, Roller: 70, Crane: 62 },
  { m: 'Apr', Crusher: 79, Screener: 69, Roller: 73, Crane: 61 },
  { m: 'May', Crusher: 83, Screener: 72, Roller: 78, Crane: 64 },
  { m: 'Jun', Crusher: 88, Screener: 76, Roller: 83, Crane: 66 },
  { m: 'Jul', Crusher: 93, Screener: 80, Roller: 87, Crane: 67 },
]
