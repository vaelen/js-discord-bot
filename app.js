var fs = require("fs");
const Discord = require('discord.js');
const Twitter = require('twitter');

var loadJSON = function (filename) {
    return JSON.parse(fs.readFileSync(filename));
}

config = loadJSON("config.json");

const twitter = new Twitter(config.twitter);
const discord = new Discord.Client();

var searchTweets = function (query, msg) {
    console.log(`Searching for ${query}`);
    twitter.get('search/tweets', { q: query }, function (error, tweets, response) {
        if (error !== null) {
            msg.reply(`Error: ${error}`);
        } else if (tweets.statuses.length == 0) {
            msg.reply("Sorry, I couldn't find anything.");
        } else {
            msg.reply(tweets.statuses[0].text)
        }
    });
}

discord.on('ready', () => {
    console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
    if (msg.content.match(/.*[wW]hat time is it.*/) !== null) {
        msg.reply(`The time is ${new Date().toLocaleTimeString()}`);
    }
    var twitter_matches = msg.content.match(/.*[tT]ell me about (.*)$/);
    if (twitter_matches !== null) {
        searchTweets(twitter_matches[1], msg);
    }
});

discord.login(config.discord_key);