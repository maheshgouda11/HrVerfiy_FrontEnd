import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Award, Target, CheckCircle, ArrowRight } from "lucide-react";

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

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-8"
            >
              About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HRVerify</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              We're on a mission to make job searching safer by providing instant verification 
              of HR contacts and protecting job seekers from employment scams.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Every year, thousands of job seekers fall victim to employment scams that steal personal 
                information, money, and hope. We believe everyone deserves a safe job search experience.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                HRVerify was founded to bridge the trust gap between job seekers and legitimate employers 
                by providing instant verification of HR contacts through our comprehensive database.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Trust & Security First</div>
                  <div className="text-slate-600">Every verification is backed by company authentication</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why We Started HRVerify</h3>
                <div className="space-y-4">
                  {[
                    "Job scams increased by 300% in recent years",
                    "Millions lost to fake employment opportunities",
                    "No reliable way to verify HR contacts existed",
                    "Job seekers needed a trusted verification platform"
                  ].map((point, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do at HRVerify
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Security First",
                description: "We prioritize the security and privacy of all user data with enterprise-grade protection.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Focused",
                description: "Building a safer job market benefits everyone - job seekers, employers, and society.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Excellence",
                description: "We maintain the highest standards of accuracy and reliability in our verification process.",
                color: "from-purple-500 to-pink-500"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.color} text-white mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to making job searching safer for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maheshgouda Patil",
                role: "CEO & Founder",
                bio: "Former HR executive with 15+ years of experience in talent acquisition and employment security.",
                initials: "MP"
              },
              {
                name: "Sunilgouda Patil",
                role: "CTO",
                bio: "Security expert and full-stack developer passionate about building trust through technology.",
                initials: "SP"
              },
              {
                name: "Mallkajigouda Patil",
                role: "Head of Operations",
                bio: "Operations specialist focused on scaling verification processes and maintaining data quality.",
                initials: "MP"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">{member.initials}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{member.name}</h3>
                <div className="text-blue-600 font-medium mb-4">{member.role}</div>
                <p className="text-slate-600 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
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
            <Target className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Help us build a safer job market for everyone. Whether you're a job seeker or employer, 
              you can be part of the solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/candidate"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                Start Verifying
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                to="/company"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                Register Company
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}