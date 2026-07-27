// Logistics — Omnia's in-house shipping department moves stock door-to-door,
// from partial container loads (LCL) to full RoRo. Anvil tracks each leg and
// flags ETA risk. Illustrative shipments across the real export corridors.

export type Leg = { label: string; done: boolean; date: string }
export type ShipStatus = 'booking' | 'at-origin' | 'on-water' | 'at-port' | 'inland' | 'delivered'

export type Shipment = {
  id: string
  mode: 'RoRo' | 'FCL' | 'LCL' | 'Flat-rack'
  vessel: string
  units: number
  machineSummary: string
  origin: string
  dest: string
  buyer: string
  flag: string
  etd: string
  eta: string
  status: ShipStatus
  progress: number // 0-100
  etaRisk: 'on-track' | 'watch' | 'delayed'
  legs: Leg[]
  value: number
}

export const SHIP_STATUS_LABEL: Record<ShipStatus, string> = {
  booking: 'Booking',
  'at-origin': 'At origin port',
  'on-water': 'On water',
  'at-port': 'At destination port',
  inland: 'Inland delivery',
  delivered: 'Delivered',
}

export const SHIPMENTS: Shipment[] = [
  {
    id: 'SH-8841', mode: 'RoRo', vessel: 'Grande Lagos', units: 2, machineSummary: '2× Komatsu D65 / Cat D6R dozers',
    origin: 'Antwerp', dest: 'Apapa, Nigeria', buyer: 'Lekki Infrastructure Ltd', flag: '🇳🇬',
    etd: 'Jul 14', eta: 'Aug 2', status: 'on-water', progress: 58, etaRisk: 'on-track', value: 186700,
    legs: [
      { label: 'Booked & documented', done: true, date: 'Jul 9' },
      { label: 'Delivered to Antwerp', done: true, date: 'Jul 12' },
      { label: 'Loaded RoRo · Grande Lagos', done: true, date: 'Jul 14' },
      { label: 'On water · Gulf of Guinea', done: false, date: 'ETA Aug 2' },
      { label: 'Discharge & customs · Apapa', done: false, date: '' },
      { label: 'Inland delivery to yard', done: false, date: '' },
    ],
  },
  {
    id: 'SH-8836', mode: 'FCL', vessel: 'MSC Nairobi', units: 1, machineSummary: 'Komatsu WA380-6 wheel loader',
    origin: 'Hamburg', dest: 'Mombasa, Kenya', buyer: 'Rift Valley Aggregates', flag: '🇰🇪',
    etd: 'Jul 10', eta: 'Aug 6', status: 'on-water', progress: 44, etaRisk: 'watch', value: 69800,
    legs: [
      { label: 'Booked & documented', done: true, date: 'Jul 5' },
      { label: 'Delivered to Hamburg', done: true, date: 'Jul 8' },
      { label: 'Containerised & loaded', done: true, date: 'Jul 10' },
      { label: 'On water · transhipment Salalah', done: false, date: 'ETA Aug 6' },
      { label: 'Discharge & customs · Mombasa', done: false, date: '' },
      { label: 'Inland delivery to yard', done: false, date: '' },
    ],
  },
  {
    id: 'SH-8829', mode: 'RoRo', vessel: 'Höegh Trigger', units: 1, machineSummary: 'Grove GMK5150 AT crane',
    origin: 'Miami', dest: 'Callao, Peru', buyer: 'Andes Mining Supply', flag: '🇵🇪',
    etd: 'Jul 20', eta: 'Aug 1', status: 'on-water', progress: 32, etaRisk: 'on-track', value: 172000,
    legs: [
      { label: 'Booked & documented', done: true, date: 'Jul 15' },
      { label: 'Delivered to Miami', done: true, date: 'Jul 18' },
      { label: 'Loaded RoRo · Höegh Trigger', done: true, date: 'Jul 20' },
      { label: 'On water · Panama transit', done: false, date: 'ETA Aug 1' },
      { label: 'Discharge & customs · Callao', done: false, date: '' },
      { label: 'Inland delivery to yard', done: false, date: '' },
    ],
  },
  {
    id: 'SH-8820', mode: 'Flat-rack', vessel: 'CMA CGM Jebel', units: 1, machineSummary: 'Sandvik DD421 drill rig',
    origin: 'Antwerp', dest: 'Jebel Ali, UAE', buyer: 'Gulf Lifting Services', flag: '🇦🇪',
    etd: 'Jul 8', eta: 'Jul 29', status: 'at-port', progress: 82, etaRisk: 'on-track', value: 194000,
    legs: [
      { label: 'Booked & documented', done: true, date: 'Jul 3' },
      { label: 'Delivered to Antwerp', done: true, date: 'Jul 6' },
      { label: 'Loaded flat-rack', done: true, date: 'Jul 8' },
      { label: 'On water · Suez transit', done: true, date: 'Jul 24' },
      { label: 'Discharge & customs · Jebel Ali', done: false, date: 'ETA Jul 29' },
      { label: 'Inland delivery to yard', done: false, date: '' },
    ],
  },
  {
    id: 'SH-8812', mode: 'LCL', vessel: 'Consolidation · Rotterdam', units: 3, machineSummary: 'Attachments & spares consolidation',
    origin: 'Rotterdam', dest: 'Tema, Ghana', buyer: 'Adinkra Civil Works', flag: '🇬🇭',
    etd: 'Jul 22', eta: 'Aug 10', status: 'at-origin', progress: 18, etaRisk: 'watch', value: 28400,
    legs: [
      { label: 'Booked & documented', done: true, date: 'Jul 19' },
      { label: 'Consolidating at Rotterdam', done: true, date: 'Jul 22' },
      { label: 'Container close & load', done: false, date: 'ETA Jul 26' },
      { label: 'On water', done: false, date: '' },
      { label: 'Discharge & customs · Tema', done: false, date: '' },
      { label: 'Inland delivery to yard', done: false, date: '' },
    ],
  },
  {
    // The "booked" end of the tracking ladder — freight arranged, nothing
    // collected yet. Repeat order from a buyer already mid-shipment on SH-8829.
    id: 'SH-8848', mode: 'RoRo', vessel: 'Höegh Copenhagen (awaiting confirmation)', units: 1, machineSummary: 'Volvo EC220DL excavator',
    origin: 'Miami', dest: 'Callao, Peru', buyer: 'Andes Mining Supply', flag: '🇵🇪',
    etd: 'Aug 8', eta: 'Aug 27', status: 'booking', progress: 8, etaRisk: 'on-track', value: 61200,
    legs: [
      { label: 'Booked & documented', done: true, date: 'Jul 27' },
      { label: 'Collection from Miami yard', done: false, date: 'Aug 3' },
      { label: 'Loaded RoRo · Höegh Copenhagen', done: false, date: 'ETA Aug 8' },
      { label: 'On water · Panama transit', done: false, date: 'ETA Aug 27' },
      { label: 'Discharge & customs · Callao', done: false, date: '' },
      { label: 'Inland delivery to yard', done: false, date: '' },
    ],
  },
]

// KPIs
export const SHIP_STATS = {
  inTransit: SHIPMENTS.filter((s) => ['on-water', 'at-port', 'inland'].includes(s.status)).length,
  // Only count what is genuinely moving — a booked-but-not-collected unit is
  // not "value in transit", and including it would overstate the figure.
  valueInTransit: SHIPMENTS.filter((s) => ['on-water', 'at-port', 'inland'].includes(s.status)).reduce((s, x) => s + x.value, 0),
  booked: SHIPMENTS.filter((s) => s.status === 'booking').length,
  onWater: SHIPMENTS.filter((s) => s.status === 'on-water').length,
  atRisk: SHIPMENTS.filter((s) => s.etaRisk !== 'on-track').length,
  countriesYTD: 49,
}
