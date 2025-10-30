import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {Mail, Lock, Eye, EyeOff, ArrowRight, Key } from "lucide-react";
import API from "../api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "company" | "admin">("candidate");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Base endpoint and request body
    let endpoint = "/api/auth/login";
    let payload: any = {
      username: email,
      password,
    };
    if (userType === "admin" && requireOtp) {
      endpoint = "/api/auth/admin/login";
      payload.otp = otp;
    }
     const res = await API.post(endpoint, payload);

    const data = res.data;

    // Handle Admin OTP requirement
    if (data.message === "OTP_REQUIRED") {
      setRequireOtp(true);
      alert("Please enter the 6-digit OTP to continue.");
      setIsLoading(false);
      return;
    }
     if (userType === "company" && data.message === "NO_COMPANY_PROFILE") {
      alert("Please complete your company profile setup.");
      navigate("/CompanyDetails");
      setIsLoading(false);
      return;
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    }
     

      // Save JWT token
       if (data.role === "CANDIDATE" || userType === "candidate") {
      navigate("/CandidateDashboard");
    } else if (data.role === "COMPANY" || userType === "company") {
      navigate("/CompanyDashboard");
    } else if (data.role === "ADMIN" || userType === "admin") {
      navigate("/AdminDashboard");
    }

     } catch (err: any) {
    alert("Login failed: " + (err.response?.data || err.message));
  } finally {
    setIsLoading(false);
  }
};

  // Reset OTP requirement when user type changes
  const handleUserTypeChange = (type: "candidate" | "company" | "admin") => {
    setUserType(type);
    setRequireOtp(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              HRVerify
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your HRVerify account</p>
        </motion.div>

        {/* Login Form */}
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-xl p-8">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">Account Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "candidate", label: "Candidate" },
                { type: "company", label: "Company" },
                { type: "admin", label: "Admin" },
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => handleUserTypeChange(option.type as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userType === option.type
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {userType === "admin" ? "Admin Email" : "Email Address"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={userType === "admin" ? "Enter admin email" : "Enter your email"}
                  disabled={userType === "admin" && requireOtp}
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {userType === "admin" && requireOtp ? "Password (Verified)" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pl-11 pr-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    userType === "admin" && requireOtp ? "bg-green-50 border-green-200" : ""
                  }`}
                  placeholder="Enter your password"
                  disabled={userType === "admin" && requireOtp}
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {userType === "admin" && requireOtp && (
                <p className="text-xs text-green-600 mt-1">✓ Password verified</p>
              )}
            </div>

            {/* OTP Field (Only for Admin after password step) */}
            {userType === "admin" && requireOtp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Security Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter 6-digit code"
                  />
                  <Key className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Demo OTP: <span className="font-semibold">123456</span>
                </p>
              </motion.div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {userType === "admin" && requireOtp ? "Verifying OTP..." : "Signing In..."}
                </>
              ) : (
                <>
                  {userType === "admin" && requireOtp ? "Verify OTP & Login" : "Sign In"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-900 mb-2">Demo Credentials</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>
                <strong>Candidate:</strong> candidate@demo.com / password123
              </div>
              <div>
                <strong>Company:</strong> company@demo.com / password123
              </div>
              <div>
                <strong>Admin:</strong> admin@demo.com / password123 + OTP 123456
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div variants={fadeInUp} className="text-center mt-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}