const id = '1121290678396276866';
const rpc = require('discord-rpc');

const express = require('express');
const cors = require('cors');

const ipc = new rpc.Client({ transport: 'ipc' });

let current_activity = {
    details: 'Chilling',
    state: 'Idling in the main screen',
    largeImageKey: 'https://avatarfiles.alphacoders.com/896/thumb-89615.png',
    largeImageText: 'Idle',
    startTimestamp: new Date().getTime(),
};

function setActivity(activity) {
    if (!ipc) return;

    const activityObject = {};

    if (activity?.details !== null && activity?.details !== undefined) {
        activityObject.details = activity.details;
    }

    if (activity?.state !== null && activity?.state !== undefined) {
        activityObject.state = activity.state;
    }

    if (activity?.endTimestamp !== null && activity?.endTimestamp !== undefined) {
        activityObject.endTimestamp = activity.endTimestamp;
    }

    if (activity?.startTimestamp !== null && activity?.startTimestamp !== undefined) {
        activityObject.startTimestamp = activity.startTimestamp;
    }

    if (activity?.largeImageKey !== null && activity?.largeImageKey !== undefined) {
        activityObject.largeImageKey = activity.largeImageKey;
    }

    if (activity?.largeImageText !== null && activity?.largeImageText !== undefined) {
        activityObject.largeImageText = activity.largeImageText;
    }

    if (activity?.smallImageKey !== null && activity?.smallImageKey !== undefined) {
        activityObject.smallImageKey = activity.smallImageKey;
    }

    if (activity?.smallImageText !== null && activity?.smallImageText !== undefined) {
        activityObject.smallImageText = activity.smallImageText;
    }

    if (activity?.instance !== null && activity?.instance !== undefined) {
        activityObject.instance = activity.instance;
    }

    current_activity = activityObject;
    console.log(current_activity);

    ipc.setActivity(current_activity);
}


ipc.on('ready', () => {
    console.log('ready');
    setInterval(() => {
        setActivity(current_activity);
    }, 15e3);
});

ipc.login({ clientId: id }).catch(console.error);


const app = express();
app.use(cors());

let port = `3024`;
let hostname = 'localhost';

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/discord', (req, res) => {

    console.log("recived request: " + req);

    const details = req.query.details;
    const state = req.query.state;
    const largeImageKey = req.query.largeImageKey;
    const largeImageText = req.query.largeImageText;
    const smallImageKey = req.query.smallImageKey;
    const smallImageText = req.query.smallImageText;
    const startTimestamp = req.query.startTimestamp;
    const endTimestamp = req.query.endTimestamp;
    const instance = req.query.instance;

    const activityObject = {};
    ipc.clearActivity();

    if (details !== null && details !== undefined) {
        activityObject.details = details;
    }

    if (state !== null && state !== undefined) {
        activityObject.state = state;
    }

    if (largeImageKey !== null && largeImageKey !== undefined) {
        activityObject.largeImageKey = largeImageKey;
    }

    if (largeImageText !== null && largeImageText !== undefined) {
        activityObject.largeImageText = largeImageText;
    }

    if (smallImageKey !== null && smallImageKey !== undefined) {
        activityObject.smallImageKey = smallImageKey;
    }

    if (smallImageText !== null && smallImageText !== undefined) {
        activityObject.smallImageText = smallImageText;
    }

    if (endTimestamp !== null && endTimestamp !== undefined) {
        activityObject.endTimestamp = parseInt(endTimestamp);
    }

    if (startTimestamp !== null && startTimestamp !== undefined) {
        activityObject.startTimestamp = parseInt(startTimestamp);
    }

    if (instance !== null && instance !== undefined) {
        activityObject.instance = instance;
    }

    setActivity(activityObject);
    res.end("Operation completed");
});


