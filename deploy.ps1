# JanjatiSetu - One-Click Deploy Script
# Run this script in PowerShell to deploy to Vercel

Write-Host "=== JanjatiSetu Vercel Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Ask for token securely (not shown on screen)
$token = Read-Host -AsSecureString "Paste your Vercel Token (from vercel.com/account/tokens)"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Building project..." -ForegroundColor Yellow

# Step 2: Build the client
Set-Location "$PSScriptRoot\client"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build FAILED!" -ForegroundColor Red
    exit 1
}
Write-Host "Build SUCCESS!" -ForegroundColor Green

# Step 3: Deploy to Vercel
Write-Host ""
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow

$env:VERCEL_TOKEN = $plainToken
$result = npx vercel --token $plainToken --yes --prod 2>&1

Write-Host $result

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Your site is live!" -ForegroundColor Green
    # Extract URL from output
    $url = $result | Select-String -Pattern "https://.*\.vercel\.app" | Select-Object -First 1
    if ($url) {
        Write-Host "URL: $url" -ForegroundColor Cyan
    }
} else {
    Write-Host "Deployment failed. Output:" -ForegroundColor Red
    Write-Host $result
}

# Cleanup
$env:VERCEL_TOKEN = ""
Set-Location "$PSScriptRoot"
