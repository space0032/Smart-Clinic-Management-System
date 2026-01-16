import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Try to sign in with OTP (Magic Link)
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: 'http://localhost:5173'
            }
        });

        if (error) {
            setMessage('Error: ' + error.message);
        } else {
            setMessage('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Clinic Portal</h2>
                <p className="mb-6 text-center text-gray-500">Sign in to manage your clinic</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 text-sm rounded-lg ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Sending Magic Link...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Powered by Smart Clinic System v1.0
                </div>
            </div>
        </div>
    );
}
