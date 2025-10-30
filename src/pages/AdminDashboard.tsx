  import { useState, useEffect } from "react";
  import { motion } from "framer-motion";
  import {
    Shield,
    Users,
    Building,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Eye,
    UserCheck,
    AlertTriangle,
    Star,
    LogOut,
    Plus,
    Trash2,
    Upload,
    BarChart3,
    TrendingUp,
    Activity,
    User,
    Settings,
    ChevronDown,
    Menu,
    X
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import Papa from "papaparse";
  import { typedAdminAPI, apiUtils } from '../api';

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  interface Company {
    id: string;
    name: string;
    website: string;
    industry: string;
    size?: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedDate: string;
    hrContacts: number;
  }

  interface HRContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    title?: string;
    company?: string;
    status: 'ACTIVE' | 'SUSPENDED';
    verifiedDate: string;
    reported?: boolean;
  }

  interface Candidate {
    id: string;
    name: string;
    email: string;
    phone?: string;
    skills?: string;
    preferred?: boolean;
  }

  interface AdminStats {
    totalCompanies: number;
    pendingApprovals: number;
    totalContacts: number;
    flaggedReports: number;
  }

  interface RecentActivity {
    id: string;
    action: string;
    company: string;
    timestamp: string;
    type: 'REGISTRATION' | 'VERIFICATION' | 'REPORT' | 'APPROVAL';
  }

  function AdminHeader({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: any) => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
      localStorage.removeItem('adminToken');
      navigate("/login");
    };
    
    const goToProfile = () => {
      setIsProfileDropdownOpen(false);
      alert("Profile page would open here");
    };
    
    const goToSettings = () => {
      setIsProfileDropdownOpen(false);
      alert("Settings page would open here");
    };

    return (
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-50"
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                HRVerify Admin
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'companies', label: 'Companies', icon: <Building className="w-4 h-4" /> },
                { id: 'contacts', label: 'HR Contacts', icon: <Users className="w-4 h-4" /> },
                { id: 'preferred', label: 'Candidates', icon: <Star className="w-4 h-4" /> },
                { id: 'reports', label: 'Reports', icon: <AlertTriangle className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 group ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Profile Dropdown */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 text-sm">Admin</div>
                  <div className="text-xs text-slate-500">Super Admin</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="font-medium text-slate-900">Admin User</div>
                    <div className="text-sm text-slate-500">admin@hrverify.com</div>
                  </div>
                  
                  <button 
                    onClick={goToProfile}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  
                  <button 
                    onClick={goToSettings}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <motion.div 
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-slate-200"
          >
            <div className="py-4 space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'companies', label: 'Companies', icon: <Building className="w-4 h-4" /> },
                { id: 'contacts', label: 'HR Contacts', icon: <Users className="w-4 h-4" /> },
                { id: 'preferred', label: 'Candidates', icon: <Star className="w-4 h-4" /> },
                { id: 'reports', label: 'Reports', icon: <AlertTriangle className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
              
              {/* Mobile Profile Section */}
              <div className="border-t border-slate-200 pt-4 mt-4 px-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">Admin User</div>
                    <div className="text-sm text-slate-500">Super Administrator</div>
                  </div>
                </div>
                
                <button 
                  onClick={goToProfile}
                  className="w-full text-left px-2 py-2 hover:bg-slate-50 flex items-center gap-3 text-slate-700 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                
                <button 
                  onClick={goToSettings}
                  className="w-full text-left px-2 py-2 hover:bg-slate-50 flex items-center gap-3 text-slate-700 rounded-lg"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                
                <button 
                  onClick={logout}
                  className="w-full text-left px-2 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600 rounded-lg mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </nav>
      </motion.header>
    );
  }

  export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'contacts' | 'preferred' | 'reports'>('dashboard');

    // Search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // States for API data
    const [stats, setStats] = useState<AdminStats>({
      totalCompanies: 0,
      pendingApprovals: 0,
      totalContacts: 0,
      flaggedReports: 0
    });

    const [companies, setCompanies] = useState<Company[]>([]);
    const [hrContacts, setHrContacts] = useState<HRContact[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    const [newHR, setNewHR] = useState({ 
      name: "", 
      email: "", 
      phone: "", 
      department: "", 
      title: "", 
      company: "" 
    });

    // Fetch data based on active tab
    useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        switch (activeTab) {
          case 'dashboard':
            const [statsResponse, companiesResponse, contactsResponse] = await Promise.all([
              typedAdminAPI.getDashboardStats(),
              typedAdminAPI.getCompanies(),
              typedAdminAPI.getAllHRContacts()
            ]);
            setStats(statsResponse.data);
            setCompanies(companiesResponse.data);
            setHrContacts(contactsResponse.data);
            break;
          case 'companies':
            const companiesData = await typedAdminAPI.getCompanies(filterStatus);
            setCompanies(companiesData.data);
            break;
          case 'contacts':
            const contactsData = await typedAdminAPI.getAllHRContacts();
            setHrContacts(contactsData.data);
            break;
        }
      } catch (err) {
        setError(apiUtils.handleError(err));
      } finally {
        setLoading(false);
      }
    };

      fetchData();
  }, [activeTab, filterStatus]);

    // Enhanced API functions
    const handleApprove = async (companyId: string) => {
    try {
      const response = await typedAdminAPI.approveCompany(companyId);
      setCompanies(companies.map(c => 
        c.id === companyId ? response.data : c
      ));
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };

    const handleReject = async (companyId: string) => {
    try {
      const response = await typedAdminAPI.rejectCompany(companyId);
      setCompanies(companies.map(c => 
        c.id === companyId ? response.data : c
      ));
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };
    const updateHRStatus = async (contactId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    try {
      const response = await typedAdminAPI.updateHRStatus(contactId, status);
      setHrContacts(hrContacts.map(h =>
        h.id === contactId ? response.data : h
      ));
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };

    const addHR = async () => {
    if (!newHR.name || !newHR.email) {
      setError('Name and email are required');
      return;
    }
    
    try {
      const response = await typedAdminAPI.createHRContact(newHR);
      setHrContacts([...hrContacts, response.data]);
      setNewHR({ name: "", email: "", phone: "", department: "", title: "", company: "" });
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };

    const removeHR = async (id: string) => {
    try {
      await typedAdminAPI.deleteHRContact(id);
      setHrContacts(hrContacts.filter(c => c.id !== id));
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };

  const handleHRCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const contacts = results.data as any[];
          const validContacts = contacts.map(c => ({
            name: c.name,
            email: c.email,
            phone: c.phone,
            department: c.department,
            title: c.title,
            company: c.company
          }));
          
          const response = await typedAdminAPI.bulkAddHRContacts(validContacts);
          setHrContacts([...hrContacts, ...response.data]);
        }
      });
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };

    const handleHRBulkDeleteCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const contactsToDelete = results.data as any[];
          const contactIds = contactsToDelete
            .map((row: any) => hrContacts.find(c => c.email === row.email || c.phone === row.phone)?.id)
            .filter(Boolean) as string[];
          
          await typedAdminAPI.bulkDeleteHRContacts(contactIds);
          setHrContacts(hrContacts.filter(c => !contactIds.includes(c.id)));
        }
      });
    } catch (err) {
      setError(apiUtils.handleError(err));
    }
  };

    const togglePreferred = (id: string) => {
      setCandidates(candidates.map(c => c.id === id ? { ...c, preferred: !c.preferred } : c));
    };

    const getStatusBadge = (status: string) => {
      const statusMap: { [key: string]: { style: string, label: string } } = {
        'PENDING': { style: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        'APPROVED': { style: 'bg-green-100 text-green-800', label: 'Approved' },
        'REJECTED': { style: 'bg-red-100 text-red-800', label: 'Rejected' },
        'ACTIVE': { style: 'bg-green-100 text-green-800', label: 'Active' },
        'SUSPENDED': { style: 'bg-red-100 text-red-800', label: 'Suspended' },
        'pending': { style: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        'approved': { style: 'bg-green-100 text-green-800', label: 'Approved' },
        'rejected': { style: 'bg-red-100 text-red-800', label: 'Rejected' },
        'active': { style: 'bg-green-100 text-green-800', label: 'Active' },
        'suspended': { style: 'bg-red-100 text-red-800', label: 'Suspended' }
      };

      const statusInfo = statusMap[status] || { style: 'bg-gray-100 text-gray-800', label: status };
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.style}`}>
          {statusInfo.label}
        </span>
      );
    };

    const formatTimeAgo = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      return `${Math.floor(diffInHours / 24)} days ago`;
    };

    const getActivityColor = (type: string) => {
      const colors = {
        'REGISTRATION': 'bg-blue-500',
        'VERIFICATION': 'bg-green-500',
        'REPORT': 'bg-red-500',
        'APPROVAL': 'bg-purple-500'
      };
      return colors[type as keyof typeof colors] || 'bg-gray-500';
    };

    const filteredCompanies = Array.isArray(companies)
    ? companies.filter(c => 
        (filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase()) &&
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

    const filteredHRContacts = hrContacts.filter(h =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loading state
    if (loading && activeTab === 'dashboard') {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    const ErrorAlert = () => (
      error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )
    );

    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
            <ErrorAlert />
            
            {/* Welcome Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
              className="mb-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Welcome to Admin Dashboard
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'companies' && 'Company Management'}
                {activeTab === 'contacts' && 'HR Contacts'}
                {activeTab === 'preferred' && 'Candidate Management'}
                {activeTab === 'reports' && 'Security Reports'}
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-slate-600">
                {activeTab === 'dashboard' && 'Monitor platform activity and key metrics'}
                {activeTab === 'companies' && 'Manage company registrations and approvals'}
                {activeTab === 'contacts' && 'Oversee HR contact verification and status'}
                {activeTab === 'preferred' && 'Manage candidate preferences and status'}
                {activeTab === 'reports' && 'Review security reports and flagged content'}
              </motion.p>
            </motion.div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      label: 'Total Companies', 
                      value: stats.totalCompanies.toLocaleString(), 
                      icon: <Building className="w-6 h-6" />, 
                      color: 'from-blue-500 to-cyan-500',
                      change: '+12%'
                    },
                    { 
                      label: 'Pending Approvals', 
                      value: stats.pendingApprovals, 
                      icon: <CheckCircle className="w-6 h-6" />, 
                      color: 'from-yellow-500 to-orange-500',
                      change: '+5'
                    },
                    { 
                      label: 'HR Contacts', 
                      value: stats.totalContacts.toLocaleString(), 
                      icon: <Users className="w-6 h-6" />, 
                      color: 'from-green-500 to-emerald-500',
                      change: '+8%'
                    },
                    { 
                      label: 'Flagged Reports', 
                      value: stats.flaggedReports, 
                      icon: <AlertTriangle className="w-6 h-6" />, 
                      color: 'from-red-500 to-pink-500',
                      change: '-2'
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                          <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {stat.change} from last week
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                          {stat.icon}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                            <p className="text-xs text-slate-500">{activity.company} • {formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-900">Active Companies</span>
                        <span className="font-bold text-blue-700">{companies.filter(c => c.status === 'APPROVED').length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-900">Verified HR Contacts</span>
                        <span className="font-bold text-green-700">{hrContacts.filter(h => h.status === 'ACTIVE').length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-yellow-900">Pending Reviews</span>
                        <span className="font-bold text-yellow-700">{companies.filter(c => c.status === 'PENDING').length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-red-900">Suspended Accounts</span>
                        <span className="font-bold text-red-700">{hrContacts.filter(h => h.status === 'SUSPENDED').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Companies Tab */}
            {activeTab === 'companies' && (
              <div className="space-y-6">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-slate-600">Loading companies...</p>
                  </div>
                )}
                
                {/* Search and Filter */}
                <div className="bg-white p-6 rounded-xl shadow-lg flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      placeholder="Search companies..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <select 
                      value={filterStatus} 
                      onChange={e => setFilterStatus(e.target.value)} 
                      className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Companies Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Company Registrations ({filteredCompanies.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Industry</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">HR Contacts</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {filteredCompanies.map(company => (
                          <tr key={company.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900">{company.name}</div>
                              <div className="text-sm text-slate-500">{company.website}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900">{company.industry}</td>
                            <td className="px-6 py-4 text-sm text-slate-900">{company.hrContacts}</td>
                            <td className="px-6 py-4">{getStatusBadge(company.status)}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {new Date(company.submittedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              {company.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(company.id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(company.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredCompanies.length === 0 && !loading && (
                      <div className="text-center py-8 text-slate-500">
                        No companies found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* HR Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-slate-600">Loading HR contacts...</p>
                  </div>
                )}
                
                {/* Add/Delete HR */}
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                  <h3 className="font-semibold text-lg">Manage HR Contacts</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input 
                      placeholder="Name" 
                      value={newHR.name} 
                      onChange={e => setNewHR({...newHR, name: e.target.value})} 
                      className="border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                      placeholder="Email" 
                      value={newHR.email} 
                      onChange={e => setNewHR({...newHR, email: e.target.value})} 
                      className="border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                      placeholder="Phone" 
                      value={newHR.phone} 
                      onChange={e => setNewHR({...newHR, phone: e.target.value})} 
                      className="border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                      placeholder="Department" 
                      value={newHR.department} 
                      onChange={e => setNewHR({...newHR, department: e.target.value})} 
                      className="border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                      placeholder="Title" 
                      value={newHR.title} 
                      onChange={e => setNewHR({...newHR, title: e.target.value})} 
                      className="border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                      placeholder="Company" 
                      value={newHR.company} 
                      onChange={e => setNewHR({...newHR, company: e.target.value})} 
                      className="border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <button 
                      onClick={addHR} 
                      className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" /> Add HR Contact
                    </button>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700">
                      <Upload className="w-4 h-4"/> Bulk Add CSV
                      <input type="file" accept=".csv" onChange={handleHRCSVUpload} className="hidden" />
                    </label>
                    <label className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2 hover:bg-red-700">
                      <Trash2 className="w-4 h-4"/> Bulk Delete CSV
                      <input type="file" accept=".csv" onChange={handleHRBulkDeleteCSV} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* HR Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-900">HR Contacts ({filteredHRContacts.length})</h3>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        placeholder="Search contacts..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Verified</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {filteredHRContacts.map(hr => (
                          <tr key={hr.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900">{hr.name}</div>
                              <div className="text-sm text-slate-500">{hr.email}</div>
                              {hr.phone && <div className="text-sm text-slate-500">{hr.phone}</div>}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-900">{hr.company}</td>
                            <td className="px-6 py-4">
                              {getStatusBadge(hr.status)}
                              {hr.reported && <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Reported</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {new Date(hr.verifiedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removeHR(hr.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateHRStatus(hr.id, hr.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                                className={`${hr.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredHRContacts.length === 0 && !loading && (
                      <div className="text-center py-8 text-slate-500">
                        No HR contacts found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Candidates Tab (Placeholder) */}
            {activeTab === 'preferred' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Candidate Management</h3>
                <p className="text-slate-600">Candidate management features coming soon...</p>
              </div>
            )}

            {/* Reports Tab (Placeholder) */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Reports</h3>
                <p className="text-slate-600">Security reports and analytics coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }