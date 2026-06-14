import { Book } from "../types";

export const mockBooks: Book[] = [
  {
    id: "chambers-of-secrets",
    title: "The Chambers of Secrets",
    author: "Kenara Legalen",
    description: "The Chambers of Secrets is a renowned high-fantasy novel that blends folklore, dark occult arts, and elegant world-building. Following the silent paths of ancient sorcerers, its complex lore unfolds in lyrical prose. A masterpiece of vintage fantasy detailing secrets of ancient civilizations and secret schools of wizardry.",
    price: 115.90,
    rating: 4.8,
    reviewsCount: 645,
    category: "Premium Books",
    genre: ["Fantasy", "Mystery", "Legends"],
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    originalReleaseDate: "November 3, 2020",
    pagesCount: 420,
    accentColor: "#274e37", // forest green
    featured: true,
    sampleText: "Chapter I: The Whispering Seals.\n\nBeneath the cold cobblestones of the southern gate, there lay a passage forgotten by three generations of kings. It was not mapped in the Royal Registry nor mentioned in the songs of the traveling bards. Yet, every year when the wind turned crimson with winter ash, a low hum vibrated through the floorboards of the cathedral above. To anyone else, it was simply the settling of old timber. To Julian, it was the sound of a seal cracking..."
  },
  {
    id: "the-fumber",
    title: "The Fumber",
    author: "Scowlen",
    description: "A psychological journey through memory landscapes. Scowlen's deep narrative probes our understanding of time, loss, and the silent spaces between human communication. Critics describe this as an exquisite and challenging read for those seeking literary elevation.",
    price: 39.00,
    rating: 4.5,
    reviewsCount: 189,
    category: "Classic Literature",
    genre: ["Fiction", "Cognitive", "Philosophy"],
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    originalReleaseDate: "June 14, 2018",
    pagesCount: 310,
    accentColor: "#8c6a5c", // soft brown
    sampleText: "Page 1: The Weight of an Echo.\n\nIf you listen closely to the static of an empty room, you do not hear silence. You hear the residual particles of every word ever spoken between these walls. For Helen, the house on Oakhaven Lane was a persistent conversation. Every dust mote drifting in the morning light was an syllable, suspended in the medium of regret. She sat by the open hearth, her cold fingers tracing the grain of the elder wood table..."
  },
  {
    id: "coailty-reit",
    title: "Coailty Reit",
    author: "Docoorst",
    description: "An intellectual exploration of socio-economic systems, Docoorst's groundbreaking thesis challenges contemporary structures with prose that reads like high poetry. Recommended for policy students and curious minds.",
    price: 59.95,
    rating: 4.7,
    reviewsCount: 311,
    category: "Socio-Economics",
    genre: ["Economics", "Structure", "Politics"],
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    originalReleaseDate: "March 22, 2021",
    pagesCount: 280,
    accentColor: "#1e3d59", // luxury dark blue
    sampleText: "Section I: The Core Exchange.\n\nMoney is not a material constraint, but a consensus of collective faith. In the early mercantile communities of the eastern gulf, trust was not written on vellum or logged in ledger books. It was spoken. When a merchant boarded a vessel with three thousand barrels of pitch, the price was pegged not to gold deposits, but to the reliability of his name. If his word faltered, the ships would simply refuse his cargo..."
  },
  {
    id: "fire-and-blood",
    title: "Fire & Blood",
    author: "George R.R. Martin",
    description: "300 Years before A Game of Thrones, dragons ruled Westeros. This historical masterpiece unveils the rise and fall of House Targaryen, filled with intrigue, battle, and ancient magic.",
    price: 79.00,
    rating: 4.9,
    reviewsCount: 1240,
    category: "Premium Books",
    genre: ["Fantasy", "History", "Warfare"],
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
    originalReleaseDate: "November 20, 2018",
    pagesCount: 738,
    accentColor: "#6b1414", // deep burgundy red
    sampleText: "Chapter II: The Aegon's Conquest.\n\nIt was the design of Aegon Targaryen to bind the seven warring realms into a single kingdom under the rule of the dragon. When he raised his standard on the three hills that would eventually bear his name, the lords of the mainland laughed. What could a boy with fewer than sixteen hundred men achieve against the iron host of Harren the Black or the massed chivalry of Highgarden? They forgot, of course, the fire..."
  },
  {
    id: "kinille-goife",
    title: "Kinille & Goife",
    author: "Puty",
    description: "An artistic layout of minimalist short stories. Each paragraph is a painting, capturing raw human vulnerabilities in moments of serene stillness.",
    price: 45.00,
    rating: 4.6,
    reviewsCount: 92,
    category: "AI Suggestions",
    genre: ["Modern", "Short Stories", "Minimalism"],
    coverUrl: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=600",
    originalReleaseDate: "April 1, 2023",
    pagesCount: 195,
    accentColor: "#dfa47e", // soft sand or amber
    sampleText: "Paragraph I: The Yellow Bowl.\n\nIt was placed precisely three inches from the edge of the sideboard. It held nothing but light. When the afternoon sun filtered through the lace curtains, the porcelain fired itself anew, glowing with a soft, pre-Copernican light. They spent forty years in that room, speaking only when the tea kettle sang. It was a perfect marriage of silences..."
  },
  {
    id: "the-slamon-road",
    title: "The Slamon Road",
    author: "Orchid An Lia Chili",
    description: "A visual odyssey tracking ancient migration routes and spiritual paths across the northern ridges. Beautifully illustrated with elegant, contemplative journal entries and geographic mappings.",
    price: 88.00,
    rating: 4.9,
    reviewsCount: 154,
    category: "AI Suggestions",
    genre: ["Travel", "Heritage", "Spirituality"],
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600",
    originalReleaseDate: "January 15, 2022",
    pagesCount: 350,
    accentColor: "#3e646b", // slate green-blue
    sampleText: "Route entry 4: The Stone Cairn.\n\nWe reached the high ridge before the mist settled. Below us, the valleys of the Silt River were submerged in a sea of pale gray wool. The guide pointed to an arrangement of flat slates piled three feet high. Each rock represented a traveler who had crossed this pass before the winter closed in. I took a gray pebble from the stream bed, warming it in my palm before placing it on the absolute peak..."
  }
];

export const mockFriendActivities = [
  {
    id: "act-1",
    name: "Francesca Cane",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    action: "finished reading",
    bookTitle: "The Chambers of Secrets",
    timeAgo: "2 hours ago"
  },
  {
    id: "act-2",
    name: "Robert Lang",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    action: "added to favorites",
    bookTitle: "Fire & Blood",
    timeAgo: "1 day ago"
  },
  {
    id: "act-3",
    name: "Aline Sommer",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    action: "is currently reading",
    bookTitle: "Coailty Reit",
    timeAgo: "4 hours ago"
  }
];

export const mockAchievements = [
  {
    id: "ach-1",
    title: "Enthusiastic Scholar",
    description: "Read 3 different genres in a single week",
    iconName: "BookOpen",
    unlockedAt: "June 10, 2026",
    progressMax: 3,
    progressCurrent: 3
  },
  {
    id: "ach-2",
    title: "Streak Master",
    description: "Maintain a 10-day reading steak",
    iconName: "Flame",
    progressMax: 10,
    progressCurrent: 7
  },
  {
    id: "ach-3",
    title: "Lore Hoarder",
    description: "Add 5 premium books to your luxury wishlist",
    iconName: "Heart",
    unlockedAt: "June 12, 2026",
    progressMax: 5,
    progressCurrent: 5
  },
  {
    id: "ach-4",
    title: "Luminous Reader",
    description: "Spend 300 minutes reading chapters on the platform",
    iconName: "Compass",
    progressMax: 300,
    progressCurrent: 215
  }
];

export const mockReadingProgress = [
  {
    bookId: "chambers-of-secrets",
    bookTitle: "The Chambers of Secrets",
    author: "Kenara Legalen",
    progressPercent: 68,
    totalPages: 420,
    currentPage: 285,
    lastRead: "Today at 07:15 AM"
  },
  {
    bookId: "coailty-reit",
    bookTitle: "Coailty Reit",
    author: "Docoorst",
    progressPercent: 32,
    totalPages: 280,
    currentPage: 90,
    lastRead: "Yesterday at 09:40 PM"
  }
];

export const mockGoals = {
  dailyTargetMinutes: 45,
  weeklyTargetBooks: 2,
  currentStreakDays: 7,
  yearlyTargetBooks: 24,
  completedThisYear: 11
};

export const mockSchedule = [
  { day: "Mon", minutesRead: 45, targetMinutes: 45 },
  { day: "Tue", minutesRead: 30, targetMinutes: 45 },
  { day: "Wed", minutesRead: 60, targetMinutes: 45 },
  { day: "Thu", minutesRead: 15, targetMinutes: 45 },
  { day: "Fri", minutesRead: 50, targetMinutes: 45 },
  { day: "Sat", minutesRead: 90, targetMinutes: 45 },
  { day: "Sun", minutesRead: 40, targetMinutes: 45 }
];
