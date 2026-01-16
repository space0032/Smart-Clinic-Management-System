import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Search, FileText, Plus, User } from 'lucide-react';

export default function MedicalRecords() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Doctors list for the form
    const [doctors, setDoctors] = useState([]);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: '',
        diagnosis: '',
        prescription: ''
    });

    useEffect(() => {
        fetchPatientsAndDoctors();
    }, []);

    const fetchPatientsAndDoctors = async () => {
        try {
            const [patRes, docRes] = await Promise.all([
                supabase.from('patients').select('id, name, contactNo'),
                supabase.from('doctors').select('id, name, specialization')
            ]);

            if (patRes.error) throw patRes.error;
            if (docRes.error) throw docRes.error;

            setPatients(patRes.data || []);
            setDoctors(docRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchRecords = async (patientId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('medical_records')
                .select(`
                    *,
                    doctor:doctors(id, name, specialization)
                `)
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        fetchRecords(patient.id);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;

        try {
            const { error } = await supabase
                .from('medical_records')
                .insert([{
                    patient_id: selectedPatient.id,
                    doctor_id: formData.doctorId,
                    diagnosis: formData.diagnosis,
                    prescription: formData.prescription
                }]);

            if (error) throw error;

            setShowForm(false);
            setFormData({ doctorId: '', diagnosis: '', prescription: '' });
            fetchRecords(selectedPatient.id);
        } catch (error) {
            console.error("Error adding record:", error);
            alert("Failed to add record");
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">

            {/* Patient List Sidebar */}
            <div className="w-1/3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">Select Patient</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center transition-colors ${selectedPatient?.id === patient.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${selectedPatient?.id === patient.id ? 'bg-indigo-200 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200' : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-300'}`}>
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className={`text-sm font-medium ${selectedPatient?.id === patient.id ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-slate-200'}`}>{patient.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{patient.contactNo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medical Records View */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col">
                {!selectedPatient ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500">
                        <FileText className="w-12 h-12 mb-2 opacity-50" />
                        <p>Select a patient to view medical records</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{selectedPatient.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">Medical History & Prescriptions</p>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Record
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
                            {showForm && (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-slate-700 mb-6">
                                    <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-4">New Medical Entry</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="dark:text-slate-200 block text-sm font-medium text-gray-700 mb-1">Diagnosing Doctor</label>
                                            <select
                                                required
                                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                value={formData.doctorId}
                                                onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="dark:text-slate-200 block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                                            <textarea
                                                required
                                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg h-20 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                placeholder="Enter clinical diagnosis..."
                                                value={formData.diagnosis}
                                                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="dark:text-slate-200 block text-sm font-medium text-gray-700 mb-1">Prescription</label>
                                            <textarea
                                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg h-20 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                placeholder="Medications, dosage, instructions..."
                                                value={formData.prescription}
                                                onChange={e => setFormData({ ...formData, prescription: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-red-600 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg font-medium transition-colors">Cancel</button>
                                            <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Record</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {loading ? (
                                <p className="text-center text-gray-500 dark:text-slate-400 mt-10">Loading history...</p>
                            ) : records.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-slate-400 mt-10">No medical records found for this patient.</p>
                            ) : (
                                <div className="space-y-4">
                                    {records.map(record => (
                                        <div key={record.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{record.diagnosis}</h4>
                                                <span className="text-xs text-gray-400 dark:text-slate-500">
                                                    {new Date(record.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-slate-300 mb-3 text-sm">{record.prescription}</p>
                                            <div className="pt-3 border-t border-gray-50 dark:border-slate-700 flex items-center text-xs text-gray-500 dark:text-slate-400">
                                                <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 px-2 py-1 rounded">Dr. {record.doctor?.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
