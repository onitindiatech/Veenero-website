import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import AboutUsPage from "./pages/AboutUsPage";

import SolutionsPage from "./pages/SolutionsPage";
import ApproachPage from "./pages/ApproachPage";
import ImpactPage from "./pages/ImpactPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";

// Admin Imports
import Login from "./admin/pages/Login";
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Placeholder from "./admin/pages/Placeholder";
import CmsPages from "./admin/pages/cms/CmsPages";
import CareersPage from "./pages/CareersPage";
import CareerDetailsPage from "./pages/CareerDetailsPage";
import Careers from "./admin/pages/cms/Careers";
import Blog from "./admin/pages/cms/Blog";
import BlogSettingsPage from "./admin/pages/cms/BlogSettings";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import HomeCms from "./admin/pages/cms/Home";

// Auth Provider & Guard
import { AuthProvider } from "./admin/context/AuthContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/approach" element={<ApproachPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:slug" element={<CareerDetailsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailsPage />} />
            
            {/* Admin Portal Routing */}
            <Route path="/admin/login" element={<Login />} />
            
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sites" element={<Placeholder />} />
            <Route path="monitoring" element={<Placeholder />} />
            <Route path="analytics" element={<Placeholder />} />
            <Route path="risk" element={<Placeholder />} />
            <Route path="insights" element={<Placeholder />} />
            <Route path="reports" element={<Placeholder />} />
            <Route path="pages" element={<CmsPages />} />
            <Route path="home" element={<HomeCms />} />
            <Route path="home-sections" element={<Navigate to="/admin/home" replace />} />
            <Route path="careers" element={<Careers />} />
            <Route path="navigation" element={<Placeholder />} />
            <Route path="footer" element={<Placeholder />} />
            <Route path="seo" element={<Placeholder />} />
            <Route path="global-settings" element={<Placeholder />} />
            <Route path="job-applications" element={<Placeholder />} />
            <Route path="activity-logs" element={<Placeholder />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/settings" element={<BlogSettingsPage />} />
            <Route path="media" element={<Placeholder />} />
            <Route path="casestudies" element={<Placeholder />} />
            <Route path="faqs" element={<Placeholder />} />
            <Route path="testimonials" element={<Placeholder />} />
            <Route path="partners" element={<Placeholder />} />
            <Route path="leads" element={<Placeholder />} />
            <Route path="contact" element={<Placeholder />} />
            <Route path="newsletters" element={<Placeholder />} />
            <Route path="users" element={<Placeholder />} />
            <Route path="roles" element={<Placeholder />} />
            <Route path="settings" element={<Placeholder />} />
            <Route path="audit" element={<Placeholder />} />
            <Route path="health" element={<Placeholder />} />
            <Route path="*" element={<Placeholder />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
