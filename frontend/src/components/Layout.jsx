import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Patients', href: '/patients', icon: Users },
        { name: 'Doctors', href: '/doctors', icon: Users },
        { name: 'Appointments', href: '/appointments', icon: Calendar },
        { name: 'Records', href: '/medical-records', icon: FileText },
        { name: 'Billing', href: '/billing', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200">
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <span className="text-xl font-bold text-indigo-600">Smart Clinic</span>
                </div>
                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                    <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="flex items-center justify-between px-8 bg-white border-b border-gray-200 h-16">
                    <h1 className="text-lg font-semibold text-gray-800">
                        {navigation.find(n => n.href === location.pathname)?.name || 'Portal'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Welcome, Dr. Smith</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            DS
                        </div>
                    </div>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
