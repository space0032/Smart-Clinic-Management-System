// Automated Dark Mode Class Replacements
// This script contains regex patterns to automatically add dark mode classes

export const darkModeReplacements = [
    // Cards and containers
    { from: 'bg-white ', to: 'bg-white dark:bg-slate-800 ' },
    { from: 'bg-white"', to: 'bg-white dark:bg-slate-800"' },

    // Borders
    { from: 'border-slate-100 ', to: 'border-slate-100 dark:border-slate-700 ' },
    { from: 'border-slate-200 ', to: 'border-slate-200 dark:border-slate-700 ' },
    { from: 'border-gray-200 ', to: 'border-gray-200 dark:border-slate-700 ' },

    // Text colors
    { from: 'text-slate-800 ', to: 'text-slate-800 dark:text-slate-100 ' },
    { from: 'text-slate-800"', to: 'text-slate-800 dark:text-slate-100"' },
    { from: 'text-slate-700 ', to: 'text-slate-700 dark:text-slate-200 ' },
    { from: 'text-slate-700"', to: 'text-slate-700 dark:text-slate-200"' },
    { from: 'text-slate-600 ', to: 'text-slate-600 dark:text-slate-300 ' },
    { from: 'text-slate-600"', to: 'text-slate-600 dark:text-slate-300"' },
    { from: 'text-slate-500 ', to: 'text-slate-500 dark:text-slate-400 ' },
    { from: 'text-slate-500"', to: 'text-slate-500 dark:text-slate-400"' },
    { from: 'text-slate-400 ', to: 'text-slate-400 dark:text-slate-500 ' },
    { from: 'text-slate-400"', to: 'text-slate-400 dark:text-slate-500"' },

    // Backgrounds
    { from: 'bg-slate-50 ', to: 'bg-slate-50 dark:bg-slate-700 ' },
    { from: 'bg-slate-50"', to: 'bg-slate-50 dark:bg-slate-700"' },
    { from: 'bg-slate-100 ', to: 'bg-slate-100 dark:bg-slate-700 ' },
    { from: 'bg-gray-50 ', to: 'bg-gray-50 dark:bg-slate-900 ' },

    // Inputs
    { from: 'bg-white border', to: 'bg-white dark:bg-slate-700 border' },

    // Hover states
    { from: 'hover:bg-slate-50 ', to: 'hover:bg-slate-50 dark:hover:bg-slate-700 ' },
    { from: 'hover:bg-slate-100 ', to: 'hover:bg-slate-100 dark:hover:bg-slate-700 ' },
    { from: 'hover:bg-gray-50 ', to: 'hover:bg-gray-50 dark:hover:bg-slate-700/30 ' },
];

// Common class combinations
export const cardClasses = "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700";
export const headingClasses = "text-slate-800 dark:text-slate-100";
export const subheadingClasses = "text-slate-600 dark:text-slate-300";
export const mutedClasses = "text-slate-500 dark:text-slate-400";
export const inputClasses = "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100";
export const tableRowClasses = "border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30";
