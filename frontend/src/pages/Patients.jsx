import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNo: '',
        dateOfBirth: '',
        gender: 'Male',
        address: '',
        medicalHistory: ''
    });

    // Base API URL
    // Base API URL removed in favor of Supabase

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .order('name');

            if (error) throw error;
            setPatients(data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('patients')
                .insert([formData]);

            if (error) throw error;

            setShowForm(false);
            setFormData({
                name: '', email: '', contactNo: '', dateOfBirth: '',
                gender: 'Male', address: '', medicalHistory: ''
            });
            fetchPatients();
        } catch (error) {
            console.error("Error creating patient:", error);
            alert("Failed to create patient");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            const { error } = await supabase
                .from('patients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPatients();
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.contactNo && p.contactNo.includes(searchTerm))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Patients</h1>
                    <p className="text-gray-500 dark:text-slate-500">Manage patient records and history</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Patient
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search patients by name or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 dark:placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Add Patient Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">New Patient Registration</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Full Name" required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="email" placeholder="Email"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Contact No" required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                        />
                        <input
                            type="date" placeholder="Date of Birth"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                        <select
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        <input
                            type="text" placeholder="Address"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg md:col-span-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                        <textarea
                            placeholder="Medical History (Optional)"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg md:col-span-2 h-24 focus:ring-2 focus:ring-primary-400 focus:outline-none"
                            value={formData.medicalHistory} onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
                        />

                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button
                                type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-red-600 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                            >
                                Save Patient
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Patient List Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-500">Loading patients...</td></tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-500">No patients found.</td></tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{patient.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{patient.contactNo}<br /><span className="text-xs text-slate-400 dark:text-slate-500">{patient.email}</span></td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{patient.gender}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{patient.dateOfBirth}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(patient.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
