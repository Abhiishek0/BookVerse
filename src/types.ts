/**
 * BookVerse TypeScript Types definition
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
  genre: string[];
  coverUrl: string;
  originalReleaseDate: string;
  pagesCount: number;
  accentColor: string;
  featured?: boolean;
  sampleText?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface WishlistItem {
  book: Book;
  savedAt: string;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatarUrl: string;
  action: string;
  bookTitle: string;
  timeAgo: string;
}

export interface ReadingProgress {
  bookId: string;
  bookTitle: string;
  author: string;
  progressPercent: number;
  totalPages: number;
  currentPage: number;
  lastRead: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  progressMax: number;
  progressCurrent: number;
}

export interface ReadingGoal {
  dailyTargetMinutes: number;
  weeklyTargetBooks: number;
  currentStreakDays: number;
  yearlyTargetBooks: number;
  completedThisYear: number;
}

export interface BookingSchedule {
  day: string; // e.g. "Mon", "Tue"
  minutesRead: number;
  targetMinutes: number;
}
