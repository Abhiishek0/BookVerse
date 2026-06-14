import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  addDoc,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Safely probe if credentials are valid (not default placeholder strings)
export const isRealFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 5 && 
  firebaseConfig.projectId
);

let app;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isRealFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("🔥 Real Firebase initialized successfully inside BookVerse.");
  } catch (error) {
    console.error("Failed to initialize active Firebase components:", error);
  }
} else {
  console.log("ℹ️ Standard empty Firebase configuration template detected. Running dynamic LocalStorage Sandbox sync mode.");
}

// Ensure clean schemas for local state database when offline/mocked
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  currentStreakDays: number;
  dailyGoalMinutes: number;
}

// ---------------------------------------------------------------------------
// HYBRID SYNCHRONIZED STORAGE BRIDGE
// ---------------------------------------------------------------------------
export { auth, db, googleProvider };

export interface SyncData {
  cart: any[];
  wishlist: any[];
  progress: any[];
  reviews: Record<string, any[]>;
  profile: UserProfile | null;
}

const getLocalStore = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalStore = <T>(key: string, val: T) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// Simulated mock user profile if real auth is not configured
const defaultMockProfile: UserProfile = {
  uid: "scholar_lux",
  email: "scholar.fellow@bookverse.org",
  displayName: "Noble Scholar",
  photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  currentStreakDays: 7,
  dailyGoalMinutes: 45
};

// ---------------------------------------------------------------------------
// CONSTRAINED FIRESTORE ERROR HANDLING SYSTEM (Section 3 of Skill)
// ---------------------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on init (Requirement validation connection block)
async function testConnection() {
  if (isRealFirebaseConfigured && db) {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
}
testConnection();

export const hybridService = {
  // Sync wrapper that uses Firestore if active, else LocalStorage
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    if (isRealFirebaseConfigured && db && auth) {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `users/${uid}`);
      }
    }
    return getLocalStore<UserProfile | null>(`bv_profile_${uid}`, uid === "scholar_lux" ? defaultMockProfile : null);
  },

  saveUserProfile: async (uid: string, profile: UserProfile) => {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "users", uid), profile, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${uid}`);
      }
    }
    setLocalStore(`bv_profile_${uid}`, profile);
  },

  getCart: async (uid: string): Promise<any[]> => {
    if (isRealFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, "carts", uid));
        if (docSnap.exists()) {
          return docSnap.data().items || [];
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `carts/${uid}`);
      }
    }
    return getLocalStore<any[]>(`bv_cart_${uid}`, []);
  },

  saveCart: async (uid: string, items: any[]) => {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "carts", uid), { items, updatedAt: new Date().toISOString() });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `carts/${uid}`);
      }
    }
    setLocalStore(`bv_cart_${uid}`, items);
  },

  getWishlist: async (uid: string): Promise<any[]> => {
    if (isRealFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, "wishlists", uid));
        if (docSnap.exists()) {
          return docSnap.data().books || [];
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `wishlists/${uid}`);
      }
    }
    return getLocalStore<any[]>(`bv_wishlist_${uid}`, []);
  },

  saveWishlist: async (uid: string, books: any[]) => {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "wishlists", uid), { books, updatedAt: new Date().toISOString() });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `wishlists/${uid}`);
      }
    }
    setLocalStore(`bv_wishlist_${uid}`, books);
  },

  getProgress: async (uid: string): Promise<any[]> => {
    if (isRealFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, "progress", uid));
        if (docSnap.exists()) {
          return docSnap.data().history || [];
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `progress/${uid}`);
      }
    }
    return getLocalStore<any[]>(`bv_progress_${uid}`, []);
  },

  saveProgress: async (uid: string, history: any[]) => {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "progress", uid), { history, updatedAt: new Date().toISOString() });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `progress/${uid}`);
      }
    }
    setLocalStore(`bv_progress_${uid}`, history);
  },

  getBookReviews: async (bookId: string): Promise<any[]> => {
    if (isRealFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, "reviews", bookId));
        if (docSnap.exists()) {
          return docSnap.data().reviews || [];
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `reviews/${bookId}`);
      }
    }
    // Hardcoded default reviews schema matched by bookId
    const fallbackReviews = getLocalStore<any[]>(`bv_reviews_${bookId}`, [
      {
        id: "r1",
        userName: "Marc Aurel",
        rating: 5,
        comment: "This handbound edition feels exceptionally premium. The leather embossing matches the rigorous prose perfectly.",
        date: "2026-05-18"
      },
      {
        id: "r2",
        userName: "Clarissa Finch",
        rating: 4,
        comment: "Elegant typesetting. The footnotes are beautiful and clear. A total scholar addition.",
        date: "2026-06-02"
      }
    ]);
    return fallbackReviews;
  },

  saveBookReview: async (bookId: string, review: any) => {
    const reviews = await hybridService.getBookReviews(bookId);
    const updated = [review, ...reviews];
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "reviews", bookId), { reviews: updated }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `reviews/${bookId}`);
      }
    }
    setLocalStore(`bv_reviews_${bookId}`, updated);
    return updated;
  }
};
