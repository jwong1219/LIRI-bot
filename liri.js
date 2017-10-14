var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var Request = require('request');

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
      console.log("Artist(s): " + artists);
      console.log("Song: " + songName);
      console.log("Preview: " + previewURL);
      console.log("Album: " + album);
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
      console.log("Artist(s): " + artists);
      console.log("Song: " + songName);
      console.log("Preview: " + previewURL);
      console.log("Album: " + album);
    })
    .catch(function(err) {
      console.error('Error occurred: ' + err);
    });
  }
}

function tweets() {
  client.get('statuses/user_timeline.json?screen_name=realdonaldtrump&count=20&include_rts=false', function(error, tweets, response) {
    if(error) throw error;
    console.log("Who let this guy in here....");
    console.log("============");
    // console.log(tweets);
    for (each in tweets) {
      console.log("When: " + tweets[each].created_at);
      console.log("What: " + tweets[each].text);
      console.log("============");
    }
  });
}



var command = process.argv[2];
var input = process.argv.slice(3).join("+");
//commands: 
//my-tweets
//spotify-this-song
//movie-this
//do-what-it-says
console.log ({command, input});
tweets();