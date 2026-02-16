import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx'; // To check if the user is logged in

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Shapes / Subtle Texture (Optional - adjust as desired) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-white -z-10 opacity-75"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto py-12 sm:py-20">
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up">
          TrackHigher
        </h1>
        <p className="text-2xl text-gray-700 mb-10 leading-relaxed animate-fade-in-up animation-delay-300">
          Your ultimate companion for a streamlined job application journey.
          Effortlessly manage, track, and conquer your career goals.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up animation-delay-600">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-10 py-4 bg-indigo-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-10 py-4 bg-indigo-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 text-indigo-700 bg-transparent border-2 border-indigo-600 text-xl font-bold rounded-full hover:bg-indigo-50 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Optional: Feature Showcase Section (Slightly less prominent) */}
      <div className="relative z-10 max-w-5xl mx-auto mt-20 pt-12 border-t border-gray-200 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-up animation-delay-900">
          Why Choose TrackHigher?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition duration-300 animate-fade-in-up animation-delay-1200">
            <div className="text-indigo-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Organize Your Applications</h3>
            <p className="text-gray-600">
              Keep all your job applications, statuses, and details in one clean, accessible place. Never miss an update.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition duration-300 animate-fade-in-up animation-delay-1500">
            <div className="text-indigo-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Stay On Top of Deadlines</h3>
            <p className="text-gray-600">
              Easily track application dates, interview schedules, and follow-up reminders.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition duration-300 animate-fade-in-up animation-delay-1800">
            <div className="text-indigo-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gain Insights & Success</h3>
            <p className="text-gray-600">
              Understand your application patterns and improve your strategy for higher success rates.
            </p>
          </div>
        </div>
      </div>

      {/* Footer (Optional, you might have a global footer) */}
      <footer className="relative z-10 mt-20 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TrackHigher. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;