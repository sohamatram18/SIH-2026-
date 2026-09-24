@echo off
title JanjatiSetu - Push to GitHub
color 0A
echo ============================================
echo   JanjatiSetu - GitHub Push + Auto Deploy
echo ============================================
echo.
echo Step 1: Generate a NEW GitHub Token at:
echo   https://github.com/settings/tokens/new
echo   - Note: deploy
echo   - Expiry: 7 days
echo   - Check: [x] repo
echo   - Click: Generate token
echo.
echo Step 2: Paste it below (it will be HIDDEN):
echo.

powershell -Command ^
  "$token = Read-Host -AsSecureString 'Paste GitHub Token (hidden)';" ^
  "$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token));" ^
  "git -C '%~dp0' -c credential.helper='' remote set-url origin \"https://sohamatram18:$plain@github.com/sohamatram18/SIH-2026-.git\";" ^
  "Write-Host 'Pushing all files to GitHub...' -ForegroundColor Yellow;" ^
  "$result = git -C '%~dp0' -c credential.helper='' push origin main --force 2>&1;" ^
  "Write-Host $result;" ^
  "git -C '%~dp0' remote set-url origin 'https://github.com/sohamatram18/SIH-2026-.git';" ^
  "if ($LASTEXITCODE -eq 0) { Write-Host 'SUCCESS! GitHub push done. Vercel will auto-deploy now.' -ForegroundColor Green } else { Write-Host 'Push failed. Check output above.' -ForegroundColor Red }"

echo.
echo ============================================
echo Press any key to close...
pause > nul
