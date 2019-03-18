//Requires dotenv to gain access to secret api keys
require("dotenv").config();

//requires the NPM modules for accessing the spotify API
var Spotify = require('node-spotify-api');

//requires the information contained in the keys.js file to access spotify API
var SpotifyKeys = require('./keys.js');

//requires the Node Module fs for accessing do-what-it-says
var fs = require('fs');

//requires the Node Module axios for accessing ombd API and bands in town API
var axios = require('axios');

//Requires the NPM module for moment.js
var moment = require('moment');

//Output file for logs
var filename = './log.txt';

//NPM module used for logging
var log = require('simple-node-logger').createSimpleFileLogger(filename);

//All log info is allowed in log.txt
log.setLevel('all');


//Operation that user desires to process
var operation = process.argv[2];
//The argument the operation will process
var argument = "";

//Fuction that determines the operation and argument to process and return data
processOperation(operation, argument);

//Switch statement function to determine which operation to process
function processOperation(operation, argument) {
    argument = grabArgument();
    switch (operation) {
        //Movie-this
        case "movie-this":
        //Grabs movieTitle
        var movieTitle = argument;
        //When no movie given then process default
        if ( movieTitle === "") {
            defaultMovie();
        } else {
            //Grab the movie info
            returnMovie(movieTitle);
        }
        break;
        //Spotify API
        case "spotify-this-song":
        //return songTitle
        var songTitle = argument;
        //When no songTitle given then process default
        if ( songTitle === "") {
            defaultSong();
        } else {
            //Grab the song info
            returnSong(songTitle);
        }
        break;
        //Concert-this
        case "concert-this":
        //Grab artistName
        var artistName = argument;
        //When no artistName then process default
        if (artistName === "") {
            defaultArtist();
        } else {
            //Grab the event info
            returnArtist(artistName);
        }
        break;
        //do-what-it-says
        case "do-what-it-says":
        //Process random.txt operation
        doWhatItSays();
        break;
    };
};

//Returns the argument
function grabArgument() {
    //storing all arguments
    argumentArray = process.argv;
    //Loop through all arguments
    for ( var i = 3; i < argumentArray.length; i++) {
        argument += argumentArray[i];
    }
    return argument;
};

//Movie-this
function returnMovie(movieTitle) {
    //Call to OMDB for movie data
    axios.get('http://omdbapi.com/?apikey=trilogy&t=' + movieTitle)
    .then(function(response) {
        logData('Operation: node liri.js movie-this ' + movieTitle);
        logData('Title: ' + response.data.Title);
        logData('Year: ' + response.data.Year);
        logData('IMDB Rating: ' + response.data.Ratings[0].Value);
        logData('Rotton Tomatoes Rating: ' + response.data.Ratings[1].Value);
        logData('Country ' + response.data.Country);
        logData('Language ' + response.data.Language);
        logData('Plot ' + response.data.Plot);
        logData('Actors ' + response.data.Actors);
        logData("============");
    })
    .catch(function(error) {
        logData(error);
    });
};

//DefaultMovie
function defaultMovie() {
    //Call to OMDB for default movie, Mr. Nobody
    axios.get('http://omdbapi.com/?apikey=trilogy&t=Mr.+Nobody')
    .then(function(response) {
        logData('Operation: node liri.js movie-this ' + response.data.Title);
        logData('Title: ' + response.data.Title);
        logData('Year: ' + response.data.Year);
        logData('IMDB Rating: ' + response.data.Ratings[0].Value);
        logData('Rotton Tomatoes Rating: ' + response.data.Ratings[1].Value);
        logData('Country ' + response.data.Country);
        logData('Language ' + response.data.Language);
        logData('Plot ' + response.data.Plot);
        logData('Actors ' + response.data.Actors);
        logData("============");
    })
    .catch(function(error) {
        logData(error);
    });
};

//Spotify-this-song
function returnSong(songTitle) {
    //set spotify var to the key info to make API call
    var spotify = new Spotify(SpotifyKeys.spotify);
    spotify
    .search({ type: 'track', query: songTitle})
    .then(function(response) {
        var artistsArray = response.tracks.items[0].album.artists;
        var artistNames = [];
        for ( var i = 0; i < artistsArray.length; i++) {
            artistNames.push(artistsArray[i].name);
        }
        var artists = artistNames.join(", ");
        logData("Operation: spotify-this-song " + response.tracks.items[0].name);
        logData("Artist: " + artists);
        logData("Song: " + response.tracks.items[0].name);
        logData("Spotify Preview URL: " + response.tracks.items[0].preview_url);
        logData("Album Name: " + response.tracks.items[0].album.name);
        logData("============");
    })
    .catch(function(err) {
        console.log(err);
        logData(err);
    });
};

//DefaultSong
function defaultSong() {
    //set spotify var to the key info to make API call
    var spotify = new Spotify(SpotifyKeys.spotify);
    //search spoitfy by track name
    spotify
    .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
    .then(function(response) {
        logData("Operation: spotify-this-song " + response.name);
        logData("Artist: " + response.artists[0].name);
        logData("Song " + response.name);
        logData("Spotify Preview URL: " + response.preview_url);
        logData("Album Name: " + response.album.name);
        logData("============");
    })
    .catch(function(err) {
        console.log(err);
        logData(err);
    });
};

//Concert-this
function returnArtist(artistName) {
    //Call bandsintown API
    axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp")
    .then(function(response) {
        //Loop through response data
        for ( var i = 0; i < 3 && i < response.data.length; i++) {
            //Log data and use moment.js for datetime
            logData("Operation: node liri.js concert-this " + artistName);
            logData("Venue Name: " + response.data[i].venue.name);
            logData("Location: " + response.data[i].venue.city + ' , ' + response.data[i].venue.region);
            logData("Date: " + moment(response.data[i].datetime).format("MMMM Do YYYY, hh:mm:ss a"));
            logData("============");
        }
    })
    .catch(function(error) {
        logData(error);
    });
};

//DefaultArtist
function defaultArtist() {
    // Call bandsintown API to process default artist
    axios.get("https://rest.bandsintown.com/artists/recondnb/events?app_id=codingbootcamp")
    .then(function(response) {
        //Loop through the response.data
        for ( var i = 0; i < 3; i++) {
            //Log data and use moment.js for datetime
            logData("Operation: node liri.js concert-this");
            logData("Venue Name: " + response.data[i].venue.name);
            logData("Location: " + response.data[i].venue.city + ' , ' + response.data[i].venue.region);
            logData("Date: " + moment(response.data[i].datetime).format("MMMM Do YYYY, hh:mm:ss a"));
            logData("============");
        }
    })
    .catch(function(error) {
        logData(error);
    });
};

//DoWhatItSays
function doWhatItSays() {
    fs.readFile('random.txt','utf8', (err, data) => {
        if (err) {
            logData(err);
        } else {
            //Make array for data in random.txt
            var randomTxtArray = data.split(",");
            //Make operation the first element
            operation = randomTxtArray[0];
            //Make argument the second element
            argument = randomTxtArray[1];
            //Call processOperation fuction to process the operation/argument from random.txt
            processOperation(operation, argument);
        }
    });
};

//Log data into terminal and text file
function logData(logText) {
    log.info(logText);
    console.log(logText);
};
