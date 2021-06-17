import xapi from 'xapi';

const JokeAPIURL = 'https://official-joke-api.appspot.com/random_joke';
let currentJoke = null;
const webexMsgUrl = 'https://webexapis.com/v1/messages';
const yourBotToken = '';
const playtimeRoomID = '';

const jokeButtonId = 'joke_button'
const jokeButtonXML = `
<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>1000</Order>
    <Type>Global</Type>
    <Icon>Language</Icon>
    <Color>#07C1E4</Color> 
    <Name>Joke</Name>
    <ActivityType>Custom</ActivityType>
  </Panel>
</Extensions>
`

const jokeSetupPanel = {
  id: 'joke_setup_panel',
  setupTextId: 'joke_setup_text',
  buttonId: 'joke_setup_punchline_button',
}
const jokeSetupPanelXML = `
<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Page>
      <Name>Joke!</Name>
      <Row>
        <Widget>
          <WidgetId>${jokeSetupPanel.setupTextId}</WidgetId>
          <Type>Text</Type>
          <Options>size=5;align=center</Options>
        </Widget>
      </Row>
      <Row>
        <Widget>
          <WidgetId>${jokeSetupPanel.buttonId}</WidgetId>
          <Type>Button</Type>
          <Name>Punchline me!</Name>
          <Options>size=5</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>
`

const jokePunchlinePanel = {
  id: 'joke_punchline_panel',
  punchlineTextId: 'joke_punchline_text',
  shareButtonId: 'joke_punchline_share',
  closeButtonId: 'joke_punchline_close'
}
const jokePunchlinePanelXML = `
<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Page>
      <Name>Punchline!</Name>
      <Row>
        <Widget>
          <WidgetId>${jokePunchlinePanel.punchlineTextId}</WidgetId>
          <Type>Text</Type>
          <Options>size=5;align=center</Options>
        </Widget>
      </Row>
      <Row>
        <Widget>
          <WidgetId>${jokePunchlinePanel.closeButtonId}</WidgetId>
          <Type>Button</Type>
          <Name>😂</Name>
          <Option>size=2;align=left</Option>
        </Widget>
        <Widget>
          <WidgetId>${jokePunchlinePanel.shareButtonId}</WidgetId>
          <Type>Button</Type>
          <Name>Share it!</Name>
          <Option>size=2;align=right</Option>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>
`

const maxNumJokes = 12;
function getCustomJoke()
{
    const jokes = [   
    {"id":1 ,"setup": "What do you call the phenomenon where nobody can hear you on Webex?", "punchline": "A Mute-atetion"},
    {"id":2, "setup": "No one turns on their camera in Webex", "punchline": "they have been infected by Novid-19"},
    {"id":3, "setup": "I told a joke during a Webex meeting", "punchline": "It wasn’t even remotely funny"},
    {"id":4, "setup": "Whats the best thing about Switzerland?", "punchline": "I don't know but the flag is a big plus!"},
    {"id":5, "setup": "Why are American doctors who circumcize little boys so rich?", "punchline": "Because they keep the tip"},
    {"id":6, "setup": "How does NASA set up a conference call?", "punchline": "They planet"},
    {"id":7, "setup": "What did Microsoft employees say to Bill Gates after his motivational speech?", "punchline": "Word"},
    {"id":8, "setup": "Why are Microsoft employees never relaxed?", "punchline": "Because they're always on Edge"},
    {"id":9, "setup": "An Englishman, a Frenchman, a Spaniard, and a Norwegian are all on a Web call with their boss. The boss asks, can you all see meex?", "punchline": "They answered: Yes, Oui, Si, Ja"},
    {"id":10, "setup": "What's it called when you finish a joke again?", "punchline": "Punchline!"},
    {"id":11, "setup": "I have a dog named Cosine. Do you know why it had to pee about every six hours?", "punchline": "Because he is two pee periodic!"},
    {"id":12, "setup": "Do you know what I told my boss after I was late while working from home?", "punchline": "\"You wouldn't believe the network traffic!\""}
    ]

    let randomValue = Math.round(Math.random() * maxNumJokes);
    return jokes[randomValue];
}

function showJoke(event)
{
    if (event.PanelId != jokeButtonId)
    {
        return;
    }

    // Setup the joke setup panel
    xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: jokeSetupPanel.id}, jokeSetupPanelXML);

    // There are 387 API jokes and maxNumJokes custom jokes so this gives an equal chance of picking any API joke and any custom joke
    let randchoice = Math.round((Math.random() * (387 + maxNumJokes)));

    if (randchoice >= maxNumJokes)
    {
        xapi.Command.HttpClient.Get({ Url: JokeAPIURL })
        .then(response => {
            currentJoke = JSON.parse(response.Body);
            // Open the setup panel and write the joke setup to the panel's text widget
            xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId: jokeSetupPanel.id });
            xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value: currentJoke.setup, WidgetId: jokeSetupPanel.setupTextId});
        })
        .catch(() => {});
    }
    else
    {
        currentJoke = getCustomJoke();
        xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId: jokeSetupPanel.id });
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value: currentJoke.setup, WidgetId: jokeSetupPanel.setupTextId});
    }
}

// For some reason this is called 3 times in quick succession so we do some "debouncing" on the calls
let punchlineDebouncing = false;
function showPunchline(event)
{
    if (event.WidgetId != jokeSetupPanel.buttonId)
    {
      return;
    }

    if (punchlineDebouncing)
    {
        return;
    }

    punchlineDebouncing = true;
    setTimeout(() => { punchlineDebouncing = false; }, 1000);

    // Close the joke setup panel and open the one for the punchline
    xapi.Command.UserInterface.Extensions.Panel.Close();
    xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: jokePunchlinePanel.id}, jokePunchlinePanelXML);
    xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId: jokePunchlinePanel.id });

    // Write the punchline to the panel
    xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value: currentJoke.punchline, WidgetId: jokePunchlinePanel.punchlineTextId });
}

function sendMessage(token, toPersonEmail, roomId, markdown)
{
    const headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' + token,
    ];
  
    const body = Object.assign({ markdown }, toPersonEmail ? { toPersonEmail } : { roomId });
    return xapi.Command.HttpClient.Post({ Header: headers, Url: webexMsgUrl }, JSON.stringify(body));
}

let shareJokeDebouncing = false;
function shareJoke(event)
{
    // Close the panel
    if (event.WidgetId == jokePunchlinePanel.closeButtonId)
    {
        xapi.Command.UserInterface.Extensions.Panel.Close();
        return;
    }

    if (event.WidgetId != jokePunchlinePanel.shareButtonId)
    {
        return;
    }

    if (shareJokeDebouncing)
    {
        return;
    }

    shareJokeDebouncing = true;
    setTimeout(() => { shareJokeDebouncing = false; }, 1000);

    sendMessage(yourBotToken, null, playtimeRoomID, currentJoke.setup);
    setTimeout(() => sendMessage(yourBotToken, null, playtimeRoomID, currentJoke.punchline), 5000);    
}

// Create the joke button
xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: jokeButtonId }, jokeButtonXML);
// Register for joke button pushes
xapi.Event.UserInterface.Extensions.Panel.Clicked.on(showJoke);
// Register for widget pushes to capture the "get punchline" button pushes on the setup panel
xapi.Event.UserInterface.Extensions.Widget.Action.on(showPunchline);
// Register for widget pushes to capture the "share joke" button push on the punchline panel
xapi.Event.UserInterface.Extensions.Widget.Action.on(shareJoke);
