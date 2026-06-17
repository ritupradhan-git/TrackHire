import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, Sparkles, User } from 'lucide-react';
import AuthContext from '../context/AuthContext.jsx';
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect to dashboard if already authenticated
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      register({ name, email, password });
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 pb-12 pt-28 text-slate-950 sm:px-6 lg:pt-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="mx-auto w-full max-w-md lg:order-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                <Sparkles size={22} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Create account</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                Start tracking applications with a clean, focused workspace.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="name">
                  Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    placeholder="Alex Morgan"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    placeholder="Minimum 6 characters"
                    minLength="6"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="password2">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    placeholder="Repeat your password"
                    minLength="6"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Register
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden lg:block lg:order-1">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <Sparkles size={16} />
            Designed for focused job searches
          </div>
          <h2 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950">
            Build a sharper job search system from day one.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Track companies, role details, sources, notes, and statuses with the calm structure of a modern SaaS dashboard.
          </p>

          <div className="mt-10 grid max-w-xl gap-4">
            {[
              'Save every application in one polished workspace',
              'See progress by status without spreadsheet clutter',
              'Keep notes and source links close to each role',
            ].map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg shadow-slate-200/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-sm font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
