
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import SwipeBackWrapper from "./components/SwipeBackWrapper";

const queryClient = new QueryClient();
import Index from "./pages/Index";
import ChatDetail from "./pages/ChatDetail";
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
import SkillPublish from "./pages/SkillPublish";
import Auth from "./pages/Auth";
import TopicDetail from "./pages/TopicDetail";
import Notifications from "./pages/Notifications";
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
import PointsRecharge from "./pages/profile/PointsRecharge";

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
import UserResearch from "./pages/settings/UserResearch";
import ChangePassword from "./pages/settings/ChangePassword";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SwipeBackWrapper>
          <div className="app-wrapper w-full min-h-screen bg-muted">
            <div className="app-container">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
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
                <Route path="/chat/:chatId" element={<ChatDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/skill-publish" element={<SkillPublish />} />
                <Route path="/topic/:topicId" element={<TopicDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                
                {/* Profile sub-pages */}
                <Route path="/profile/orders" element={<MyOrders />} />
                <Route path="/profile/answers" element={<MyAnswers />} />
                <Route path="/profile/favorites" element={<MyFavorites />} />
                <Route path="/profile/following" element={<MyFollowing />} />
                <Route path="/profile/earnings" element={<MyEarnings />} />
                <Route path="/profile/community" element={<MyCommunity />} />
                <Route path="/profile/drafts" element={<MyDrafts />} />
                <Route path="/profile/talent-certification" element={<TalentCertification />} />
                <Route path="/profile/recharge" element={<PointsRecharge />} />
                
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
                <Route path="/settings/user-research" element={<UserResearch />} />
                <Route path="/settings/change-password" element={<ChangePassword />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          <Toaster />
          </SwipeBackWrapper>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
