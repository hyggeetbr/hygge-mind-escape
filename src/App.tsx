
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Meditate from "./pages/Meditate";
import TodaysReading from "./pages/TodaysReading";
import ArticleDetail from "./pages/ArticleDetail";
import Yoga from "./pages/Yoga";
import AskAI from "./pages/AskAI";
import Sleep from "./pages/Sleep";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/todays-reading" element={<TodaysReading />} />
          <Route path="/todays-reading/:articleId" element={<ArticleDetail />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
