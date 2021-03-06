var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify({
  id: '73c933ecf3aa4b08829e1a2fcde0e87e',
  secret: '40cdd896d3a747c48a0fe61ce9403235'
});

var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

function spotSearch(song) {
  logCommand(); 
  var output = "";
  if(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      // console.log(data); 
      var listTracks = data.tracks.items[0];
      // console.log(listTracks);
      var album = listTracks.album.name;
      var artists = "";
      for (each in listTracks.artists) { //this is an array that can have multiple artists for that track
        if(!artists) {
          artists += listTracks.artists[each].name;
        }
        else {
          artists += "& ";
          artists += listTracks.artists[each].name;
        }
      }
      var songName = listTracks.name;
      var previewURL = listTracks.preview_url;
      output += ("Artist(s): " + artists + "\n");
      output += ("Song: " + songName + "\n");
      output += ("Preview: " + previewURL + "\n");
      output += ("Album: " + album + "\n");
      console.log(output);
      logOutput(output);
    });
  }
  else {
    spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
    .then(function(data) {
      
      var album = data.album.name;
      var artists = "";
      for (each in data.artists) { //this is an array that can have multiple artists for that track
        if(!artists) {
          artists += data.artists[each].name;
        }
        else {
          artists += "& ";
          artists += data.artists[each].name;
        }
      }
      var songName = data.name;
      var previewURL = data.preview_url;
      output += ("Artist(s): " + artists + "\n");
      output += ("Song: " + songName + "\n");
      output += ("Preview: " + previewURL + "\n");
      output += ("Album: " + album + "\n");
      console.log(output);
      logOutput(output);
    })
    .catch(function(err) {
      console.error('Error occurred: ' + err);
    });
  }
}

function tweets() {
  logCommand();
  var params = {
    screen_name: "realdonaldtrump",
    count: 20,
    include_rts: "false"
  }
  // client.get('statuses/user_timeline.json?screen_name=realdonaldtrump&count=20&include_rts=false', function(error, tweets, response) {
  client.get('statuses/user_timeline.json', params, function(error, tweets, response) {
    if(error) throw error;
    var output = "";
    output += ("Who let this guy in here....\n");
    output += ("############\n");
    // console.log(tweets);
    for (each in tweets) {
      output += ("When: " + tweets[each].created_at + "\n");
      output += ("What: " + tweets[each].text + "\n");
      output += ("============\n");
    }
    console.log(output);
    logOutput(output);
  });
}

function movieThis(movie) {
  logCommand();
  var movieToSearch;
  if(movie) movieToSearch = "t=" + movie;
  else movieToSearch = "i=tt0485947"
  request('http://www.omdbapi.com/?apikey=40e9cece&' + movieToSearch, function(error, response, body) {
    if(error) {
      console.log("error: " + error);
    }
    var output = "";
    var result = JSON.parse(body);
    output += ("Title: " + result.Title + "\n");
    output += ("Released: " + result.Released + "\n");
    for (each in result.Ratings) {
      var string = result.Ratings[each].Source;
      string += ": " + result.Ratings[each].Value;
      output += (string + "\n");
    }
    output += ("Country: " + result.Country + "\n");
    output += ("Language: " + result.Language + "\n");
    output += ("Plot: " + result.Plot + "\n");
    output += ("Actors: " + result.Actors + "\n");
    console.log(output);
    logOutput(output);
  });
}

function doIt() {
  logCommand();
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if(error) {
      return console.log("Error: " + error);
    }
    var dataArr = data.split(",");
    command = dataArr[0];
    input = dataArr[1];
    // spotSearch(input);
    console.log({command, input});
    runLIRI();
  });
}

function logCommand() {
  fs.appendFile("log.txt", "========" + "\n" + command + " " + input + "\n" + "********" + "\n", function(err) {
    if(err) {
      throw err;
      console.log("The data was not appended to file!");
    }
  });
}

function logOutput(string) {
  fs.appendFile("log.txt", string + "========" + "\n", function(err) {
    if(err) {
      throw err;
      console.log("The data was not appended to file!");
    }
  });
}

var command = process.argv[2];
var input = process.argv.slice(3).join("+");
// console.log({command, input});

runLIRI();

function runLIRI() {
  switch(command) {
    case "my-tweets":
      tweets();
      break;
    case "spotify-this-song" :
      spotSearch(input);
      break;
    case "movie-this" :
      movieThis(input);
      break;
    case "do-what-it-says":
      doIt();
      break;
    default:
      console.log("Sorry, I don't recognize that command. Please run again with a valid command.");
  }
}
