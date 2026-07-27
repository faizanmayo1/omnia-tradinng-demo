# Omnia Machinery · Anvil — Equipment Trading Intelligence

A pre-sales demo for **Omnia Machinery Group** (used heavy-equipment traders).
The **Anvil** AI layer sits over Omnia's trading operation and centralizes
machine history, inspection reports, supplier networks, logistics and buyer
demand — then surfaces the deals worth acting on.

**Prospect:** Sam Brown (Owner & Director). **Rep:** Adnan (CodeUpscale).
**Demo call:** Thu Jul 24 2026. **Updated build:** Jul 27 2026.

Omnia runs from **Billingham, Teesside (UK)** and **Miami, FL (US)**, brokers
roughly **200 machines a month** and closes **20–30** of them, with a desk of
**10–12 people** currently working out of shared spreadsheets, email and Teams.

## Signature moment
The **Opportunity Engine** flags a Komatsu PC210 cluster against a West Africa
demand surge — three units in EU yards matched to a live Ghana buyer — and
builds the deal end to end (reserve → quote → RoRo booking → buyer notify),
compressing the deal cycle from ~14 days to under 48 hours.

## Post-call additions (Jul 27)
Built in response to the Jul 24 conversation:

- **Inquiry Desk** — the email layer. Anvil reads inbound buyer email, extracts
  the spec, matches it to stock and **auto-replies to routine inquiries**,
  escalating only what needs judgement (payment terms, finance, credit) with a
  stated reason. This is the WhatsApp agent Sam saw, ported to email — where
  ~50% of Omnia's sales actually originate.
- **Machine pack** — send spec sheet, photo set and landed price to a buyer
  without leaving the platform. Sam's own feature request. Photography is
  represented by placeholder plates; real listing images drop into the same slots.
- **Sign in / sign up** — the demo opens on a real auth screen. Accounts are
  named, roles are granted by an administrator, and the sidebar only shows what
  the signed-in person may reach.
- **Access & Audit** — 11 named accounts, five scoped roles and an append-only
  audit trail, replacing "who edited the spreadsheet". Sign-ins, sign-outs, role
  grants, sent packs and approved replies all land in the log.
- **Est. value from your own book** — comparable-sale pricing drawn from Omnia's
  closed transactions rather than public auction data, which is thin for this
  catalogue. Deliberately modest: it is the honest version of the pricing tool
  Sam originally had in mind.

## Screens
Command Center · Opportunity Engine (hero) · **Inquiry Desk** · Inventory &
Machines · Demand Intelligence · Logistics & Shipments · Procurement & Sourcing ·
Anvil Copilot · **Access & Audit**.

## Signing in to the demo

The app opens on a sign-in screen. Every seeded account uses the password
**`omnia2026`**, and the screen also lists one-click accounts so nobody gets
stuck — sign in as different people to see permissions change what is visible:

| Account | Role | What they see |
|---|---|---|
| Sam Brown | Administrator | Everything, including role management |
| H. Osei | Trading desk | Deals, stock, demand, inquiry desk |
| Priya Shah | Logistics | Shipments and stock — no sourcing or pricing |
| Elena Rossi | Procurement | Sourcing and lots — no logistics |
| Anna Whitfield | Read only | Stock and demand, changes nothing |

**Sign-up** models an invite-style joiner: name, work email, password and an
invite code (`OMNIA-2026`). New accounts land as **Pending access** with no
operational screens until an administrator grants a role from Access & Audit —
nobody picks their own permissions.

There is no backend. Credentials are mock, validated in the browser, and nothing
is transmitted or stored anywhere.

## Design — "Forged Steel"
A cool milled-steel canvas, graphite ink, molten-copper brand accent, teal as the
Anvil AI signal. The ground is deliberately cool so the copper reads as heat off
a forge rather than as decorative terracotta.

Three type roles: **Familjen Grotesk** (display), **Inter** (body), **IBM Plex
Mono** (instrumentation — identifiers and readings only).

**Signature — the stamped plate.** Every object on this desk carries a code:
`OM-4471` on a machine, `SH-8841` on a shipment, `THR-5512` on an inquiry. Those
codes are how the business actually refers to its world, so they are set as
milled machine plates rather than faint grey text, and turn copper when live.
It is the one device repeated on every screen and the only place the mono face
is allowed. Plus the signature trade-flow world map.

Note for future work: the design is authored against a **numeric weight scale**
(`font-450` … `font-700`) declared in `tailwind.config.js`. Tailwind ships no
numeric `fontWeight` keys by default — without those entries every one of those
classes silently generates nothing and the whole app flattens to weight 400.

## Stack
Vite + React + TypeScript + Tailwind + Recharts. All data is static mock data in
`src/data/` — there is no backend and no live mail integration.

```bash
npm install
npm run dev      # local dev
npm run build    # production build
npm run preview  # verify the production build
```

Deploying: `public/_redirects` (Netlify) and `vercel.json` (Vercel) both ship an
SPA rewrite so deep links like `/inbox` resolve instead of 404ing. Each is inert
on the host that doesn't read it.

Figures are illustrative; brands, models and export corridors reflect Omnia's
real catalogue and footprint (exported to 49 countries across 6 continents).
