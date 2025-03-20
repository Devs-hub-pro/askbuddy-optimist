
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import CareerDevelopment from "./pages/CareerDevelopment";
import EducationLearning from "./pages/EducationLearning";
import EducationSearchResults from "./pages/EducationSearchResults";
import SearchResults from "./pages/SearchResults";
import LifestyleServices from "./pages/LifestyleServices";
import HobbiesSkills from "./pages/HobbiesSkills";
import CitySelector from "./pages/CitySelector";
import NotFound from "./pages/NotFound";
import IconsPreview from "./components/IconsPreview";
import QuestionDetail from "./pages/QuestionDetail";
import ExpertDetail from "./pages/ExpertDetail";
import ExpertProfile from "./pages/ExpertProfile";
import NewQuestion from "./pages/NewQuestion";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper w-full min-h-screen bg-gray-50">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/career" element={<CareerDevelopment />} />
            <Route path="/education" element={<EducationLearning />} />
            <Route path="/education/search" element={<EducationSearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/lifestyle" element={<LifestyleServices />} />
            <Route path="/hobbies" element={<HobbiesSkills />} />
            <Route path="/city-selector" element={<CitySelector />} />
            <Route path="/icons" element={<IconsPreview />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/expert/:id" element={<ExpertDetail />} />
            <Route path="/expert-profile/:id" element={<ExpertProfile />} />
            <Route path="/new" element={<NewQuestion />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
