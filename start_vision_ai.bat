@echo off
title VisionAI Studio Background Runner
cd /d "D:\VisionAI_Studio"

echo.
echo ==========================================
echo    VisionAI Studio - Starting Services
echo ==========================================
echo.
echo [*] Checking dependencies...
if not exist node_modules (
    echo [!] node_modules not found. Running npm install...
    npm install
)

echo [*] Starting Next.js Dev Server...
echo [TIP] You can close this window and the server will continue if run as a background task.
echo.

:: Start the dev server in the background or in a minimized window
start /min npm run dev

echo.
echo [SUCCESS] VisionAI Studio is running at http://localhost:3000
echo [INFO] You can now use your Desktop Shortcut to access the app.
echo [INFO] Close this window to keep it running in the background.
echo.
timeout /t 5
exit
