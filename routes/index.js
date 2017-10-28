var express = require('express');
var router = express.Router();
var config = require("../config/config");
var request = require("request");

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/search/movie?api_key='+config.apiKey +``
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';
function printCasts(cast){
	for(let i =0; i <cast.length; i++){
		console.log(cast[i].name);
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});
// router.get("/:movieID/casts", function(req,res,next){
// 	res.render("movieWithCast", {id: req.params.movieID})
// });
router.get("/results/:members", function(req,res,next){
	var namesArray =req.params.members;
	// console.log(namesArray);
	res.render("results", {cast: namesArray});
});

router.post("/movieData", function(req,res){
	var firstPromise = new Promise((resolve, reject)=>{
		var movieName = req.body.movie
		// console.log(movieName);
		const nowPlayingUrl = apiBaseUrl + '/search/movie?api_key='+config.apiKey +`&query=${movieName}`
		request.get(nowPlayingUrl, (error, response, movieData)=>{
			var parsedMovieData = JSON.parse(movieData)
			// console.log(parsedMovieData);
			var movieID = parsedMovieData.results[0].id;
			resolve(movieID);
		});
	});
	firstPromise.then((id)=>{
		var secondPromise = new Promise((resolve, reject)=>{
			const newUrl = apiBaseUrl + `/movie/${id}/casts?api_key=`+config.apiKey
			request.get(newUrl, (error, response, cast)=>{
				var parsedCastData = JSON.parse(cast);
				// console.log(parsedCastData);
				var castMembers = parsedCastData.cast
				resolve(castMembers);
			});
		});
		secondPromise.then((members)=>{
			var membersArray = []
			for(let i = 0; i<members.length; i++){
				membersArray.push(members[i].name);
			}
			res.redirect("/results/" + membersArray );
		});
	});
});

module.exports = router;
