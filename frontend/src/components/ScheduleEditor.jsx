import { useState, useEffect } from 'react';
import { X, Clock, Save, Plus } from 'lucide-react';

export default function ScheduleEditor({ doctor, onClose, onSave }) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Parse existing schedule or default to empty structure
    const parseSchedule = () => {
        try {
            if (doctor?.availability) {
                // Try to parse existing string if it looks like JSON
                if (doctor.availability.startsWith('{')) {
                    return JSON.parse(doctor.availability);
                }
                // Fallback for simple string: convert to generic "all days" note or reset
            }
        } catch (e) {
            console.error("Failed to parse schedule", e);
        }

        // Default structure
        const defaultSchedule = {};
        days.forEach(day => {
            defaultSchedule[day] = { active: false, start: '09:00', end: '17:00' };
        });
        return defaultSchedule;
    };

    const [schedule, setSchedule] = useState(parseSchedule());

    const handleDayToggle = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], active: !prev[day]?.active, start: prev[day]?.start || '09:00', end: prev[day]?.end || '17:00' }
        }));
    };

    const handleTimeChange = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSave = () => {
        // Serialize to JSON string
        const jsonString = JSON.stringify(schedule);
        onSave(doctor.id, { ...doctor, availability: jsonString });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Manage Schedule</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Set availability for Dr. {doctor.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {days.map(day => (
                        <div key={day} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${schedule[day]?.active ? 'bg-white dark:bg-slate-800 border-primary-200 dark:border-primary-900/50 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60'}`}>
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    checked={schedule[day]?.active || false}
                                    onChange={() => handleDayToggle(day)}
                                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                />
                            </div>
                            <div className="w-28 font-medium text-slate-700 dark:text-slate-200">{day}</div>

                            {schedule[day]?.active ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="relative">
                                        <Clock className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="time"
                                            value={schedule[day]?.start}
                                            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                            className="pl-9 pr-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <span className="text-slate-400">-</span>
                                    <div className="relative">
                                        <Clock className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="time"
                                            value={schedule[day]?.end}
                                            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                            className="pl-9 pr-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className="text-sm text-slate-400 italic">Unavailable</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-md hover:shadow-lg transition-all">
                        <Save className="w-4 h-4 mr-2" />
                        Save Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}
