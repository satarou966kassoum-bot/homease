import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AdminLayout } from "./layouts/AdminLayout";

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
import {
  AboutPage,
  ContactPage,
  TermsPage,
  PrivacyPage,
  ForgotPasswordPage,
} from "./pages/StaticPages";

import { DashboardListingsPage } from "./pages/DashboardListingsPage";
import { DashboardProfilePage } from "./pages/DashboardProfilePage";

import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminListingsPage } from "./pages/admin/AdminListingsPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="buy" element={<SearchPage />} />
            <Route path="rent" element={<SearchPage />} />
            <Route path="land" element={<SearchPage />} />
            <Route path="listing/:id" element={<ListingDetailPage />} />
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

            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardProfilePage />} />
              <Route path="listings" element={<DashboardListingsPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<DashboardProfilePage />} />
            </Route>

            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="listings" element={<AdminListingsPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
