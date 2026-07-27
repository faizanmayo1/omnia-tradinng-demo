// Inquiry Desk — the inbound email layer. Roughly half of Omnia's sales come
// from direct email campaigns to existing contacts, so this is where most
// buyer contact actually lands. Anvil reads each message, extracts the spec,
// matches it against stock, and answers the routine ones itself — escalating
// to the desk only where policy or judgement is required.
//
// This file is the single source of truth for how an inquiry has been handled.
// Demand Intelligence derives its queue status from here (see inquiryStatus)
// rather than carrying a second, drifting status of its own.

import type { Inquiry } from './demand'

export type Handling =
  | 'auto-replied' // Anvil answered and sent, no human touched it
  | 'drafted' // Anvil wrote a reply, waiting on desk approval
  | 'quoted' // priced quote issued
  | 'escalated' // routed to a human, with a reason
  | 'filtered' // not a buying inquiry; kept out of the queue

export type Channel = 'campaign' | 'website' | 'advertising' | 'direct'

export type Extracted = { label: string; value: string }

export type Thread = {
  id: string
  inquiryId?: string // links to demand.ts INQUIRIES; absent for non-inquiries
  from: string
  email: string
  company: string
  country: string
  flag: string
  subject: string
  received: string
  channel: Channel
  body: string
  handling: Handling
  intent: string
  confidence: number // 0-100, Anvil's read of the message
  extracted: Extracted[]
  matchId?: string // matched inventory unit
  reply?: string
  repliedIn?: string // time to first response
  escalation?: { reason: string; owner: string; policy: string }
}

export const THREADS: Thread[] = [
  {
    id: 'THR-5512',
    inquiryId: 'INQ-2207',
    from: 'Kwame Asare',
    email: 'k.asare@adinkracivil.com.gh',
    company: 'Adinkra Civil Works',
    country: 'Ghana',
    flag: '🇬🇭',
    subject: 'Re: Komatsu availability — 20t class',
    received: '2h ago',
    channel: 'campaign',
    body: 'Following your mailer last week — do you still have the 20-22 tonne Komatsu excavators in Rotterdam? We need one under 12,000 hours for a road contract starting September. Budget is €38-44K CIF Tema. Please send full spec and photos.',
    handling: 'auto-replied',
    intent: 'Buying inquiry · specific model class · in-budget',
    confidence: 96,
    extracted: [
      { label: 'Category', value: 'Excavator, 20-22t' },
      { label: 'Hours ceiling', value: '12,000 h' },
      { label: 'Budget', value: '€38-44K CIF' },
      { label: 'Destination', value: 'Tema, Ghana' },
      { label: 'Needed by', value: 'September' },
    ],
    matchId: 'OM-4471',
    reply: 'Hello Kwame — yes, we have a 2013 Komatsu PC210LC-8 at 10,400 hours in Rotterdam, inspection score 91/100. Landed Tema at €41,200 including RoRo freight, which sits inside your budget. Full spec sheet and 6 photos attached. Two further PC210s are available if you need a pair.',
    repliedIn: '3 min',
  },
  {
    id: 'THR-5509',
    inquiryId: 'INQ-2206',
    from: 'Chidi Okonkwo',
    email: 'procurement@lekki-infra.ng',
    company: 'Lekki Infrastructure Ltd',
    country: 'Nigeria',
    flag: '🇳🇬',
    subject: 'Dozer requirement — federal road contract',
    received: '5h ago',
    channel: 'campaign',
    body: 'We have been awarded a federal road package and need two dozers, D6 class or equivalent. Budget €85-110K for the pair. What can you offer from stock?',
    handling: 'auto-replied',
    intent: 'Buying inquiry · multi-unit · in-budget',
    confidence: 92,
    extracted: [
      { label: 'Category', value: 'Dozer, D6 class' },
      { label: 'Quantity', value: '2 units' },
      { label: 'Budget', value: '€85-110K (pair)' },
      { label: 'Destination', value: 'Apapa, Nigeria' },
    ],
    matchId: 'OM-4120',
    reply: 'Hello Chidi — we hold a 2012 Cat D6R in Rotterdam (12,900 h, inspection 86) and a 2016 Komatsu D65PX-17 in Antwerp (6,800 h, inspection 90). Spec sheets and photos attached for both. The D6R alone lands Apapa at €88,200; I have asked our desk to price the pair against your ceiling and come back to you today.',
    repliedIn: '6 min',
  },
  {
    id: 'THR-5504',
    inquiryId: 'INQ-2205',
    from: 'Rashid Al Mansoori',
    email: 'r.almansoori@gulflifting.ae',
    company: 'Gulf Lifting Services',
    country: 'UAE',
    flag: '🇦🇪',
    subject: 'All-terrain crane 90-100t',
    received: 'Yesterday',
    channel: 'direct',
    body: 'Looking for an AT crane in the 90-100 tonne class, low hours, full service history. We are a repeat buyer. Budget up to €260K. Can you quote landed Jebel Ali?',
    handling: 'quoted',
    intent: 'Buying inquiry · repeat buyer · high value',
    confidence: 89,
    extracted: [
      { label: 'Category', value: 'AT crane, 90-100t' },
      { label: 'Budget', value: 'up to €260K' },
      { label: 'Destination', value: 'Jebel Ali, UAE' },
      { label: 'Buyer history', value: '4 prior purchases' },
    ],
    matchId: 'OM-4210',
    reply: 'Rashid — quoting our 2012 Liebherr LTM 1090-4.2, 9,800 hours, inspection 88/100, full service history available. €251,000 landed Jebel Ali on flat-rack, 21-day transit. Formal quote OMN-Q-4210 attached with photo set and inspection report.',
    repliedIn: '12 min',
  },
  {
    id: 'THR-5501',
    inquiryId: 'INQ-2204',
    from: 'Grace Wanjiru',
    email: 'g.wanjiru@riftvalleyagg.co.ke',
    company: 'Rift Valley Aggregates',
    country: 'Kenya',
    flag: '🇰🇪',
    subject: 'Wheel loader for quarry duty',
    received: 'Yesterday',
    channel: 'website',
    body: 'Need a wheel loader with a 4-5m³ bucket for aggregate handling. €60-72K. Mombasa delivery.',
    handling: 'auto-replied',
    intent: 'Buying inquiry · specific spec · in-budget',
    confidence: 90,
    extracted: [
      { label: 'Category', value: 'Wheel Loader, 4-5m³' },
      { label: 'Application', value: 'Quarry / aggregate' },
      { label: 'Budget', value: '€60-72K' },
      { label: 'Destination', value: 'Mombasa, Kenya' },
    ],
    matchId: 'OM-4060',
    reply: 'Hello Grace — the Komatsu WA380-6 (2014, 10,100 h, inspection 88) is quarry-specced and available in Hamburg. €69,800 landed Mombasa. Spec sheet and photos attached; bucket configuration is confirmed at 4.3m³.',
    repliedIn: '4 min',
  },
  {
    id: 'THR-5496',
    inquiryId: 'INQ-2203',
    from: 'Ibrahim Traoré',
    email: 'i.traore@sahelroads.com',
    company: 'Sahel Roads Consortium',
    country: 'Ghana',
    flag: '🇬🇭',
    subject: 'Re: Bomag roller — payment terms',
    received: '2d ago',
    channel: 'campaign',
    body: 'The BW 213 works for us at €45,200. However our funding releases in tranches — we would need 90-day terms, 30% deposit and the balance on delivery. Is that something you can accommodate?',
    handling: 'escalated',
    intent: 'Buying inquiry · non-standard payment terms',
    confidence: 94,
    extracted: [
      { label: 'Unit agreed', value: 'OM-4015 · Bomag BW 213 D-5' },
      { label: 'Price agreed', value: '€45,200' },
      { label: 'Terms requested', value: '90 days, 30% deposit' },
      { label: 'Destination', value: 'Tema, Ghana' },
    ],
    matchId: 'OM-4015',
    escalation: {
      reason: 'Buyer is requesting 90-day payment terms on a €45.2K unit. Credit exposure and staged payment fall outside what Anvil is permitted to agree.',
      owner: 'H. Osei · Trading Desk Lead',
      policy: 'Auto-reply policy: terms beyond 30 days, or any staged payment, route to the desk.',
    },
  },
  {
    id: 'THR-5488',
    inquiryId: 'INQ-2202',
    from: 'Prakash Nair',
    email: 'p.nair@konkanheavy.in',
    company: 'Konkan Heavy Movers',
    country: 'India',
    flag: '🇮🇳',
    subject: 'Material handler — port specification',
    received: '3d ago',
    channel: 'advertising',
    body: 'Require a material handler in port specification, scrap and bulk handling. Around €105-120K. Nhava Sheva.',
    handling: 'quoted',
    intent: 'Buying inquiry · specific application',
    confidence: 87,
    extracted: [
      { label: 'Category', value: 'Material Handler' },
      { label: 'Application', value: 'Port · scrap & bulk' },
      { label: 'Budget', value: '€105-120K' },
      { label: 'Destination', value: 'Nhava Sheva, India' },
    ],
    matchId: 'OM-3994',
    reply: 'Prakash — quoting the Sennebogen 830 M (2015, 9,500 h, inspection 89), port-specced with material handling boom and grab. €114,500 landed Nhava Sheva. Quote OMN-Q-3994 attached with photo set.',
    repliedIn: '9 min',
  },
  {
    id: 'THR-5480',
    inquiryId: 'INQ-2201',
    from: 'Diego Ramírez',
    email: 'd.ramirez@andesminingsupply.pe',
    company: 'Andes Mining Supply',
    country: 'Peru',
    flag: '🇵🇪',
    subject: '20t excavator, mining specification',
    received: '3d ago',
    channel: 'website',
    body: 'Buscamos una excavadora de 20 toneladas para faena minera. Presupuesto €55-65K, entrega Callao. ¿Qué tienen disponible?',
    handling: 'auto-replied',
    intent: 'Buying inquiry · Spanish · mining application',
    confidence: 85,
    extracted: [
      { label: 'Language', value: 'Spanish — replied in kind' },
      { label: 'Category', value: 'Excavator, 20t' },
      { label: 'Application', value: 'Mining' },
      { label: 'Budget', value: '€55-65K' },
      { label: 'Destination', value: 'Callao, Peru' },
    ],
    matchId: 'OM-4402',
    reply: 'Diego — tenemos una Volvo EC220DL de 2015 con 8,600 horas en Miami, puntuación de inspección 89/100, configurada para minería. €61,200 puesto en Callao vía RoRo. Ficha técnica y fotos adjuntas.',
    repliedIn: '5 min',
  },
  {
    id: 'THR-5471',
    inquiryId: 'INQ-2200',
    from: 'Joseph Mwakalinga',
    email: 'j.mwakalinga@coastalplant.co.tz',
    company: 'Coastal Plant Tanzania',
    country: 'Tanzania',
    flag: '🇹🇿',
    subject: 'Cheapest 20t excavator you have',
    received: '4d ago',
    channel: 'campaign',
    body: 'What is the cheapest 20 tonne excavator you can land in Dar es Salaam? Hours are not important to us, condition just needs to be working. Around €30-36K.',
    handling: 'drafted',
    intent: 'Buying inquiry · price-led · hours flexible',
    confidence: 79,
    extracted: [
      { label: 'Category', value: 'Excavator, 20t' },
      { label: 'Budget', value: '€30-36K' },
      { label: 'Hours', value: 'Not a constraint' },
      { label: 'Destination', value: 'Dar es Salaam, Tanzania' },
    ],
    matchId: 'OM-4351',
    reply: 'Hello Joseph — the closest fit is our 2011 Cat 320D, 15,600 hours, currently in inspection at Southampton. Indicative €33,200 landed Dar es Salaam. It is a high-hour machine, so I would want the inspection signed off before confirming — I will come back to you the moment it clears.',
  },
  {
    id: 'THR-5468',
    from: 'Fatima Bello',
    email: 'f.bello@northgateplant.ng',
    company: 'Northgate Plant Hire',
    country: 'Nigeria',
    flag: '🇳🇬',
    subject: 'Finance options for a fleet purchase',
    received: '4d ago',
    channel: 'campaign',
    body: 'We are looking at 6-8 machines over the next quarter and would want to finance rather than pay outright. Do you offer any leasing or does that need to go through a third party?',
    handling: 'escalated',
    intent: 'Buying inquiry · fleet scale · financing question',
    confidence: 88,
    extracted: [
      { label: 'Scale', value: '6-8 units, next quarter' },
      { label: 'Question', value: 'Leasing / finance availability' },
      { label: 'Destination', value: 'Nigeria' },
    ],
    escalation: {
      reason: 'Financing and leasing arrangements are commercial decisions with credit implications. Fleet-scale enquiry worth a direct conversation.',
      owner: 'S. Brown · Owner & Director',
      policy: 'Auto-reply policy: finance, leasing and credit questions always route to a human.',
    },
  },
  {
    id: 'THR-5463',
    from: 'Ahmed Farouk',
    email: 'a.farouk@deltaequip.eg',
    company: 'Delta Equipment Egypt',
    country: 'Egypt',
    flag: '🇪🇬',
    subject: 'Do you ship to Alexandria?',
    received: '5d ago',
    channel: 'website',
    body: 'Before I look through your stock — do you handle shipping to Alexandria, and roughly what does that add to the price?',
    handling: 'auto-replied',
    intent: 'Pre-sales question · logistics capability',
    confidence: 93,
    extracted: [
      { label: 'Question type', value: 'Shipping capability' },
      { label: 'Destination', value: 'Alexandria, Egypt' },
      { label: 'Stock matched', value: 'None requested yet' },
    ],
    reply: 'Hello Ahmed — yes, we ship to Alexandria regularly, usually RoRo out of Antwerp or Rotterdam on a 14-18 day transit. Freight typically adds €2,400-3,600 depending on machine class. Tell me what you are looking for and I will come back with a landed price rather than an ex-yard one.',
    repliedIn: '2 min',
  },
  {
    id: 'THR-5459',
    from: 'Tunde Adeyemi',
    email: 't.adeyemi@westcoastplant.ng',
    company: 'West Coast Plant Services',
    country: 'Nigeria',
    flag: '🇳🇬',
    subject: 'Spare parts for PC210',
    received: '5d ago',
    channel: 'website',
    body: 'Do you sell final drives and undercarriage parts for the Komatsu PC210? We run four of them.',
    handling: 'auto-replied',
    intent: 'Out of scope · parts request',
    confidence: 91,
    extracted: [
      { label: 'Request', value: 'Spare parts — final drives' },
      { label: 'Scope', value: 'Omnia trades whole machines' },
      { label: 'Onward value', value: 'Runs 4× PC210 — future buyer' },
    ],
    reply: 'Hello Tunde — we trade complete machines rather than parts, so I cannot help directly on final drives. I have added you to our PC210 stock alerts, since you run a fleet of four and we move these regularly. If you ever want to replace rather than repair, we usually have several in yard.',
    repliedIn: '3 min',
  },
  {
    id: 'THR-5452',
    from: 'Marketing',
    email: 'campaigns@plantfinance-offers.net',
    company: 'PlantFinance Offers',
    country: '—',
    flag: '📧',
    subject: 'Boost your equipment sales by 300% this quarter',
    received: '6d ago',
    channel: 'direct',
    body: 'Dear Sir/Madam, our proven lead generation system has helped hundreds of equipment dealers triple their sales. Book a free consultation today...',
    handling: 'filtered',
    intent: 'Unsolicited marketing — not a buying inquiry',
    confidence: 99,
    extracted: [
      { label: 'Classification', value: 'Bulk marketing' },
      { label: 'Action', value: 'Filtered, not queued' },
    ],
  },
  {
    id: 'THR-5449',
    from: 'Newsletter',
    email: 'news@euroauction-weekly.com',
    company: 'EuroAuction Weekly',
    country: '—',
    flag: '📧',
    subject: 'This week: 1,400 lots across 6 sales',
    received: '6d ago',
    channel: 'direct',
    body: 'Your weekly digest of upcoming auction lots across Europe...',
    handling: 'filtered',
    intent: 'Trade newsletter — routed to procurement digest',
    confidence: 97,
    extracted: [
      { label: 'Classification', value: 'Trade newsletter' },
      { label: 'Action', value: 'Filtered from buyer queue' },
    ],
  },
  {
    id: 'THR-5444',
    from: 'Kwame Asare',
    email: 'k.asare@adinkracivil.com.gh',
    company: 'Adinkra Civil Works',
    country: 'Ghana',
    flag: '🇬🇭',
    subject: 'Komatsu availability (resent)',
    received: '6d ago',
    channel: 'campaign',
    body: 'Following your mailer last week — do you still have the 20-22 tonne Komatsu excavators in Rotterdam?...',
    handling: 'filtered',
    intent: 'Duplicate of THR-5512 — merged',
    confidence: 95,
    extracted: [
      { label: 'Classification', value: 'Duplicate message' },
      { label: 'Merged into', value: 'THR-5512' },
    ],
  },
]

// --- Derived helpers ---

export const HANDLING_LABEL: Record<Handling, string> = {
  'auto-replied': 'Auto-replied',
  drafted: 'Draft ready',
  quoted: 'Quoted',
  escalated: 'Escalated',
  filtered: 'Filtered',
}

/**
 * How a handling state presents in Demand Intelligence's buyer queue.
 * Keeping the mapping here means the two screens can never disagree about
 * the same INQ- id. Filtered threads have no queue presence at all.
 */
const HANDLING_TO_STATUS: Record<Handling, Inquiry['status'] | null> = {
  'auto-replied': 'matched',
  drafted: 'new',
  quoted: 'quoted',
  escalated: 'negotiating',
  filtered: null,
}

/** Queue status for an INQ- id, derived from how the thread was actually handled. */
export function inquiryStatus(inquiryId: string): Inquiry['status'] | undefined {
  const t = THREADS.find((x) => x.inquiryId === inquiryId)
  if (!t) return undefined
  return HANDLING_TO_STATUS[t.handling] ?? undefined
}

/** The thread behind an inventory unit, if a buyer has asked about it. */
export function threadForMachine(machineId: string) {
  return THREADS.find((t) => t.matchId === machineId)
}

export const QUEUE = THREADS.filter((t) => t.handling !== 'filtered')
export const ESCALATIONS = THREADS.filter((t) => t.handling === 'escalated')

// Channel mix — roughly half of all sales originate in direct email campaigns
// to existing contacts, the other half from the website and paid advertising.
export const CHANNEL_MIX: { label: string; share: number; tone: 'copper' | 'anvil' | 'steel' }[] = [
  { label: 'Direct email campaigns', share: 50, tone: 'copper' },
  { label: 'Website enquiries', share: 34, tone: 'anvil' },
  { label: 'Advertising & marketplaces', share: 16, tone: 'steel' },
]

export const INBOX_STATS = {
  received30d: 412,
  autoHandledPct: 78,
  escalated30d: 61,
  medianReply: '4 min',
  manualBaseline: '9h 20m',
}
