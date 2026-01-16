import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Save, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [saved, setSaved] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: true,
        compactView: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('clinicUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSave = () => {
        // Save settings to localStorage
        localStorage.setItem('clinicSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Profile</h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name || 'User'}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{user?.email || 'email@clinic.com'}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                            {user?.role || 'STAFF'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Push Notifications</p>
                            <p className="text-sm text-slate-400">Receive in-app notifications</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <span className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.notifications ? 'left-6' : 'left-0.5'}`}></span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Email Alerts</p>
                            <p className="text-sm text-slate-400">Get updates via email</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.emailAlerts ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <span className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.emailAlerts ? 'left-6' : 'left-0.5'}`}></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Appearance</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                Dark Mode
                            </p>
                            <p className="text-sm text-slate-400">Toggle between light and dark theme</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <span className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${isDark ? 'left-6' : 'left-0.5'}`}></span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">Compact View</p>
                            <p className="text-sm text-slate-400">Reduce spacing for more content</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, compactView: !settings.compactView })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.compactView ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <span className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.compactView ? 'left-6' : 'left-0.5'}`}></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Security</h2>
                </div>

                <div className="space-y-4">
                    <button className="w-full py-3 px-4 text-left bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                        <p className="font-medium text-slate-700 dark:text-slate-200">Change Password</p>
                        <p className="text-sm text-slate-400">Update your login credentials</p>
                    </button>
                    <button className="w-full py-3 px-4 text-left bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                        <p className="text-sm text-red-400">Permanently remove your account</p>
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                    <Save className="w-5 h-5" />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
