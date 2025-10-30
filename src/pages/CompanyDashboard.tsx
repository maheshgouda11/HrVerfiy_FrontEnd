  import { useState, useRef, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { motion } from "framer-motion";
  import { Building, User, Plus, Trash2, Mail, Phone, AlertTriangle, LogOut, Upload } from "lucide-react";
  import Papa from "papaparse";
  import API from "../api";

  interface HRContact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    title?: string;
    reported?: boolean;
    company?: string;
    status?: string;
    verifiedDate?: string;
  }

  interface CompanyInfo {
    id: number;
    name: string;
    website: string;
    industry: string;
    size: string;
    description: string;
    status: string;
    createdAt: string;
  }

  interface NewContact {
    name: string;
    email: string;
    phone: string;
    department: string;
    title: string;
  }

  interface DeleteContactInput {
    name: string;
    email: string;
    phone: string;
  }

  export default function CompanyDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'hrContacts' | 'addHR' | 'delete' | 'reported'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // Company state
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [hrContacts, setHrContacts] = useState<HRContact[]>([]);

    const [newContact, setNewContact] = useState<NewContact>({ 
      name: "", 
      email: "", 
      phone: "", 
      department: "", 
      title: "" 
    });
    const [bulkFile, setBulkFile] = useState<File | null>(null);
    const [deleteFile, setDeleteFile] = useState<File | null>(null);
    const [deleteContactInput, setDeleteContactInput] = useState<DeleteContactInput>({ 
      name: "", 
      email: "", 
      phone: "" 
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Load company data on component mount
    useEffect(() => {
      loadCompanyProfile();
      loadHRContacts();
    }, []);

    const loadCompanyProfile = async () => {
      try {
        setLoadingMessage("Loading company profile...");
        const response = await API.get("/api/company/profile");
        setCompanyInfo(response.data);
      } catch (error: any) {
        console.error("Failed to load company profile:", error);
        if (error.response?.status === 404) {
          navigate("/CompanyDetails");
        } else {
          alert("Failed to load company profile: " + (error.response?.data?.message || error.message));
        }
      } finally {
        setLoadingMessage("");
      }
    };

    const loadHRContacts = async () => {
  try {
    setLoadingMessage("Loading HR contacts...");
    const response = await API.get("/api/company/hr-contacts");
    
    // Ensure hrContacts is always an array
    const contacts = response.data || [];
    setHrContacts(Array.isArray(contacts) ? contacts : []);
    
  } catch (error: any) {
    console.error("Failed to load HR contacts:", error);
    // Set empty array on error
    setHrContacts([]);
    alert("Failed to load HR contacts: " + (error.response?.data?.message || error.message));
  } finally {
    setLoadingMessage("");
  }
};

    // Add single contact
    const addContact = async () => {
      if (!newContact.name || !newContact.email) {
        alert("Name and Email are required fields");
        return;
      }
      
      setIsLoading(true);
      setLoadingMessage("Adding HR contact...");
      try {
        const response = await API.post("/api/company/hr-contacts", newContact);
        setHrContacts(prev => [...prev, response.data]);
        setNewContact({ name: "", email: "", phone: "", department: "", title: "" });
        alert("HR contact added successfully!");
      } catch (error: any) {
        console.error("Failed to add HR contact:", error);
        alert("Failed to add HR contact: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    // Remove contact by ID
    const removeContact = async (id: number) => {
      if (!confirm("Are you sure you want to delete this HR contact?")) return;
      
      setIsLoading(true);
      setLoadingMessage("Deleting HR contact...");
      try {
        await API.delete(`/api/company/hr-contacts/${id}`);
        setHrContacts(prev => prev.filter(c => c.id !== id));
        alert("HR contact deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete HR contact:", error);
        alert("Failed to delete HR contact: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    // Remove contact by details
    const removeContactByDetails = async (name: string, email?: string, phone?: string) => {
      if (!confirm("Are you sure you want to delete this HR contact?")) return;
      
      setIsLoading(true);
      setLoadingMessage("Deleting HR contact...");
      try {
        // This would need a corresponding backend endpoint
        await API.delete("/api/company/hr-contacts/by-details", {
          data: { name, email, phone }
        });
        setHrContacts(prev => prev.filter(c => 
          !(c.name === name && (c.email === email || c.phone === phone))
        ));
        alert("HR contact deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete HR contact:", error);
        alert("Failed to delete HR contact: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    const handleDeleteContact = () => {
      if (!deleteContactInput.name && !deleteContactInput.email && !deleteContactInput.phone) {
        alert("Please provide at least one field to identify the contact to delete");
        return;
      }
      removeContactByDetails(deleteContactInput.name, deleteContactInput.email, deleteContactInput.phone);
      setDeleteContactInput({ name: "", email: "", phone: "" });
    };

    // Bulk Upload Submit
    const handleBulkUploadSubmit = async () => {
      if (!bulkFile) {
        alert("Please select a CSV file first.");
        return;
      }
      
      setIsLoading(true);
      setLoadingMessage("Uploading HR contacts...");
      try {
        const formData = new FormData();
        formData.append("file", bulkFile);

        const response = await API.post("/api/company/hr-contacts/bulk", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        setHrContacts(prev => [...prev, ...response.data]);
        setBulkFile(null);
        alert("Bulk upload successful! " + response.data.length + " contacts added.");
      } catch (error: any) {
        console.error("Bulk upload failed:", error);
        alert("Bulk upload failed: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    // Bulk Delete Submit
    const handleBulkDeleteSubmit = async () => {
      if (!deleteFile) {
        alert("Please select a CSV file first.");
        return;
      }
      
      setIsLoading(true);
      setLoadingMessage("Deleting HR contacts...");
      try {
        const formData = new FormData();
        formData.append("file", deleteFile);

        await API.post("/api/company/hr-contacts/bulk-delete", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Reload contacts after bulk delete
        await loadHRContacts();
        setDeleteFile(null);
        alert("Bulk delete successful!");
      } catch (error: any) {
        console.error("Bulk delete failed:", error);
        alert("Bulk delete failed: " + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("companyInfo");
      navigate("/login");
    };

    const reportedContacts = hrContacts.filter(c => c.reported);
    const filteredHRContacts = hrContacts.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
    );
    const filteredReportedContacts = reportedContacts.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
    );

    if (!companyInfo && loadingMessage) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">{loadingMessage}</p>
          </div>
        </div>
      );
    }

    if (!companyInfo) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <p className="text-slate-600">Failed to load company profile</p>
            <button 
              onClick={() => navigate("/CompanyDetails")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Company Profile
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-50"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Building className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Company Dashboard
                </span>
              </div>

              {/* Tabs */}
              <div className="hidden md:flex items-center space-x-4">
                {[
                  { id: 'profile', label: 'Profile' },
                  { id: 'hrContacts', label: 'HR Contacts' },
                  { id: 'addHR', label: 'Add HR' },
                  { id: 'delete', label: 'Delete HR' },
                  { id: 'reported', label: 'Reported HR' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSearchQuery(""); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <button 
                onClick={handleLogout} 
                disabled={isLoading}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 gap-1 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </motion.header>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-12">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-700">{loadingMessage}</p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                <Building className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-slate-900">Company Profile</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div><span className="font-medium">Name:</span> {companyInfo.name}</div>
                <div><span className="font-medium">Website:</span> {companyInfo.website}</div>
                <div><span className="font-medium">Industry:</span> {companyInfo.industry}</div>
                <div><span className="font-medium">Size:</span> {companyInfo.size}</div>
                <div className="md:col-span-2">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    companyInfo.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    companyInfo.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {companyInfo.status}
                  </span>
                </div>
              </div>
              {companyInfo.description && (
                <div className="mt-6">
                  <span className="font-medium">Description:</span>
                  <p className="mt-2 text-slate-600">{companyInfo.description}</p>
                </div>
              )}
              {companyInfo.createdAt && (
                <div className="mt-4 text-sm text-slate-500">
                  Registered on: {new Date(companyInfo.createdAt).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          )}

          {/* HR Contacts Tab */}
          {activeTab === 'hrContacts' && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-slate-900">HR Contacts ({hrContacts.length})</h2>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email or phone"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <div className="space-y-4">
                {filteredHRContacts.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {hrContacts.length === 0 ? "No HR contacts found. Add your first HR contact!" : "No contacts match your search."}
                  </div>
                ) : (
                  filteredHRContacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className={`p-4 rounded-lg border flex justify-between items-center transition-all ${
                        contact.reported ? "border-red-300 bg-red-50" : "border-slate-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 flex items-center">
                          {contact.name}
                          {contact.reported && (
                            <span className="ml-2 flex items-center text-red-600 text-sm">
                              <AlertTriangle className="w-4 h-4 mr-1" /> Reported
                            </span>
                          )}
                          {contact.status && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              contact.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {contact.status}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600">
                          {contact.title} {contact.department && `- ${contact.department}`}
                        </div>
                        <div className="text-sm text-slate-500 flex gap-4 mt-1">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                        {contact.verifiedDate && (
                          <div className="text-xs text-slate-400 mt-1">
                            Verified: {new Date(contact.verifiedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeContact(contact.id)} 
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 ml-4"
                        title="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Add HR Tab */}
          {activeTab === 'addHR' && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Add HR Contacts</h2>

              {/* Single Add */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Add Single Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Full Name *" 
                    value={newContact.name} 
                    onChange={e => setNewContact({ ...newContact, name: e.target.value })} 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="email" 
                    placeholder="Email *" 
                    value={newContact.email} 
                    onChange={e => setNewContact({ ...newContact, email: e.target.value })} 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    value={newContact.phone} 
                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })} 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Department" 
                    value={newContact.department} 
                    onChange={e => setNewContact({ ...newContact, department: e.target.value })} 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Job Title" 
                    value={newContact.title} 
                    onChange={e => setNewContact({ ...newContact, title: e.target.value })} 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                  />
                </div>
                <button 
                  onClick={addContact} 
                  disabled={!newContact.name || !newContact.email || isLoading}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" /> Add HR Contact
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 my-6"></div>

              {/* Bulk Add */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Bulk Add via CSV</h3>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Upload CSV File
                  </label>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={e => setBulkFile(e.target.files?.[0] || null)} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {bulkFile && (
                    <p className="text-sm text-green-600 flex items-center">
                      <Upload className="w-4 h-4 mr-1" />
                      Selected: {bulkFile.name}
                    </p>
                  )}
                  <button 
                    onClick={handleBulkUploadSubmit} 
                    disabled={!bulkFile || isLoading}
                    className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" /> Upload CSV
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">CSV Format:</h4>
                  <pre className="text-sm text-slate-600">
                    {`name,email,phone,department,title\nJohn Doe,john@company.com,+1234567890,HR,HR Manager\nJane Smith,jane@company.com,,Recruitment,Talent Specialist`}
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">
                    * Required fields: name, email
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Delete Tab */}
          {activeTab === 'delete' && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-semibold text-slate-900">Delete HR Contacts</h2>

              {/* Single Delete */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Delete Single Contact</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={deleteContactInput.name} 
                    onChange={e => setDeleteContactInput({ ...deleteContactInput, name: e.target.value })} 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Email" 
                    value={deleteContactInput.email} 
                    onChange={e => setDeleteContactInput({ ...deleteContactInput, email: e.target.value })} 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Phone" 
                    value={deleteContactInput.phone} 
                    onChange={e => setDeleteContactInput({ ...deleteContactInput, phone: e.target.value })} 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={handleDeleteContact} 
                  disabled={isLoading || (!deleteContactInput.name && !deleteContactInput.email && !deleteContactInput.phone)}
                  className="flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete HR Contact
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 my-6"></div>

              {/* Bulk Delete */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Bulk Delete via CSV</h3>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Upload CSV with emails or phones to delete
                  </label>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={e => setDeleteFile(e.target.files?.[0] || null)} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {deleteFile && (
                    <p className="text-sm text-red-600 flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Selected: {deleteFile.name}
                    </p>
                  )}
                  <button 
                    onClick={handleBulkDeleteSubmit} 
                    disabled={!deleteFile || isLoading}
                    className="flex items-center justify-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" /> Bulk Delete
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">CSV Format for Deletion:</h4>
                  <pre className="text-sm text-red-700">
                    {`email\njohn@company.com\n\nOR\n\nphone\n+1234567890`}
                  </pre>
                  <p className="text-xs text-red-600 mt-2">
                    * Provide either email or phone column
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reported HR Tab */}
          {activeTab === 'reported' && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Reported HR Contacts ({reportedContacts.length})
                </h2>
                <input
                  type="text"
                  placeholder="Search reported HR"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {filteredReportedContacts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">
                    {reportedContacts.length === 0 
                      ? "No reported HR contacts." 
                      : "No reported contacts match your search."}
                  </p>
                  {reportedContacts.length === 0 && (
                    <p className="text-slate-400 mt-2">All your HR contacts are in good standing!</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReportedContacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className="p-4 rounded-lg border border-red-300 bg-red-50 flex justify-between items-center transition-all hover:shadow-md"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 flex items-center">
                          {contact.name} 
                          <AlertTriangle className="w-4 h-4 ml-2 text-red-600" />
                        </div>
                        <div className="text-sm text-slate-600">
                          {contact.title} {contact.department && `- ${contact.department}`}
                        </div>
                        <div className="text-sm text-slate-500 flex gap-4 mt-1">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-red-600 mt-2 font-medium">
                          ⚠️ This contact has been reported by candidates
                        </div>
                      </div>
                      <button 
                        onClick={() => removeContact(contact.id)} 
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 ml-4"
                        title="Delete reported contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  }