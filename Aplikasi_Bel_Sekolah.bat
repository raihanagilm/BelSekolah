@echo off
title Bel Sekolah Otomatis Mandiri
cd /d "%~dp0"

echo ===================================================
echo     MEMBUKA APLIKASI BEL SEKOLAH OTOMATIS
echo ===================================================
echo.

:: Tentukan target URL (Jika ada ESP32 di jaringan atau lokal)
set TARGET_URL=http://192.168.4.1

:: Cek koneksi ke ESP8266 di IP 192.168.4.1
ping -n 1 -w 800 192.168.4.1 >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Terdeteksi terhubung ke Wi-Fi ESP8266 (Bel-Sekolah-AP)!
    echo [INFO] Relay amplifier pada alat akan otomatis aktif saat bel berbunyi.
) else (
    echo [INFO] Menjalankan dalam Mode Offline Laptop/Komputer...
    echo [INFO] Suara nada bel tetap akan berbunyi melalui pengeras suara PC.
)

:: Selalu arahkan ke file web lokal agar dapat memutar seluruh file MP3 dari folder d:\BelSekolah\firmware\data\audio\
set TARGET_URL=file:///%~dp0firmware\data\index.html

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
