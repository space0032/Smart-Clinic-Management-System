import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Activity, Clock } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        appointmentsToday: 0,
        pendingAppointments: 0,
        totalRevenue: 0,
        pendingBills: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentAppointments, setRecentAppointments] = useState([]);

    // Get logged in user
    const user = JSON.parse(localStorage.getItem('clinicUser') || '{}');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, appointmentsRes] = await Promise.all([
                axios.get('http://localhost:8080/api/stats/dashboard'),
                axios.get('http://localhost:8080/api/appointments')
            ]);
            setStats(statsRes.data);
            // Get recent 5 appointments
            setRecentAppointments(appointmentsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Patients',
            value: stats.totalPatients.toLocaleString(),
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Appointments Today',
            value: stats.appointmentsToday,
            change: `${stats.pendingAppointments} pending`,
            icon: Calendar,
            color: 'text-primary-600',
            bg: 'bg-primary-50'
        },
        {
            title: 'Total Revenue',
            value: `$${Number(stats.totalRevenue).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            title: 'Active Doctors',
            value: stats.totalDoctors,
            change: 'On duty',
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    if (loading) {
        return <div className="text-center text-slate-500 dark:text-slate-400 py-12">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Role-Based Welcome Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold">
                    Welcome back, {user.name || 'User'}! 👋
                </h1>
                <p className="text-white/80 mt-1">
                    {user.role === 'ADMIN' && 'You have full access to manage the clinic system.'}
                    {user.role === 'DOCTOR' && 'View your scheduled appointments and patient records.'}
                    {user.role === 'RECEPTIONIST' && 'Manage appointments, patients, and billing.'}
                    {!user.role && 'Here\'s an overview of today\'s clinic operations.'}
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {user.role || 'STAFF'}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            {stat.change && (
                                <div className="mt-4 flex items-center text-sm">
                                    <span className="font-medium text-slate-600 dark:text-slate-300">{stat.change}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Appointments */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Appointments</h3>
                        <a href="/appointments" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    <th className="pb-4">Patient</th>
                                    <th className="pb-4">Doctor</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="space-y-4">
                                {recentAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-slate-400 dark:text-slate-500">No appointments yet</td>
                                    </tr>
                                ) : (
                                    recentAppointments.map((appt, i) => (
                                        <tr key={i} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="py-3 font-medium text-slate-700 dark:text-slate-200">{appt.patient?.name || 'N/A'}</td>
                                            <td className="py-3 text-slate-500 dark:text-slate-400 text-sm">{appt.doctor?.name || 'N/A'}</td>
                                            <td className="py-3 text-slate-500 dark:text-slate-400 text-sm">
                                                {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${appt.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                                                    appt.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700' :
                                                        appt.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                                                            'bg-yellow-50 text-yellow-700'
                                                    }`}>
                                                    {appt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions & Stats */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Quick Actions</h3>
                    <div className="space-y-3 flex-1">
                        <a href="/patients" className="w-full py-3 px-4 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center">
                            <Users className="w-5 h-5 mr-2" /> Register New Patient
                        </a>
                        <a href="/appointments" className="w-full py-3 px-4 bg-secondary-50 dark:bg-indigo-900/30 text-secondary-700 dark:text-indigo-300 font-medium rounded-xl hover:bg-secondary-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center">
                            <Calendar className="w-5 h-5 mr-2" /> Book Appointment
                        </a>
                        <a href="/billing" className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center justify-center">
                            <DollarSign className="w-5 h-5 mr-2" /> Generate Invoice
                        </a>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-slate-500 dark:text-slate-400">Pending Bills</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">${Number(stats.pendingBills).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 dark:text-slate-400">System Status</span>
                            <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
