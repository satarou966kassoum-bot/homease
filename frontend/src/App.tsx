import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./layouts/MainLayout";

import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { PublishPage } from "./pages/PublishPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { MessagesPage } from "./pages/MessagesPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import {
  AboutPage,
  ContactPage,
  TermsPage,
  PrivacyPage,
  ForgotPasswordPage,
  FAQPage,
  SupportPage,
} from "./pages/StaticPages";
import { WhyEmobilePage } from "./pages/WhyEmobilePage";
import { PublicProfilePage } from "./pages/PublicProfilePage";
import { GuidedTourPage } from "./pages/GuidedTourPage";

// Chargées à la demande seulement : évite d'alourdir le chargement initial
// de l'accueil avec le code du tableau de bord/admin (graphiques recharts, etc.)
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout").then((m) => ({ default: m.DashboardLayout })));
const AdminLayout = lazy(() => import("./layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })));

const DashboardListingsPage = lazy(() => import("./pages/DashboardListingsPage").then((m) => ({ default: m.DashboardListingsPage })));
const DashboardProfilePage = lazy(() => import("./pages/DashboardProfilePage").then((m) => ({ default: m.DashboardProfilePage })));
const DashboardStatsPage = lazy(() => import("./pages/DashboardStatsPage").then((m) => ({ default: m.DashboardStatsPage })));
const DashboardBoosterPage = lazy(() => import("./pages/DashboardBoosterPage").then((m) => ({ default: m.DashboardBoosterPage })));
const DashboardCollectionsPage = lazy(() => import("./pages/DashboardCollectionsPage").then((m) => ({ default: m.DashboardCollectionsPage })));

const AdminOverviewPage = lazy(() => import("./pages/admin/AdminOverviewPage").then((m) => ({ default: m.AdminOverviewPage })));
const AdminBannersPage = lazy(() => import("./pages/admin/AdminBannersPage").then((m) => ({ default: m.AdminBannersPage })));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage").then((m) => ({ default: m.AdminUsersPage })));
const AdminListingsPage = lazy(() => import("./pages/admin/AdminListingsPage").then((m) => ({ default: m.AdminListingsPage })));
const AdminKycPage = lazy(() => import("./pages/admin/AdminKycPage").then((m) => ({ default: m.AdminKycPage })));
const AdminReportsPage = lazy(() => import("./pages/admin/AdminReportsPage").then((m) => ({ default: m.AdminReportsPage })));

function PageFallback() {
  return <div className="page-container py-16 text-center text-sm text-ink-300">Chargement...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="buy" element={<SearchPage />} />
              <Route path="rent" element={<SearchPage />} />
              <Route path="land" element={<SearchPage />} />
              <Route path="listing/:id" element={<ListingDetailPage />} />
              <Route path="listing/:id/visite" element={<GuidedTourPage />} />
              <Route path="publish" element={<PublishPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="pourquoi" element={<WhyEmobilePage />} />
              <Route path="profil/:userId" element={<PublicProfilePage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="a-venir" element={<ComingSoonPage />} />

              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="banners" element={<AdminBannersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="listings" element={<AdminListingsPage />} />
                <Route path="kyc" element={<AdminKycPage />} />
                <Route path="reservations" element={<ReservationsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Le tableau de bord a son propre en-tête/menu — pas de Navbar globale ici */}
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardProfilePage />} />
              <Route path="listings" element={<DashboardListingsPage />} />
              <Route path="listings/:id/edit" element={<PublishPage />} />
              <Route path="stats" element={<DashboardStatsPage />} />
              <Route path="booster" element={<DashboardBoosterPage />} />
              <Route path="collections" element={<DashboardCollectionsPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<DashboardProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
