
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import Sounds from "./pages/Sounds";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import Community from "./pages/Community";
import UserProfile from "./pages/UserProfile";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
        <Route path="/sounds" element={<Sounds />} />
        {/* Temporary alias for older links */}
        <Route path="/sleep" element={<Sounds />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/community" element={<Community />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
