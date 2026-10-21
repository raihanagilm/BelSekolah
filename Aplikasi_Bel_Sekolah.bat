@echo off
title Bel Sekolah Otomatis Mandiri
cd /d "%~dp0"

echo ===================================================
echo     MEMBUKA APLIKASI BEL SEKOLAH OTOMATIS
echo ===================================================
echo.

:: Tentukan target URL (Jika ada ESP32 di jaringan atau lokal)
set TARGET_URL=http://192.168.4.1

:: Cek koneksi ke ESP32 (timeout 1 detik)
ping -n 1 -w 1000 192.168.4.1 >nul 2>&1
if %errorlevel% neq 0 (
    :: Jika belum terhubung ke WiFi ESP32, buka file HTML lokal (Semi-Offline Mode)
    set TARGET_URL=file:///%~dp0firmware\data\index.html
    echo [INFO] Menjalankan dalam Mode Offline Lokal...
) else (
    echo [INFO] Terhubung ke Modul ESP32!
)

:: Cari browser Chromium (Edge / Chrome) untuk mode standalone window (--app)
set BROWSER_CMD=

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set BROWSER_CMD="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set BROWSER_CMD="%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%"
) else if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set BROWSER_CMD="%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set BROWSER_CMD="%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%"
) else (
    :: Fallback ke default browser sistem
    start "" "%TARGET_URL%"
    exit /b
)

:: Jalankan sebagai aplikasi desktop mandiri tanpa address bar
start "" %BROWSER_CMD%
exit /b
