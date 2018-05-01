// Reads and sets any environment variables with dotenv pkg.
require("dotenv").config();


// NPMs
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// fs for reading/writing files
var fs = require("fs");

// Grabs api keys
var keys = require("./keys.js");
var request = require("request");
var inquirer = require('inquirer');
var moment = require('moment');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter)// ===== INQUIER QUERY ===== //

var typeExecution = process.argv[2];
var tweets = 'my-tweets';
var song = 'spotify-this-song';
var movie = 'movie-this'

//===============Song and Movie Variables=============//

var movieTitle = '';
var songTitle = '';

//===============Handler for Terminal Input=============//

switch (typeExecution) {
	case tweets:
		myTweets();
		break;
	case song:
		spotifySong();
		break;
	case movie:
		getMovie();
		break;
	default:
		initInquirer();
}

//===============Functions=============//

function log(item) {
	console.log(item);
}

function newLine(){
	fs.appendFile('log.txt', '\n', 'utf8', function(err){
		if (err) {
			console.log(err);
		}
	});
}

function appendType(type) {
	fs.appendFile('log.txt', type, 'utf8', function(err) {
		if (err) {
			console.log(err);
		}
	});
	newLine();
}

function newContent(content) {
	fs.appendFile('log.txt', content, 'utf8', function(err) {
		if (err) {
			console.log(err);
		}
	});
	newLine();
}

function myTweets() {
	var tweetType = "========== Tweet Search ==========";
	appendType(tweetType);
	newLine();

	client.get('statuses/user_timeline', {screen_name: 'codeyourway'}, function(error, tweets, response){
		if (error){
			log(error.message)
		}

		var len = tweets.length;

		if (len > 19){
			for (var i = 0; i < 20; i++){
				var name = tweets[0].user.name;
				var tweetDate = moment(tweets[i].created_at).format('MMM Do YYYY');
				var tweetTime = moment(tweets[i].created_at).format('h:mm a');
				var tweet = tweets[i].text;
				var output = "At " + tweetTime + ' on ' + tweetDate + ' ' + name + ' tweeted: ' + tweet;
				log(output);
				newContent(output)
			}	
		} else {
			for ( var i = 0; i < len; i++){
				var name = tweets[0].user.name;
				var tweetDate = moment(tweets[i].created_at).format('MMM Do YYYY');
				var tweetTime = moment(tweets[i].created_at).format('h:mm a');
				var tweet = tweets[i].text;
				var output = "At " + tweetTime + ' on ' + tweetDate + ' ' + name + ' tweeted: ' + tweet;
				log(output);
				newContent(output)
			}
		}
		newLine();
	});
}

function spotifySong() {
	var trackInfo = "========== Spotify Track Searched ==========";
	appendType(trackInfo);
	// Refer to console input to extract the song title and store it into
	// songTitle variable.
	var len = process.argv.length

	if (len > 3) {
		for (var i = 3; i < len; i++){
			if (i === 3) {
				songTitle = process.argv[i];

			} else if (i < len) {
				songTitle = songTitle + ' ' + process.argv[i];

			} 
		}
	} else if (songTitle === '') {
		log('Please add a song title.');
	}
	
	spotify.search({ type: 'track', query: songTitle })
		.then(function(response) {

			var artist = 'Artist: ' + response.tracks.items[0].album.artists[0].name;
			var preview = 'Preview URL: ' + response.tracks.items[0].preview_url
			var songName = 'Song Name: ' + response.tracks.items[0].name;
			var album = 'Album Name: ' + response.tracks.items[0].album.name;
	
			log('\n');
			log(artist);
			log(preview);
			log(songName);
			log(album);
			log('\n');
			
			newLine();
			newContent(artist);
			newContent(preview);
			newContent(songName);
			newContent(album);
			newLine();
		})
		.catch(function(err) {
			log(err);
		});
}

function getMovie() {
	var movieInfo = "========== Movie Searched ==========";
	appendType(movieInfo);
	// Refer to console input to extract the song title and store it into
	// movieTitle variable.
	var len = process.argv.length
	// Make sure a movie is added
	if (len > 3) {
		for (var i = 3; i < len; i++){
			if (i < len && movieTitle !== ''){
				movieTitle = movieTitle; + '+' + process.argv[i].toLowerCase();
			} else {
				movieTitle = process.argv[i].toLowerCase();
			}
		}
	} else if (movieTitle === '') {
		log('Please add a movie title.');
	}	
	// Log to make sure functioning.
	// log(movieTitle);

	var queryURL = 'http://www.omdbapi.com/?apikey=395b87e4&t='	+ movieTitle;
	request(queryURL, function(error, response, body){

		movieObj = JSON.parse(body);
		// * Title of the movie.
		// * Year the movie came out.
		// * IMDB Rating of the movie.
		// * Rotten Tomatoes Rating of the movie.
		// * Country where the movie was produced.
		// * Language of the movie.
		// * Plot of the movie.
		// * Actors in the movie.
		log('\n');
		log("* Title: " + movieObj.Title);
		log("* Year Released: " + movieObj.Year);
		log("* IMDB rating: " + movieObj.Ratings[0].Value);
		log("* Rotten Tomatoes rating: " + movieObj.Ratings[1].Value);
		log("* Country: " + movieObj.Country);
		log("* Language: " + movieObj.Language);
		log("\n* Plot: " + movieObj.Plot + "\n");
		log("* Actors: " + movieObj.Actors);
		log('\n');

		newContent("* Title: " + movieObj.Title);
		newContent("* Year Released: " + movieObj.Year);
		newContent("* IMDB rating: " + movieObj.Ratings[0].Value);
		newContent("* Rotten Tomatoes rating: " + movieObj.Ratings[1].Value);
		newContent("* Country: " + movieObj.Country);
		newContent("* Language: " + movieObj.Language);
		newContent("\n* Plot: " + movieObj.Plot + "\n");
		newContent("* Actors: " + movieObj.Actors);
		newLine();		
	})

}

function initInquirer() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Please select what you want to do?',
			choices: ['my-tweets', 'spotify-this-song', 'movie-this'],
			name: 'selection'
		}
		]).then(function(response){

			switch (response.selection) {
				case tweets:
					myTweets();
					break;
				case song:
					inquireSong();
					break;
				case movie:
					inquireMovie();
				break;

			}
		})
}

function inquireSong() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Tell me the song you want:',
			name: 'songTitle'
		}
		]).then(function(response){
			songTitle = response.songTitle;
			spotifySong();
		})
}

function inquireMovie() {
	inquirer.prompt([
		{

			type: 'input',
			message: 'Tell me the movie you want:',
			name: 'movieTitle'
		}
		]).then(function(response){
			titleList = response.movieTitle.split(' ');
			var len = titleList.length;
			for (var i = 0; i < len; i++){
				if (i === 0){
					movieTitle += titleList[i].toLowerCase();
				} else {
					movieTitle = movieTitle + '+' + titleList[i].toLowerCase();	
				}
			}
			getMovie();
	});
}