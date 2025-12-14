import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useTelegram } from "./integrations/telegram/useTelegram";

const queryClient = new QueryClient();

function AppContent() {
  const { webApp, isTelegram } = useTelegram();

  useEffect(() => {
    if (isTelegram && webApp) {
      // Apply Telegram-specific styles
      document.body.classList.add('tg-webapp');
      
      // Handle theme changes
      const handleThemeChange = () => {
        if (webApp.themeParams.bg_color) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color);
        }
      };
      
      webApp.onEvent('themeChanged', handleThemeChange);
      
      return () => {
        document.body.classList.remove('tg-webapp');
      };
    }
  }, [webApp, isTelegram]);

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
