export interface ProofPoint {
  claim: string
  standardOrCert: string
  issuer: string
  link: string
}

export interface TraceabilityStep {
  step: string
  org: string
  country: string
  date: string
  evidenceUrl: string
}

export interface ImpactMetric {
  name: string
  value: string
  unit?: string
  comparison?: string
  sourceUrl?: string
}

export interface ImpactProfile {
  methodologyNote: string
  metrics: ImpactMetric[]
}

export interface PassportEvents {
  creationTx: string
  lastTransfer: string
  currentHolder: string
}

export interface PassportNFT {
  assetId: string
  name: string
  unitName: string
  image: string
  properties: {
    productId: string
    batch: string
    size: string
    color: string
    serial: string
  }
  reserve: string
  creator: string
  explorerUrl: string
  peraUrl: string
  events: PassportEvents
}

export interface Product {
  productId: string
  title: string
  sku: string
  description: string
  category: string
  materials: string[]
  msrp?: string
  impactRange: 'Low' | 'Medium' | 'High'
  verifiedClaims: string[]
  images: string[]
  masterAssetId: string
  impact: ImpactProfile
  traceability: TraceabilityStep[]
  proofPoints: ProofPoint[]
}

export interface FeaturedDropTile {
  productId: string
  model: string
  assetId: string
  image?: string
  gradient?: string
}

export interface LookupPreset {
  passport: PassportNFT
  product: Product
}

// Demo imagery
import hero from '../assets/hero.jpg'

export const featuredDrops: FeaturedDropTile[] = [
  {
    productId: 'aurora-overcoat',
    model: 'FW24 Capsule',
    assetId: '103451726',
    image: hero,
  },
  {
    productId: 'lumen-knit',
    model: 'FW24 Capsule',
    assetId: '103451810',
    gradient: 'from-rose-100 via-amber-100 to-rose-200',
  },
  {
    productId: 'halo-trench',
    model: 'FW24 Capsule',
    assetId: '103451921',
    gradient: 'from-slate-900 via-slate-800 to-slate-700 text-white',
  },
  {
    productId: 'celeste-denim',
    model: 'Core Icons',
    assetId: '103452034',
    gradient: 'from-sky-100 via-emerald-100 to-sky-200',
  },
]

const sharedImpact: ImpactProfile = {
  methodologyNote:
    'Measured using the Higg MSI v3.7 methodology with Algorand-anchored audit hashes and third-party verification.',
  metrics: [
    {
      name: 'CO₂e footprint',
      value: '7.2',
      unit: 'kg',
      comparison: '42% lower than EU ESPR benchmark',
      sourceUrl: 'https://allbirds.com/pages/sustainability',
    },
    {
      name: 'Water usage',
      value: '610',
      unit: 'L',
      comparison: '55% less than fast fashion average',
    },
    {
      name: 'Energy mix',
      value: '92%',
      comparison: 'Powered by Iberian solar co-op',
    },
    {
      name: 'Circularity score',
      value: '78',
      unit: '/100',
      comparison: '+28 pts vs ESPR baseline',
    },
  ],
}

const sharedTraceability: TraceabilityStep[] = [
  {
    step: 'Fiber sourcing',
    org: 'TerraCotton Cooperative',
    country: 'Spain',
    date: 'Jan 2024',
    evidenceUrl: '#soil-audit',
  },
  {
    step: 'Mill & dyehouse',
    org: 'Laguna Mill',
    country: 'Portugal',
    date: 'Feb 2024',
    evidenceUrl: '#bluesign',
  },
  {
    step: 'Cut & sew',
    org: 'Atelier Lumen',
    country: 'Portugal',
    date: 'Mar 2024',
    evidenceUrl: '#fairwage',
  },
  {
    step: 'Logistics',
    org: 'ZeroTrace Logistics',
    country: 'EU',
    date: 'Mar 2024',
    evidenceUrl: '#offset-proof',
  },
  {
    step: 'Retail activation',
    org: 'Étoile House Paris',
    country: 'France',
    date: 'Apr 2024',
    evidenceUrl: '#popup',
  },
]

const sharedProofPoints: ProofPoint[] = [
  {
    claim: 'Organic cotton',
    standardOrCert: 'EU Organic Cert #ES-RA-204',
    issuer: 'Regione Andalucía',
    link: '#organic-proof',
  },
  {
    claim: 'Living-wage factory',
    standardOrCert: 'Fair Wage Network audit 2024',
    issuer: 'Fair Wage Network',
    link: '#living-wage',
  },
  {
    claim: 'Traceable logistics',
    standardOrCert: 'Carbon offset tx 1AD5H...QM4',
    issuer: 'Algorand ledger',
    link: '#logistics-proof',
  },
]

export const products: Product[] = [
  {
    productId: 'aurora-overcoat',
    title: 'Aurora Overcoat',
    sku: 'ETO-AUR-01',
    description: 'Bio-based leather overcoat with modular thermal lining for year-round wear.',
    category: 'Outerwear',
    materials: ['Bio-based leather shell', 'Organic cotton lining', 'Recycled corozo buttons'],
    msrp: '€420',
    impactRange: 'Low',
    verifiedClaims: ['Organic cotton lining', 'Bluesign® dyehouse'],
    images: [hero],
    masterAssetId: '103451726',
    impact: sharedImpact,
    traceability: sharedTraceability,
    proofPoints: sharedProofPoints,
  },
  {
    productId: 'lumen-knit',
    title: 'Lumen Knit Set',
    sku: 'ETO-LUM-02',
    description: 'Regenerative wool twinset produced in a solar-powered Portuguese mill.',
    category: 'Knitwear',
    materials: ['Regenerative merino', 'Plant-dyed trims'],
    msrp: '€260',
    impactRange: 'Medium',
    verifiedClaims: ['Fair Trade certified', 'Solar-powered mill'],
    images: [hero],
    masterAssetId: '103451810',
    impact: sharedImpact,
    traceability: sharedTraceability,
    proofPoints: sharedProofPoints,
  },
  {
    productId: 'halo-trench',
    title: 'Halo Bio-Leather Trench',
    sku: 'ETO-HAL-03',
    description: 'Carbon-negative leather alternative finished with biodegradable coatings.',
    category: 'Outerwear',
    materials: ['Bio-based leather', 'Tencel™ lining'],
    msrp: '€515',
    impactRange: 'Low',
    verifiedClaims: ['VEGAN 100', 'Living-wage factory'],
    images: [hero],
    masterAssetId: '103451921',
    impact: sharedImpact,
    traceability: sharedTraceability,
    proofPoints: sharedProofPoints,
  },
  {
    productId: 'celeste-denim',
    title: 'Celeste Recycled Denim',
    sku: 'ETO-CEL-04',
    description: 'Recycled cotton denim with laser finishing and digital passport in every pair.',
    category: 'Denim',
    materials: ['Recycled cotton', 'Water-based dyes'],
    msrp: '€180',
    impactRange: 'Medium',
    verifiedClaims: ['GRS recycled', 'Water stewardship'],
    images: [hero],
    masterAssetId: '103452034',
    impact: sharedImpact,
    traceability: sharedTraceability,
    proofPoints: sharedProofPoints,
  },
]

export const lookupPresets: LookupPreset[] = [
  {
    product: products[0],
    passport: {
      assetId: '103451726',
      name: 'Aurora Overcoat Pass',
      unitName: 'ETO-AUR',
      image: hero,
      properties: {
        productId: 'aurora-overcoat',
        batch: 'FW24-A',
        size: 'M',
        color: 'Aurora',
        serial: '045/200',
      },
      reserve: 'RESERVEADDRESS123',
      creator: 'CREATORADDR456',
      explorerUrl: 'https://testnet.explorer.perawallet.app/asset/103451726',
      peraUrl: 'https://testnet.perawallet.app/assets/103451726',
      events: {
        creationTx: 'I4N7Y...PQ6',
        lastTransfer: '2024-04-11T13:24:00Z',
        currentHolder: 'TESTADDRESS123',
      },
    },
  },
]
