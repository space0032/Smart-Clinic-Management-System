import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, User, Stethoscope, Clock, FileText, Pill, ChevronRight } from 'lucide-react';

export default function PatientPortal() {
    const [activeTab, setActiveTab] = useState('search');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');

    const user = JSON.parse(localStorage.getItem('clinicUser') || '{}');

    useEffect(() => {
        fetchDoctors();
        if (user.id) {
            fetchMyAppointments();
            fetchMyPrescriptions();
        }
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/doctors');
            setDoctors(res.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchMyAppointments = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/appointments');
            // Filter appointments for current user (patient)
            setAppointments(res.data.filter(a => a.patient?.email === user.email));
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchMyPrescriptions = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/prescriptions');
            setPrescriptions(res.data.filter(p => p.patient?.email === user.email));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedDoctor || !bookingDate) {
            alert('Please select a doctor and date');
            return;
        }
        setLoading(true);
        try {
            // Find patient by email 
            const patientsRes = await axios.get('http://localhost:8080/api/patients');
            const patient = patientsRes.data.find(p => p.email === user.email);

            if (!patient) {
                alert('Patient profile not found. Please contact administrator.');
                return;
            }

            await axios.post('http://localhost:8080/api/appointments', {
                patientId: patient.id,
                doctorId: selectedDoctor.id,
                appointmentDate: bookingDate,
                notes: bookingNotes
            });
            alert('Appointment booked successfully!');
            setSelectedDoctor(null);
            setBookingDate('');
            setBookingNotes('');
            fetchMyAppointments();
            setActiveTab('appointments');
        } catch (error) {
            console.error('Error booking:', error);
            alert('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(d =>
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'search', label: 'Find Doctor', icon: Search },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'prescriptions', label: 'My Prescriptions', icon: Pill },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold">Patient Portal</h1>
                    <p className="text-white/80">Welcome, {user.name || 'Patient'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {/* Search Doctors Tab */}
                {activeTab === 'search' && (
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search doctors by name or specialty..."
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Booking Modal */}
                        {selectedDoctor && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedDoctor(null)}>
                                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                                    <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                            <Stethoscope className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Dr. {selectedDoctor.name}</p>
                                            <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full p-3 border rounded-xl"
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                                            <textarea
                                                className="w-full p-3 border rounded-xl h-20"
                                                placeholder="Describe your symptoms..."
                                                value={bookingNotes}
                                                onChange={(e) => setBookingNotes(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setSelectedDoctor(null)} className="flex-1 py-3 bg-slate-100 rounded-xl font-medium">Cancel</button>
                                            <button onClick={handleBookAppointment} disabled={loading} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium disabled:opacity-50">
                                                {loading ? 'Booking...' : 'Confirm Booking'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Doctor Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDoctors.map(doctor => (
                                <div key={doctor.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Stethoscope className="w-7 h-7 text-primary-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">Dr. {doctor.name}</h3>
                                            <p className="text-sm text-primary-600 font-medium">{doctor.specialty || 'General'}</p>
                                            <p className="text-xs text-slate-400 mt-1">{doctor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <span className={`px-2 py-1 rounded-full text-xs ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {doctor.available ? 'Available' : 'Unavailable'}
                                        </span>
                                        <button
                                            onClick={() => setSelectedDoctor(doctor)}
                                            disabled={!doctor.available}
                                            className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Book Now <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredDoctors.length === 0 && (
                            <div className="text-center py-12 text-slate-400">No doctors found</div>
                        )}
                    </div>
                )}

                {/* My Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">My Appointments</h2>
                        {appointments.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">No appointments found</div>
                        ) : (
                            appointments.map(appt => (
                                <div key={appt.id} className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Dr. {appt.doctor?.name}</p>
                                            <p className="text-sm text-slate-500">{appt.doctor?.specialty}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            appt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {appt.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* My Prescriptions Tab */}
                {activeTab === 'prescriptions' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">My Prescriptions</h2>
                        {prescriptions.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">No prescriptions found</div>
                        ) : (
                            prescriptions.map(rx => (
                                <div key={rx.id} className="bg-white p-5 rounded-xl shadow-sm border">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                                <Pill className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">Dr. {rx.doctor?.name}</p>
                                                <p className="text-xs text-slate-400">{rx.prescribedDate ? new Date(rx.prescribedDate).toLocaleDateString() : ''}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${rx.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {rx.status}
                                        </span>
                                    </div>
                                    {rx.diagnosis && <p className="text-sm text-slate-600 mb-2"><strong>Diagnosis:</strong> {rx.diagnosis}</p>}
                                    <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{rx.medications}</p>
                                    {rx.instructions && <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg mt-2">{rx.instructions}</p>}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
