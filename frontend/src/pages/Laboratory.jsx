import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import {
    FlaskConical, Plus, Search, FileText, Activity, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

export default function Laboratory() {
    const [activeTab, setActiveTab] = useState('orders'); // orders, results, tests
    const [orders, setOrders] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);

    // New Order Form State
    const [newOrder, setNewOrder] = useState({
        patientId: '',
        doctorId: '',
        notes: ''
    });

    // Patients & Doctors for dropdowns (simplified - ideally fetch from API)
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const toast = useToast();

    useEffect(() => {
        fetchData();
        fetchDropdownData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders' || activeTab === 'results') {
                const response = await axios.get('http://localhost:8080/api/lab/orders');
                setOrders(response.data);
            } else if (activeTab === 'tests') {
                const response = await axios.get('http://localhost:8080/api/lab/tests');
                setTests(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [patientsRes, doctorsRes] = await Promise.all([
                axios.get('http://localhost:8080/api/patients?size=100'), // simplified
                axios.get('http://localhost:8080/api/doctors')
            ]);
            setPatients(patientsRes.data.content || []);
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error('Error fetching dropdowns:', error);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/lab/orders', newOrder);
            toast.show('Lab order created successfully', 'success');
            setShowOrderModal(false);
            fetchData();
            setNewOrder({ patientId: '', doctorId: '', notes: '' });
        } catch (error) {
            console.error('Create Order Error:', error);
            const msg = error.response?.data || 'Failed to create order';
            toast.show(typeof msg === 'string' ? msg : 'Failed to create order', 'error');
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            'IN_PROGRESS': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Laboratory</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage lab orders, results, and test catalog</p>
                </div>
                <button
                    onClick={() => setShowOrderModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
                >
                    <Plus className="w-4 h-4" />
                    New Lab Order
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'orders'
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    Lab Orders
                </button>
                <button
                    onClick={() => setActiveTab('tests')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'tests'
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    Test Catalog
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading...</div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {activeTab === 'orders' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Doctor</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                                {order.id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                                {order.patient?.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {order.doctor?.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                                    View Results
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                No lab orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'tests' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Test Name</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Normal Range</th>
                                        <th className="px-6 py-4">Units</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {tests.map((test) => (
                                        <tr key={test.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{test.code}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{test.name}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${test.price}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{test.normalRange}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{test.units}</td>
                                        </tr>
                                    ))}
                                    {tests.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                No tests in catalog
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* New Order Modal */}
            {showOrderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create Lab Order</h2>
                            <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Patient
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={newOrder.patientId}
                                    onChange={e => setNewOrder({ ...newOrder, patientId: e.target.value })}
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Doctor
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={newOrder.doctorId}
                                    onChange={e => setNewOrder({ ...newOrder, doctorId: e.target.value })}
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    rows="3"
                                    value={newOrder.notes}
                                    onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
                                    placeholder="Enter test requirements (e.g., CBC, Lipid Profile)"
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowOrderModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-primary-600/20"
                                >
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
