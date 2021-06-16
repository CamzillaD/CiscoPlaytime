import xapi from 'xapi';

// Direct link to the raw code to be ran
const CodeURL = '';

// Super hacky hack to bootstrap into the actual code from the git repository
xapi.Command.HttpClient.Get({ Url: CodeURL })
    .then(res => {
        eval(res.Body);
    }, err => console.log(err));
