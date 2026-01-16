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

export const Patients = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient List</h2>
        <p className="text-gray-500">List of patients will appear here.</p>
    </div>
);

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

export const Login = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Smart Clinic</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                <button type="button" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                    Sign In
                </button>
            </form>
        </div>
    </div>
);
