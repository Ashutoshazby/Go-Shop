import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, register } from '../redux/slices/authSlice.js';
import { api } from '../services/api.js';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const submit = async (event) => {
    event.preventDefault();
    await dispatch(login(form)).unwrap();
    navigate(params.get('redirect') || '/profile');
  };
  return <AuthShell title="Welcome back" copy="Sign in to track orders, manage wishlist, and checkout faster." error={error}>
    <form onSubmit={submit} className="grid gap-4">
      <input className="input" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-primary" disabled={loading}>Login</button>
      <Link className="text-sm font-bold text-accent" to="/forgot-password">Forgot password?</Link>
      <p className="text-sm">New here? <Link className="font-bold text-accent" to={`/register${params.get('redirect') ? `?redirect=${encodeURIComponent(params.get('redirect'))}` : ''}`}>Create account</Link></p>
    </form>
  </AuthShell>;
};

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const submit = async (event) => {
    event.preventDefault();
    await dispatch(register(form)).unwrap();
    navigate(params.get('redirect') || '/profile');
  };
  return <AuthShell title="Create your account" copy="Unlock wishlist, recently viewed products, and smooth checkout.">
    <form onSubmit={submit} className="grid gap-4">
      <input className="input" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn-primary">Register</button>
      <p className="text-sm">Already a member? <Link className="font-bold text-accent" to={`/login${params.get('redirect') ? `?redirect=${encodeURIComponent(params.get('redirect'))}` : ''}`}>Login</Link></p>
    </form>
  </AuthShell>;
};

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    await api.post('/auth/forgot-password', { email });
    setDone(true);
  };
  return <AuthShell title="Reset password" copy="Enter your email and we will send reset instructions.">
    <form onSubmit={submit} className="grid gap-4">
      <input className="input" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
      <button className="btn-primary">Send reset link</button>
      {done && <p className="rounded-md bg-green-100 p-3 text-sm font-bold text-green-700">Reset instructions sent if the email exists.</p>}
    </form>
  </AuthShell>;
};

const AuthShell = ({ title, copy, error, children }) => (
  <div className="container-padded grid min-h-[calc(100vh-8rem)] items-center py-12 md:grid-cols-2">
    <div className="hidden pr-12 md:block">
      <p className="text-sm font-black uppercase text-accent">Go Shop account</p>
      <h1 className="mt-3 text-5xl font-black">{title}</h1>
      <p className="mt-4 max-w-md text-slate-600 dark:text-slate-300">{copy}</p>
    </div>
    <div className="surface rounded-lg p-6 md:p-8">
      <h2 className="mb-6 text-2xl font-black md:hidden">{title}</h2>
      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
      {children}
    </div>
  </div>
);
