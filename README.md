# Discord Member Organizer Bot

If you're reading this, you've stumbled upon a simple bot I created to streamline member organization for a specific Discord server I'm a part of. Please note that this bot is primarily tailored to work with that specific Discord server and a designated website.

## Setup for Other Discord Servers

To adapt this bot for use on other Discord servers, follow these steps:

1. Create a new `.env` file with the following values:

   ```env
   TOKEN = BOT TOKEN
   GUILD_ID = ID OF YOUR DISCORD SERVER
   CLIENT_ID = ID OF YOUR BOT
   DB_HOST = localhost
   POSTGRES_USER = POSTGRES USERNAME
   POSTGRES_DB = DATABASE NAME
   POSTGRES_PASSWORD = POSTGRES PASSWORD
   FORCE_DB_RESET = false
   LUMINARY_USERNAME = *delete if not using bot to scrape data from the Luminary website*
   LUMINARY_PASSWORD = *delete if not using bot to scrape data from the Luminary website*
   FIRST_TIME_STARTUP = true
   STAFF_ROLE = STAFF ROLE ON DISCORD SERVER
   TRANSLATOR_ROLE = TRANSLATOR ROLE ON DISCORD SERVER
   MTLTRANSLATOR_ROLE = MTL TRANSLATOR ROLE ON DISCORD SERVER
   EDITOR_ROLE = EDITOR ROLE ON DISCORD SERVER
   AUTHOR_ROLE = AUTHOR ROLE ON DISCORD SERVER
   NEW_RELEASES_CHANNEL = ID OF NEW RELEASES CHANNEL ON DISCORD SERVER```

Customize the values in the .env file to match the specifications of your Discord server.
Please note that forking this bot might not be practical. I created it for the sake of experimentation and fun. The web scraper is hard-coded to scan only the Luminary Novels website, and the PostgreSQL database configuration is also hard-coded. Modifying this bot for use with other sites would require significant effort.