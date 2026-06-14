import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  googleProvider, 
  isRealFirebaseConfigured,
  hybridService
} from "../lib/firebaseHelper";
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { Book, ReadingProgress, CartItem, ReadingGoal } from "../types";
import { mockGoals } from "../data/mockBooks";

interface AuthContextType {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isMock?: boolean;
  } | null;
  loading: boolean;
  isRealFirebase: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // High-impact missing state persisters synced through hybrid database
  recentViews: string[];
  addToRecentViews: (bookId: string) => void;
  
  streak: number;
  incrementStreak: () => void;
  
  goals: ReadingGoal;
  updateGoals: (newGoals: Partial<ReadingGoal>) => void;
  
  reviews: Record<string, any[]>;
  loadReviews: (bookId: string) => Promise<any[]>;
  submitReview: (bookId: string, userName: string, rating: number, comment: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentViews, setRecentViews] = useState<string[]>(() => {
    const saved = localStorage.getItem("bv_recent_views");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("bv_streak");
    return saved ? parseInt(saved, 10) : mockGoals.currentStreakDays;
  });

  const [goals, setGoals] = useState<ReadingGoal>(() => {
    const saved = localStorage.getItem("bv_goals");
    return saved ? JSON.parse(saved) : mockGoals;
  });

  const [reviews, setReviews] = useState<Record<string, any[]>>({});

  // Auth observer
  useEffect(() => {
    if (isRealFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.displayName || "User"}`
          };
          setUser(profile);
          
          // Fetch remote synced profile details (streak, goals)
          const remoteProfile = await hybridService.getUserProfile(firebaseUser.uid);
          if (remoteProfile) {
            setStreak(remoteProfile.currentStreakDays);
            setGoals(prev => ({
              ...prev,
              currentStreakDays: remoteProfile.currentStreakDays,
              dailyTargetMinutes: remoteProfile.dailyGoalMinutes
            }));
          } else {
            // First time login - save initial setup
            await hybridService.saveUserProfile(firebaseUser.uid, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: profile.photoURL,
              currentStreakDays: streak,
              dailyGoalMinutes: goals.dailyTargetMinutes
            });
          }
        } else {
          // Check local mock user if previously set
          const savedMock = localStorage.getItem("bv_mock_user");
          if (savedMock) {
            setUser(JSON.parse(savedMock));
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local mode auth recovery
      const savedMock = localStorage.getItem("bv_mock_user");
      if (savedMock) {
        setUser(JSON.parse(savedMock));
      } else {
        // Default mock user is automatically logged in for quick showcase
        const userPayload = {
          uid: "scholar_lux",
          email: "scholar.fellow@bookverse.org",
          displayName: "Noble Scholar",
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          isMock: true
        };
        setUser(userPayload);
        localStorage.setItem("bv_mock_user", JSON.stringify(userPayload));
      }
      setLoading(false);
    }
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("bv_recent_views", JSON.stringify(recentViews));
  }, [recentViews]);

  useEffect(() => {
    localStorage.setItem("bv_streak", streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("bv_goals", JSON.stringify(goals));
  }, [goals]);

  // Google Sign In trigger
  const loginWithGoogle = async () => {
    if (isRealFirebaseConfigured && auth && googleProvider) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error("Popup Authenticaton failed:", error);
      }
    } else {
      // Elegant visual representation of credentials login
      const randomNames = ["Lady Guinevere", "Sir Galahad", "Aurelius", "Sophia Thorne"];
      const randomSelected = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomSeed = Math.random().toString(36).substring(7);
      const mockUser = {
        uid: `scholar_${randomSeed}`,
        email: `${randomSelected.toLowerCase().replace(/ /g, ".")}@bookverse.org`,
        displayName: randomSelected,
        photoURL: `https://api.dicebear.com/7.x/micah/svg?seed=${randomSelected}`,
        isMock: true
      };
      
      setUser(mockUser);
      localStorage.setItem("bv_mock_user", JSON.stringify(mockUser));
      console.log("💎 Logged into sandboxed LocalStorage BookVerse profile.");
    }
  };

  const logout = async () => {
    if (isRealFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Signout error:", e);
      }
    }
    setUser(null);
    localStorage.removeItem("bv_mock_user");
    // Clear credentials
    console.log("🚪 Logged out of BookVerse.");
  };

  const addToRecentViews = (bookId: string) => {
    setRecentViews((prev) => {
      const filtered = prev.filter((id) => id !== bookId);
      return [bookId, ...filtered].slice(0, 4); // Keep last 4 viewed books
    });
  };

  const incrementStreak = () => {
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setGoals(prev => ({
      ...prev,
      currentStreakDays: nextStreak
    }));
    
    // Save to user profiles online
    if (user && !user.isMock) {
      hybridService.saveUserProfile(user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        currentStreakDays: nextStreak,
        dailyGoalMinutes: goals.dailyTargetMinutes
      });
    }
  };

  const updateGoals = (newGoals: Partial<ReadingGoal>) => {
    setGoals((prev) => {
      const updated = { ...prev, ...newGoals };
      if (user && !user.isMock) {
        hybridService.saveUserProfile(user.uid, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          currentStreakDays: streak,
          dailyGoalMinutes: updated.dailyTargetMinutes
        });
      }
      return updated;
    });
  };

  const loadReviews = async (bookId: string) => {
    const remoteReviews = await hybridService.getBookReviews(bookId);
    setReviews((prev) => ({
      ...prev,
      [bookId]: remoteReviews
    }));
    return remoteReviews;
  };

  const submitReview = async (bookId: string, userName: string, rating: number, comment: string) => {
    const nextReview = {
      id: `rev-${Date.now()}`,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0]
    };
    
    const updatedReviewsList = await hybridService.saveBookReview(bookId, nextReview);
    setReviews((prev) => ({
      ...prev,
      [bookId]: updatedReviewsList
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isRealFirebase: isRealFirebaseConfigured,
        loginWithGoogle,
        logout,
        recentViews,
        addToRecentViews,
        streak,
        incrementStreak,
        goals,
        updateGoals,
        reviews,
        loadReviews,
        submitReview
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
