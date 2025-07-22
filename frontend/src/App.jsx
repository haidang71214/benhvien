import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/doctors/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import MyAppointment from "./pages/appointments/MyAppointment";
import Appointment from "./pages/appointments/Appointment";
import Navbar from "./components/layouts/Navbar";
import ChangePassword from "./pages/account-settings/ChangePassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import LoginSuccess from "./pages/Auth/LoginSuccess";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { Toaster } from "react-hot-toast";
import AccountLayout from "./pages/account-settings/AccountLayout";
import AccountInfo from "./pages/account-settings/AccountInfo";
import MedicalRecordsHistory from "./pages/account-settings/MedicalRecordsHistory";
import SecuritySettings from "./pages/account-settings/SecuritySettings";
import ReceptionistAppointments from "./pages/appointments/ReceptionistAppointment";
import RescheduleAppointment from "./pages/appointments/RescheduleAppointment";
import AppointmentDetail from "./pages/appointments/AppointmentDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminUser from "./admin-fe/AdminUser";
import AdminDashboard from "../src/admin-fe/AdminDashboard";
import AdminMedicine from "../src/admin-fe/AdminMedicine";
import AdminInvoice from "../src/admin-fe/AdminInvoice";
import AISuggest from "./pages/AISuggest";
import PaymentCancel from "./pages/PaymentCancel";

import Chat from "./pages/Chat";
import AllNotifications from "./pages/AllNotifications";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/my-appointments" element={<MyAppointment />} />
        <Route path="/ai-suggest" element={<AISuggest />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/receptionist-appointments"
          element={<ReceptionistAppointments />}
        />
        <Route
          path="/reschedule-appointment/:appointmentId"
          element={<RescheduleAppointment />}
        />
        <Route
          path="/appointment-detail/:appointmentId"
          element={<AppointmentDetail />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/appointment/:docId/:userId" element={<Appointment />} />
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/medicines" element={<AdminMedicine />} />
        <Route path="/admin/invoices" element={<AdminInvoice />} />
        {/* Optionally keep /admin for user management */}
        <Route path="/account-settings" element={<AccountLayout />}>
          <Route index element={<AccountInfo />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="medical-records-history" element={<MedicalRecordsHistory />} />
        </Route>
        <Route path="/notifications" element={<AllNotifications />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" />
      
    </div>
  );
};

export default App;
