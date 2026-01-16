import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [searchTerm, setSearchTerm] = useState(query || '');
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

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ q: searchTerm.trim() });
        } else {
            setSearchParams({}); // Clear search param if input is empty
        }
    };

    return (
        <div className="p-8 space-y-8 bg-white dark:bg-slate-900 min-h-screen text-gray-900 dark:text-slate-100">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Global Search</h1>
                <p className="text-gray-500 dark:text-slate-400">Search across patients, doctors, and appointments</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-primary-600 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    placeholder="Search patients, doctors..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
            </form>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-500 dark:text-slate-400">Searching...</span>
                </div>
            ) : !query ? (
                <div className="p-8 text-center text-gray-500 dark:text-slate-400">Please enter a search term.</div>
            ) : (
                <>

                    {/* Patients Section */}
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" /> Patients ({results.patients.length})
                        </h2>

                        {results.patients.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.patients.map(p => (
                                    <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-slate-100">{p.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">{p.contactNo}</p>
                                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{p.email}</p>
                                            </div>
                                            <Link to={`/medical-records?patientId=${p.id}`} className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No patients found.</p>
                        )}
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <Stethoscope className="w-5 h-5 mr-2" /> Doctors ({results.doctors.length + results.specialists.length})
                        </h2>

                        {results.doctors.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">By Name</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.doctors.map(d => (
                                        <div key={d.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center">
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
                                        <div key={'spec-' + d.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center">
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
                            <p className="text-gray-400 italic">No doctors found matching "{query}".</p>
                        )}
                    </section>

                    {results.patients.length === 0 && results.doctors.length === 0 && results.specialists.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-slate-400 text-lg">No results found for "{query}"</p>
                            <p className="text-gray-400 dark:text-slate-500 text-sm">Try checking for typos or using broader terms.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
