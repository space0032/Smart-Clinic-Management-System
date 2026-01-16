# Final cleanup script - fix any duplicate dark mode classes

$files = @(
    "src/pages/Patients.jsx",
    "src/pages/Doctors.jsx",
    "src/pages/Appointments.jsx",
    "src/pages/Billing.jsx",
    "src/pages/MedicalRecords.jsx",
    "src/pages/Prescriptions.jsx",
    "src/pages/Reports.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Remove duplicate dark: classes that might have been added
        $content = $content -replace 'dark:border-slate-700 dark:border-slate-600', 'dark:border-slate-600'
        $content = $content -replace 'dark:bg-slate-800 dark:bg-slate-700', 'dark:bg-slate-700'
        $content = $content -replace 'dark:text-slate-100 dark:text-slate-100', 'dark:text-slate-100'
        $content = $content -replace 'dark:text-slate-500 dark:text-slate-400', 'dark:text-slate-400'
        $content = $content -replace 'dark:text-slate-400 dark:text-slate-500', 'dark:text-slate-500'
        
        # Fix any remaining input fields missing bg/text
        $content = $content -replace 'border border-slate-200 dark:border-slate-700 rounded-lg focus:ring', 'border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring'
         
        # Ensure consistency for select elements
        $content = $content -replace '<select([^>]*?)className="([^"]*?)border border-slate-200 dark:border-slate-700', '<select$1className="$2border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100'
        
        # Ensure textarea has dark mode
        $content = $content -replace '<textarea([^>]*?)className="([^"]*?)border border-slate-200 dark:border-slate-700', '<textarea$1className="$2border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100'
        
        Set-Content $file $content -NoNewline
        Write-Host "Cleaned up $file"
    }
}

Write-Host "`nCleanup complete!"
