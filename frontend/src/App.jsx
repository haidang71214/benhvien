import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
<<<<<<< HEAD
import Login from "./pages/Login";
=======
>>>>>>> fe-demo
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
<<<<<<< HEAD
import Signup from "./pages/SignUp";
=======
>>>>>>> fe-demo
import VerifyEmail from "./pages/VerifyEmail";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LoginSuccess from "./pages/LoginSuccess";
<<<<<<< HEAD
=======
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from 'react-hot-toast';
>>>>>>> fe-demo

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/signup" element={<Signup />} />
        <Route path ="/verify-email" element={<VerifyEmail />} />
=======
        <Route path="/auth/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/register" element={<Register />} />
>>>>>>> fe-demo
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
<<<<<<< HEAD
        <Route path="/forgot-password" element={<ForgotPassword />} />
=======
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
>>>>>>> fe-demo
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/my-appointments" element={<MyAppointment />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
<<<<<<< HEAD
=======
      <Footer />
      <Toaster position="top-right"/>
>>>>>>> fe-demo
    </div>
  );
};

export default App;
