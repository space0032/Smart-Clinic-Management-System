// Common dark mode class utilities for consistent theming

export const cardClass = "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700";

export const headingClass = "text-slate-800 dark:text-slate-100";

export const subheadingClass = "text-slate-600 dark:text-slate-300";

export const mutedClass = "text-slate-500 dark:text-slate-400";

export const inputClass = "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

export const buttonPrimaryClass = "bg-primary-600 hover:bg-primary-700 text-white";

export const buttonSecondaryClass = "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200";

export const tableHeaderClass = "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200";

export const tableRowClass = "border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30";

export const badgeClass = (color = 'blue') => {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    };
    return colors[color] || colors.blue;
};

export const statCardClass = (color = 'blue') => {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/20',
        green: 'bg-green-50 dark:bg-green-900/20',
        purple: 'bg-purple-50 dark:bg-purple-900/20',
        orange: 'bg-orange-50 dark:bg-orange-900/20',
    };
    return colors[color] || colors.blue;
};
