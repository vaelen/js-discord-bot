/*
js-discord-bot
Copyright (C) 2020 Andrew C. Young <andrew@vaelen.org>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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