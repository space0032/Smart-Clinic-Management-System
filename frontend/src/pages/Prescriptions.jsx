import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Plus, Search, Trash2, Eye, FileText } from 'lucide-react';

export default function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        diagnosis: '',
        medications: '',
        instructions: '',
        validDays: 30
    });

    const API_URL = 'http://localhost:8080/api/prescriptions';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prescRes, patientsRes, doctorsRes] = await Promise.all([
                axios.get(API_URL),
                axios.get('http://localhost:8080/api/patients'),
                axios.get('http://localhost:8080/api/doctors')
            ]);
            setPrescriptions(prescRes.data);
            setPatients(patientsRes.data);
            setDoctors(doctorsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setShowForm(false);
            setFormData({ patientId: '', doctorId: '', diagnosis: '', medications: '', instructions: '', validDays: 30 });
            fetchData();
        } catch (error) {
            console.error('Error creating prescription:', error);
            alert('Failed to create prescription');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this prescription?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting prescription:', error);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medications?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Prescriptions</h1>
                    <p className="text-slate-500 dark:text-slate-500">Manage patient prescriptions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Prescription
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by patient, doctor, or medication..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">New Prescription</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.patientId}
                            onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.doctorId}
                            onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Diagnosis"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg md:col-span-2 focus:ring-2 focus:ring-primary-400"
                            value={formData.diagnosis}
                            onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                        />
                        <textarea
                            required
                            placeholder="Medications (e.g., Paracetamol 500mg - 1 tablet 3x daily)"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg md:col-span-2 h-24 focus:ring-2 focus:ring-primary-400"
                            value={formData.medications}
                            onChange={e => setFormData({ ...formData, medications: e.target.value })}
                        />
                        <textarea
                            placeholder="Instructions (e.g., Take after meals)"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg md:col-span-2 h-20 focus:ring-2 focus:ring-primary-400"
                            value={formData.instructions}
                            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Valid for (days)"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.validDays}
                            onChange={e => setFormData({ ...formData, validDays: parseInt(e.target.value) })}
                        />
                        <div className="md:col-span-2 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 bg-slate-100 dark:bg-slate-700 rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">Create Prescription</button>
                        </div>
                    </form>
                </div>
            )}

            {/* View Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedPrescription(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Prescription</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-500">#{selectedPrescription.id?.substring(0, 8)}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedPrescription.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                {selectedPrescription.status}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-slate-500 dark:text-slate-400">Patient:</span><p className="font-medium">{selectedPrescription.patient?.name}</p></div>
                                <div><span className="text-slate-500 dark:text-slate-400">Doctor:</span><p className="font-medium">Dr. {selectedPrescription.doctor?.name}</p></div>
                            </div>
                            {selectedPrescription.diagnosis && (
                                <div><span className="text-sm text-slate-500 dark:text-slate-400">Diagnosis:</span><p className="mt-1 text-slate-800 dark:text-slate-100">{selectedPrescription.diagnosis}</p></div>
                            )}
                            <div><span className="text-sm text-slate-500 dark:text-slate-400">Medications:</span><pre className="mt-1 text-slate-800 dark:text-slate-100 whitespace-pre-wrap bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">{selectedPrescription.medications}</pre></div>
                            {selectedPrescription.instructions && (
                                <div><span className="text-sm text-slate-500 dark:text-slate-400">Instructions:</span><p className="mt-1 text-slate-800 dark:text-slate-100 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm">{selectedPrescription.instructions}</p></div>
                            )}
                            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div><span className="text-slate-500 dark:text-slate-400">Prescribed:</span><p>{selectedPrescription.prescribedDate ? new Date(selectedPrescription.prescribedDate).toLocaleDateString() : 'N/A'}</p></div>
                                <div><span className="text-slate-500 dark:text-slate-400">Valid Until:</span><p>{selectedPrescription.validUntil ? new Date(selectedPrescription.validUntil).toLocaleDateString() : 'N/A'}</p></div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedPrescription(null)} className="w-full mt-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 rounded-lg font-medium">Close</button>
                    </div>
                </div>
            )}

            {/* Prescriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 text-center text-slate-500 py-8">Loading prescriptions...</div>
                ) : filteredPrescriptions.length === 0 ? (
                    <div className="col-span-3 text-center text-slate-500 py-8">No prescriptions found</div>
                ) : (
                    filteredPrescriptions.map(prescription => (
                        <div key={prescription.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                        <Pill className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{prescription.patient?.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">Dr. {prescription.doctor?.name}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${prescription.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                    prescription.status === 'EXPIRED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {prescription.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">{prescription.medications}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                    {prescription.prescribedDate ? new Date(prescription.prescribedDate).toLocaleDateString() : ''}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedPrescription(prescription)} className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(prescription.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
