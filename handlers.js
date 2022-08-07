const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const txtomp3 = require("text-to-mp3");
const { youtube } = require('scrape-youtube');
const deepai = require('deepai');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

deepai.setApiKey(process.env.API_KEY);

module.exports = {
    "img": async (msg) => {
        msg.react("🤖");
        msg.reply("Generating image...");
        const text = msg.body.substring(5);
        console.log(text);
        try {
            const image = await deepai.callStandardApi("text2img", {
                text: text,
            });
            const media = await MessageMedia.fromUrl(image['output_url']);
            msg.reply(media);
        } catch (error) {
            console.log(error);
        }
    },

    "yt": async (msg) => {
        msg.react("🤖");
        msg.reply("Searching for video...");
        const text = msg.body.substring(4);
        console.log(text);
        try {
            const { videos } = await youtube.search(text);
            console.log(videos);
            const media = await MessageMedia.fromUrl(videos[0].thumbnail);
            chat = await msg.getChat();
            await chat.sendMessage(videos[0].title);
            await chat.sendMessage(media);
            await chat.sendMessage(videos[0].description);
            const link = videos[0].link.split("/").pop();
            await chat.sendMessage("https://www.youtube.com/watch?v=" + link, {"linkPreview": true});
        } catch (error) {
            console.log(error);
        }
    },

    "yta": async (msg) => {
        msg.react("🤖");
        msg.reply("Fetching audio...");
        console.log(msg);
        const downloader = new YoutubeMp3Downloader({
            "ffmpegPath": "C:/Program Files/ffmpeg/bin/ffmpeg.exe",
            "outputPath": ".",
            "youtubeVideoQuality": "highestaudio",
            "queueParallelism": 2,
            "progressTimeout": 2000,
            "allowWebm": false
        });
        downloader.download(msg.body.split("=").pop(), "audio.mp3");
        downloader.on("finished", function(err, data) {
            console.log(JSON.stringify(data));
            const media = MessageMedia.fromFilePath("audio.mp3");
            msg.reply(media);
        });
        downloader.on("error", (error) => {
            console.log(error);
        });
    },

    "tts": async (msg) => {
        msg.react("🤖");
        msg.reply("Generating audio...");
        const text = msg.body.substring(5);
        console.log(text);
        txtomp3.getMp3(text, (err, binaryStream) => {
            if (err) {
                console.log(err);
                return;
            }
            let audioStream = fs.createWriteStream("tts.mp3");
            audioStream.write(binaryStream);
            audioStream.on('finish', () => {
                const media = MessageMedia.fromFilePath("tts.mp3");
                msg.reply(media);
            })
            audioStream.end();
        });
    },

    "everyone": async (msg) => {
        msg.react("🤖");
        const chat = await msg.getChat();

        let text = "";
        let mentions = [];

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);

            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
}