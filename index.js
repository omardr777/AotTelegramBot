const { Telegraf } = require('telegraf');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const TOKEN = process.env.TOKEN
var moment = require('moment')
const bot = new Telegraf(TOKEN)
var episodes = [];
const EPS_IDS = require('./episodsis')

const epsID = EPS_IDS.Episods_ids
for (let i = 1; i <= 87; i++) {
    if (i <= 25) {
        episodes.push(`S1EP${i}`)
    }
    if (i > 25 && i <= 37) {
        episodes.push(`S2EP${i - 25}`)
    }
    if (i > 37 && i <= 49) {
        episodes.push(`S3P1EP${i - 37}`)
    }
    if (i > 49 && i <= 59) {
        episodes.push(`S3P2EP${i - 49}`)
    }
    if (i > 59 && i <= 75) {
        episodes.push(`S4P1EP${i - 59}`)
    }
    if (i > 75 && i <= 87) {
        episodes.push(`S4P2EP${i - 75}`)
    }

}
bot.start((ctx) => {
    ctx.reply('Welcome to Attack on titan downloader Bot ,\n choose an episode to download')
    sendStartMessage(ctx);
})

bot.action('start', ctx => {
    sendStartMessage(ctx);
})

const seasons = ['S1', 'S2', 'S3P1', 'S3P2', 'S4P1', 'S4P2']
bot.action(seasons, (ctx) => {
    ctx.deleteMessage();
    let season = ctx.match;
    let l = 0;
    console.log(season, typeof (season))
    switch (season[0]) {
        case 'S1':
            l = 25;
            break;
        case 'S2':
            l = 12;
            break;
        case 'S3P1':
            l = 12;
            break;
        case 'S3P2':
            l = 10;
            break;
        case 'S4P1':
            l = 16;
            break;
        case 'S4P2':
            l = 12;
            break;
    }
    let ep = [];
    let i = l;
    if (i > 0)
        while (i >= -2) {

            ep.push([])
            i -= 4;
        }

    let k = 1;
    let ii = 0;
    for (let i = 0; i < ep.length; i++) {
        ii = 0;
        while (k <= l && ii < 4) {
            ep[i].push({ text: `EP${k}`, callback_data: `${season}EP${k}` })
            ii++;
            k++;
        }
    }
    console.log(season[0])
    ep.push([{ text: 'back to main menu', callback_data: 'start' }])
    ctx.reply('Choose an episode', {
        "reply_markup": {
            'inline_keyboard':
                ep
        }
    })
})

bot.action(episodes, (ctx) => {
    ep = ctx.match;
    let epId;
    epId = epsID.find(e => e.episod === ep[0])
    if (epId != undefined)
        if (epId.type === 'mp4')
            ctx.telegram.sendVideo(ctx.chat.id, epId.id)
        else
            ctx.telegram.sendDocument(ctx.chat.id, epId.id)
    else {//if epID is not defined
        ctx.reply('Sorry, coming soon..')
        sendStartMessage(ctx)
    }

})

function sendStartMessage(ctx) {
    let startMessage = 'Choose a season';
    ctx.deleteMessage();
    ctx.reply(startMessage, {
        "reply_markup": {
            'inline_keyboard': [
                [{ text: 'S1', callback_data: 'S1' },
                { text: 'S2', callback_data: 'S2' },
                { text: 'S3 P1', callback_data: 'S3P1' }],
                [{ text: 'S3 P2', callback_data: 'S3P2' },
                { text: 'S4 P1', callback_data: 'S4P1' },
                { text: 'S4 P2', callback_data: 'S4P2' }]
            ]
        }
    })
}

bot.launch()
