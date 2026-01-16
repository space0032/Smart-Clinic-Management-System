# Targeted dark mode fixes for specific pages - numerical values and visibility issues

Write-Host "Applying targeted dark mode fixes..." -ForegroundColor Cyan

# REPORTS.JSX - Fix invisible numerical values
$reportsFile = "src/pages/Reports.jsx"
if (Test-Path $reportsFile) {
    $content = Get-Content $reportsFile -Raw
    
    # Fix numerical values visibility - Line 65
    $content = $content -replace 'text-2xl font-bold text-slate-800 mt-1', 'text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1'
    
    # Fix all text-slate-500 that don't have dark mode
    $content = $content -replace 'text-slate-500 dark:text-slate-500', 'text-slate-500 dark:text-slate-400'
    
    # Fix borders without dark mode
    $content = $content -replace 'border border-slate-100"', 'border border-slate-100 dark:border-slate-700"'
    
    Set-Content $reportsFile $content -NoNewline
    Write-Host "✓ Fixed Reports.jsx - numerical values now visible" -ForegroundColor Green
}

# MEDICAL RECORDS - Fix form inputs and selects
$medicalRecordsFile = "src/pages/MedicalRecords.jsx"
if (Test-Path $medicalRecordsFile) {
    $content = Get-Content $medicalRecordsFile -Raw
    
    # Add dark mode to all missing elements
    $ content = $content -replace 'text-gray-800 mb-3', 'text-gray-800 dark:text-slate-100 mb-3'
    $content = $content -replace 'text-gray-900"', 'text-gray-900 dark:text-slate-100"'
    $content = $content -replace 'text-gray-700"', text-gray-700 dark:text-slate-200"'
    $content = $content -replace 'text-gray-700 mb-1', 'text-gray-700 dark:text-slate-200 mb-1'
    $content = $content -replace 'border-gray-200 dark:border-slate-700', 'border-gray-200 dark:border-slate-700'
    $content = $content -replace 'border-gray-100"', 'border-gray-100 dark:border-slate-700"'
    $content = $content -replace 'bg-gray-50"', 'bg-gray-50 dark:bg-slate-900"'
    $content = $content -replace 'w-full p-2 border rounded-lg"', 'w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"'
    $content = $content -replace '<select([^>]*?)className="w-full p-2 border rounded-lg"', '<select$1className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"'
    $content = $content -replace '<textarea([^>]*?)className="w-full p-2 border rounded-lg', '<textarea$1className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg'
    
    Set-Content $medicalRecordsFile $content -NoNewline
    Write-Host "✓ Fixed MedicalRecords.jsx - forms and colors improved" -ForegroundColor Green
}

# APPOINTMENTS - Fix forms and card elements
$appointmentsFile = "src/pages/Appointments.jsx"
if (Test-Path $appointmentsFile) {
    $content = Get-Content $appointmentsFile -Raw
    
    # Fix form elements
    $content = $content -replace 'text-lg font-semibold mb-4"', 'text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100"'
    $content = $content -replace 'border-gray-200"', 'border-gray-200 dark:border-slate-700"'
    $content = $content -replace 'border-gray-100"', 'border-gray-100 dark:border-slate-700"'
    $content = $content -replace 'text-gray-900"', 'text-gray-900 dark:text-slate-100"'
    $content = $content -replace 'text-gray-500 mt-1', 'text-gray-500 dark:text-slate-400 mt-1'
    $content = $content -replace 'text-gray-400 mt-1', 'text-gray-400 dark:text-slate-500 mt-1'
    $content = $content -replace 'text-gray-700 bg-gray-100', 'text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-700'
    $content = $content -replace '<select([^>]*?)className="w-full p-2 border rounded-lg"', '<select$1className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"'
    $content = $content -replace '<input([^>]*?)className="w-full p-2 border rounded-lg"', '<input$1className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg"'
    $content = $content -replace '<textarea([^>]*?)className="w-full p-2 border rounded-lg', '<textarea$1className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg'
    
    Set-Content $appointmentsFile $content -NoNewline
    Write-Host "✓ Fixed Appointments.jsx - forms and cards improved" -ForegroundColor Green
}

# DOCTORS & BILLING - Check and fix
$doctorsFile = "src/pages/Doctors.jsx"
if (Test-Path $doctorsFile) {
    $content = Get-Content $doctorsFile -Raw
    $content = $content -replace 'border-gray-200"', 'border-gray-200 dark:border-slate-700"'
    $content = $content -replace 'text-gray-900"', 'text-gray-900 dark:text-slate-100"'
    Set-Content $doctorsFile $content -NoNewline
    Write-Host "✓ Fixed Doctors.jsx" -ForegroundColor Green
}

$billingFile = "src/pages/Billing.jsx"
if (Test-Path $billingFile) {
    $content = Get-Content $billingFile -Raw
     $content = $content -replace 'border-gray-200"', 'border-gray-200 dark:border-slate-700"'
    $content = $content -replace 'text-gray-900"', 'text-gray-900 dark:text-slate-100"'
    $content = $content -replace 'text-gray-700"', 'text-gray-700 dark:text-slate-200"'
    Set-Content $billingFile $content -NoNewline
    Write-Host "✓ Fixed Billing.jsx" -ForegroundColor Green
}

Write-Host "`n✅ All targeted fixes applied!" -ForegroundColor Green
Write-Host "Numerical values in Reports should now be visible in dark mode" -ForegroundColor Yellow
