@echo off
setlocal

set WINSCP="C:\Program Files (x86)\WinSCP\WinSCP.com"
set ENV_FILE=%~dp0.env
set FTP_HOST=b1.hitrost.net
set FTP_PORT=21
set REMOTE_PATH=/

:: Preberi .env
for /f "usebackq tokens=1,2 delims==" %%A in ("%ENV_FILE%") do (
    if "%%A"=="FTP_USER" set FTP_USER=%%B
    if "%%A"=="FTP_PASS" set FTP_PASS=%%B
)

if not defined FTP_USER (
    echo NAPAKA: FTP_USER ni nastavljen v .env
    pause & exit /b 1
)
if not defined FTP_PASS (
    echo NAPAKA: FTP_PASS ni nastavljen v .env
    pause & exit /b 1
)

echo.
echo ===================================
echo  Billero Web — FTP deploy
echo  %FTP_HOST%:%FTP_PORT%
echo ===================================
echo.

:: -filemask izkljucuje obcutljive / interne datoteke iz uploada.
:: POZOR: ze nalozene datoteke na serverju to NE pobrise — odstrani jih rocno.
%WINSCP% /command ^
    "open ftp://%FTP_USER%:%FTP_PASS%@%FTP_HOST%:%FTP_PORT%/" ^
    "synchronize remote . %REMOTE_PATH% -delete -criteria=size -filemask=""| .env; .git/; .gitignore; .claude/; .cursorrules; *.bat; dillero-concept.html; ai/; .idea/; .vscode/""" ^
    "exit"

if %errorlevel% neq 0 (
    echo.
    echo DEPLOY FAILED!
    pause
    exit /b 1
)

echo.
echo DONE! Spletna stran je objavljena.
pause
endlocal
