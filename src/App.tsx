
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Meditate from "./pages/Meditate";
import TodaysReading from "./pages/TodaysReading";
import Yoga from "./pages/Yoga";
import AskAI from "./pages/AskAI";
import Discover from "./pages/Discover";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import ArticleDetail from "./pages/ArticleDetail";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Sleep from "./pages/Sleep";
import Sounds from "./pages/Sounds";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/todays-reading" element={<TodaysReading />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/sounds" element={<Sounds />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
