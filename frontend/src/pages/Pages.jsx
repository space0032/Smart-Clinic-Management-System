/* eslint-disable react/prop-types */

export const Dashboard = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
            { title: 'Total Patients', value: '1,234', color: 'bg-blue-500' },
            { title: 'Appointments Today', value: '42', color: 'bg-green-500' },
            { title: 'Pending Bills', value: '$3,450', color: 'bg-yellow-500' }
        ].map((card) => (
            <div key={card.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
        ))}
    </div>
);

export { default as Patients } from './Patients';
export { default as Doctors } from './Doctors';

export const Appointments = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments</h2>
        <p className="text-gray-500">Calendar view will appear here.</p>
    </div>
);

export const Billing = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing & Invoices</h2>
        <p className="text-gray-500">Invoices table will appear here.</p>
    </div>
);

// Exporting pages
export { default as Login } from './Login';

