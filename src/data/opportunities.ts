// Anvil opportunity feed — the AI's ranked calls across the trading operation:
// resale matches, procurement to buy, reprice nudges, and reroute suggestions.
// The hero is OPP-2207: a surplus-vs-demand resale match into West Africa.

export type OppKind = 'resale' | 'procure' | 'reprice' | 'reroute'

export type Evidence = { label: string; value: string }

export type Opportunity = {
  id: string
  kind: OppKind
  title: string
  summary: string
  region: string
  units: string[] // machine ids
  confidence: number // 0-100
  marginUplift: number // EUR gained vs current plan
  window: string // acting window
  evidence: Evidence[]
  action: string // primary CTA label
  hero?: boolean
}

/**
 * What `marginUplift` actually measures differs by kind, so the headline must say which.
 * A resale gains over selling in Europe; a reprice deliberately gives margin up to convert;
 * a reroute shifts commission between destinations. One generic "margin uplift" label made
 * the reprice read as a €6K gain when it is a €6K reduction.
 */
export const UPLIFT_LABEL: Record<OppKind, string> = {
  resale: 'Uplift vs EU sale',
  procure: 'Predicted margin',
  reprice: 'Margin impact',
  reroute: 'Commission impact',
}

export const KIND_LABEL: Record<OppKind, string> = {
  resale: 'Resale match',
  procure: 'Procurement',
  reprice: 'Reprice',
  reroute: 'Reroute',
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'OPP-2207',
    kind: 'resale',
    hero: true,
    title: 'Powerscreen Chieftain cluster → West Africa aggregate surge',
    summary:
      'Buyer demand for mobile screening plant in Ghana & Nigeria is up 22% over 30 days, driven by road and port aggregate contracts. Omnia holds three Chieftain 2100X units in EU yards acquired at €67.8K average. Anvil predicts €111K average resale into Tema/Apapa — backed by seven closed Chieftain sales in the last six months — and matches live inquiry INQ-2207 (Adinkra Civil Works, 96% fit).',
    region: 'Tema, Ghana · Apapa, Nigeria',
    units: ['OM-4471', 'OM-4472', 'OM-4473'],
    confidence: 94,
    marginUplift: 57500,
    window: 'Act within 6 days — inquiry INQ-2207 quoted competitively by 2 rivals',
    evidence: [
      { label: 'Demand index (Tema)', value: '94 · +22% 30d' },
      { label: 'Units in EU stock', value: '3 × Chieftain 2100X' },
      { label: 'Avg acquisition', value: '€67,833' },
      { label: 'Predicted resale (avg)', value: '€111,000' },
      { label: 'Comps behind estimate', value: '7 closed sales · high confidence' },
      { label: 'Best routing', value: 'RoRo Antwerp → Tema · 19d' },
      { label: 'Matched inquiry', value: 'INQ-2207 · 96% fit' },
    ],
    action: 'Build deal & book RoRo',
  },
  {
    id: 'OPP-2211',
    kind: 'procure',
    title: 'Acquire 2× Metso LT106 at Ritchie Bros Meppen auction',
    summary:
      'Two 2015 Metso Lokotrack LT106 jaw crushers listed at the Aug 3 Meppen sale, est. €148-162K each. Kenya & UAE quarry demand supports €215K+ resale. Anvil rates procurement ROI at 41% net of logistics and refurbishment.',
    region: 'Source: Meppen, DE → Mombasa / Jebel Ali',
    units: [],
    confidence: 86,
    marginUplift: 84200,
    window: 'Auction closes Aug 3 · pre-bid by Aug 1',
    evidence: [
      { label: 'Est. hammer (each)', value: '€148-162K' },
      { label: 'Predicted resale (each)', value: '€215.4K' },
      { label: 'Net ROI', value: '41%' },
      { label: 'Demand support', value: 'Mombasa 82 · Jebel Ali 88' },
    ],
    action: 'Add to bid plan',
  },
  {
    id: 'OPP-2209',
    kind: 'reprice',
    title: 'Sandvik DD421 aging 128 days — reprice for Jebel Ali',
    summary:
      'Drill rig OM-3980 has sat 128 days at the Miami yard. UAE demand is firm but the current ask sits 6% above comparable clears. A €6K reduction is predicted to convert within 12 days and still hold a 47% margin.',
    region: 'Jebel Ali, UAE',
    units: ['OM-3980'],
    confidence: 81,
    marginUplift: -6000,
    window: 'Aging cost €140/day — act this week',
    evidence: [
      { label: 'Days listed', value: '128' },
      { label: 'Current ask', value: '€178,000' },
      { label: 'Suggested ask', value: '€172,000' },
      { label: 'Predicted days-to-clear', value: '12' },
    ],
    action: 'Apply reprice',
  },
  {
    id: 'OPP-2205',
    kind: 'reroute',
    title: 'Divert Terex Finlay 883+ from Tanzania to Ghana',
    summary:
      'Budget screener OM-4351, listed for Kelly Plant Hire in Cork, is pencilled for Dar es Salaam at €66.5K. Anvil sees a stronger Tema match (INQ from Sahel Roads) predicting €71.4K on the same freight cost, lifting Omnia commission €370 and clearing a 118-day listing.',
    region: 'Reroute: Dar es Salaam → Tema',
    units: ['OM-4351'],
    confidence: 77,
    marginUplift: 370,
    window: 'Before inspection completes — listing is 118 days old',
    evidence: [
      { label: 'Current plan', value: 'Dar es Salaam €66.5K' },
      { label: 'Anvil suggestion', value: 'Tema €71.4K' },
      { label: 'Freight delta', value: '€0 (same lane band)' },
    ],
    action: 'Reroute unit',
  },
]

export const HERO = OPPORTUNITIES.find((o) => o.hero)!

// Opportunity roll-up for the command center
export const OPP_STATS = {
  open: OPPORTUNITIES.length,
  totalUplift: OPPORTUNITIES.reduce((s, o) => s + Math.max(0, o.marginUplift), 0),
  highConfidence: OPPORTUNITIES.filter((o) => o.confidence >= 85).length,
}
