import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

export default function CalendarView({ appointments, onDateClick }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Generate empty slots for days before the 1st
    const blanks = Array(firstDay).fill(null);

    // Generate array of days
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const allSlots = [...blanks, ...days];

    const getAppointmentsForDay = (day) => {
        if (!day) return [];
        return appointments.filter(appt => {
            const apptDate = new Date(appt.appointmentDate);
            return apptDate.getDate() === day &&
                apptDate.getMonth() === currentDate.getMonth() &&
                apptDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        Today
                    </button>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 block">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 block">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {allSlots.map((day, index) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (day) {
                                    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                    // Adjust for local time zone offset to prevent "previous day" isue when converting to ISO string
                                    // Or simply pass the date object and formatting will happen in parent
                                    onDateClick && onDateClick(clickedDate);
                                }
                            }}
                            className={`min-h-[120px] p-2 border-b border-r border-slate-100 dark:border-slate-700/50 ${!day ? 'bg-slate-50/50 dark:bg-slate-900/30' : 'bg-white dark:bg-slate-800 cursor-pointer'} relative group transition-colors hover:bg-slate-50 dark:hover:bg-slate-750`}
                        >
                            {day && (
                                <>
                                    <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday(day) ? 'bg-primary-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                        {dayAppointments.map(appt => (
                                            <div key={appt.id} className={`text-xs p-1.5 rounded-md truncate border-l-2 shadow-sm ${appt.status === 'CONFIRMED' ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300' :
                                                appt.status === 'COMPLETED' ? 'bg-gray-50 dark:bg-slate-700 border-gray-500 text-gray-600 dark:text-slate-300' :
                                                    appt.status === 'CANCELLED' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300 decoration-line-through' :
                                                        'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                                                }`}>
                                                <div className="font-semibold flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(appt.appointmentDate).getHours()}:{String(new Date(appt.appointmentDate).getMinutes()).padStart(2, '0')}
                                                </div>
                                                <div className="truncate text-[10px] mt-0.5 opacity-90">{appt.patient?.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
