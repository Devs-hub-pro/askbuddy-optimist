
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CitySelector from "./pages/CitySelector";
import NotFound from "./pages/NotFound";
import IconsPreview from "./components/IconsPreview";
import EducationLearning from "./pages/EducationLearning";
import CareerDevelopment from "./pages/CareerDevelopment";
import LifestyleServices from "./pages/LifestyleServices";
import HobbiesSkills from "./pages/HobbiesSkills";

const queryClient = new QueryClient();

// Create placeholder pages for routes that will be implemented later
const Discover = () => <div className="min-h-screen flex items-center justify-center">发现页面正在开发中</div>;
const New = () => <div className="min-h-screen flex items-center justify-center">新建问题页面正在开发中</div>;
const Messages = () => <div className="min-h-screen flex items-center justify-center">消息页面正在开发中</div>;
const Profile = () => <div className="min-h-screen flex items-center justify-center">个人页面正在开发中</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/city-selector" element={<CitySelector />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/new" element={<New />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/icons-preview" element={<IconsPreview />} />
          <Route path="/education" element={<EducationLearning />} />
          <Route path="/career" element={<CareerDevelopment />} />
          <Route path="/lifestyle" element={<LifestyleServices />} />
          <Route path="/hobbies" element={<HobbiesSkills />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
