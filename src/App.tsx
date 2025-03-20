
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
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Profile sub-pages
import MyOrders from "./pages/profile/MyOrders";
import MyAnswers from "./pages/profile/MyAnswers";
import MyFavorites from "./pages/profile/MyFavorites";
import MyFollowing from "./pages/profile/MyFollowing";
import MyEarnings from "./pages/profile/MyEarnings";
import MyCommunity from "./pages/profile/MyCommunity";
import MyDrafts from "./pages/profile/MyDrafts";
import TalentCertification from "./pages/profile/TalentCertification";

// Settings sub-pages
import AccountSecurity from "./pages/settings/AccountSecurity";
import GeneralSettings from "./pages/settings/GeneralSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import PrivacySettings from "./pages/settings/PrivacySettings";
import StorageSpace from "./pages/settings/StorageSpace";
import ContentPreferences from "./pages/settings/ContentPreferences";
import HelpCenter from "./pages/settings/HelpCenter";
import CommunityGuidelines from "./pages/settings/CommunityGuidelines";
import ProductFeedback from "./pages/settings/ProductFeedback";
import AboutUs from "./pages/settings/AboutUs";

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
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            
            {/* Profile sub-pages */}
            <Route path="/profile/orders" element={<MyOrders />} />
            <Route path="/profile/answers" element={<MyAnswers />} />
            <Route path="/profile/favorites" element={<MyFavorites />} />
            <Route path="/profile/following" element={<MyFollowing />} />
            <Route path="/profile/earnings" element={<MyEarnings />} />
            <Route path="/profile/community" element={<MyCommunity />} />
            <Route path="/profile/drafts" element={<MyDrafts />} />
            <Route path="/profile/talent-certification" element={<TalentCertification />} />
            
            {/* Settings sub-pages */}
            <Route path="/settings/account" element={<AccountSecurity />} />
            <Route path="/settings/general" element={<GeneralSettings />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="/settings/privacy" element={<PrivacySettings />} />
            <Route path="/settings/storage" element={<StorageSpace />} />
            <Route path="/settings/content-preferences" element={<ContentPreferences />} />
            <Route path="/settings/help" element={<HelpCenter />} />
            <Route path="/settings/guidelines" element={<CommunityGuidelines />} />
            <Route path="/settings/feedback" element={<ProductFeedback />} />
            <Route path="/settings/about" element={<AboutUs />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
