var fs = require('fs');
var YouTube_Adapter = require('./adapters/youtube-dl.js');

exports.split = function(req,res){
	YouTube_Adapter.getYouTubeVideo(req.body.url)
	.then((done)=>{
		res.send(done);
	},(error)=>{
		res.send(error);
	});
};