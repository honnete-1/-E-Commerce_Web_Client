import { useState, useEffect } from "react";

/**
 * A custom hook to manage Dark Mode in our application.
 * It checks if the user has a saved preference, or uses their system preference.
 * 
 * Think of a "hook" in React as a reusable function that can remember things (state).
 */
export function useTheme() {
  // 1. We create a piece of state called 'isDark'. 
  // We initialize it by checking if they already saved "dark" in their browser storage,
  // or if their computer itself is set to dark mode.
  const [isDark, setIsDark] = useState(() => {
    // Check browser storage (localStorage)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    
    // If nothing is saved, check the computer's system preference
    // window.matchMedia is a browser feature that checks CSS media queries
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 2. We use 'useEffect' to run some code every time 'isDark' changes.
  // This is where we actually tell Tailwind CSS and the browser to switch colors.
  useEffect(() => {
    // We grab the main HTML tag of our website
    const root = window.document.documentElement;

    if (isDark) {
      // If it's dark, we add the "dark" class. Tailwind will see this and use 'dark:' colors!
      root.classList.add("dark");
      // We also save their choice so they don't have to click it again next time
      localStorage.setItem("theme", "dark");
    } else {
      // If it's light, we remove the "dark" class
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]); // The [isDark] array tells React: "Only run this effect when isDark changes"

  // 3. We provide a simple function to flip the switch
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // 4. We return the current state and our toggle function so other components can use them
  return { isDark, toggleTheme };
}
