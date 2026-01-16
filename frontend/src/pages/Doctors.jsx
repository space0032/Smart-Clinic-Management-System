import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Plus, Search, Trash2, Edit2, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import ScheduleEditor from '../components/ScheduleEditor';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [showScheduleEditor, setShowScheduleEditor] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: 'General',
        experienceYears: '',
        contactNo: '',
        availability: ''
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select('*')
                .order('name');

            if (error) throw error;
            setDoctors(data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('doctors')
                .insert([formData]);

            if (error) throw error;

            setShowForm(false);
            setFormData({
                name: '', email: '', specialization: 'General',
                experienceYears: '', contactNo: '', availability: ''
            });
            fetchDoctors();
        } catch (error) {
            console.error("Error creating doctor:", error);
            alert("Failed to create doctor");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            const { error } = await supabase
                .from('doctors')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchDoctors();
        } catch (error) {
            console.error("Error deleting doctor:", error);
        }
    };

    // ScheduleEditor Handling (Assuming doctor object has availability/schedule fields directly or relates to another table)
    // For now, based on schema, 'availability' is a text field in doctors table. Refactoring to update that.

    const handleOpenSchedule = (doctor) => {
        setSelectedDoctor(doctor);
        setShowScheduleEditor(true);
    };

    const handleSaveSchedule = async (id, updatedDoctor) => {
        try {
            // Remove id from update payload if present
            const { id: _, ...updates } = updatedDoctor;

            const { error } = await supabase
                .from('doctors')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            setShowScheduleEditor(false);
            fetchDoctors();
        } catch (error) {
            console.error("Error updating schedule:", error);
            alert("Failed to update schedule");
        }
    };

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Doctors</h1>
                    <p className="text-gray-500 dark:text-slate-400">Manage medical staff and schedules</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Doctor
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">New Doctor Registration</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Dr. Full Name" required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="email" placeholder="Email" required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Specialization (e.g. Cardiology)" required
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                        />
                        <input
                            type="number" placeholder="Experience (Years)"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Contact No"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Availability Info (Optional)"
                            className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-400"
                            value={formData.availability} onChange={e => setFormData({ ...formData, availability: e.target.value })}
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
                                Save Doctor
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid View for Doctors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-slate-500 dark:text-slate-400 col-span-3 text-center">Loading doctors...</div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-slate-500 dark:text-slate-400 col-span-3 text-center">No doctors found.</div>
                ) : (
                    filteredDoctors.map((doc) => (
                        <div key={doc.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                                <Stethoscope className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{doc.name}</h3>
                            <span className="inline-block px-3 py-1 bg-secondary-50 dark:bg-indigo-900/30 text-secondary-700 dark:text-indigo-300 rounded-full text-xs font-medium mt-2 border border-secondary-100 dark:border-indigo-800">
                                {doc.specialization}
                            </span>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">{doc.experienceYears} Years Exp.</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{doc.email}</p>

                            <div className="flex gap-2 mt-6 w-full">
                                <button
                                    onClick={() => handleOpenSchedule(doc)}
                                    className="flex-1 py-2 text-primary-700 dark:text-teal-300 bg-primary-50 dark:bg-teal-900/30 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-teal-900/50 transition-colors flex items-center justify-center"
                                >
                                    <CalendarIcon className="w-3 h-3 mr-1" /> Schedule
                                </button>
                                <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showScheduleEditor && selectedDoctor && (
                <ScheduleEditor
                    doctor={selectedDoctor}
                    onClose={() => setShowScheduleEditor(false)}
                    onSave={handleSaveSchedule}
                />
            )}
        </div>
    );
}
