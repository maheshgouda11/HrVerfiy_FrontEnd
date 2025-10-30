import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Building, CheckCircle, XCircle, Search, Filter, Eye, UserCheck, AlertTriangle } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  hrContacts: number;
}

interface HRContact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'suspended';
  verifiedDate: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'contacts' | 'reports'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const stats = {
    totalCompanies: 10247,
    pendingApprovals: 23,
    totalContacts: 52891,
    flaggedReports: 7
  };

  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      website: 'https://techcorp.com',
      industry: 'Technology',
      status: 'pending',
      submittedDate: '2024-01-15',
      hrContacts: 5
    },
    {
      id: '2',
      name: 'HealthFirst Medical',
      website: 'https://healthfirst.com',
      industry: 'Healthcare',
      status: 'approved',
      submittedDate: '2024-01-10',
      hrContacts: 12
    },
    {
      id: '3',
      name: 'Suspicious Corp',
      website: 'https://suspicious.com',
      industry: 'Unknown',
      status: 'rejected',
      submittedDate: '2024-01-12',
      hrContacts: 2
    }
  ];

  const mockContacts: HRContact[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah@techcorp.com',
      company: 'TechCorp Solutions',
      status: 'active',
      verifiedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@healthfirst.com',
      company: 'HealthFirst Medical',
      status: 'active',
      verifiedDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Fake Person',
      email: 'fake@suspicious.com',
      company: 'Suspicious Corp',
      status: 'suspended',
      verifiedDate: '2024-01-12'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleApprove = (companyId: string) => {
    alert(`Company ${companyId} approved successfully!`);
  };

  const handleReject = (companyId: string) => {
    alert(`Company ${companyId} rejected.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="mb-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Admin Dashboard - Restricted Access
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            HRVerify Admin Panel
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg text-slate-600">
            Manage company registrations, HR contacts, and platform security
          </motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <Shield className="w-4 h-4" /> },
                { id: 'companies', label: 'Companies', icon: <Building className="w-4 h-4" /> },
                { id: 'contacts', label: 'HR Contacts', icon: <Users className="w-4 h-4" /> },
                { id: 'reports', label: 'Reports', icon: <AlertTriangle className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
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
                { label: 'Total Companies', value: stats.totalCompanies.toLocaleString(), icon: <Building className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' },
                { label: 'Pending Approvals', value: stats.pendingApprovals, icon: <CheckCircle className="w-6 h-6" />, color: 'from-yellow-500 to-orange-500' },
                { label: 'HR Contacts', value: stats.totalContacts.toLocaleString(), icon: <Users className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
                { label: 'Flagged Reports', value: stats.flaggedReports, icon: <AlertTriangle className="w-6 h-6" />, color: 'from-red-500 to-pink-500' }
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
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New company registration', company: 'TechCorp Solutions', time: '2 hours ago', type: 'registration' },
                  { action: 'HR contact verified', company: 'HealthFirst Medical', time: '4 hours ago', type: 'verification' },
                  { action: 'Suspicious activity reported', company: 'Fake Corp', time: '6 hours ago', type: 'report' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'registration' ? 'bg-blue-500' :
                      activity.type === 'verification' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.company} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Companies List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Company Registrations</h3>
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
                    {mockCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{company.name}</div>
                            <div className="text-sm text-slate-500">{company.website}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{company.industry}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{company.hrContacts}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(company.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(company.submittedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          {company.status === 'pending' && (
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
              </div>
            </div>
          </motion.div>
        )}

        {/* HR Contacts Tab */}
        {activeTab === 'contacts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">HR Contacts</h3>
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
                  {mockContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{contact.name}</div>
                          <div className="text-sm text-slate-500">{contact.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{contact.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(contact.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(contact.verifiedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <UserCheck className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Security Reports</h3>
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-slate-900 mb-2">No Active Reports</h4>
              <p className="text-slate-600">All security reports have been reviewed and resolved.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}