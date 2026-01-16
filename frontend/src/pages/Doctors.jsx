import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, Edit2, Stethoscope } from 'lucide-react';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialization: 'General',
        experienceYears: '',
        contactNo: '',
        availabilitySchedule: ''
    });

    const API_URL = 'http://localhost:8080/api/doctors';

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(API_URL);
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setShowForm(false);
            setFormData({
                name: '', email: '', specialization: 'General',
                experienceYears: '', contactNo: '', availabilitySchedule: ''
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
            await axios.delete(`${API_URL}/${id}`);
            fetchDoctors();
        } catch (error) {
            console.error("Error deleting doctor:", error);
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
                    <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
                    <p className="text-gray-500">Manage medical staff and schedules</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Doctor
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">New Doctor Registration</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Dr. Full Name" required
                            className="p-2 border rounded-lg"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="email" placeholder="Email" required
                            className="p-2 border rounded-lg"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Specialization (e.g. Cardiology)" required
                            className="p-2 border rounded-lg"
                            value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                        />
                        <input
                            type="number" placeholder="Experience (Years)"
                            className="p-2 border rounded-lg"
                            value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Contact No"
                            className="p-2 border rounded-lg"
                            value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Schedule (e.g. Mon-Fri 9-5)"
                            className="p-2 border rounded-lg"
                            value={formData.availabilitySchedule} onChange={e => setFormData({ ...formData, availabilitySchedule: e.target.value })}
                        />

                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button
                                type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
                    <div className="text-gray-500 col-span-3 text-center">Loading doctors...</div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-gray-500 col-span-3 text-center">No doctors found.</div>
                ) : (
                    filteredDoctors.map((doc) => (
                        <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <Stethoscope className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mt-2">
                                {doc.specialization}
                            </span>
                            <p className="text-gray-500 text-sm mt-3">{doc.experienceYears} Years Exp.</p>
                            <p className="text-gray-400 text-xs mt-1">{doc.email}</p>

                            <div className="flex gap-2 mt-6 w-full">
                                <button className="flex-1 py-2 text-indigo-600 bg-indigo-50 rounded-lg text-sm font-medium hover:bg-indigo-100">
                                    View Profile
                                </button>
                                <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
