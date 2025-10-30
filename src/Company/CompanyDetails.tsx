      import { useState } from "react";
      import { useNavigate } from "react-router-dom";
      import { motion } from "framer-motion";
      import { Building, Globe, Users, FileText } from "lucide-react";
      import API from "../api"; // Your API instance

      interface CompanyFormData {
        name: string;
        website: string;
        industry: string;
        size: string;
        description: string;
      }

      export default function CompanyDetails() {
        const navigate = useNavigate();
        const [company, setCompany] = useState<CompanyFormData>({
          name: "",
          website: "",
          industry: "",
          size: "",
          description: ""
        });
        const [isLoading, setIsLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
          const token = localStorage.getItem("token"); // JWT from login

          const response = await API.post("/api/company/profile", company, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          localStorage.setItem("companyInfo", JSON.stringify(response.data));
          navigate("/CompanyDashboard");
        } catch (error: any) {
          console.error("Failed to create company profile:", error);
          alert("Failed to create company profile: " + (error.response?.data?.message || error.message));
        } finally {
          setIsLoading(false);
        }
      };


        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-600" />
                Complete Company Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={company.website}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Industry *"
                  value={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Company Size (e.g. 201-1000) *"
                  value={company.size}
                  onChange={(e) => setCompany({ ...company, size: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={company.description}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Profile...
                    </>
                  ) : (
                    "Save & Go to Dashboard"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        );
      }