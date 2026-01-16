import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, Search,
    Stethoscope, Activity, Menu, X, BarChart3, Pill, FlaskConical
} from 'lucide-react';
import { getUser, NAV_ITEMS } from '../utils/permissions';
import { ToastContainer, useToast } from './Toast';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Toast notifications
    const toast = useToast();

    // Get current user and filter navigation by role
    const user = getUser();
    const userRole = user.role || 'RECEPTIONIST';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    // Icon mapping
    const iconMap = {
        '/': LayoutDashboard,
        '/patients': Users,
        '/doctors': Stethoscope,
        '/appointments': Calendar,
        '/medical-records': Activity,
        '/prescriptions': Pill,
        '/billing': FileText,
        '/reports': BarChart3,
        '/lab': FlaskConical,
        '/staff': Users,
        '/settings': Settings,
    };

    // Filter navigation based on user role
    const navigation = NAV_ITEMS
        .filter(item => item.roles.includes(userRole))
        .map(item => ({
            ...item,
            icon: iconMap[item.href] || LayoutDashboard
        }));

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 font-sans">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-sidebar dark:bg-slate-950 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-white/10 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && <span className="text-xl font-bold tracking-tight">MediCare</span>}
                    </div>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-sidebar border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-100 hidden lg:block"
                    >
                        {sidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                title={!sidebarOpen ? item.name : ''}
                            >
                                <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'} transition-transform group-hover:scale-110`} />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Sign Out */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => {
                            localStorage.removeItem('clinicUser');
                            navigate('/login');
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-white/5 transition-colors ${!sidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                        {sidebarOpen && "Sign Out"}
                    </button>
                    {sidebarOpen && (
                        <div className="mt-4 text-xs text-center text-slate-500">
                            v1.0.0
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            {navigation.find(n => n.href === location.pathname)?.name || 'Portal'}
                        </h1>
                        <p className="text-xs text-slate-500">Overview of clinic operations</p>
                    </div>

                    {/* Search Bar */}
                    <form
                        className="flex-1 max-w-md relative"
                        onSubmit={handleSearch}
                    >
                        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-primary-500 transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            placeholder="Search patients, doctors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </form>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{user?.role || 'Administrator'}</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        </div>
    );
};

export default Layout;
