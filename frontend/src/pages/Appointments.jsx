import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Plus, Calendar as CalendarIcon, Clock, User, Stethoscope, CheckCircle, XCircle, LayoutGrid, List } from 'lucide-react';
import CalendarView from '../components/CalendarView';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'

    // Form State
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [apptRes, docRes, patRes] = await Promise.all([
                supabase.from('appointments').select(`
                    *,
                    patient:patients(id, name, contactNo),
                    doctor:doctors(id, name, specialization)
                `).order('appointment_date', { ascending: false }),
                supabase.from('doctors').select('*'),
                supabase.from('patients').select('*')
            ]);

            if (apptRes.error) throw apptRes.error;
            if (docRes.error) throw docRes.error;
            if (patRes.error) throw patRes.error;

            // Map snake_case to camelCase for consistency
            const mappedAppointments = apptRes.data.map(appt => ({
                ...appt,
                appointmentDate: appt.appointment_date
            }));

            setAppointments(mappedAppointments);
            setDoctors(docRes.data);
            setPatients(patRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('appointments')
                .insert([{
                    patient_id: formData.patientId,
                    doctor_id: formData.doctorId,
                    appointment_date: formData.appointmentDate,
                    notes: formData.notes,
                    status: 'SCHEDULED'
                }]);

            if (error) throw error;

            setShowForm(false);
            setFormData({
                patientId: '', doctorId: '', appointmentDate: '', notes: ''
            });
            fetchData();
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("Failed to book appointment. Ensure all fields are valid.");
        }
    };

    const handleDateClick = (date) => {
        // Format date to local ISO string (YYYY-MM-DDTHH:MM) for datetime-local input
        // Simple trick to get local ISO string
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);

        // Default to 9:00 AM on that day
        const defaultTime = localISOTime.split('T')[0] + 'T09:00';

        setFormData({ ...formData, appointmentDate: defaultTime });
        setShowForm(true);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const statusColors = {
        SCHEDULED: 'bg-blue-100 text-blue-800',
        CONFIRMED: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800'
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Appointments</h1>
                    <p className="text-gray-500 dark:text-slate-400">Schedule and manage visits</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="List View"
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Calendar View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Appointment
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Book New Appointment</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Patient Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Patient</label>
                            <select
                                required
                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"
                                value={formData.patientId}
                                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.contactNo})</option>
                                ))}
                            </select>
                        </div>

                        {/* Doctor Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Doctor</label>
                            <select
                                required
                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"
                                value={formData.doctorId}
                                onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Date & Time</label>
                            <input
                                type="datetime-local" required
                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"
                                value={formData.appointmentDate}
                                onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
                            />
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Notes</label>
                            <textarea
                                placeholder="Reason for visit..."
                                className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg h-20"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button
                                type="button" onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-red-600 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Appointment Cards */}
            {/* Appointment Cards or Calendar */}
            {viewMode === 'calendar' ? (
                <CalendarView appointments={appointments} onDateClick={handleDateClick} />
            ) : (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-gray-500 dark:text-slate-400 text-center py-8">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-gray-500 dark:text-slate-400 text-center py-8 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                            <CalendarIcon className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                            <p>No appointments scheduled.</p>
                        </div>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-center min-w-[80px]">
                                        <span className="block text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                            {new Date(appt.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="block text-xl font-bold text-indigo-800 dark:text-indigo-200">
                                            {new Date(appt.appointmentDate).getHours()}:{String(new Date(appt.appointmentDate).getMinutes()).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{appt.patient?.name || 'Unknown Patient'}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${statusColors[appt.status] || 'bg-gray-100'}`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mt-1">
                                            <Stethoscope className="w-4 h-4 mr-1" />
                                            {appt.doctor?.name || 'Unknown Doctor'} ({appt.doctor?.specialization})
                                        </div>
                                        {appt.notes && <p className="text-sm text-gray-400 dark:text-slate-500 mt-1 italic">"{appt.notes}"</p>}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {appt.status === 'SCHEDULED' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg flex items-center">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Confirm
                                            </button>
                                            <button onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center">
                                                <XCircle className="w-3 h-3 mr-1" /> Cancel
                                            </button>
                                        </>
                                    )}
                                    {appt.status === 'CONFIRMED' && (
                                        <button onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
