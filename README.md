# ShadeBot <img src="https://alipoodle.me/i/96NdQ.png" align="right" height="250" width="250" />

ShadeBot is a discord bot primarily made for the Hentai! server Discord! It's function is to welcome people using a special welcome room. When users join the server, they can only see #announcements #rules and #go-here-for-user-rank and they need to have a profile picture &  type a specific password. In our case it's simply **Hi**. They will then be welcomed in the primary chat room.

# Installation

### - Install Required Programs -

Before you can download and setup the bot, there are 2 programs you need to have installed on your computer to make sure everything runs on first go:

- [**Git**](https://git-scm.com/downloads)
- [**Node JS**](https://nodejs.org/en/download/current/)

### - Download Project Files -

After you have the required programs installed, you can go ahead and download the project files. To do that, you either download the ZIP folder or do `git clone https://github.com/ShadeBot/ShadeBot-Discord-Bot.git` if you are a console person. Once you finish downloading it you will be ready to setup the config files.

### - Setup Config Files -

Once you download the project files you will see the `configbot.json` you'll need to fill it with how you would like ShadeBot to work.
As well as the config file, there's the jsonStorage which will contain a few files which can be edited of it's content. However all of them can be edited from within Discord.

#### < Windows >

Open the `installer.bat` file. This will install the required node modules (so you dont have to do it yourself) and create a `run.bat` file. You can use this file to start the bot. If you did everything correctly, the bot should start up fine.

If for some reason you have ran `installer.bat`, it disapeared and it didnt create `run.bat`, then re-download `installer.bat` and try again. Most likely either git or node were not installed correctly. Check if they work and try again.


#### < Linux / Mac >

Executable files are kind of weird in linux, and users most likely use console to do their work. So to setup this bot on linux or mac open a terminal in the directory you downloaded the files to and and either type `./installer.sh` or if the script doesn't work manually type `npm i`.

Once it is finished you can start the bot by using the `run.sh` script that will keep restarting the bo if it crashes (if the installer worked correctly) otherwise try `npm start` or `node self.js`. If you did everything correctly, the bot should start up fine.

### - Feautres -

#### Daily
Shadebot has a small Gambling system in it. Each day a user can come in and do ``#daily`` and can get **100 Shadebucks** which can be used towards roulette and a luckydip game which can let them gain more Shadebucks!

![Example of #daily](https://alipoodle.me/i/DRSuJ.png)

#### Events team points
The bot  handles our events team points, allowing users to cash out for items such as Steam Credit, or Custom Roles / Commands.

![Event team stuff](https://alipoodle.me/i/LhIC2.png)

#### Self assign Roles
As on many servers you have a few roles which users can "self assign". With Shadebot, there's a specific room which users can ask for a role and be provided with them.

![Roles](https://alipoodle.me/i/EzlLX.png)

#### Ban SA roles
"But I only want specific people, who have X role to gain this role", ShadeBot can do that!

![Roles2](https://alipoodle.me/i/r8V2H.png)

#### Muting system
Shadebot has a muting system that will add a specific role to a user to mute them and then will remove it at specific time. (Work in progress)

![Mute](https://alipoodle.me/i/PoFad.png)

#### Removal of Discord Links
Don't want stupid Discord links

![Discord Links](https://alipoodle.me/i/AjDof.png)

There's a many other things that Shadebot can do!

**Currently Shadebot is made more for the [Hentai server](https://discord.gg/0rJcIjZ54vYONbfJ). However has a config file to be able to change how it works!**
