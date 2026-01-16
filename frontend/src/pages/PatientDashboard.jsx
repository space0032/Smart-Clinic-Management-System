import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Plus, User, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [doctors, setDoctors] = useState([]);

    // Form data for new booking
    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentDate: '',
        notes: ''
    });

    const navigate = useNavigate();
    const API_URL = 'http://localhost:8080/api/appointments';
    const DOCTORS_URL = 'http://localhost:8080/api/doctors';
    // We need an endpoint to get patient details by email or user ID to link them
    // For MVP, we'll assume we can filter appointments by patient name matching user name 
    // OR ideally, backend should handle "get my appointments". 
    // Since backend isn't authenticated per se (open APIs), we'll do a client-side filter for now or match by email if possible.

    useEffect(() => {
        const storedUser = localStorage.getItem('clinicUser');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchData(parsedUser);
    }, [navigate]);

    const fetchData = async (currentUser) => {
        try {
            const [apptRes, docRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(DOCTORS_URL)
            ]);

            // Client-side filtering for MVP (In real app, API should filter by logged-in patient)
            // Assuming Patient Name matches User Name for this simple integration
            const myAppointments = apptRes.data.filter(appt =>
                appt.patient && appt.patient.name === currentUser.name
            );

            setAppointments(myAppointments);
            setDoctors(docRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('clinicUser');
        navigate('/login');
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            // We need to find the patient ID associated with this user
            // This is a bit tricky without a direct link in the frontend user object.
            // Option: Fetch all patients and find one with matching email/name.
            const patientsRes = await axios.get('http://localhost:8080/api/patients');
            const myPatientProfile = patientsRes.data.find(p => p.email === user.email || p.name === user.name);

            if (!myPatientProfile) {
                alert("Could not find your patient profile. Please contact the clinic.");
                return;
            }

            const payload = {
                patientId: myPatientProfile.id,
                doctorId: formData.doctorId,
                appointmentDate: formData.appointmentDate,
                notes: formData.notes,
                status: 'SCHEDULED'
            };

            await axios.post(API_URL, payload);
            setShowBookingModal(false);
            setFormData({ doctorId: '', appointmentDate: '', notes: '' });
            fetchData(user);
            alert("Appointment booked successfully!");
        } catch (error) {
            console.error("Error booking appointment", error);
            alert("Failed to book appointment.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">MediCare Portal</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <User className="w-4 h-4" />
                            <span>{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Appointments</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage your upcoming and past visits</p>
                    </div>
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Book Appointment
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading your appointments...</div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No appointments found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                            You don't have any scheduled visits. Click the "Book Appointment" button to schedule one.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {appointments.map(appt => (
                            <div key={appt.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg text-center min-w-[70px]">
                                        <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase">
                                            {new Date(appt.appointmentDate).toLocaleDateString(undefined, { month: 'short' })}
                                        </div>
                                        <div className="text-xl font-bold text-primary-700 dark:text-primary-300">
                                            {new Date(appt.appointmentDate).getDate()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                                Dr. {appt.doctor?.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                                ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    appt.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span>•</span>
                                            <span>{appt.doctor?.specialization}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {/* Action buttons could go here (e.g., Cancel) */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Book Appointment</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Doctor</label>
                                <select
                                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
                                    value={formData.doctorId}
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                >
                                    <option value="">Choose a doctor...</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
                                    value={formData.appointmentDate}
                                    onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (Optional)</label>
                                <textarea
                                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Reason for visit..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBookAppointment}
                                className="flex-1 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
