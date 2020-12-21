echo "/ ---------------------------------------------- /"
echo "          Wyvern created by Virak"
echo "                29 / 9 / 2020"
echo "              All rights reserved."
echo "/ ---------------------------------------------- /"

echo Installing Required Node Modules...
echo --------------------------------------
npm i
echo.
echo Done!
echo Creating run files for Wyvern...
echo ------------------------------------

echo "echo Starting the Auto restart Bot program for Linux / Mac
echo If you require any help with it not working, please check some of the comments in this file!
while :
do
 	node app.js
 	echo Bot shutdown, restarting now
done

#!/bin/bash
# If you have issues running this try this code
# sudo chmod 777 run.sh" > run.sh
echo Created run.sh
echo ------------------------------------
echo Discord.js may provide some warnings... these can simply be ignored!
sleep 1
echo Closing...
sleep 5
exit

	
