require("dotenv").config();
var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var command = process.argv[2];
var instruction = process.argv[3];
var instruction2 = process.argv[4];
console.log("this is the command: ", command);

/* 
==================
TWITTER
==================
*/ 
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

var numTweets = 20;

if (command === "my-tweets") {
    var params = {screen_name: 'panierdecrabe', count: numTweets};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        tweets.forEach(function(element) {
            console.log(element.created_at);
            console.log(element.text);
          });
        }
    })
};

/* 
==================
SPOTIFY
==================
*/ 

/*
node liri.js spotify-this-song '<song name here>'
This will show the following information about the song in your terminal/bash window

Artist(s)
The song's name
A preview link of the song from Spotify
The album that the song is from

If no song is provided then your program will default to "The Sign" by Ace of Base.
*/

// search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
if (command === "spotify-this-song") {
    var track = instruction + " " + instruction2;
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
      });
    console.log("this is spotify" + JSON.stringify(spotify))   
      spotify
        .search({ type: 'track', limit: 5, query: track })
        .then(function(response) {
            response.tracks.items.forEach(function(element) {
                console.log("***************")
                console.log("Track Name: ", element.name);
                console.log("Album: ", element.album.name);
                console.log("Artist: ", element.artists[0].name);
                // console.log("Other info from 'Artists': ", element.artists);
                console.log("URL: ", element.href) // which will not work without the token ID
                console.log("***************")
            });
                
        })
        .catch(function(err) {
          console.log(err);
        });

}




/*
node liri.js movie-this '<movie name here>'

This will output the following information to your terminal/bash window:

   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.


If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.
*/


/* 
node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Feel free to change the text in that document to test out the feature for other commands.

*/