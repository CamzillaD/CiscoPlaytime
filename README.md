# CiscoPlaytime
Playtime project for group 6

## How to setup Jokobot

### Setup a bot and get a bot token
1. Go to [https://developer.webex.com/](https://developer.webex.com/) and log in.
2. Klick on your profile picture in the top right corner.
3. Go on "My Webex Apps".
4. Go on "Create a New App".
5. Go on "Create a Bot".
6. Follow the instructions to create a bot.
7. You should receive a bot token in the process.

### Find your Room ID
1. Go to [https://developer.webex.com/docs/api/v1/rooms/list-rooms](https://developer.webex.com/docs/api/v1/rooms/list-rooms) and log in.
2. Press the yellow "Run" button on the right.
3. From the JSON result you get, you can find the Room ID under the field "id" where the "title" field is your desired room to share jokes with.

### Finishing the setup
1. Make sure your bot is added to your desired space.
2. Copy the content of `joke.js` to your macro editor via the web interface of your webex device.
3. Enter your bot token in line 6 of the script.
4. Enter your Room ID in line 7 of the script.
5. Save the script.
6. The jokobot should now be available on your webex device.
