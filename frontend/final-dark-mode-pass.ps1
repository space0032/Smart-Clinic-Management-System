# Final comprehensive dark mode pass - catch ALL remaining issues

$files = @(
    "src/pages/Patients.jsx",
    "src/pages/Doctors.jsx",
    "src/pages/Appointments.jsx",
    "src/pages/Billing.jsx",
    "src/pages/MedicalRecords.jsx",
    "src/pages/Prescriptions.jsx",
    "src/pages/Reports.jsx",
    "src/pages/SearchPage.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        Write-Host "Processing $file..." -ForegroundColor Cyan
        
        # Fix card containers without dark mode
        $content = $content -replace 'border border-slate-200"', 'border border-slate-200 dark:border-slate-700"'
        
        # Fix any remaining text colors
        $content = $content -replace '([^-])text-slate-900"', '$1text-slate-900 dark:text-slate-100"'
        
        # Fix form labels that might be missing dark mode
        $content = $content -replace '<label className="([^"]*)"', '<label className="$1 dark:text-slate-200"'
        
        # Clean up double dark mode on labels
        $content = $content -replace 'dark:text-slate-200 dark:text-slate-200', 'dark:text-slate-200'
        
        # Ensure select/option elements have proper dark mode
        $content = $content -replace '<select([^>]*?)className="([^"]*?)"', '<select$1className="$2 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"'
        $content = $content -replace 'dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 dark:bg-slate-700', 'dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600'
        
        # Fix any span/div with slate colors
        $content = $content -replace 'className="([^"]*?)text-slate-700([^"]*?)"', 'className="$1text-slate-700 dark:text-slate-200$2"'
        $content = $content -replace 'dark:text-slate-200 dark:text-slate-200', 'dark:text-slate-200'
        
        # Fix strong/bold text
        $content = $content -replace '<strong className="([^"]*?)text-slate', '<strong className="$1text-slate-900 dark:text-slate-100'
        
        # Ensure all cards have dark background
        $content = $content -replace 'className="([^"]*?)bg-white ([^"]*?)p-', 'className="$1bg-white dark:bg-slate-800 $2p-'
        $content = $content -replace 'dark:bg-slate-800 dark:bg-slate-800', 'dark:bg-slate-800'
        
        # Fix any button variants
        $content = $content -replace 'bg-slate-100 hover:bg-slate-200', 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
        
        # Fix table cell text
        $content = $content -replace '<td className="([^"]*?)text-slate', '<td className="$1text-slate-600 dark:text-slate-300'
        
        # Fix headings in cards
        $content = $content -replace '<h3 className="([^"]*?)text-', '<h3 className="$1text-slate-800 dark:text-slate-100 '
        $content = $content -replace '<h2 className="([^"]*?)text-lg', '<h2 className="$1text-lg dark:text-slate-100'
        
        # Clean up any triple duplicates
        $content = $content -replace '(dark:[a-z-]+) \1 \1', '$1'
        $content = $content -replace '(dark:[a-z-]+) \1', '$1'
        
        Set-Content $file $content -NoNewline
        Write-Host "✓ Completed $file" -ForegroundColor Green
    }
}

Write-Host "`n✅ Final dark mode pass complete!" -ForegroundColor Green
Write-Host "All remaining issues should now be fixed." -ForegroundColor Yellow
