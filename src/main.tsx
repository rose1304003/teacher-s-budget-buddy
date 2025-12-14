import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize Telegram WebApp if available
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  
  // Set viewport height for Telegram webview
  const setViewportHeight = () => {
    const vh = tg.viewportHeight || window.innerHeight;
    document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
  };
  
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  
  // Handle viewport changes from Telegram
  tg.onEvent('viewportChanged', setViewportHeight);
}

createRoot(document.getElementById("root")!).render(<App />);
