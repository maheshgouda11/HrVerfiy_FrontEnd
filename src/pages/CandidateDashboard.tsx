import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import {
  Search, Shield, CheckCircle, XCircle, AlertTriangle,
  Mail, Phone, User, Upload, LogOut, FileText, Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'verify' | 'report' | 'profile'>('verify');
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // Report state
  const [reportDetails, setReportDetails] = useState({
    hrName: '', hrEmail: '', hrPhone: '', reason: '', documents: null as File | null
  });
  const [reports, setReports] = useState<any[]>([]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Candidate info
  const [candidate, setCandidate] = useState({ name: "", email: "" });

  // Load candidate profile and reports on component mount
  useEffect(() => {
    loadCandidateProfile();
    loadUserReports();
  }, []);

  const loadCandidateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setCandidate({ 
          name: "John Doe", 
          email: "candidate@demo.com" 
        });
      }
    } catch (error) {
      console.error("Failed to load candidate profile:", error);
    }
  };

  const loadUserReports = async () => {
    try {
      const response = await API.get("/api/candidate/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);

    try {
      const response = await API.post("/api/candidate/verify", {
        searchType,
        searchValue
      });
      setSearchResult(response.data);
    } catch (error: any) {
      console.error("Verification failed:", error);
      setSearchResult({
        status: 'error',
        warning: error.response?.data || 'Verification failed'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'FLAGGED': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'UNVERIFIED': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'border-green-200 bg-green-50';
      case 'FLAGGED': return 'border-red-200 bg-red-50';
      case 'UNVERIFIED': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'Verified';
      case 'FLAGGED': return 'Flagged';
      case 'UNVERIFIED': return 'Unverified';
      default: return 'Unknown';
    }
  };

  const submitReport = async () => {
    if (!reportDetails.reason.trim()) {
      alert("Please provide a reason for the report.");
      return;
    }
    if (!reportDetails.hrEmail.trim() && !reportDetails.hrPhone.trim()) {
      alert("Please provide at least HR Email or HR Phone.");
      return;
    }

    setIsSubmittingReport(true);

    try {
      const formData = new FormData();
      if (reportDetails.hrName) formData.append("hrName", reportDetails.hrName);
      formData.append("hrEmail", reportDetails.hrEmail || "");
      formData.append("hrPhone", reportDetails.hrPhone || "");
      formData.append("reason", reportDetails.reason);
      if (reportDetails.documents) formData.append("document", reportDetails.documents);

      await API.post("/api/candidate/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await loadUserReports();
      setReportDetails({ hrName: '', hrEmail: '', hrPhone: '', reason: '', documents: null });
      alert("Report submitted successfully!");
    } catch (error: any) {
      console.error("Report submission failed:", error);
      alert("Report submission failed: " + (error.response?.data || error.message));
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">HRVerify</span>
          </div>
          <nav className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="font-medium text-slate-600 hover:text-slate-800">Home</button>
            <button onClick={() => navigate("/About")} className="font-medium text-slate-600 hover:text-slate-800">About Us</button>
            <button onClick={() => setTab('verify')} className={`font-medium ${tab === 'verify' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}>Verify HR</button>
            <button onClick={() => setTab('report')} className={`font-medium ${tab === 'report' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}>Report HR</button>
            <button onClick={() => setTab('profile')} className={`font-medium ${tab === 'profile' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}>Profile</button>
          </nav>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all duration-200">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Verify HR */}
        {tab === 'verify' && (
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }} className="mb-8">
          <motion.div variants={fadeInUp} className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                <Shield className="w-4 h-4 mr-2" /> Candidate Verification Portal
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Verify HR Contacts</h1>
              <p className="text-slate-600 max-w-xl mx-auto">Enter an HR email or phone to check if it's verified. Protect yourself from job scams.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6 flex space-x-4">
                <button onClick={() => setSearchType('email')} className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${searchType === 'email' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}><Mail className="w-4 h-4 mr-2" /> Email</button>
                <button onClick={() => setSearchType('phone')} className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${searchType === 'phone' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}><Phone className="w-4 h-4 mr-2" /> Phone</button>
              </div>
              <div className="mb-4 relative">
                <input type={searchType === 'email' ? 'email' : 'tel'} value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder={searchType === 'email' ? 'hr@company.com' : '+91 9876543210'} onKeyPress={e => e.key === 'Enter' && handleSearch()} className="w-full px-4 py-3 pl-4 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                {searchType === 'email' ? <Mail className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" /> : <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />}
              </div>
              <button onClick={handleSearch} disabled={!searchValue.trim() || isSearching} className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSearching ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Verifying...</>) : (<><Search className="w-5 h-5 mr-2" />Verify Contact</>)}
              </button>
            </motion.div>
            {searchResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 bg-white rounded-2xl shadow-xl p-6 border-2 ${getStatusColor(searchResult.status)}`}>
                <div className="flex items-start space-x-4">{getStatusIcon(searchResult.status)}<div className="flex-1"><h3 className="text-lg font-semibold text-slate-900 mb-2">{getStatusText(searchResult.status)}</h3>{searchResult.status === 'VERIFIED' ? (<div className="space-y-2"><div className="flex items-center space-x-2"><Building className="w-4 h-4 text-slate-600" /><span className="text-slate-700">{searchResult.company}</span></div><div className="flex items-center space-x-2"><User className="w-4 h-4 text-slate-600" /><span className="text-slate-700">{searchResult.hrName} - {searchResult.department}</span></div>{searchResult.verifiedDate && (<div className="text-sm text-slate-500">Verified on {new Date(searchResult.verifiedDate).toLocaleDateString()}</div>)}</div>) : (<p className="text-slate-600">{searchResult.warning || 'No additional information available'}</p>)}</div></div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Report HR */}
        {tab === 'report' && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Report HR Contact</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">HR Name</label>
                  <input type="text" placeholder="Enter HR name" value={reportDetails.hrName} onChange={e => setReportDetails({...reportDetails, hrName: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">HR Email*</label>
                  <input type="email" placeholder="hr@company.com" value={reportDetails.hrEmail} onChange={e => setReportDetails({...reportDetails, hrEmail: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">HR Phone* </label>
                  <input type="tel" placeholder="+91 9876543210" value={reportDetails.hrPhone} onChange={e => setReportDetails({...reportDetails, hrPhone: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Report *</label>
                  <textarea placeholder="Please provide details..." value={reportDetails.reason} onChange={e => setReportDetails({...reportDetails, reason: e.target.value})} rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center justify-center px-4 py-3 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors duration-200">
                    <Upload className="w-5 h-5 mr-2" />Upload Supporting Documents (PDF, Images, Audio)
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.mp3,.wav" onChange={e => setReportDetails({...reportDetails, documents: e.target.files?.[0] || null})} className="hidden" />
                  </label>
                  {reportDetails.documents && (<p className="text-sm text-slate-600 mt-2">📄 {reportDetails.documents.name}</p>)}
                </div>
              </div>
              <button onClick={submitReport} disabled={isSubmittingReport} className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isSubmittingReport ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Submitting Report...</>) : ('Submit Report')}
              </button>
            </div>
            {reports.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Submitted Reports</h3>
                <div className="space-y-4">{reports.map(report => (
                  <div key={report.id} className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{report.hrName} ({report.hrEmail || report.hrPhone})</h4>
                        <p className="text-sm text-slate-600">Reported on {new Date(report.reportedAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : report.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' : report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{report.status.replace('_', ' ')}</span>
                    </div>
                    <p className="text-slate-700">{report.reason}</p>
                    {report.documentPath && (<div className="mt-2 flex items-center text-sm text-slate-600"><FileText className="w-4 h-4 mr-1" />Document attached</div>)}
                  </div>
                ))}</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Candidate Profile</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4"><User className="w-5 h-5 text-slate-600" /><span className="text-slate-800 font-medium">{candidate.name}</span></div>
              <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-slate-600" /><span className="text-slate-800">{candidate.email}</span></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
