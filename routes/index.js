var express = require('express');
var router = express.Router();
var config = require("../config/config");
// var request = require("request");
var request = require("request-promise");
// var fetch =require("isomorphic-fetch");
// const apiBaseUrl = 'http://api.themoviedb.org/3';
// const movieDBURL = 'http://api.themoviedb.org/3/search/movie?api_key='+config.apiKey
// const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

// ==========Question2==========

router.get("/", function(req, res, next){
	res.render("index", {title: "Express"})
});
router.get("/results/:casts", function(req, res, next){
	var castArray = req.params.casts;
	res.render("results", {cast: castArray})
});
router.get("/results", function(req, res, next){
	res.redirect("/results/Hello World");
})
router.post("/movieData", (req, res, next)=>{
	var userInput = req.body.movieName;
	const movieDBURL = 'http://api.themoviedb.org/3/search/movie?api_key='+config.apiKey+`&query=${userInput}`
	request(movieDBURL)
	.then((res)=>{
		var parsedMovieData = JSON.parse(res);
		var castsCrewArray = []
		for(let i = 0; i <5; i++){
			var movieID = parsedMovieData.results[i].id;
			// console.log(movieID);
			const newUrl = `http://api.themoviedb.org/3/movie/${movieID}/casts?api_key=`+config.apiKey
			request(newUrl)
			.then((res)=>{
				var castsCrew = JSON.parse(res);
				// console.log(castsCrew.cast);
				for(let i =0; i<castsCrew.cast.length; i++){
					castsCrewArray.push(castsCrew.cast[i].name);
				}
				return castsCrewArray;
			})
			.then((res)=>{
				console.log(res);
				// for(let i =0; i<res.length; i++){
				// 	console.log(res[i].slice().sort());
				// }
				var newArray = require("uniq")(res);
				console.log(newArray);
			})

		}
	})

})


// ==========QUESTION 1==========
// router.get("/", function(req, res, next){
// 	res.render("index", {title: "Express"})
// });
// router.get("/results/:casts", function(req, res, next){
// 	var castArray = req.params.casts;
// 	res.render("results", {cast: castArray})
// });
// router.get("/results", function(req, res, next){
// 	res.redirect("/results/Hello World");
// })
// router.post("/movieData", (req, res, next)=>{
// 	var userInput = req.body.movieName;
// 	const movieDBURL = 'http://api.themoviedb.org/3/search/movie?api_key='+config.apiKey+`&query=${userInput}`
// 	request(movieDBURL)
// 	.then((res)=>{
// 		var parsedMovieData = JSON.parse(res);
// 		var movieID = parsedMovieData.results[0].id;
// 		const newUrl = `http://api.themoviedb.org/3/movie/${movieID}/casts?api_key=`+config.apiKey	
// 		return request(newUrl);
// 	})
// 	.then((res)=>{
// 		// console.log(res);
// 		var parsedMovieData = JSON.parse(res);
// 		return parsedMovieData;
// 	})
// 	.then((res)=>{
// 		var castArray = []
// 		for(let i =0; i<res.cast.length; i++){
// 			castArray.push(res.cast[i].name);
// 		}
// 		return castArray
// 	})
// 	.then((res2)=>{
// 		res.redirect("/results/" + res2);
// 	});
// })


// ====================	 Like call back=============
// router.post("/movieData", function(req, res, next){
// 	var movieIdPromise = new Promise((resolve, reject)=>{
// 		var userInput = req.body.movieName;
// 		const movieDBURL = 'http://api.themoviedb.org/3/search/movie?api_key='+config.apiKey+`&query=${userInput}`
// 		request.get(movieDBURL, (error, response, movieData)=>{
// 			var parsedMovieData = JSON.parse(movieData);
// 			// console.log(parsedMovieData);
// 			resolve(parsedMovieData.results[0].id);
// 		});
// 	}).then((movieID)=>{
// 		var movieCastPromise = new Promise((resolve, reject)=>{
// 			const newUrl = `http://api.themoviedb.org/3/movie/${movieID}/casts?api_key=`+config.apiKey;
// 			request.get(newUrl, (error, response, movieData)=>{
// 				var parsedMovieCast = JSON.parse(movieData);
// 				var castMember = parsedMovieCast.cast
// 				resolve(castMember);
// 			});
// 		}).then((casts)=>{
// 			console.log(casts);
// 			for(let i =0; i<casts.length; i++){
// 				console.log(casts[i].name);
// 			}
// 		});
// 	});
// });


//===========FIRST ATTEMP=========
// function printCasts(cast){
// 	for(let i =0; i <cast.length; i++){
// 		console.log(cast[i].name);
// 	}
// }

/* GET home page. */
// router.get('/', function(req, res, next) {
// 	res.render('index', { title: 'Express' });
// });

// router.get("/results/:members", function(req,res,next){
// 	var namesArray =req.params.members;
// 	// console.log(namesArray);
// 	res.render("results", {cast: namesArray});
// });

// router.post("/movieData", function(req,res){
// 	var firstPromise = new Promise((resolve, reject)=>{
// 		var movieName = req.body.movie
// 		// console.log(movieName);
// 		const nowPlayingUrl = apiBaseUrl + '/search/movie?api_key='+config.apiKey +`&query=${movieName}`
// 		request.get(nowPlayingUrl, (error, response, movieData)=>{
// 			var parsedMovieData = JSON.parse(movieData)
// 			// console.log(parsedMovieData);
// 			var movieID = parsedMovieData.results[0].id;
// 			resolve(movieID);
// 		});
// 	});
// 	firstPromise.then((id)=>{
// 		var secondPromise = new Promise((resolve, reject)=>{
// 			const newUrl = apiBaseUrl + `/movie/${id}/casts?api_key=`+config.apiKey
// 			request.get(newUrl, (error, response, cast)=>{
// 				var parsedCastData = JSON.parse(cast);
// 				// console.log(parsedCastData);
// 				var castMembers = parsedCastData.cast
// 				resolve(castMembers);
// 			});
// 		});
// 		secondPromise.then((members)=>{
// 			var membersArray = []
// 			for(let i = 0; i<members.length; i++){
// 				membersArray.push(members[i].name);
// 			}
// 			res.redirect("/results/" + membersArray );
// 		});
// 	});
// });

module.exports = router;
