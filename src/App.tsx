
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import CareerDevelopment from "./pages/CareerDevelopment";
import EducationLearning from "./pages/EducationLearning";
import EducationSearchResults from "./pages/EducationSearchResults";
import LifestyleServices from "./pages/LifestyleServices";
import HobbiesSkills from "./pages/HobbiesSkills";
import CitySelector from "./pages/CitySelector";
import NotFound from "./pages/NotFound";
import IconsPreview from "./components/IconsPreview";
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
            <Route path="/lifestyle" element={<LifestyleServices />} />
            <Route path="/hobbies" element={<HobbiesSkills />} />
            <Route path="/city-selector" element={<CitySelector />} />
            <Route path="/icons" element={<IconsPreview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
