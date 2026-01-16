# Enhanced Dark Mode Improvement Script
# Fixes remaining elements that need dark mode

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
        
        # Input fields - ensure complete dark mode
        $content = $content -replace 'className="p-2 border border-slate-200 dark:border-slate-700 rounded', 'className="p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded'
        
        # Fix any remaining bg-slate-50 in table headers
        $content = $content -replace 'bg-slate-50 dark:bg-slate-700 border', 'bg-slate-50 dark:bg-slate-700/50 border'
        
        # Ensure all primary links have dark mode
        $content = $content -replace 'text-primary-600 hover', 'text-primary-600 dark:text-primary-400 hover'
        $content = $content -replace 'hover:text-primary-700"', 'hover:text-primary-700 dark:hover:text-primary-300"'
        
        # Badge status colors  
        $content = $content -replace 'bg-green-50 text-green-700', 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
        $content = $content -replace 'bg-blue-50 text-blue-700', 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        $content = $content -replace 'bg-yellow-50 text-yellow-700', 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
        $content = $content -replace 'bg-red-50 text-red-700', 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        $content = $content -replace 'bg-purple-50 text-purple-700', 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
        
        # Form labels
        $content = $content -replace '<label className="', '<label className="dark:text-slate-200 '
        
        # Placeholder text (already handled by input classes but ensure consistency)
        $content = $content -replace 'placeholder:', 'placeholder:text-slate-400 dark:placeholder:'
        
        # Icon colors in various contexts
        $content = $content -replace 'text-gray-400 w-', 'text-gray-400 dark:text-slate-500 w-'
        $content = $content -replace 'text-slate-400 w-', 'text-slate-400 dark:text-slate-500 w-'
        
        Set-Content $file $content -NoNewline
        Write-Host "Enhanced dark mode for $file"
    }
}

Write-Host "`nEnhanced dark mode patterns applied!"
