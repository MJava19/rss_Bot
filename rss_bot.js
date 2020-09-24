const exspress = require('express');
const app = new exspress();
let schedule = require('node-schedule');
const RssParser = require('feedparser');
const fetch = require('node-fetch');
const req = fetch('https://news.ycombinator.com/rss');
const port = 3080;
const TelegramBot = require('node-telegram-bot-api');
const url = 'https://98809c2b5f63.ngrok.io';
const TOKEN = '828929063:AAG3PrnDkzXqQVqK6CCSp9jEUuFQ6e8pCXI';
const bot = new TelegramBot(TOKEN);

bot.setWebHook(`${url}/bot`);
app.use(exspress.json());
app.use(exspress.urlencoded({extended: true}));
let feedparser = new RssParser();


    app.post(`/bot`, function (request, resp) {

        schedule.scheduleJob('*/1 * * * *', function () {
            console.log('1 minute');
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
            bot.sendMessage(request.body.message.from.id, item.link);
        });
    });
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

