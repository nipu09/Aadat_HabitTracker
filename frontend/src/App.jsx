import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyHabits from "./pages/MyHabits.jsx";
import Settings from "./pages/Settings.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route path="/otpverify" element={<OtpVerify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myhabits" element={<MyHabits />} />
        <Route path="/insights" element={<ComingSoon title="Insights" />} />
        <Route path="/calendar" element={<ComingSoon title="Calendar" />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
