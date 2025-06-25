import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/doctors/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyAppointment from "./pages/appointments/MyAppointment";
import Appointment from "./pages/appointments/Appointment";
import Navbar from "./components/layouts/Navbar";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ChangePassword from "./pages/account-settings/ChangePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import LoginSuccess from "./pages/auth/LoginSuccess";
import Footer from "./components/layouts/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "react-hot-toast";
import AccountLayout from "./pages/account-settings/AccountLayout";
import AccountInfo from "./pages/account-settings/AccountInfo";
import SecuritySettings from "./pages/account-settings/SecuritySettings";
import AdminDashboard from "../src/admin-fe/AdminUser";
import AdminMedicine from "../src/admin-fe/AdminMedicine";

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
        <Route path="/appointment/:docId/:userId" element={<Appointment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/medicine" element={<AdminMedicine/>}/>
        <Route path="/account-settings" element={<AccountLayout />}>
          <Route index element={<AccountInfo />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="security" element={<SecuritySettings />} />
        </Route>
                

      </Routes>
      <Footer />
      <Toaster position="top-center"/>
    </div>
  );
};

export default App;