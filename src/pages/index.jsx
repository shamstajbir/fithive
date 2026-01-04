import Layout from "./Layout.jsx";

import About from "./About";

import AdminDashboard from "./AdminDashboard";

import App from "./App";

import BannerManager from "./BannerManager";

import BlogManager from "./BlogManager";

import BlogPost from "./BlogPost";

import Blogs from "./Blogs";

import BookingManager from "./BookingManager";

import Challenges from "./Challenges";

import ClassManager from "./ClassManager";

import ClassSchedule from "./ClassSchedule";

import ClassScheduleManager from "./ClassScheduleManager";

import Classes from "./Classes";

import ClubManager from "./ClubManager";

import Clubs from "./Clubs";

import Contact from "./Contact";

import ContentManager from "./ContentManager";

import FAQs from "./FAQs";

import Home from "./Home";

import InitializeSuperAdmin from "./InitializeSuperAdmin";

import InquiryManager from "./InquiryManager";

import MealPlanner from "./MealPlanner";

import MyBookings from "./MyBookings";

import NotificationSettings from "./NotificationSettings";

import PackageManager from "./PackageManager";

import Packages from "./Packages";

import PrivacyPolicy from "./PrivacyPolicy";

import ProgressTracker from "./ProgressTracker";

import PromoBannerManager from "./PromoBannerManager";

import SiteSettingsManager from "./SiteSettingsManager";

import SuperAdminPanel from "./SuperAdminPanel";

import TermsOfService from "./TermsOfService";

import TrainerDetail from "./TrainerDetail";

import UserDashboard from "./UserDashboard";

import UserManager from "./UserManager";

import VisitorAnalytics from "./VisitorAnalytics";

import WorkoutPlanner from "./WorkoutPlanner";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    About: About,
    
    AdminDashboard: AdminDashboard,
    
    App: App,
    
    BannerManager: BannerManager,
    
    BlogManager: BlogManager,
    
    BlogPost: BlogPost,
    
    Blogs: Blogs,
    
    BookingManager: BookingManager,
    
    Challenges: Challenges,
    
    ClassManager: ClassManager,
    
    ClassSchedule: ClassSchedule,
    
    ClassScheduleManager: ClassScheduleManager,
    
    Classes: Classes,
    
    ClubManager: ClubManager,
    
    Clubs: Clubs,
    
    Contact: Contact,
    
    ContentManager: ContentManager,
    
    FAQs: FAQs,
    
    Home: Home,
    
    InitializeSuperAdmin: InitializeSuperAdmin,
    
    InquiryManager: InquiryManager,
    
    MealPlanner: MealPlanner,
    
    MyBookings: MyBookings,
    
    NotificationSettings: NotificationSettings,
    
    PackageManager: PackageManager,
    
    Packages: Packages,
    
    PrivacyPolicy: PrivacyPolicy,
    
    ProgressTracker: ProgressTracker,
    
    PromoBannerManager: PromoBannerManager,
    
    SiteSettingsManager: SiteSettingsManager,
    
    SuperAdminPanel: SuperAdminPanel,
    
    TermsOfService: TermsOfService,
    
    TrainerDetail: TrainerDetail,
    
    UserDashboard: UserDashboard,
    
    UserManager: UserManager,
    
    VisitorAnalytics: VisitorAnalytics,
    
    WorkoutPlanner: WorkoutPlanner,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/About" element={<About />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/App" element={<App />} />
                
                <Route path="/BannerManager" element={<BannerManager />} />
                
                <Route path="/BlogManager" element={<BlogManager />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/Blogs" element={<Blogs />} />
                
                <Route path="/BookingManager" element={<BookingManager />} />
                
                <Route path="/Challenges" element={<Challenges />} />
                
                <Route path="/ClassManager" element={<ClassManager />} />
                
                <Route path="/ClassSchedule" element={<ClassSchedule />} />
                
                <Route path="/ClassScheduleManager" element={<ClassScheduleManager />} />
                
                <Route path="/Classes" element={<Classes />} />
                
                <Route path="/ClubManager" element={<ClubManager />} />
                
                <Route path="/Clubs" element={<Clubs />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/ContentManager" element={<ContentManager />} />
                
                <Route path="/FAQs" element={<FAQs />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/InitializeSuperAdmin" element={<InitializeSuperAdmin />} />
                
                <Route path="/InquiryManager" element={<InquiryManager />} />
                
                <Route path="/MealPlanner" element={<MealPlanner />} />
                
                <Route path="/MyBookings" element={<MyBookings />} />
                
                <Route path="/NotificationSettings" element={<NotificationSettings />} />
                
                <Route path="/PackageManager" element={<PackageManager />} />
                
                <Route path="/Packages" element={<Packages />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/ProgressTracker" element={<ProgressTracker />} />
                
                <Route path="/PromoBannerManager" element={<PromoBannerManager />} />
                
                <Route path="/SiteSettingsManager" element={<SiteSettingsManager />} />
                
                <Route path="/SuperAdminPanel" element={<SuperAdminPanel />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/TrainerDetail" element={<TrainerDetail />} />
                
                <Route path="/UserDashboard" element={<UserDashboard />} />
                
                <Route path="/UserManager" element={<UserManager />} />
                
                <Route path="/VisitorAnalytics" element={<VisitorAnalytics />} />
                
                <Route path="/WorkoutPlanner" element={<WorkoutPlanner />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}