import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Font Awesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarDays, 
  faChartLine, 
  faArrowRight, 
  faLayerGroup, 
  faEnvelope, 
  faTable, 
  faClock, 
  faUsers, 
  faBolt,
  faCirclePlay
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans selection:bg-blue-100">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
      </div>

      

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <MotionDiv 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center flex flex-col items-center"
          >
            <MotionDiv variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Trusted by students and job seekers
            </MotionDiv>

            <MotionH1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl leading-[1.1]">
              Track every application,<br />
              land your <span className="text-blue-600">next opportunity.</span>
            </MotionH1>

            <MotionP variants={itemVariants} className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
              Track applications, interviews, deadlines, follow-ups and offers from one intelligent workspace.
            </MotionP>

            <MotionDiv variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
              <Link to="/register" className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-3">
                Start Tracking Free <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <button className="px-8 py-4 bg-white border border-gray-200 text-gray-900 text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-3">
                <FontAwesomeIcon icon={faCirclePlay} className="text-blue-600" /> Watch Demo
              </button>
            </MotionDiv>
          </MotionDiv>

          {/* FLOATING PRODUCT ELEMENTS */}
          <div className="hidden xl:block">
            <MotionDiv 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-20 left-0 bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-xl w-56 -rotate-6"
            >
              <div className="text-xs font-bold text-yellow-700 mb-2">Follow up with Amazon</div>
              <div className="text-[10px] text-yellow-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} /> Tomorrow 11:00 AM
              </div>
            </MotionDiv>

            <MotionDiv 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-10 right-0 bg-white p-5 rounded-3xl border border-gray-200 shadow-xl w-64 rotate-3"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FontAwesomeIcon icon={faCalendarDays} size="lg" />
                </div>
                <div>
                  <div className="text-sm font-bold">Google Interview</div>
                  <div className="text-[10px] text-gray-400">Friday 2:00 PM</div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl font-extrabold mb-4">Everything you need to manage your job hunt</h2>
          <p className="text-gray-500 text-lg">From applications to offers. One place for everything.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: faLayerGroup, color: "text-blue-600", title: "Smart Tracker", desc: "A kanban-style dashboard to track every stage of the process." },
            { icon: faTable, color: "text-green-600", title: "Excel Import", desc: "Switching from a sheet? Upload your existing CSV instantly." },
            { icon: faClock, color: "text-purple-600", title: "Deadline Mgmt", desc: "Never miss a technical assessment or an application window again." },
            { icon: faUsers, color: "text-orange-600", title: "Interview Prep", desc: "Track every round, interviewer names, and feedback notes." },
            { icon: faChartLine, color: "text-pink-600", title: "Analytics", desc: "Monitor your success rates and find out which resume works best." },
            { icon: faBolt, color: "text-yellow-600", title: "Automations", desc: "Get reminders before important follow-up dates via email." },
          ].map((feat, i) => (
            <div key={i} className="group p-8 rounded-[32px] bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={feat.icon} className={`${feat.color} text-xl`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Your next offer starts with<br /> better organization.</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of job seekers managing their careers with TrackHigher.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-10 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-3 justify-center">
                Start Free Now <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link to="/dashboard" className="px-10 py-4 bg-slate-800 text-white text-lg font-bold rounded-2xl hover:bg-slate-700 transition-all">View Dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold mb-6">TrackHigher</div>
            <div className="flex gap-4 text-gray-400">
               <FontAwesomeIcon icon={faLinkedin} size="lg" className="hover:text-blue-600 cursor-pointer transition-colors" />
               <FontAwesomeIcon icon={faEnvelope} size="lg" className="hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>
          {/* Footer columns remain same... */}
        </div>
      </footer>
    </div>
  );
};

export default Home;
