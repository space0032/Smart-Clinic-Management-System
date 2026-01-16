export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
            {/* Header */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className="h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
            </div>
        </div>
    );
};

export const StatCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
        </div>
    );
};

export const FormSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
            ))}
            <div className="flex justify-end gap-3">
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-24"></div>
                <div className="h-10 bg-primary-200 dark:bg-primary-800 rounded w-32"></div>
            </div>
        </div>
    );
};
