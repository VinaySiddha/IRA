import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    role: 'author',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.institution)
      newErrors.institution = 'Institution is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        institution: formData.institution,
        role: formData.role,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
      {/* Floating shapes */}
      <div className="absolute top-20 right-10 w-48 h-48 bg-primary/5 rounded-full animate-float-slow blur-xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/5 rounded-full animate-float-medium blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-border/50 p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-black gradient-text inline-block mb-2">IRA</h1>
            </Link>
            <p className="text-text-muted text-sm">Create your research account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Dr. Jane Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@university.edu"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Input
              label="Institution / Affiliation"
              type="text"
              name="institution"
              placeholder="University / Research Lab"
              icon={Building2}
              value={formData.institution}
              onChange={handleChange}
              error={errors.institution}
              required
            />

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'author', label: 'Author', desc: 'Submit papers' },
                  { value: 'reviewer', label: 'Reviewer', desc: 'Review papers' },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: role.value })
                    }
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                      ${
                        formData.role === role.value
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    <p className="font-semibold text-sm text-text">{role.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              icon={UserPlus}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted uppercase font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
