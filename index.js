// VARIBALES
var express = require('express');
var OAuth2 = require('oauth').OAuth2; 
var https = require('https');
var Twitter = require('twitter-node-client').Twitter;

var bodyParser = require('body-parser');

var app = express();

var config = {
    "consumerKey": "FafB4L4DwoIsj79ZCpQblyZgR",
    "consumerSecret": process.env.CONSUMER_SECRET,
    "accessToken": "491620559-BlLTNnN9SAcWJS64epbJMgjUrbKfU1wfxIjGXd5O",
    "accessTokenSecret": process.env.ACCESS_SECRET 

};
console.log(process.env.CONSUMER_SECRET);
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
    console.log('ERROR [%s]', JSON.stringify(err));
};
var success = function (data) {
    console.log('Data [%s]', data);
};

var twitter = new Twitter(config);

var parameters = {
    screen_name: "NoahMoroze",
}; 

app.post('/getfollowers', function (req, res) {
    twitter.getFollowersList({ screen_name: req.body.name }, error, function(data) {
        res.send(JSON.stringify(parse_followers(data)));
    }); 
}); 

function parse_followers(data) {
    var graph_data = {
        nodes: [],
        links: []
    }; 

    data = JSON.parse(data); 
    var users = data.users; 
    for(var i=0; i<users.length; i++) {
        graph_data.nodes.push({
            name: users[i].name,
            group: 1,
            picture: users[i].profile_image_url
        });
        graph_data.links.push({
            source: i+1,
            target: 0,
            value: 1
        }); 
    }
    return data; 
}
