import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ patients: [], doctors: [], specialists: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            performSearch(query);
        }
    }, [query]);

    const performSearch = async (searchTerm) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/search?query=${searchTerm}`);
            setResults(response.data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!query) return <div className="p-8 text-center text-gray-500">Please enter a search term.</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Search Results for "{query}"</h1>

            {loading ? (
                <div className="text-gray-500">Searching...</div>
            ) : (
                <>
                    {/* Patients Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" /> Patients ({results.patients.length})
                        </h2>
                        {results.patients.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.patients.map(p => (
                                    <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-900">{p.name}</h3>
                                        <p className="text-sm text-gray-500">{p.contactNo}</p>
                                        <p className="text-xs text-gray-400 mt-1">{p.email}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-400 italic">No patients found.</p>}
                    </section>

                    {/* Doctors Section */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <Stethoscope className="w-5 h-5 mr-2" /> Doctors ({results.doctors.length + results.specialists.length})
                        </h2>

                        {results.doctors.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">By Name</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.doctors.map(d => (
                                        <div key={d.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{d.name}</h3>
                                                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{d.specialization}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.specialists.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">By Specialization</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.specialists.map(d => (
                                        <div key={'spec-' + d.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{d.name}</h3>
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{d.specialization}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.doctors.length === 0 && results.specialists.length === 0 && (
                            <p className="text-gray-400 italic">No doctors found.</p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
