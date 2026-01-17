"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);  
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
