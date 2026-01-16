import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, ArrowRight, Heart, Shield, Clock, User } from 'lucide-react';
import axios from 'axios';

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'RECEPTIONIST'
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            const response = await axios.post(`http://localhost:8080${endpoint}`, formData);

            if (response.data.success) {
                localStorage.setItem('clinicUser', JSON.stringify(response.data.user));
                navigate('/');
            } else {
                setMessage('Error: ' + response.data.message);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Authentication failed';
            setMessage('Error: ' + errorMsg);
        }
        setLoading(false);
    };

    const features = [
        { icon: Heart, title: 'Patient Care', desc: 'Comprehensive patient management' },
        { icon: Shield, title: 'Secure Data', desc: 'Enterprise-grade security' },
        { icon: Clock, title: '24/7 Access', desc: 'Always available portal' },
    ];

    return (
        <div className="flex min-h-screen font-sans">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Activity className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">MediCare</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Modern Healthcare<br />Management System
                    </h1>
                    <p className="text-white/80 text-lg max-w-md">
                        Streamline your clinic operations with our comprehensive solution for patient care, scheduling, and billing.
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <Icon className="w-6 h-6 text-white/90 mb-2" />
                                    <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                                    <p className="text-white/60 text-xs mt-1">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative z-10 text-white/50 text-sm">
                    © 2026 MediCare. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-800">MediCare</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">
                            {isRegister ? 'Create Account' : 'Welcome back'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {isRegister ? 'Register to access the clinic portal' : 'Sign in to access your dashboard'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required={isRegister}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Dr. John Smith"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    placeholder="doctor@clinic.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isRegister && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="RECEPTIONIST">Receptionist</option>
                                </select>
                            </div>
                        )}

                        {message && (
                            <div className={`p-4 rounded-xl text-sm ${message.startsWith('Error')
                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                    : 'bg-green-50 text-green-600 border border-green-100'
                                }`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-500/25"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isRegister ? 'Create Account' : 'Sign In'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsRegister(!isRegister); setMessage(''); }}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                        </button>
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-400">
                        Smart Clinic Management System v1.0
                    </div>
                </div>
            </div>
        </div>
    );
}
