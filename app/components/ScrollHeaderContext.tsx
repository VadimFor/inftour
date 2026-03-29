"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ScrollHeaderContextValue = {
  topBarVisible: boolean;
};

const ScrollHeaderContext = createContext<ScrollHeaderContextValue>({
  topBarVisible: true,
});

export function useScrollHeader() {
  return useContext(ScrollHeaderContext);
}

const TOP_THRESHOLD_PX = 4;

export function ScrollHeaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [topBarVisible, setTopBarVisible] = useState(true);

  const update = useCallback(() => {
    setTopBarVisible(window.scrollY <= TOP_THRESHOLD_PX);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  return (
    <ScrollHeaderContext.Provider value={{ topBarVisible }}>
      {children}
    </ScrollHeaderContext.Provider>
  );
}
