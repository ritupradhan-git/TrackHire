import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import AuthContext from '../context/AuthContext.jsx';
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
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
    login({ email, password });
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 pb-12 pt-28 text-slate-950 sm:px-6 lg:pt-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <Sparkles size={16} />
            Application command center
          </div>
          <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950">
            Welcome back to your hiring pipeline.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Keep every opportunity, follow-up, and interview signal organized in one focused workspace.
          </p>

          <div className="mt-10 max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Pipeline health</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-950">72% on track</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="grid gap-3 pt-5">
              {['Senior Frontend Engineer', 'Product Designer', 'Growth Analyst'].map((role, index) => (
                <div key={role} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{role}</p>
                    <p className="text-xs font-semibold text-slate-400">{index === 0 ? 'Interview' : index === 1 ? 'Applied' : 'Saved'}</p>
                  </div>
                  <div className="h-2 w-20 rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${index === 0 ? 'w-4/5 bg-blue-600' : index === 1 ? 'w-3/5 bg-amber-500' : 'w-2/5 bg-slate-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Sign in</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                Access your TrackHigher workspace securely.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
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
                    placeholder="Enter your password"
                    minLength="6"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Login
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <ShieldCheck size={15} />
            Secure workspace access for your job search data
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
