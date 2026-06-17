import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRightFromBracket, 
  faUserCircle, 
  faTableList, 
  faRocket,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add shadow and blur effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', path: '/#features', icon: faRocket },
    { name: 'Dashboard', path: '/dashboard', icon: faTableList },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 h-20 flex items-center ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm">
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <span>Track<span className="text-blue-600">Higher</span></span>
        </Link>

        {/* CENTER NAVIGATION (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
                location.pathname === link.path ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE (Auth State) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 text-xl" />
                <span className="text-sm font-bold">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-rose-600 transition-colors"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-gray-800"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-gray-100" />
          {user ? (
            <button onClick={logout} className="text-left text-lg font-bold text-rose-600">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-lg font-bold text-gray-800">Login</Link>
              <Link to="/register" className="text-lg font-bold text-blue-600">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
