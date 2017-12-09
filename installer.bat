@echo off
title Node.js Modules Installer

echo / ---------------------------------------------- /
echo           ShadeBot created by Alipoodle
echo          Installer made by TheRacingLion
echo                 6 / 12 / 2016
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
echo :: Script created by TheRacingLion (https://github.com/TheRacingLion) [ 6 / 12 / 2016 ] >> run.bat
echo :: Bot created by Alipoodle (https://github.com/Alipoodle) [ 28 / 09 / 2017 ] >> run.bat
echo :: -*Read LICENSE to know more about permissions*- >> run.bat
echo title Discord ShadeBot >> run.bat
echo :START >> run.bat
echo node app.js >> run.bat
echo goto START >> run.bat
echo "run.bat" File Created.
echo ------------------------------------
echo Deleting unwanted files...
echo ------------------------------------
del "%~f0"
echo Closing...
timeout /t 5
exit
