import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, Clock, CreditCard, Plus } from 'lucide-react';

export default function Billing() {
    const [bills, setBills] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        appointmentId: '',
        amount: ''
    });

    const API_URL = 'http://localhost:8080/api/bills';
    const APPOINTMENTS_URL = 'http://localhost:8080/api/appointments';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [billsRes, apptsRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(APPOINTMENTS_URL)
            ]);
            setBills(billsRes.data);
            // Only show completed appointments that don't have bills yet (logic simplified for now)
            setAppointments(apptsRes.data);
        } catch (error) {
            console.error("Error fetching billing data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            // Find patientId from appointment
            const appointment = appointments.find(a => a.id === formData.appointmentId);
            if (!appointment) return;

            await axios.post(API_URL, {
                appointmentId: formData.appointmentId,
                patientId: appointment.patient.id,
                amount: parseFloat(formData.amount)
            });

            setShowForm(false);
            setFormData({ appointmentId: '', amount: '' });
            fetchData();
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Failed to create invoice");
        }
    };

    const handlePayment = async (id) => {
        const method = prompt("Enter payment method (Cash, Card, UPI):", "Cash");
        if (!method) return;

        try {
            await axios.put(`${API_URL}/${id}/pay?method=${method}`);
            fetchData();
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Billing & Invoices</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage payments and revenue</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Generate Invoice
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">${bills.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-green-600 dark:text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Pending Amount</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">${bills.filter(b => b.status === 'PENDING' || b.status === 'OVERDUE').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</p>
                        </div>
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg text-yellow-600 dark:text-yellow-400">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Unpaid Invoices</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{bills.filter(b => b.status !== 'PAID').length}</p>
                        </div>
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-red-600 dark:text-red-400">
                            <CreditCard className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 w-full md:w-1/2 mx-auto">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Create New Invoice</h2>
                    <form onSubmit={handleCreateInvoice} className="space-y-4">
                        <div>
                            <label className="dark:text-slate-200 block text-sm font-medium text-gray-700 mb-1">Select Appointment</label>
                            <select
                                required
                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"
                                value={formData.appointmentId}
                                onChange={e => setFormData({ ...formData, appointmentId: e.target.value })}
                            >
                                <option value="">Choose Appointment...</option>
                                {appointments.map(appt => (
                                    <option key={appt.id} value={appt.id}>
                                        {new Date(appt.appointmentDate).toLocaleDateString()} - {appt.patient.name} (Dr. {appt.doctor.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="dark:text-slate-200 block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number" step="0.01" required
                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-red-600 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg font-medium transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Generate Bill</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Bills Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Invoice ID</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Patient</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Date</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Amount</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading bills...</td></tr>
                        ) : bills.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4 text-gray-500 dark:text-slate-400">No invoices found.</td></tr>
                        ) : (
                            bills.map(bill => (
                                <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-slate-400">#{bill.id.substring(0, 8)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">{bill.patient?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                                        {bill.paymentDate
                                            ? new Date(bill.paymentDate).toLocaleDateString()
                                            : bill.appointment?.appointmentDate
                                                ? new Date(bill.appointment.appointmentDate).toLocaleDateString()
                                                : 'Pending'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-slate-100">${bill.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            bill.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {bill.status !== 'PAID' && (
                                            <button
                                                onClick={() => handlePayment(bill.id)}
                                                className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        {bill.status === 'PAID' && <span className="text-xs text-green-600 dark:text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Paid</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
