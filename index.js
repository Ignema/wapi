require('dotenv').config()
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const handlers = require('./handlers');

const groups = ["Wapi Testing"]

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('message', async msg => {
//     chat = await msg.getChat();
//     if (!chat.isGroup || !groups.includes(chat.name)) return;
//     msg.react("🤖");
//     if(msg.hasMedia) {
//         const media = await msg.downloadMedia();
//         msg.reply(media);
//     } else {
//         msg.reply(msg.body);
//     }
// });

client.on('message', async msg => {
    chat = await msg.getChat();
    if (!chat.isGroup || !groups.includes(chat.name)) return;
    Object.keys(handlers).forEach(async key => {
        if (msg.body.split(" ")[0] === `@${key}` && !msg.body.includes("everyone")) {
            await handlers[key](msg);
        }
    });
});

client.initialize();