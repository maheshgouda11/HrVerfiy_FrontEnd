import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Search, Building, CheckCircle, Users, Star, Award, Clock, ArrowRight } from "lucide-react";
import { label, path } from "framer-motion/client";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      
      <section className="pt-24 pb-20 px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Trusted by 100+ companies worldwide
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-8"
            >
              Verify HR Contacts with
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Complete Trust
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Protect yourself from job scams with our comprehensive HR verification platform. 
              Instantly verify HR contacts and ensure your job search stays secure.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/Login"
                className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Verify HR Contact
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                to="/company"
                className="flex items-center px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold shadow-lg border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Register Your Company
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How HRVerify Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to verify HR contacts and protect yourself from job scams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8" />,
                title: "Search & Verify",
                description: "Enter an HR email or phone number to instantly check if it's verified by the company.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Building className="w-8 h-8" />,
                title: "Company Verified",
                description: "All HR contacts are authenticated directly with companies before being listed in our database.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Stay Protected",
                description: "Get instant verification results and avoid falling victim to employment scams and fraud.",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="h-full p-8 bg-white rounded-2xl border border-slate-200 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Our platform has helped thousands of job seekers stay safe while finding their dream jobs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Building className="w-6 h-6" />, number: "100 +", label: "Verified Companies" },
              { icon: <Users className="w-6 h-6" />, number: "50+", label: "HR Contacts" },
              { icon: <Star className="w-6 h-6" />, number: "99.9%", label: "Accuracy Rate" },
              { icon: <Clock className="w-6 h-6" />, number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-pointer"
              >
                <div className="inline-flex p-3 rounded-full bg-white/10 text-blue-200 mb-4 group-hover:bg-white/20 transition-colors duration-200">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-slate-700 max-w-4xl mx-auto mb-8 leading-relaxed">
              "HRVerify saved me from a sophisticated job scam. The verification process is instant and gave me complete peace of mind during my job search."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">SM</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Sachin HV</div>
                <div className="text-slate-500">Software Engineer at TechCorp</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Award className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Verify HR Contacts Safely?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who trust HRVerify to keep their job search secure and scam-free.
            </p>
            <Link 
              to="/candidate"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              Start Verifying Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HRVerify</span>
              </div>
              <p className="text-slate-400 max-w-md mb-4">
                The most trusted platform for HR contact verification. Protecting job seekers from employment scams since 2025.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
               {[
                 { label: "About Us", path: "/about" },
                 { label: "Careers", path: "/careers" },
                 { label: "Contact", path: "/contact" }
              ].map((item) => (
             <li key={item.label}>
             <Link
              to={item.path}
              className="hover:text-white transition-colors duration-200"
              >
             {item.label}
             </Link>
             </li>
             ))}
            </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                {[
                  {label:"Privacy Policy",path:""},{label:"Terms of Service",path:""},{ label:"Cookie Policy",path:""}].map((item) => (
                  <li key={item.label}>
                    <Link
              to={item.path}
              className="hover:text-white transition-colors duration-200"
              >
             {item.label}
             </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} HRVerify. Built for job safety and security.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}