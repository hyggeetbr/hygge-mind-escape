
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
import Pulse from "./pages/Pulse";
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
import GoalSetting from "./pages/GoalSetting";
import LongTermGoals from "./pages/LongTermGoals";
import ShortTermGoals from "./pages/ShortTermGoals";
import EchoCulture from "./pages/EchoCulture";
import Folklore from "./pages/Folklore";
import DailyWisdomSections from "./pages/DailyWisdomSections";
import AncientTeachings from "./pages/DailyWisdom/AncientTeachings";
import ModernMindfulness from "./pages/DailyWisdom/ModernMindfulness";
import WisdomFromWorld from "./pages/DailyWisdom/WisdomFromWorld";
import EmotionalWisdom from "./pages/DailyWisdom/EmotionalWisdom";
import EverydayPhilosophy from "./pages/DailyWisdom/EverydayPhilosophy";

const queryClient = new QueryClient();

function App() {
  return (
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
            <Route path="/todays-reading/:id" element={<ArticleDetail />} />
            <Route path="/yoga" element={<Yoga />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/echo-culture" element={<EchoCulture />} />
            <Route path="/folklore/:country" element={<Folklore />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/goal-setting" element={<GoalSetting />} />
            <Route path="/long-term-goals" element={<LongTermGoals />} />
            <Route path="/short-term-goals" element={<ShortTermGoals />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/sounds" element={<Sounds />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/daily-wisdom-sections" element={<DailyWisdomSections />} />
            <Route path="/daily-wisdom/ancient-teachings" element={<AncientTeachings />} />
            <Route path="/daily-wisdom/modern-mindfulness" element={<ModernMindfulness />} />
            <Route path="/daily-wisdom/wisdom-from-world" element={<WisdomFromWorld />} />
            <Route path="/daily-wisdom/emotional-wisdom" element={<EmotionalWisdom />} />
            <Route path="/daily-wisdom/everyday-philosophy" element={<EverydayPhilosophy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
