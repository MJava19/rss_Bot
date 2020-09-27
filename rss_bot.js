const exspress = require('express');
const app = new exspress();
let schedule = require('node-schedule');
const RssParser = require('feedparser');
const fetch = require('node-fetch');
const port = 3080;
const TelegramBot = require('node-telegram-bot-api');
const url = 'https://836b5b726c61.ngrok.io';
const TOKEN = '828929063:AAG3PrnDkzXqQVqK6CCSp9jEUuFQ6e8pCXI';
const bot = new TelegramBot(TOKEN);

bot.setWebHook(`${url}/bot`);
app.use(exspress.json());
app.use(exspress.urlencoded({extended: true}));
let news_link = new Set();

    app.post(`/bot`, function (request, resp) {
        schedule.scheduleJob('*/5 * * * *', function () {
            let req = fetch('https://news.ycombinator.com/rss');
            let feedparser = new RssParser();
        req.then(function (res) {
            if (res.status !== 200) {
                throw new Error('Bad status code');
            } else {
                res.body.pipe(feedparser);
            }
        }, function (err) {
        });

        feedparser.on('error', function (error) {
        });

        feedparser.on('readable', function () {
            let stream = this;
            let item;
            item = stream.read();
            if (news_link.has(item.link)) {

            } else {
                news_link.add(item.link);
                bot.sendMessage(request.body.message.from.id, item.link);
            }
        });
    });
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

