import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
} from "lucide-react";
import { authAPI, apiUtils } from "../api"; // Make sure to import from your api.ts

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "company" | "admin">("candidate");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"form" | "verify" | "adminAuth">("form");
  const [otp, setOtp] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const navigate = useNavigate();

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (phone && (!/^[6-9]\d{9}$/.test(phone) || phone.length !== 10)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    // Validate password
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Using the authAPI from your api.ts file
      const response = await authAPI.signup({
        username: email,
        email: email,
        fullName: fullName,
        phone: phone,
        password: password,
        role: userType.toUpperCase(),
      });

      alert("Signup successful! Please verify.");
      setVerificationStep("verify");
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      alert("Signup failed: " + errorMessage);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      alert("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would verify the OTP with the backend
      // For demo purposes, we'll accept any 6-digit code
      if (userType === "admin") {
        setVerificationStep("adminAuth");
      } else {
        // Auto-login after successful verification
        const loginRes = await authAPI.login({
          username: email,
          password: password
        });

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("userType", userType);

        // Navigate based on user type
        if (userType === "candidate") {
          navigate("/CandidateDashboard");
        } else if (userType === "company") {
          navigate("/Company/CompanyDetails");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      alert("Verification failed: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Security Authentication
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminCode.trim()) {
      alert("Please enter the admin security code");
      return;
    }

    setIsLoading(true);

    try {
      if (adminCode === "ADMIN-2025-KEY") {
        // Auto-login admin after successful verification
        const loginRes = await authAPI.adminLogin({
          username: email,
          password: password,
          otp: "123456" // Demo OTP
        });

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("userType", userType);
        navigate("/AdminDashboard");
      } else {
        alert("Invalid Admin Security Code! Please use: ADMIN-2025-KEY");
      }
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      alert("Admin verification failed: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when user type changes
  const handleUserTypeChange = (type: "candidate" | "company" | "admin") => {
    setUserType(type);
    setVerificationStep("form");
    setOtp("");
    setAdminCode("");
  };

  // Format phone number for display
  const formatPhoneDisplay = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              HRVerify
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create an Account
          </h1>
          <p className="text-slate-600">Sign up to get started with HRVerify</p>
        </motion.div>

        {/* Form / Verification Steps */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Progress Steps */}
          <div className="flex justify-between mb-6">
            {["Account", "Verify", "Complete"].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    (verificationStep === "form" && index === 0) ||
                    (verificationStep === "verify" && index <= 1) ||
                    (verificationStep === "adminAuth" && index <= 2)
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 text-slate-600">{step}</span>
              </div>
            ))}
          </div>

          {/* Step 1 → Signup Form */}
          {verificationStep === "form" && (
            <form onSubmit={handleSignup} className="space-y-6">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Account Type
                </label>
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

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-600 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formatPhoneDisplay(phone)}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-3 pl-14 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="987 654 3210"
                    maxLength={12}
                  />
                  <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
                {phone.length > 0 && (!/^[6-9]\d{9}$/.test(phone) || phone.length !== 10) && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Enter a valid 10-digit Indian mobile number
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pl-11 pr-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Create a password"
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
                <p className={`text-xs mt-1 ${
                  password.length >= 6 ? "text-green-500" : "text-slate-500"
                }`}>
                  {password.length >= 6 ? "✓ " : ""}Password must be at least 6 characters long
                </p>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading || !fullName || !email || !password}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Continue to Verification
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2 → OTP Verification */}
          {verificationStep === "verify" && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Verify Your Account
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  We've sent a verification code to your email.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Demo:</strong> Enter any 6-digit code
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Email: {email}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Verification Code *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) setOtp(value);
                  }}
                  required
                  className="w-full px-4 py-3 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Enter any 6-digit number for demo purposes
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setVerificationStep("form")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Signup
                </button>
              </div>
            </form>
          )}

          {/* Step 3 → Admin Extra Authentication */}
          {verificationStep === "adminAuth" && (
            <form onSubmit={handleAdminAuth} className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Admin Security Verification
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Enter the system-provided Admin Access Code to continue.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-700">
                    <strong>Demo Code:</strong> ADMIN-2025-KEY
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    This is for demonstration purposes only
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Security Code *
                </label>
                <input
                  type="text"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter Admin Security Code"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying Admin...
                  </>
                ) : (
                  <>
                    Complete Admin Setup
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setVerificationStep("verify")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to OTP Verification
                </button>
              </div>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}