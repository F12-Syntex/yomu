const { Client } = require("@xhayper/discord-rpc");

const client_id = "1121290678396276866";

const client = new Client({
  clientId: client_id
});

client.on("ready", async () => {
  await client.user?.setActivity({
    state: "Suffering with my life",
    details: "Pain and Suffering",
    startTimestamp: Date.now(),
    largeImageKey: "main",
    largeImageText: "me irl",
  });
});

client.login({ client_id }).catch(console.error);