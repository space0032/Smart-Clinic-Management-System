import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrendingUp, Users, Calendar, DollarSign,
    BarChart3, PieChart, Activity, Download
} from 'lucide-react';

export default function Reports() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/reports/analytics');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!analytics) return;

        const headers = ["Category", "Metric", "Value"];
        const rows = [
            ["Overview", "Total Patients", analytics.totalPatients],
            ["Overview", "Total Doctors", analytics.totalDoctors],
            ["Overview", "Total Appointments", analytics.totalAppointments],
            ["Overview", "Total Bills", analytics.totalBills],
            ["Revenue", "Total Revenue", analytics.totalRevenue],
            ["Revenue", "Pending Revenue", analytics.pendingRevenue],
        ];

        // Add Monthly Revenue
        analytics.monthlyRevenue.forEach(m => {
            rows.push(["Monthly Revenue", m.month, m.revenue]);
        });

        // Add Appointment Status
        Object.entries(analytics.appointmentsByStatus).forEach(([status, count]) => {
            rows.push(["Appointment Status", status, count]);
        });

        // Add Top Doctors
        Object.entries(analytics.appointmentsByDoctor).forEach(([doc, count]) => {
            rows.push(["Top Doctors", doc, count]);
        });

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "clinic_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">Loading analytics...</div>;
    }

    if (!analytics) {
        return <div className="text-center text-red-500">Failed to load analytics</div>;
    }

    const statCards = [
        { title: 'Total Patients', value: analytics.totalPatients, icon: Users, color: 'bg-blue-500' },
        { title: 'Total Appointments', value: analytics.totalAppointments, icon: Calendar, color: 'bg-primary-500' },
        { title: 'Total Revenue', value: `$${Number(analytics.totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { title: 'Pending Revenue', value: `$${Number(analytics.pendingRevenue).toLocaleString()}`, icon: TrendingUp, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reports & Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Comprehensive clinic performance insights</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-xl`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Revenue Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monthly Revenue</h3>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {analytics.monthlyRevenue?.map((month, i) => {
                            const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => Number(m.revenue) || 1));
                            const height = maxRevenue > 0 ? (Number(month.revenue) / maxRevenue) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all hover:from-primary-700 hover:to-primary-500"
                                        style={{ height: `${Math.max(height, 5)}%` }}
                                    ></div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{month.month}</span>
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">${Number(month.revenue).toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Appointment Status Breakdown */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-secondary-600" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Appointment Status</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(analytics.appointmentsByStatus || {}).map(([status, count]) => {
                            const total = Object.values(analytics.appointmentsByStatus).reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                            const colors = {
                                'SCHEDULED': 'bg-yellow-500',
                                'CONFIRMED': 'bg-blue-500',
                                'COMPLETED': 'bg-green-500',
                                'CANCELLED': 'bg-red-500'
                            };
                            return (
                                <div key={status}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 dark:text-slate-300">{status}</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-100">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors[status] || 'bg-slate-500'} rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Appointments by Doctor */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Top Doctors</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(analytics.appointmentsByDoctor || {})
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([doctor, count], i) => (
                                <div key={doctor} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            {i + 1}
                                        </span>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{doctor}</span>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{count} appointments</span>
                                </div>
                            ))}
                        {Object.keys(analytics.appointmentsByDoctor || {}).length === 0 && (
                            <p className="text-slate-400 text-center py-4">No data available</p>
                        )}
                    </div>
                </div>

                {/* Appointments by Day of Week */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Busiest Days</h3>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => {
                            const fullDay = {
                                'MON': 'MONDAY', 'TUE': 'TUESDAY', 'WED': 'WEDNESDAY',
                                'THU': 'THURSDAY', 'FRI': 'FRIDAY', 'SAT': 'SATURDAY', 'SUN': 'SUNDAY'
                            }[day];
                            const count = analytics.appointmentsByDayOfWeek?.[fullDay] || 0;
                            const maxCount = Math.max(...Object.values(analytics.appointmentsByDayOfWeek || {}), 1);
                            const intensity = count > 0 ? Math.min(count / maxCount, 1) : 0;
                            return (
                                <div key={day} className="text-center">
                                    <div
                                        className="h-20 rounded-lg mb-2 flex items-end justify-center pb-2"
                                        style={{
                                            backgroundColor: `rgba(20, 184, 166, ${0.1 + intensity * 0.9})`,
                                        }}
                                    >
                                        <span className={`text-lg font-bold ${intensity > 0.5 ? 'text-white' : 'text-primary-700'}`}>
                                            {count}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
