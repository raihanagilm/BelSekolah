@echo off
title Bel Sekolah Otomatis Mandiri
cd /d "%~dp0"

echo ===================================================
echo     MEMBUKA APLIKASI BEL SEKOLAH OTOMATIS
echo ===================================================
echo.

:: Selalu arahkan ke file web lokal agar audio MP3 bisa diputar langsung
set "HTML_FILE=%~dp0firmware\data\index.html"

:: Cek koneksi ke ESP8266 di IP 192.168.4.1
ping -n 1 -w 800 192.168.4.1 >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Terhubung ke Wi-Fi ESP8266 Bel-Sekolah-AP.
    echo [INFO] Relay amplifier pada alat akan otomatis aktif saat bel berbunyi.
) else (
    echo [INFO] Menjalankan dalam Mode Offline Laptop/Komputer.
    echo [INFO] Suara nada bel tetap akan berbunyi melalui pengeras suara PC.
)

:: Deteksi lokasi Google Chrome atau Microsoft Edge
set "BROWSER_EXE="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
)

:: Buka dalam mode aplikasi desktop mandiri (--app) jika browser Chromium ditemukan
if defined BROWSER_EXE (
    start "" "%BROWSER_EXE%" --app="%HTML_FILE%"
) else (
    start "" "%HTML_FILE%"
)

exit /b

