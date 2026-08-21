export interface ProfessionSkill {
  name: string
  keywords: string[]
}

export interface Profession {
  name: string
  icon: string
  skills: ProfessionSkill[]
}

export const PROFESSIONS: Profession[] = [
  {
    name: "Electrical",
    icon: "⚡",
    skills: [
      {
        name: "Fan Repair",
        keywords: [
          "fan",
          "ceiling fan",
          "fan repair",
          "fan not working",
          "fan installation",
          "fan fitting",
        ],
      },
      {
        name: "House Wiring",
        keywords: [
          "wiring",
          "house wiring",
          "electrical wiring",
          "rewiring",
          "wire repair",
          "electrical connection",
        ],
      },
      {
        name: "Switch & Socket Repair",
        keywords: [
          "switch",
          "socket",
          "plug",
          "switch repair",
          "socket repair",
          "electrical switch",
        ],
      },
      {
        name: "Light Installation",
        keywords: [
          "light",
          "bulb",
          "light fitting",
          "light installation",
          "ceiling light",
          "lamp installation",
        ],
      },
      {
        name: "Circuit Repair",
        keywords: [
          "circuit",
          "short circuit",
          "circuit repair",
          "power issue",
          "electrical fault",
          "fuse",
        ],
      },
      {
        name: "Appliance Repair",
        keywords: [
          "electrical appliance",
          "appliance repair",
          "home appliance",
          "electrical repair",
          "appliance not working",
          "electrical equipment",
        ],
      },
    ],
  },

  {
    name: "Plumbing",
    icon: "🔧",
    skills: [
      {
        name: "Leak Repair",
        keywords: [
          "leak",
          "water leak",
          "pipe leak",
          "leaking tap",
          "leaking pipe",
          "water leakage",
        ],
      },
      {
        name: "Pipe Fitting",
        keywords: [
          "pipe",
          "pipe fitting",
          "pipe installation",
          "water pipe",
          "pipe replacement",
          "plumbing pipe",
        ],
      },
      {
        name: "Tap Repair",
        keywords: [
          "tap",
          "faucet",
          "tap repair",
          "tap replacement",
          "broken tap",
          "water tap",
        ],
      },
      {
        name: "Drain Cleaning",
        keywords: [
          "drain",
          "blocked drain",
          "drain cleaning",
          "clogged drain",
          "drain blockage",
          "waste pipe",
        ],
      },
      {
        name: "Bathroom Plumbing",
        keywords: [
          "bathroom",
          "toilet",
          "shower",
          "bathroom plumbing",
          "wash basin",
          "bathroom pipe",
        ],
      },
      {
        name: "Water Tank Repair",
        keywords: [
          "water tank",
          "tank repair",
          "tank leakage",
          "overhead tank",
          "water storage",
          "tank installation",
        ],
      },
    ],
  },

  {
    name: "Construction",
    icon: "🧱",
    skills: [
      {
        name: "Masonry",
        keywords: [
          "masonry",
          "brick masonry",
          "cement work",
          "wall construction",
          "mason",
          "concrete work",
        ],
      },
      {
        name: "Brickwork",
        keywords: [
          "brick",
          "brickwork",
          "brick wall",
          "brick laying",
          "wall repair",
          "brick construction",
        ],
      },
      {
        name: "Tiling",
        keywords: [
          "tiles",
          "tiling",
          "floor tiles",
          "wall tiles",
          "tile installation",
          "tile repair",
        ],
      },
      {
        name: "Painting",
        keywords: [
          "painting",
          "house painting",
          "wall painting",
          "paint",
          "interior painting",
          "exterior painting",
        ],
      },
      {
        name: "Flooring",
        keywords: [
          "flooring",
          "floor installation",
          "floor repair",
          "marble",
          "floor tiles",
          "floor work",
        ],
      },
      {
        name: "Carpentry",
        keywords: [
          "carpentry",
          "carpenter",
          "woodwork",
          "wood repair",
          "furniture repair",
          "wood installation",
        ],
      },
    ],
  },

  {
    name: "Tailoring",
    icon: "🧵",
    skills: [
      {
        name: "Clothing Alterations",
        keywords: [
          "alteration",
          "clothes alteration",
          "dress alteration",
          "size adjustment",
          "clothing repair",
          "fitting",
        ],
      },
      {
        name: "Stitching",
        keywords: [
          "stitching",
          "stitch",
          "sewing",
          "clothes stitching",
          "sewing clothes",
          "garment stitching",
        ],
      },
      {
        name: "Blouse Making",
        keywords: [
          "blouse",
          "blouse stitching",
          "blouse making",
          "saree blouse",
          "women blouse",
          "blouse design",
        ],
      },
      {
        name: "Dress Making",
        keywords: [
          "dress",
          "dress making",
          "dress stitching",
          "custom dress",
          "clothing design",
          "garment making",
        ],
      },
      {
        name: "Trouser Repair",
        keywords: [
          "trouser",
          "pants",
          "pant alteration",
          "pant repair",
          "trouser stitching",
          "jeans alteration",
        ],
      },
      {
        name: "Custom Clothing",
        keywords: [
          "custom clothes",
          "custom clothing",
          "made to measure",
          "custom stitching",
          "personalized clothing",
          "tailored clothes",
        ],
      },
    ],
  },

  {
    name: "Farming",
    icon: "🌾",
    skills: [
      {
        name: "Crop Cultivation",
        keywords: [
          "farming",
          "crop farming",
          "crop cultivation",
          "cultivation",
          "field work",
          "agriculture",
        ],
      },
      {
        name: "Sowing",
        keywords: [
          "sowing",
          "seed planting",
          "planting",
          "seed sowing",
          "crop planting",
          "farm planting",
        ],
      },
      {
        name: "Harvesting",
        keywords: [
          "harvesting",
          "crop harvest",
          "harvest",
          "cutting crops",
          "farm harvest",
          "crop cutting",
        ],
      },
      {
        name: "Irrigation",
        keywords: [
          "irrigation",
          "watering crops",
          "farm watering",
          "water management",
          "irrigation system",
          "field irrigation",
        ],
      },
      {
        name: "Pest Management",
        keywords: [
          "pest",
          "pest control",
          "crop pests",
          "insect control",
          "plant disease",
          "crop protection",
        ],
      },
      {
        name: "Livestock Care",
        keywords: [
          "livestock",
          "cattle",
          "cow care",
          "animal care",
          "farm animals",
          "livestock farming",
        ],
      },
    ],
  },

  {
    name: "Cooking",
    icon: "🍳",
    skills: [
      {
        name: "Home Cooking",
        keywords: [
          "home cooking",
          "home cook",
          "daily cooking",
          "household cooking",
          "cook at home",
          "meal cooking",
        ],
      },
      {
        name: "Indian Cuisine",
        keywords: [
          "indian food",
          "indian cooking",
          "north indian",
          "south indian",
          "traditional food",
          "indian dishes",
        ],
      },
      {
        name: "Baking",
        keywords: [
          "baking",
          "cake",
          "bread",
          "pastry",
          "cookies",
          "bakery",
        ],
      },
      {
        name: "Catering",
        keywords: [
          "catering",
          "caterer",
          "event food",
          "party food",
          "function catering",
          "bulk cooking",
        ],
      },
      {
        name: "Meal Preparation",
        keywords: [
          "meal preparation",
          "meal prep",
          "food preparation",
          "daily meals",
          "prepare food",
          "meal service",
        ],
      },
      {
        name: "Tiffin Preparation",
        keywords: [
          "tiffin",
          "tiffin service",
          "lunch box",
          "home tiffin",
          "meal delivery",
          "daily tiffin",
        ],
      },
    ],
  },

  {
    name: "Driving",
    icon: "🚗",
    skills: [
      {
        name: "Local Driving",
        keywords: [
          "local driver",
          "city driving",
          "personal driver",
          "local travel",
          "driver",
          "city driver",
        ],
      },
      {
        name: "Auto / Taxi Driving",
        keywords: [
          "auto driver",
          "taxi driver",
          "cab driver",
          "rickshaw",
          "auto",
          "taxi",
        ],
      },
      {
        name: "Delivery Driving",
        keywords: [
          "delivery driver",
          "delivery",
          "parcel delivery",
          "food delivery",
          "package delivery",
          "delivery person",
        ],
      },
      {
        name: "Goods Transport",
        keywords: [
          "goods transport",
          "goods delivery",
          "truck driver",
          "transport driver",
          "cargo",
          "load transport",
        ],
      },
      {
        name: "School Transport",
        keywords: [
          "school driver",
          "school transport",
          "school van",
          "student transport",
          "school pickup",
          "school drop",
        ],
      },
      {
        name: "Long Distance Driving",
        keywords: [
          "long distance driver",
          "outstation driver",
          "highway driving",
          "intercity driving",
          "outstation travel",
          "tour driver",
        ],
      },
    ],
  },

  {
    name: "Healthcare",
    icon: "🩺",
    skills: [
      {
        name: "Elderly Care",
        keywords: [
          "elder care",
          "elderly care",
          "old age care",
          "senior care",
          "elderly assistance",
          "senior citizen care",
        ],
      },
      {
        name: "Patient Assistance",
        keywords: [
          "patient care",
          "patient assistance",
          "hospital attendant",
          "patient attendant",
          "hospital care",
          "patient support",
        ],
      },
      {
        name: "Home Nursing",
        keywords: [
          "home nurse",
          "home nursing",
          "nursing care",
          "nurse at home",
          "home healthcare",
          "nursing assistance",
        ],
      },
      {
        name: "First Aid",
        keywords: [
          "first aid",
          "basic first aid",
          "wound care",
          "emergency first aid",
          "injury care",
          "basic medical assistance",
        ],
      },
      {
        name: "Medicine Assistance",
        keywords: [
          "medicine",
          "medicine assistance",
          "medication reminder",
          "medicine support",
          "prescription assistance",
          "medication help",
        ],
      },
      {
        name: "Child Care",
        keywords: [
          "child care",
          "babysitting",
          "baby care",
          "child assistance",
          "infant care",
          "children care",
        ],
      },
    ],
  },
]

export function getProfession(name: string) {
  return PROFESSIONS.find((profession) => profession.name === name)
}

export function getProfessionSkills(name: string): ProfessionSkill[] {
  return getProfession(name)?.skills ?? []
}

export function getSkillKeywords(
  professionName: string,
  skillNames: string[],
): string[] {
  const profession = getProfession(professionName)

  if (!profession) {
    return []
  }

  return profession.skills
    .filter((skill) => skillNames.includes(skill.name))
    .flatMap((skill) => skill.keywords)
}