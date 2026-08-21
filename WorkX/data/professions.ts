export const professions = [
    {
        id: "tailor",
        icon: "🧵",
    },
    {
        id: "farmer",
        icon: "🌾",
    },
    {
        id: "construction_worker",
        icon: "🧱",
    },
    {
        id: "cook",
        icon: "🍳",
    },
    {
        id: "driver",
        icon: "🚗",
    },
    {
        id: "electrician",
        icon: "⚡",
    },
    {
        id: "plumber",
        icon: "🔧",
    },
    {
        id: "healthcare_worker",
        icon: "🩺",
    },
    {
        id: "carpenter",
        icon: "🪚",
    },
    {
        id: "welder",
        icon: "🔥",
    },
    {
        id: "mechanic",
        icon: "🔩",
    },
    {
        id: "delivery_worker",
        icon: "📦",
    },
    {
        id: "security_guard",
        icon: "🛡️",
    },
    {
        id: "housekeeper",
        icon: "🧹",
    },
    {
        id: "beauty_worker",
        icon: "💇",
    },
    {
        id: "mason",
        icon: "🏗️",
    },
    {
        id: "painter",
        icon: "🎨",
    },
    {
        id: "retail_worker",
        icon: "🛍️",
    },
    {
        id: "factory_worker",
        icon: "🏭",
    },
    {
        id: "gardener",
        icon: "🌱",
    },
    {
        id: "photographer",
        icon: "📷",
    }
] as const;

export type ProfessionId =
    (typeof professions)[number]["id"];