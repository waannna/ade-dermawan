import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import useAuth from "./hooks/useAuth"
import { useTheme } from "./context/ThemeContext"

// Pages - Public
import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Lawyers from "./pages/Lawyers"
import LawyerDetail from "./pages/LawyerDetail"

// Pages - Protected
import ClientDashboard from "./pages/ClientDashboard"
import ConsultationForm from "./pages/ConsultationForm"
import Consultations from "./pages/Consultations"
import ConsultationDetail from "./pages/ConsultationDetails"
import LawyerDashboard from "./pages/LawyerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
// import AdminLawyers from "./pages/AdminLawyers"
import UsersPage from "./pages/UsersPage"
import ProtectedRoute from "./components/ProtectedRoute"

function AppContent() {
  const { darkMode } = useTheme()

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lawyers" element={<Lawyers />} />
          <Route path="/lawyers/:id" element={<LawyerDetail />} />

          <Route path="/client-dashboard" element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/consultation/new" element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ConsultationForm />
            </ProtectedRoute>
          } />
          <Route path="/consultations" element={
            <ProtectedRoute allowedRoles={["client", "lawyer"]}>
              <Consultations />
            </ProtectedRoute>
          } />
          <Route path="/consultations/:id" element={
            <ProtectedRoute allowedRoles={["client", "lawyer"]}>
              <ConsultationDetail />
            </ProtectedRoute>
          } />
          <Route path="/lawyer-dashboard" element={
            <ProtectedRoute allowedRoles={["lawyer"]}>
              <LawyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/lawyers" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              {/* <AdminLawyers /> */}
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersPage />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </Layout>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  )
}

export default App