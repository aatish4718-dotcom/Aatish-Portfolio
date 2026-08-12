@echo off
REM Serves this folder on your PC AND on your phone.
REM
REM Double-clicking index.html mostly works, but a real http:// origin is
REM better: some browsers treat file:// pages as a unique origin and refuse
REM the YouTube embeds, and it is the only way to check the site on a phone.
REM
REM Binding to 0.0.0.0 (not 127.0.0.1) is what makes the phone able to reach it.
REM Phone and PC must be on the SAME Wi-Fi. If the phone still cannot connect,
REM Windows Firewall is blocking the port - allow Python on private networks.

cd /d "%~dp0"

echo.
echo   On this PC:  http://localhost:8123/
echo.
echo   On your phone, use whichever of these matches your Wi-Fi:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do echo      http:%%a:8123/
echo.
echo   Press Ctrl+C to stop the server.
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8123/
  py -m http.server 8123 --bind 0.0.0.0
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8123/
  python -m http.server 8123 --bind 0.0.0.0
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8123/
  npx --yes serve -l 8123 .
  goto :eof
)

echo.
echo Could not find Python or Node on this machine.
echo Install either one, or upload the folder to your host - on a real
echo web server it just works, no launcher needed.
echo.
pause
