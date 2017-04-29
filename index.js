// VARIBALES
var express = require('express');
var OAuth2 = require('oauth').OAuth2; 
var https = require('https');
var Twitter = require('twitter-node-client').Twitter;

var bodyParser = require('body-parser');

var app = express();
var error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
    console.log('Data [%s]', data);
};
var config = {
    "consumerKey": "FafB4L4DwoIsj79ZCpQblyZgR",
    "consumerSecret": process.env.CONSUMER_SECRET,
    "accessToken": "491620559-BlLTNnN9SAcWJS64epbJMgjUrbKfU1wfxIjGXd5O",
    "accessTokenSecret": process.env.ACCESS_SECRET 
};

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running on port ' + port);
});

//TWITTER AUTHENICATION
var token = null;
var oauth2 = new OAuth2(config.consumerKey, config.consumerSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
        'grant_type': 'client_credentials'
        }, function (e, access_token) {
        token = access_token;
        });

//APP CONFIG
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//public is the folder your angular application is in.
//This allows your angular app to handle routing when you hit the URL root (/)
app.use(express.static('public'));

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

var twitter = new Twitter(config);

//Example calls

twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);
twitter.getMentionsTimeline({ count: '10'}, error, success);
twitter.getHomeTimeline({ count: '10'}, error, success);
twitter.getReTweetsOfMe({ count: '10'}, error, success);
twitter.getTweet({ id: '1111111111'}, error, success);

//
// Get 10 tweets containing the hashtag haiku
//
twitter.getSearch({'q':'#haiku','count': 10}, error, success);

//
// Get 10 popular tweets with a positive attitude about a movie that is not scary 
//
twitter.getSearch({'q':' movie -scary :) since:2013-12-27', 'count': 10, 'result\_type':'popular'}, error, success);

