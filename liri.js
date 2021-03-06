require("dotenv").config();

var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var QueryType = process.argv[2];
var QueryData = process.argv[3];

//BANDS IN TOWN
if (QueryType === "concert-this") {
    band();
}

//SPOTIFY
if (QueryType === "spotify-this-song") {
    song();

};
//OMDB
if (QueryType === "movie-this") {
    movie();
}

//RANDOM
if (QueryType === "do-what-it-says") {
random();}

///////////////
// FUNCTIONS //
///////////////


// RANDOM //
function random()
{
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            throw error;
        }
        // split the data from the file into two different items based on the comma
        var separate = data.split(",");
        RandomType = separate[0];
        QueryData = separate[1];
        process.argv[3]= 1;
        console.log(QueryData)
        if (RandomType === "spotify-this-song") {
            song();
        } else if (RandomType === "movie-this") {
            movie();
        } else if (RandomType === "concert-this") {
            band();
        }
    })
}

// BANDS IN TOWN //
function band() {
    if (process.argv[3] == undefined) {
        QueryData = "Metallica"
    }
    var queryUrl = "https://rest.bandsintown.com/artists/" + QueryData + "/events?app_id=codingbootcamp";
    console.log(queryUrl);

    axios.get(queryUrl)
        .then(function (response) {
            console.log(response.data[0].venue.name)
            // // * Name of the venue
            console.log(response.data[0].venue.city)
            // * Venue location
            console.log(moment((response.data[0].datetime)).format('L'))
            // * Date of the Event (use moment to format this as "MM/DD/YYYY")

        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

// SPOTIFY //
function song() {
    if (process.argv[3] == undefined) {
        QueryData = "The Sign Ace of Base"
    }
    var Spotify = require('node-spotify-api');
    var keys = require("./keys.js");
    var spotify = new Spotify(keys.spotify);


    spotify.search({ type: 'track', query: QueryData }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //ARTIST NAME
        console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name)
        //Song Name
        console.log("Song Name: " + QueryData)
        //Spotify link
        console.log("Spotify Link: " + data.tracks.items[0].album.external_urls.spotify)
        //Album Title
        console.log("Album Title: " + data.tracks.items[0].album.name)
        //   console.log(data.tracks.items[0].album[0])
        // console.log("This is the NODE SPOTIFY REPLY: " + data);
    });
}

// OMDB //
function movie() {
    if (process.argv[3] == undefined) {
        QueryData = "Mr. Nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + QueryData + "&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl);

    axios.get(queryUrl)
        .then(function (response) {
            // console.log(response.data);
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log(response.data.Ratings[1].Source + " = " + response.data.Ratings[1].Value);
            console.log("Produced in: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}