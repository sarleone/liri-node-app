// Read and set environment variables with the dotenv package
require("dotenv").config();
//console.log(process.env);
// Import the keys.js and store in variable
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
//require fs node package
var fs = require("fs");

//console.log("*** HERE I AM ***", process.env.TWITTER_CONSUMER_KEY); 

//set up inputs from user
var command = process.argv[2];
var output = "";
for (var i = 3; i < process.argv.length; i++) {
    output += process.argv[i] + " ";
};

// Create a switch-case statement to run the action chosen
switch (command) {
    case "my-tweets":
        tweets();
        break;
    
    case "spotify-this-song":
        songInfo();
        break;
    
    case "movie-this":
        movieInfo();
        break;
    
    case "do-what-it-says":
        doIt();
        break;
}
// If the "tweets" function is called
function tweets() {
    //call on keys
    var client = new Twitter(keys.twitter);
    //set params for search
    var params = {
        screen_name: 'Sarah_M_L',
        count: 20
    };
    //get tweets! and log when they are created!
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet: ");
                console.log(tweets[i].text);

                console.log("Date Created: ");
                console.log(tweets[i].created_at);
                console.log("--------------------------------------------------");
    //************BONUS add info to log.txt**********/
                fs.appendFile("log.txt", (
                    "\nTweet: " + tweets[i].text + 
                    "\nDate Created: " + tweets[i].created_at + 
                    "\n--------------------------------------------------"), function(err) {
                if (err) {
                    return console.log(err);
                };
                    //console.log("log.txt was updated!");
                    
                });
            };
        };
    });
};

// If the "spotify-this-song" is called
function songInfo() {
    //if you don't enter anything, return results for The Sign
    var songTitle = output ? output : "'The Sign' by Ace of Base";

    console.log(output);
    //call the keys for reaching Spotify
    var spotify = new Spotify(keys.spotify);
    //tell Spotify what kind of search you are making
    spotify.search({ 
        type: 'track', 
        query: songTitle 
    }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //grab da object created by track    
        var songInfo = data.tracks.items;

        //loop through the info you just grabbed and grab specific info
        for (var i = 0; i < songInfo.length; i++) {
            //Artist(s)
            var artists = songInfo[i].artists[0].name;
            //The song's name
            var songName = songInfo[i].name;
            //A preview link of the song from Spotify
            var preview = songInfo[i].album.external_urls.spotify;
            //The album that the song is from
            var album = songInfo[i].album.name;
        
        //Print our newly collected song info in console
        console.log("Song Title: " + songName + 
            "\nArtist(s): " + artists +
            "\nAlbum: " + album +
            "\nPreview: " + preview +
            "\n------------------------------------------------------------" + "\n"
        )
    //************BONUS add info to log.txt**********/
        fs.appendFile("log.txt", (
            "\nSong Title: " + songName + 
            "\nArtist(s): " + artists + 
            "\nAlbum: " + album +
            "\nPreview: " + preview +
            "\n--------------------------------------------------"), function(err) {
        if (err) {
            return console.log(err);
        };
            //console.log("log.txt was updated!");
            
        });
        };
    
    });
};

//if "movie-this" is called...
function movieInfo() {
    //if there are no entries, give results for 'Mr. Nobody'
    var movieName = output ? output: "Mr. Nobody";
    console.log(output);

    //make a variable with your queryUrl
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=26420b91";

    //use request to get your info!
    request(queryUrl, function(err, response, body){
        if(err) {
            return console.log("Error occurred: " + err);
        };
        //if there are no errors and everything is coming in clear, lets rock and roll
        if (!err && response.statusCode === 200) {
        //store the info we are collecting into variables
            //Title of the movie.
            var title = JSON.parse(body).Title;
            //Year the movie came out.
            var year = JSON.parse(body).Year;
            //IMDB Rating of the movie.
            var imbdRating = JSON.parse(body).imbdRating;
            //Rotten Tomatoes Rating of the movie.
            var rtRating = JSON.parse(body).Ratings[1].Value;
            //Country where the movie was produced.
            var country = JSON.parse(body).Country;
            //Language of the movie.
            var lang = JSON.parse(body).Language;
            //Plot of the movie.
            var plot = JSON.parse(body).Plot;
            //Actors in the movie.
            var actors = JSON.parse(body).Actors;
        
        //Show movie data collected in console
            console.log(
                "Title: " + title +
                "\nYear Released: " + year +
                "\nIMBD Rating: " + imbdRating +
                "\nRotten Tomatoes Rating: " + rtRating +
                "\nCountry produced: " + country +
                "\nLanguage(s) spoken: " + lang +
                "\nPlot: " + plot +
                "\nActors: " + actors +
                "\n-------------------------------------------------------------"
            )
        //************BONUS add info to log.txt**********/
            fs.appendFile("log.txt", (
                "\nTitle: " + title +
                "\nYear Released: " + year +
                "\nIMBD Rating: " + imbdRating +
                "\nRotten Tomatoes Rating: " + rtRating +
                "\nCountry produced: " + country +
                "\nLanguage(s) spoken: " + lang +
                "\nPlot: " + plot +
                "\nActors: " + actors +
                "\n--------------------------------------------------"), function(err) {
            if (err) {
                return console.log(err);
            }; 
            });
        };
    });
};
//if you select "do-what-it-says"...
function doIt() {
    //read the random.txt file
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err) {
            return console.log(err);
        }
        //split the text in file by comma
        var dataArray = data.split(",");
        //console.log(dataArray);
        //set the first word in array equal to command
        command = dataArray[0];
        //set the second phrase in array equal to output
        output = dataArray[1];
        //run the switch statements with funtions that you ran earlier (minus doIt)
        switch (command) {
            case "my-tweets":
                tweets();
                break;
            
            case "spotify-this-song":
                songInfo();
                break;
            
            case "movie-this":
                movieInfo();
                break;
        };
    });
};
