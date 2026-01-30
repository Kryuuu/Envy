@echo off
echo Setting up environment...
set "PATH=%PATH%;C:\Program Files\nodejs;C:\Users\USER\AppData\Roaming\npm"

echo Installing dependencies (if needed)...
call npm install --legacy-peer-deps

echo Starting Portfolio Website...
echo.
echo Open your browser to: http://localhost:3000
echo.
call npm run dev
pause
