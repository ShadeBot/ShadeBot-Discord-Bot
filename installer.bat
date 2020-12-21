@echo off
title Node.js Modules Installer

echo / ---------------------------------------------- /
echo           Wyvern created by Virak
echo          Installer made by Virak
echo                 26 / 6 / 2020
echo               All rights reserved.
echo / ---------------------------------------------- /

echo Installing Required Node Modules...
echo --------------------------------------
cd %~dp0
cmd /c "npm i"
echo.
echo Done!
echo Creating run files for Selfbot...
echo ------------------------------------
echo @echo off > run.bat
echo :: Script created by Virak (https://github.com/Vir4k) [ 6 / 12 / 2020] >> run.bat
echo :: Bot created by Virak (https://github.com/Vir4k) [ 26 / 06 / 2020 ] >> run.bat
echo :: -*Read LICENSE to know more about permissions*- >> run.bat
echo title Wyvern >> run.bat
echo :START >> run.bat
echo node index.js >> run.bat
echo goto START >> run.bat
echo "run.bat" File Created.
echo ------------------------------------
echo Deleting unwanted files...
echo ------------------------------------
del "%~f0"
echo Closing...
timeout /t 5
exit
