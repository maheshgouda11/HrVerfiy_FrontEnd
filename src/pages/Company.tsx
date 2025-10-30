import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building, User, Shield, Plus, Trash2, Mail, Phone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

interface HRContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  title: string;
}

export default function Company() {
  const navigate = useNavigate();
  const [demoStep, setDemoStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    description: ''
  });
  const [hrContacts, setHrContacts] = useState<HRContact[]>([]);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    title: ''
  });
  const [csvData, setCsvData] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'single' | 'csv'>('single');

  // Auto demo step animation
  useEffect(() => {
    if (demoStep < 4) {
      const timer = setTimeout(() => setDemoStep(demoStep + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [demoStep]);

  const addContact = () => {
    if (newContact.name && newContact.email) {
      setHrContacts([...hrContacts, { ...newContact, id: Date.now().toString() }]);
      setNewContact({ name: '', email: '', phone: '', department: '', title: '' });
    }
  };

  const removeContact = (id: string) => {
    setHrContacts(hrContacts.filter(contact => contact.id !== id));
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const contacts: HRContact[] = [];
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim());
      if (columns.length >= 2 && columns[0] && columns[1]) {
        contacts.push({
          id: `csv-${i}-${Date.now()}`,
          name: columns[0] || '',
          email: columns[1] || '',
          phone: columns[2] || '',
          department: columns[3] || '',
          title: columns[4] || ''
        });
      }
    }
    return contacts;
  };

  const handleCSVUpload = () => {
    if (!csvData.trim()) return;
    try {
      const parsedContacts = parseCSV(csvData);
      if (parsedContacts.length > 0) {
        setHrContacts([...hrContacts, ...parsedContacts]);
        setCsvData('');
        alert(`Successfully added ${parsedContacts.length} contacts from CSV!`);
      } else {
        alert('No valid contacts found in CSV. Please check the format.');
      }
    } catch {
      alert('Error parsing CSV. Please check the format.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCsvData(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    alert('Company registration submitted successfully! Our team will review your information.');
    setTimeout(() => navigate('/company/dashboard'), 2000);
  };

  const downloadCSVTemplate = () => {
    const template = `name,email,phone,department,title\nJohn Doe,john.doe@company.com,+1 (555) 123-4567,Human Resources,HR Manager\nJane Smith,jane.smith@company.com,+1 (555) 987-6543,Recruitment,Talent Acquisition Specialist`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hr_contacts_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">

        {/* ================= Intro Section ================= */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Building className="w-4 h-4 mr-2" /> Company Registration Portal
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How Company Registration Works
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Protect your company from impersonation and help job seekers identify legitimate HR contacts. 
            Watch the step-by-step demo below before starting your registration.
          </motion.p>

          {/* ================= Animated Demo Steps ================= */}
          <motion.div variants={fadeInUp} className="max-w-md mx-auto text-left space-y-4">
            <motion.div
              className={`p-4 rounded-lg border flex items-center ${demoStep >= 1 ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <User className="w-5 h-5 mr-2" /> <strong>Step 1:</strong> Sign up or log in.
            </motion.div>

            <motion.div
              className={`p-4 rounded-lg border flex items-center ${demoStep >= 2 ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: demoStep >= 2 ? 1 : 0.5, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Building className="w-5 h-5 mr-2" /> <strong>Step 2:</strong> Fill in your company information.
            </motion.div>

            <motion.div
              className={`p-4 rounded-lg border flex items-center ${demoStep >= 3 ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: demoStep >= 3 ? 1 : 0.5, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-5 h-5 mr-2" /> <strong>Step 3:</strong> Add HR contacts individually or via CSV.
            </motion.div>

            <motion.div
              className={`p-4 rounded-lg border flex items-center ${demoStep >= 4 ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: demoStep >= 4 ? 1 : 0.5, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-5 h-5 mr-2" /> <strong>Step 4:</strong> Review all information and submit the registration.
            </motion.div>
          </motion.div>

          {/* ================= Sign Up Button ================= */}
          <motion.button
            variants={fadeInUp}
            onClick={() => navigate('/signup')}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Sign Up to Start Registration
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
