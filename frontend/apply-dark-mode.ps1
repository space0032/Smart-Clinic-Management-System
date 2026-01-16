# PowerShell script to apply dark mode classes to all remaining pages
# Run this in PowerShell from the frontend directory

$files = @(
    "src/pages/Patients.jsx",
    "src/pages/Doctors.jsx",
    "src/pages/Appointments.jsx",
    "src/pages/Billing.jsx",
    "src/pages/MedicalRecords.jsx",
    "src/pages/Prescriptions.jsx",
    "src/pages/Reports.jsx"
)

# Backup files first
foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item $file "$file.backup"
        Write-Host "Backed up $file"
    }
}

# Apply dark mode patterns
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Text colors
        $content = $content -replace 'text-gray-800"', 'text-gray-800 dark:text-slate-100"'
        $content = $content -replace 'text-slate-800"', 'text-slate-800 dark:text-slate-100"'
        $content = $content -replace 'text-slate-700"', 'text-slate-700 dark:text-slate-200"'
        $content = $content -replace 'text-slate-600"', 'text-slate-600 dark:text-slate-300"'
        $content = $content -replace 'text-slate-500"', 'text-slate-500 dark:text-slate-400"'
        $content = $content -replace 'text-slate-400"', 'text-slate-400 dark:text-slate-500"'
        $content = $content -replace 'text-gray-500"', 'text-gray-500 dark:text-slate-400"'
        $content = $content -replace 'text-gray-400"', 'text-gray-400 dark:text-slate-500"'
        $content = $content -replace 'text-slate-900"', 'text-slate-900 dark:text-slate-100"'
        
        # Backgrounds  
        $content = $content -replace 'bg-white ', 'bg-white dark:bg-slate-800 '
        $content = $content -replace 'bg-slate-50 ', 'bg-slate-50 dark:bg-slate-700 '
        $content = $content -replace 'bg-slate-100 ', 'bg-slate-100 dark:bg-slate-700 '
        
        # Borders
        $content = $content -replace 'border-slate-100 ', 'border-slate-100 dark:border-slate-700 '
        $content = $content -replace 'border-slate-200 ', 'border-slate-200 dark:border-slate-700 '
        $content = $content -replace 'border-gray-200 ', 'border-gray-200 dark:border-slate-700 '
        
        # Dividers
        $content = $content -replace 'divide-slate-100', 'divide-slate-100 dark:divide-slate-700'
        
        # Hover states
        $content = $content -replace 'hover:bg-slate-50 ', 'hover:bg-slate-50 dark:hover:bg-slate-700/30 '
        $content = $content -replace 'hover:bg-slate-50/', 'hover:bg-slate-50 dark:hover:bg-slate-700/'
        
        # Save changes
        Set-Content $file $content -NoNewline
        Write-Host "Applied dark mode to $file"
    }
}

Write-Host "`nDone! Backups created with .backup extension"
Write-Host "Review the changes and test the app"
