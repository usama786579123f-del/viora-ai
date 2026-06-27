import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

const getTodayKey = () => new Date().toISOString().split("T")[0];

// Free plan credits per day
const FREE_DAILY_CREDITS = 5;

export function UserProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const saved = localStorage.getItem("vioraUser");
      if (saved) {
        const parsed = JSON.parse(saved);
        const todayKey = getTodayKey();

        // Daily reset — agar free user hai aur date change ho gayi
        if (parsed.plan === "free" && parsed.lastResetDate !== todayKey) {
          parsed.credits = FREE_DAILY_CREDITS;
          parsed.lastResetDate = todayKey;
          localStorage.setItem("vioraUser", JSON.stringify(parsed));
        }

        return parsed;
      }
    } catch (e) {
      console.error("UserContext load error:", e);
    }

    return {
      name: "",
      email: "",
      credits: FREE_DAILY_CREDITS,
      plan: "free",
      watermarkEnabled: false,
      loggedIn: false,
      lastResetDate: getTodayKey(),
    };
  });

  // Har 1 minute mein check karo — midnight pe auto reset
  useEffect(() => {
    const interval = setInterval(() => {
      const todayKey = getTodayKey();
      setUserState((prev) => {
        if (!prev.loggedIn) return prev;
        if (prev.plan === "free" && prev.lastResetDate !== todayKey) {
          const updated = {
            ...prev,
            credits: FREE_DAILY_CREDITS,
            lastResetDate: todayKey,
          };
          localStorage.setItem("vioraUser", JSON.stringify(updated));
          console.log("✅ Daily credits reset:", FREE_DAILY_CREDITS);
          return updated;
        }
        return prev;
      });
    }, 60000); // har 1 minute

    return () => clearInterval(interval);
  }, []);

  // setUser — localStorage bhi update karo
  const setUser = (updater) => {
    setUserState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("vioraUser", JSON.stringify(next));
      } catch (e) {
        console.error("UserContext save error:", e);
      }
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}