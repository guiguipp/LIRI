require("dotenv").config();
var fs = require("fs");
var inquirer = require("inquirer");
var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var command = process.argv[2];
var instruction = process.argv[3];
var instruction2 = process.argv[4];
// console.log("this is the command: ", command);

/*
==================
INQUIRER
==================
*/
inquirer.prompt([
    {
      type: "list",
      message: "What can I do for you?",
      choices: ["Show Tweets", "Search a song", "Search a movie"],
      name: "action"
    },
  ])
  .then(function(response) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (response.action === "Show Tweets") {
      console.log(`Ok! Here are your latest tweets:\n`);
        showTweets();
    }
    else if (response.action === "Search a song") {
        inquirer.prompt([
        {
        type: "input",
        message: "Alright! What track do you want me to search?",
        name: "track"
        },
        ])
        .then(function(songInput) {            
            if (songInput.track) {
                searchSpotify(songInput.track);
            }
            else {
                searchSpotify("I saw the sign")
            }
        })
    }

    else if (response.action === "Search a movie") {
        inquirer.prompt([
            {
            type: "input",
            message: "Got it! ;)\nWhich movie's information do you need?",
            name: "movie"
            },
            ])
            .then(function(movieInput) {
                if (movieInput.movie === "Space Jam") {
                    inquirer
                    .prompt([
                      {
                        type: "confirm",
                        message: "...really?",
                        name: "confirm",
                        default: true
                      },
                    ])
                      .then(function(sure) {
                        if (sure.confirm) {
                            searchMovie(movieInput.movie);
                        }
                    });
                }            
                else if (movieInput.movie) {
                    searchMovie(movieInput.movie);
                }
                else {
                    searchMovie("Mr. Nobody")
                }
            })
        }
        else {
        console.log("\nNot sure what to do? You can show your last tweets, search a song in Spotify, or a movie in the OMDB!\n");
        }
    });


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
    showTweets();
};

function showTweets() {
    var params = {screen_name: 'panierdecrabe', count: numTweets};
    writeLog("Twitter",params.screen_name)
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

        tweets.forEach(function(element) {
            console.log(`***********************************`);
            console.log(`On ${element.created_at}`);
            console.log(`***********************************\n`);
            if(element.retweeted_status != undefined) {
                console.log(`Retweeted a tweet from user "${element.retweeted_status.user.name}".\nHere is the original tweet:\n\n${element.retweeted_status.text}`)
            }
            else {
                console.log(`Original tweet:\n${element.text}`);
            }
            console.log("--------------------\n");            
          });
        }
    })
}
/* 
==================
SPOTIFY
==================
*/ 

// search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
if (command === "spotify-this-song") {
 searchSpotify()   
}

function searchSpotify (searchedTrack) {
    let track = searchedTrack;
    writeLog("song",track)
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
        });
        spotify.search({ 
            type: 'track', 
            limit: 5, 
            query: track 
        })
        .then(function(response) {
            response.tracks.items.forEach(function(element) {
                var log = `\n***************\nTrack Name: ${element.name}\nAlbum: ${element.album.name}\nArtist: ${element.artists[0].name}\nURL: ${element.href}\n***************`
                console.log(log);                
                // writeLog("song", log)
            });
        })
        .catch(function(err) {
            console.log(err);
        });
    }   

/*
===============
OMDB
===============
*/

if (command === "movie-this") {
    let movie = instruction + "+" + instruction2;
}

function searchMovie (movieName) {
    let query = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    writeLog("movie", movieName)
    request(query, function (error, response, body) {
    if (!error) {
        let data = JSON.parse(body);
        console.log(`Got it! Here is your info:\n\n**********\nTitle of the movie: ${data.Title}\nYear the movie came out: ${data.Year}\nCountry where the movie was produced: ${data.Country}\nLanguage of the movie: ${data.Language}.\n\nPlot of the movie:\n"${data.Plot}"\n\nCast: ${data.Actors}\n`)
        data.Ratings.forEach(function(element) {
            console.log(`${element.Source} rating of the movie: ${element.Value}`)
        });
        console.log(`\n**********\n`);
    }
    else {
        console.log('error:', error); 
        console.log('statusCode:', response && response.statusCode);
    }
});
}

/* 
node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Feel free to change the text in that document to test out the feature for other commands.

*/


/*
===============
FS
===============
*/
function writeLog(type, log){
    fs.appendFile("log.txt",`\nNew ${type} log: ${log}`,encoding='utf8',function(err){
        if(err){
            console.log("Failed to write files: ",err);
        }
        else {
            console.log(`Logged`);
        }
    })
}


/* 
BUGS:
Spotify: Search for both tracks and albums
*/