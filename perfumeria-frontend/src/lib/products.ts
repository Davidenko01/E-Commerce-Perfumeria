export interface Product {
  id: number
  name: string
  category: "Eau de Parfum" | "Parfum" | "Eau de Toilette"
  brand: "Maison Noir" | "Lumière" | "Ombre" | "Atelier"
  fragranceType: "Floral" | "Woody" | "Oriental" | "Fresh" | "Citrus"
  scentProfile: "Sweet" | "Spicy" | "Earthy" | "Aquatic" | "Powdery" | "Smoky"
  description: string
  fullDescription: string
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  price: number
  originalPrice?: number // For sale items
  size: string
  images: string[] // Multiple images for gallery
  featured: boolean
  inStock: boolean
}

// Promo codes configuration
export interface PromoCode {
  code: string
  type: "percentage" | "fixed" | "product"
  value: number
  productIds?: number[] // For product-specific discounts
  minPurchase?: number
  description: string
}

export const promoCodes: PromoCode[] = [
  { code: "WELCOME15", type: "percentage", value: 15, description: "15% off your order" },
  { code: "SAVE50", type: "fixed", value: 50, minPurchase: 200, description: "$50 off orders over $200" },
  { code: "LUXE20", type: "percentage", value: 20, productIds: [4, 7, 12, 16], description: "20% off Parfum collection" },
  { code: "FREESHIP", type: "fixed", value: 15, description: "Free shipping" },
]

export const products: Product[] = [
  {
    id: 1,
    name: "Velvet Noir",
    category: "Eau de Parfum",
    brand: "Maison Noir",
    fragranceType: "Oriental",
    scentProfile: "Sweet",
    description: "A deep, sensual blend of black orchid, dark vanilla, and warm amber.",
    fullDescription: "Velvet Noir is an ode to the mysterious hours between dusk and dawn. This captivating fragrance opens with the intoxicating allure of black orchid, unfolding into a heart of dark vanilla that whispers secrets of distant lands. The warm embrace of amber in the base creates an unforgettable trail that lingers like a beautiful memory.",
    notes: {
      top: ["Black Orchid", "Bergamot", "Pink Pepper"],
      heart: ["Dark Vanilla", "Jasmine", "Rose Absolute"],
      base: ["Warm Amber", "Sandalwood", "Musk"]
    },
    price: 195,
    originalPrice: 245,
    size: "100ml",
    images: ["/images/perfume-1.jpg", "/images/perfume-2.jpg", "/images/perfume-3.jpg"],
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: "Ambre Sauvage",
    category: "Eau de Parfum",
    brand: "Maison Noir",
    fragranceType: "Woody",
    scentProfile: "Smoky",
    description: "Wild amber intertwined with smoky oud and precious woods.",
    fullDescription: "Ambre Sauvage captures the untamed spirit of ancient forests where precious resins have cured for centuries. The wild amber heart is enriched by smoky oud, creating a primal yet sophisticated signature. Precious woods in the dry down evoke fireside contemplation under starlit skies.",
    notes: {
      top: ["Saffron", "Cinnamon", "Cardamom"],
      heart: ["Wild Amber", "Smoky Oud", "Leather"],
      base: ["Cedarwood", "Vetiver", "Benzoin"]
    },
    price: 295,
    size: "100ml",
    images: ["/images/perfume-2.jpg", "/images/perfume-4.jpg", "/images/perfume-1.jpg"],
    featured: true,
    inStock: true
  },
  {
    id: 3,
    name: "Rose Éternelle",
    category: "Eau de Parfum",
    brand: "Lumière",
    fragranceType: "Floral",
    scentProfile: "Powdery",
    description: "Bulgarian rose enveloped in soft musk and delicate petals.",
    fullDescription: "Rose Éternelle is a tribute to the queen of flowers, capturing the first light of dawn in a Bulgarian rose garden. Each drop contains the essence of thousands of hand-picked petals, wrapped in soft musk that extends the rose's natural beauty into an eternal bloom.",
    notes: {
      top: ["Bulgarian Rose", "Lychee", "Peony"],
      heart: ["May Rose", "Magnolia", "Iris"],
      base: ["White Musk", "Cashmere Wood", "Ambrette"]
    },
    price: 199,
    originalPrice: 265,
    size: "100ml",
    images: ["/images/perfume-3.jpg", "/images/perfume-5.jpg", "/images/perfume-6.jpg"],
    featured: true,
    inStock: true
  },
  {
    id: 4,
    name: "Ombre Intense",
    category: "Parfum",
    brand: "Ombre",
    fragranceType: "Oriental",
    scentProfile: "Spicy",
    description: "An intense fusion of leather, saffron, and mysterious incense.",
    fullDescription: "Ombre Intense is for those who dare to stand in their own power. The opening burst of saffron gives way to supple leather, while mysterious incense creates an aura of ancient wisdom. This is a fragrance that commands attention and leaves an indelible impression.",
    notes: {
      top: ["Saffron", "Black Pepper", "Ginger"],
      heart: ["Italian Leather", "Incense", "Tobacco"],
      base: ["Oud", "Patchouli", "Dark Amber"]
    },
    price: 345,
    size: "75ml",
    images: ["/images/perfume-4.jpg", "/images/perfume-2.jpg", "/images/perfume-1.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 5,
    name: "Cristal Lumière",
    category: "Eau de Parfum",
    brand: "Lumière",
    fragranceType: "Fresh",
    scentProfile: "Aquatic",
    description: "Sparkling bergamot meets white tea and luminous cedar.",
    fullDescription: "Cristal Lumière captures the essence of morning light filtering through crystal. Sparkling bergamot dances with the meditative calm of white tea, while luminous cedar provides a grounded elegance. A fragrance for those who embrace each day with clarity and purpose.",
    notes: {
      top: ["Bergamot", "Grapefruit", "Green Apple"],
      heart: ["White Tea", "Lily of the Valley", "Violet Leaf"],
      base: ["Cedar", "White Musk", "Blonde Woods"]
    },
    price: 169,
    originalPrice: 225,
    size: "100ml",
    images: ["/images/perfume-5.jpg", "/images/perfume-3.jpg", "/images/perfume-6.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 6,
    name: "Jardin Secret",
    category: "Eau de Parfum",
    brand: "Lumière",
    fragranceType: "Floral",
    scentProfile: "Sweet",
    description: "A lush garden of jasmine, tuberose, and green fig leaves.",
    fullDescription: "Jardin Secret transports you to a hidden garden at twilight, where jasmine and tuberose release their most intoxicating scent. Green fig leaves add a touch of verdant mystery, creating a fragrance that feels both intimate and infinite.",
    notes: {
      top: ["Green Fig", "Blackcurrant", "Pink Pepper"],
      heart: ["Jasmine Sambac", "Tuberose", "Orange Blossom"],
      base: ["Sandalwood", "Vanilla", "Musks"]
    },
    price: 275,
    size: "100ml",
    images: ["/images/perfume-6.jpg", "/images/perfume-3.jpg", "/images/perfume-5.jpg"],
    featured: true,
    inStock: true
  },
  {
    id: 7,
    name: "Nuit Absolue",
    category: "Parfum",
    brand: "Maison Noir",
    fragranceType: "Oriental",
    scentProfile: "Smoky",
    description: "The essence of midnight distilled into pure olfactory luxury.",
    fullDescription: "Nuit Absolue is the culmination of perfumery art, capturing the essence of midnight in its purest form. Rich oud blends with precious resins and rare flowers that bloom only under moonlight. This is a fragrance for connoisseurs who appreciate the extraordinary.",
    notes: {
      top: ["Night Blooming Jasmine", "Elemi", "Nutmeg"],
      heart: ["Oud Assam", "Bulgarian Rose", "Labdanum"],
      base: ["Benzoin", "Vanilla Absolute", "Ambergris"]
    },
    price: 340,
    originalPrice: 425,
    size: "75ml",
    images: ["/images/perfume-1.jpg", "/images/perfume-4.jpg", "/images/perfume-2.jpg"],
    featured: false,
    inStock: false
  },
  {
    id: 8,
    name: "Soleil d'Or",
    category: "Eau de Toilette",
    brand: "Lumière",
    fragranceType: "Citrus",
    scentProfile: "Sweet",
    description: "Mediterranean sunshine captured in a bottle of liquid gold.",
    fullDescription: "Soleil d'Or bottles the golden warmth of Mediterranean summers. Sicilian citrus bursts with joy, while neroli and petit grain create a sophisticated heart. The dry down of white cedar and musk is like the gentle warmth of sunset on sun-kissed skin.",
    notes: {
      top: ["Sicilian Lemon", "Mandarin", "Bergamot"],
      heart: ["Neroli", "Petit Grain", "Orange Blossom"],
      base: ["White Cedar", "Musk", "Honey"]
    },
    price: 185,
    size: "100ml",
    images: ["/images/perfume-5.jpg", "/images/perfume-6.jpg", "/images/perfume-3.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 9,
    name: "Bois Mystique",
    category: "Eau de Parfum",
    brand: "Ombre",
    fragranceType: "Woody",
    scentProfile: "Earthy",
    description: "Ancient sandalwood and mystical vetiver in perfect harmony.",
    fullDescription: "Bois Mystique draws from the sacred groves where sandalwood trees have grown for centuries. The earthy depth of vetiver grounds this mystical composition, while hints of incense add spiritual dimension. A fragrance for deep contemplation and inner peace.",
    notes: {
      top: ["Cardamom", "Bergamot", "Incense"],
      heart: ["Sandalwood", "Mysore Wood", "Iris"],
      base: ["Vetiver", "Amber", "Musk"]
    },
    price: 249,
    originalPrice: 310,
    size: "100ml",
    images: ["/images/perfume-2.jpg", "/images/perfume-4.jpg", "/images/perfume-1.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 10,
    name: "Fleur de Minuit",
    category: "Eau de Parfum",
    brand: "Atelier",
    fragranceType: "Floral",
    scentProfile: "Spicy",
    description: "Night-blooming flowers kissed by moonlight and mystery.",
    fullDescription: "Fleur de Minuit captures the enchanting moment when night-blooming flowers release their most intoxicating fragrance under the silver moon. A whisper of spice adds intrigue to this romantic nocturnal garden composition.",
    notes: {
      top: ["Night Jasmine", "Pink Pepper", "Bergamot"],
      heart: ["Tuberose", "Ylang Ylang", "Gardenia"],
      base: ["Musk", "Sandalwood", "Vanilla"]
    },
    price: 280,
    size: "100ml",
    images: ["/images/perfume-3.jpg", "/images/perfume-6.jpg", "/images/perfume-5.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 11,
    name: "Ocean Breeze",
    category: "Eau de Toilette",
    brand: "Atelier",
    fragranceType: "Fresh",
    scentProfile: "Aquatic",
    description: "The essence of sea air and coastal tranquility.",
    fullDescription: "Ocean Breeze captures the serene moments of standing on a coastal cliff, where the pure sea air mingles with aromatic herbs. This refreshing composition evokes endless summer days and the peaceful rhythm of waves.",
    notes: {
      top: ["Sea Salt", "Grapefruit", "Mint"],
      heart: ["Marine Accord", "Lavender", "Rosemary"],
      base: ["Driftwood", "White Musk", "Ambergris"]
    },
    price: 129,
    originalPrice: 165,
    size: "100ml",
    images: ["/images/perfume-5.jpg", "/images/perfume-3.jpg", "/images/perfume-6.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 12,
    name: "Épice Royale",
    category: "Parfum",
    brand: "Maison Noir",
    fragranceType: "Oriental",
    scentProfile: "Spicy",
    description: "A royal blend of rare spices from the ancient silk road.",
    fullDescription: "Épice Royale is a journey through the legendary spice markets of the ancient world. Precious cinnamon, saffron, and cardamom create an opulent tapestry, while rich amber and oud provide a regal foundation befitting royalty.",
    notes: {
      top: ["Saffron", "Cardamom", "Pink Pepper"],
      heart: ["Cinnamon", "Clove", "Rose"],
      base: ["Oud", "Amber", "Sandalwood"]
    },
    price: 395,
    size: "75ml",
    images: ["/images/perfume-4.jpg", "/images/perfume-2.jpg", "/images/perfume-1.jpg"],
    featured: false,
    inStock: false
  },
  {
    id: 13,
    name: "Terre Sacrée",
    category: "Eau de Parfum",
    brand: "Ombre",
    fragranceType: "Woody",
    scentProfile: "Earthy",
    description: "The primal scent of sacred earth after rain.",
    fullDescription: "Terre Sacrée captures the intoxicating moment when rain meets sun-warmed earth. This grounding composition combines the rich scent of vetiver with earthy patchouli, creating a connection to nature's most sacred moments.",
    notes: {
      top: ["Galbanum", "Violet Leaf", "Bergamot"],
      heart: ["Vetiver", "Geranium", "Orris"],
      base: ["Patchouli", "Oakmoss", "Cedar"]
    },
    price: 255,
    size: "100ml",
    images: ["/images/perfume-2.jpg", "/images/perfume-4.jpg", "/images/perfume-1.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 14,
    name: "Agrumes Sublime",
    category: "Eau de Toilette",
    brand: "Lumière",
    fragranceType: "Citrus",
    scentProfile: "Sweet",
    description: "Sun-ripened citrus fruits in a sparkling symphony.",
    fullDescription: "Agrumes Sublime is a celebration of the Mediterranean citrus harvest. Sun-ripened oranges, lemons, and grapefruits dance together in joyful harmony, sweetened by a touch of honey and warmed by gentle musks.",
    notes: {
      top: ["Blood Orange", "Lemon", "Grapefruit"],
      heart: ["Neroli", "Petitgrain", "Honey"],
      base: ["White Musk", "Cedar", "Amber"]
    },
    price: 139,
    originalPrice: 175,
    size: "100ml",
    images: ["/images/perfume-5.jpg", "/images/perfume-6.jpg", "/images/perfume-3.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 15,
    name: "Poudre d'Iris",
    category: "Eau de Parfum",
    brand: "Atelier",
    fragranceType: "Floral",
    scentProfile: "Powdery",
    description: "Delicate iris wrapped in clouds of soft powder.",
    fullDescription: "Poudre d'Iris is a whisper of elegance, featuring the precious iris root at its heart. Soft, powdery notes create an aura of refined sophistication, while subtle violet adds a touch of romance to this timeless composition.",
    notes: {
      top: ["Violet", "Pink Pepper", "Aldehydes"],
      heart: ["Iris Pallida", "Orris Butter", "Rose"],
      base: ["White Musk", "Heliotrope", "Sandalwood"]
    },
    price: 320,
    size: "100ml",
    images: ["/images/perfume-3.jpg", "/images/perfume-5.jpg", "/images/perfume-6.jpg"],
    featured: false,
    inStock: true
  },
  {
    id: 16,
    name: "Fumée Noble",
    category: "Parfum",
    brand: "Ombre",
    fragranceType: "Oriental",
    scentProfile: "Smoky",
    description: "Noble smoke rising from ancient ritual fires.",
    fullDescription: "Fumée Noble evokes the sacred smoke of ceremonial incense burning in ancient temples. Rare woods smolder alongside precious resins, creating an atmosphere of mystical reverence and profound contemplation.",
    notes: {
      top: ["Incense", "Cardamom", "Saffron"],
      heart: ["Labdanum", "Cade", "Oud"],
      base: ["Benzoin", "Guaiac Wood", "Amber"]
    },
    price: 365,
    size: "75ml",
    images: ["/images/perfume-4.jpg", "/images/perfume-2.jpg", "/images/perfume-1.jpg"],
    featured: false,
    inStock: true
  }
]

export const fragranceTypes = ["Floral", "Woody", "Oriental", "Fresh", "Citrus"] as const
export const brands = ["Maison Noir", "Lumière", "Ombre", "Atelier"] as const
export const categories = ["Eau de Parfum", "Parfum", "Eau de Toilette"] as const
export const scentProfiles = ["Sweet", "Spicy", "Earthy", "Aquatic", "Powdery", "Smoky"] as const

// Price range constants for the slider
export const MIN_PRICE = 100
export const MAX_PRICE = 500

// Helper function to check if product is on sale
export const isOnSale = (product: Product): boolean => {
  return product.originalPrice !== undefined && product.originalPrice > product.price
}

// Helper function to get discount percentage
export const getDiscountPercentage = (product: Product): number => {
  if (!product.originalPrice) return 0
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}
