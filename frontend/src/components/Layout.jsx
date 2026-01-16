import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, Search,
    Stethoscope, Activity, Menu, X, BarChart3, Pill
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
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-sidebar text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
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
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-slate-800">
                            {navigation.find(n => n.href === location.pathname)?.name || 'Portal'}
                        </h1>
                        <p className="text-xs text-slate-500">Overview of clinic operations</p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-12 relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search patients, doctors, records..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* User Profile */}
                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-slate-800">Dr. Sarah Smith</p>
                            <p className="text-xs text-primary-600 font-medium">Chief Physician</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-0.5 cursor-pointer hover:shadow-lg transition-shadow">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                                SS
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8 relative">
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
