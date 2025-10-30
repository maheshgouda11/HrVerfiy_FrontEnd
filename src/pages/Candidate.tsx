import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, Mail, Phone, Building, User } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};


export default function Candidate() {
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock results for demo
      const mockResults = {
        'hr@techcorp.com': {
          status: 'verified',
          company: 'TechCorp Solutions',
          hrName: 'Sarah Mitchell',
          verifiedDate: '2024-01-15',
          department: 'Human Resources'
        },
        'jobs@scamcompany.com': {
          status: 'unverified',
          company: 'Unknown',
          warning: 'This contact is not in our verified database'
        },
        'fake@example.com': {
          status: 'flagged',
          company: 'Unknown',
          warning: 'This contact has been reported for suspicious activity'
        }
      };

      const result = mockResults[searchValue.toLowerCase() as keyof typeof mockResults] || {
        status: 'not_found',
        warning: 'No information found for this contact'
      };

      setSearchResult(result);
      setIsSearching(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'flagged':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'border-green-200 bg-green-50';
      case 'flagged':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Candidate Verification Portal
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Verify HR Contacts
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enter an HR email or phone number to instantly check if it's verified by the company. 
            Protect yourself from job scams and fraudulent recruiters.
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              What would you like to verify?
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSearchType('email')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  searchType === 'email'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </button>
              <button
                onClick={() => setSearchType('phone')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  searchType === 'phone'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {searchType === 'email' ? 'HR Email Address' : 'HR Phone Number'}
            </label>
            <div className="relative">
              <input
                type={searchType === 'email' ? 'email' : 'tel'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'email' ? 'hr@company.com' : '+1 (555) 123-4567'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchType === 'email' ? (
                <Mail className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
              ) : (
                <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!searchValue.trim() || isSearching}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Verify Contact
              </>
            )}
          </button>
        </motion.div>

        {/* Search Results */}
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-white rounded-2xl shadow-xl p-8 border-2 ${getStatusColor(searchResult.status)}`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStatusIcon(searchResult.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {searchResult.status === 'verified' ? 'Verified Contact' : 
                     searchResult.status === 'flagged' ? 'Flagged Contact' : 'Unverified Contact'}
                  </h3>
                  {searchResult.status === 'verified' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      TRUSTED
                    </span>
                  )}
                </div>

                {searchResult.status === 'verified' ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Building className="w-4 h-4" />
                      <span>{searchResult.company}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{searchResult.hrName} - {searchResult.department}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      Verified on {new Date(searchResult.verifiedDate).toLocaleDateString()}
                    </div>
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">✅ This contact is verified and safe to communicate with.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-slate-600">{searchResult.warning}</p>
                    <div className={`mt-4 p-4 border rounded-lg ${
                      searchResult.status === 'flagged' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <p className={`font-medium ${
                        searchResult.status === 'flagged' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        {searchResult.status === 'flagged' 
                          ? '⚠️ Warning: This contact may be associated with fraudulent activity.'
                          : '⚠️ Caution: We cannot verify the legitimacy of this contact.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Demo Examples */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Try These Demo Examples</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { email: 'hr@techcorp.com', status: 'Verified', color: 'text-green-600' },
              { email: 'jobs@scamcompany.com', status: 'Unverified', color: 'text-yellow-600' },
              { email: 'fake@example.com', status: 'Flagged', color: 'text-red-600' }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchValue(example.email);
                  setSearchType('email');
                }}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
              >
                <div className="font-medium text-slate-900">{example.email}</div>
                <div className={`text-sm ${example.color}`}>{example.status}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Safety Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <h3 className="text-2xl font-semibold mb-6">Job Search Safety Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Never pay money upfront for a job opportunity",
              "Be wary of jobs that seem too good to be true",
              "Always verify HR contacts before sharing personal information",
              "Research the company independently before applying",
              "Trust your instincts if something feels suspicious",
              "Use HRVerify to check every HR contact you encounter"
            ].map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                <span className="text-blue-100">{tip}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}