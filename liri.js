require("dotenv").config();
var keys = require("./keys.js")
var Twitter = require('twitter');

// This looks like it's built from an object constructor... ?
// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

var command = process.argv[2]
console.log("this is the command: ", command);

/* 
node liri.js my-tweets
This will show your last 20 tweets and when they were created at in your terminal/bash window.
*/ 
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

// client.get(path, params, callback);
// count should be 20
var numTweets = 20;

if (command === "my-tweets") {
    var params = {screen_name: 'panierdecrabe'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        // var data = JSON.parse(tweets)
        // console.log(tweets);

        tweets.forEach(function(element) {
            console.log(element.created_at);
            console.log(element.text);
          });
          



        // console.log(tweets[0].created_at);
        // console.log(tweets[0].text);
        }
    })
};
    
    // });
// }
    // client.get('statuses/home_timeline', function(error, tweets, response) {
    //     if(error) throw error;
    //     console.log(JSON.stringify(response,null,2));
    //     console.log(JSON.stringify(response.text));  // The favorites. 
    //     console.log(response.created_at);  // Raw response object. 
//       });
// }



/*
node liri.js spotify-this-song '<song name here>'
This will show the following information about the song in your terminal/bash window

Artist(s)
The song's name
A preview link of the song from Spotify
The album that the song is from

If no song is provided then your program will default to "The Sign" by Ace of Base.
*/

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