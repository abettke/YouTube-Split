var YouTube_Adapter = require('./adapters/youtube-dl.js');
var ffmpeg_Adapter = require('./adapters/ffmpeg.js');
var shellExec = require('child_process').exec;
var CleanUp = require('../helpers/clean-up.js');

function YouTubeSplitRequest(url,tracks){
	this.url = url;
	this.tracks = tracks;
	this.unsplittable = false;
	this.videoSource = '';
	this.audioSource = '';
	this.trackSource = '';
}

YouTubeSplitRequest.prototype.fetchVideo = function(){

	return new Promise((resolve,reject)=>{

		YouTube_Adapter.getYouTubeVideo(this.url).then((video)=>{
			this.videoSource = video;
			resolve();
		},(error)=>{
			reject(error);
		});

	});

}

YouTubeSplitRequest.prototype.extractAudio = function(){

	return new Promise((resolve,reject)=>{

		ffmpeg_Adapter.extractAudioFromVideo(this.videoSource).then((audio)=>{
			this.audioSource = audio;
			CleanUp.purge(this.videoSource);
			resolve();
		},(error)=>{
			reject(error);
		});

	});

}

YouTubeSplitRequest.prototype.splitAudio = function(res){

	this.trackSource = Date.now().toString();

	let tracks = this.tracks;
	let audioSource = this.audioSource;
	let trackSource = this.trackSource;

	
	shellExec(`mkdir ./tmp/${trackSource}`, (error,stdout,stderr)=>{});
	return new Promise((resolve,reject)=>{

		for(var i = 0; i < tracks.length; i++){
			let createTrack = `ffmpeg -i ${audioSource} -acodec copy -ss ${tracks[i].startTime} -t ${tracks[i].length} ./tmp/${trackSource}/${tracks[i].trackName}.mp3`;
			shellExec(createTrack, (error,stdout,stderr)=>{
				if(!error){
					if(i >= tracks.length){
						CleanUp.purge(this.audioSource);
						resolve();
					}
					console.log(stdout);
					console.log(stderr);
				} else{
					console.log(error);
				}
			});
		}

	});
	
}

module.exports = YouTubeSplitRequest;