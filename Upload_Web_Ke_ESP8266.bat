@echo off
title Upload Web LittleFS ke ESP8266 (COM3)
cd /d "%~dp0"

echo ===================================================
echo   MEMBUAT & MENGUNGGAH TAMPILAN WEB KE ESP8266
echo ===================================================
echo.

set MKLITTLEFS="C:\Users\agil\AppData\Local\Arduino15\packages\esp8266\tools\mklittlefs\3.1.0-gcc10.3-e5f9fec\mklittlefs.exe"
set ESPTOOL="C:\Users\agil\AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\3.1.2\tools\esptool\esptool.py"
set PORT=COM3
set DATA_DIR="%~dp0firmware\data"
set BIN_FILE="%~dp0littlefs_web.bin"

echo [1/3] Menyiapkan partisi data LittleFS dari folder firmware/data...
%MKLITTLEFS% -c %DATA_DIR% -p 256 -b 8192 -s 0x1FA000 %BIN_FILE%

if not exist %BIN_FILE% (
    echo [ERROR] Gagal membuat file partisi LittleFS.
    pause
    exit /b 1
)

echo.
echo [2/3] Menutup koneksi lama & menyiapkan ESP8266 di %PORT%...
echo Pastikan Serial Monitor di Arduino IDE sudah DITUTUP.
echo.

echo [3/3] Mengunggah LittleFS ke ESP8266 pada alamat 0x200000...
python %ESPTOOL% --chip esp8266 --port %PORT% --baud 460800 write_flash 0x200000 %BIN_FILE%

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo   [SUKSES] Tampilan web LittleFS berhasil diupload!
    echo   Buka browser di http://192.168.4.1 sekarang!
    echo ===================================================
) else (
    echo.
    echo [FAIL] Gagal mengunggah ke ESP8266. Pastikan Serial Monitor ditutup dan kabel terhubung.
)

pause
