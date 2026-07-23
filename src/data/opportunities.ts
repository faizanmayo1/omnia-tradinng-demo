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
    title: 'Komatsu PC210 cluster → West Africa demand surge',
    summary:
      'Buyer demand for 20-22t crawler excavators in Ghana & Nigeria is up 22% over 30 days, led by road and port contracts. Omnia holds three PC210LC-8 units in EU yards acquired at €25.9K average. Anvil predicts €41.4K average resale into Tema/Apapa and matches live inquiry INQ-2207 (Adinkra Civil Works, 96% fit).',
    region: 'Tema, Ghana · Apapa, Nigeria',
    units: ['OM-4471', 'OM-4472', 'OM-4473'],
    confidence: 94,
    marginUplift: 46500,
    window: 'Act within 6 days — inquiry INQ-2207 quoted competitively by 2 rivals',
    evidence: [
      { label: 'Demand index (Tema)', value: '94 · +22% 30d' },
      { label: 'Units in EU stock', value: '3 × PC210LC-8' },
      { label: 'Avg acquisition', value: '€25,867' },
      { label: 'Predicted resale (avg)', value: '€41,367' },
      { label: 'Best routing', value: 'RoRo Antwerp → Tema · 19d' },
      { label: 'Matched inquiry', value: 'INQ-2207 · 96% fit' },
    ],
    action: 'Build deal & book RoRo',
  },
  {
    id: 'OPP-2211',
    kind: 'procure',
    title: 'Acquire 2× Cat 336 at Ritchie Bros Meppen auction',
    summary:
      'Two 2014 Cat 336DL excavators listed at the Jul 28 Meppen sale, est. €40-44K each. Kenya & UAE demand supports €66K+ resale. Anvil rates procurement ROI at 58% net of logistics and refurbishment.',
    region: 'Source: Meppen, DE → Mombasa / Jebel Ali',
    units: [],
    confidence: 86,
    marginUplift: 38400,
    window: 'Auction closes Jul 28 · pre-bid by Jul 27',
    evidence: [
      { label: 'Est. hammer (each)', value: '€40-44K' },
      { label: 'Predicted resale (each)', value: '€66.4K' },
      { label: 'Net ROI', value: '58%' },
      { label: 'Demand support', value: 'Mombasa 82 · Jebel Ali 88' },
    ],
    action: 'Add to bid plan',
  },
  {
    id: 'OPP-2209',
    kind: 'reprice',
    title: 'Sandvik DD421 aging 52 days — reprice for Jebel Ali',
    summary:
      'Drill rig OM-3980 has sat 52 days at Antwerp. UAE demand is firm but the current ask sits 6% above comparable clears. A €6K reduction is predicted to convert within 12 days and still hold a 47% margin.',
    region: 'Jebel Ali, UAE',
    units: ['OM-3980'],
    confidence: 81,
    marginUplift: -6000,
    window: 'Aging cost €140/day — act this week',
    evidence: [
      { label: 'Days in yard', value: '52' },
      { label: 'Current ask', value: '€178,000' },
      { label: 'Suggested ask', value: '€172,000' },
      { label: 'Predicted days-to-clear', value: '12' },
    ],
    action: 'Apply reprice',
  },
  {
    id: 'OPP-2205',
    kind: 'reroute',
    title: 'Divert Cat 320D from Tanzania to Ghana',
    summary:
      'Budget excavator OM-4351 is pencilled for Dar es Salaam at €33.2K. Anvil sees a stronger Tema match (INQ from Sahel Roads) predicting €35.8K on the same freight cost, lifting margin €2.6K.',
    region: 'Reroute: Dar es Salaam → Tema',
    units: ['OM-4351'],
    confidence: 77,
    marginUplift: 2600,
    window: 'Before inspection completes (Jul 26)',
    evidence: [
      { label: 'Current plan', value: 'Dar es Salaam €33.2K' },
      { label: 'Anvil suggestion', value: 'Tema €35.8K' },
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
