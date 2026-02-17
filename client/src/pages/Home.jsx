import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">

      {/* Soft Background Blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-gray-200 shadow-2xl rounded-3xl p-12 max-w-4xl w-full">

          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Track<span className="text-indigo-600">Higher</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            Manage, organize, and conquer your job applications with a
            beautifully simple dashboard built for ambitious professionals.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-10 py-4 bg-black text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-105 transition duration-300"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="px-10 py-4 border border-gray-300 text-gray-800 text-lg font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why TrackHigher?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-xl mb-6">
              📂
            </div>
            <h3 className="text-xl font-semibold mb-3">Organize Applications</h3>
            <p className="text-gray-600">
              Store all job details, statuses, and notes in one smart and
              minimal dashboard.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-xl mb-6">
              ⏰
            </div>
            <h3 className="text-xl font-semibold mb-3">Never Miss Deadlines</h3>
            <p className="text-gray-600">
              Smart reminders and timelines ensure every opportunity is
              followed up on time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center bg-pink-100 text-pink-600 rounded-xl mb-6">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
            <p className="text-gray-600">
              Analyze patterns and improve your job strategy with intelligent
              tracking.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center pb-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} TrackHigher. Crafted for achievers.
      </footer>
    </div>
  );
};

export default Home;