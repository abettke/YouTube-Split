const uuidV4 = require('uuid/v4');
const YouTube_Adapter = require('./adapters/youtube-dl.js');
const ffmpeg_Adapter = require('./adapters/ffmpeg.js');
const archiver = require('archiver');
const fs = require('fs');
const child = require('child_process');
const CleanUp = require('../helpers/clean-up.js');

class YouTubeSplitRequest{

	constructor(url,tracks){
		this.jobId = uuidV4();
		this.url = url;
		this.tracks = tracks;
		this.unsplittable = false;
		this.videoSource = '';
		this.audioSource = '';
		this.trackSource = uuidV4();
	}

	fetchVideo(){
		return new Promise((resolve,reject)=>{

			YouTube_Adapter.getYouTubeVideo(this.url).then((videoUUID)=>{
				this.videoSource = videoUUID;
				resolve();
			},(error)=>{
				reject(error);
			});

		});
	}

	extractAudio(){
		return new Promise((resolve,reject)=>{

			ffmpeg_Adapter.extractAudioFromVideo(this.videoSource).then((audioUUID)=>{
				this.audioSource = audioUUID;
				CleanUp.purge(this.videoSource);
				resolve();
			},(error)=>{
				reject(error);
			});

		});
	}

	splitAudio(){
		let tracks = this.tracks;
		let audioSource = this.audioSource;
		let trackSource = this.trackSource;

		return new Promise((resolve,reject) => {
			fs.mkdir(`./tmp/${trackSource}`,()=>{
				let i = 0;

				let split = function(track){
					let createTrack = `ffmpeg -i ${audioSource} -acodec copy -ss ${track.startTime} -t ${track.length} ./tmp/${trackSource}/${track.trackName}.mp3`;
					let childProcess = child.exec(createTrack, (error) => {
						if(!error){
							i++;
							if(i >= tracks.length){
								CleanUp.purge(audioSource);
								resolve();
							} else {
								split(tracks[i]);
							}
						} else{
							CleanUp.purge(audioSource);
							reject(error);
						}
					});
				}

				split(tracks[i]);
			});
		});	
	}

	compressTracks(){
		let tracksDotZip = archiver.create('zip');

		return new Promise((resolve,reject) => {
			tracksDotZip.pipe(fs.createWriteStream(`./tmp/${this.jobId}.zip`));
			tracksDotZip.directory(`./tmp/${this.trackSource}`,'/');
			tracksDotZip.finalize();

			tracksDotZip.on('error',(error)=>{
				reject(error);	
			});

			tracksDotZip.on('end',()=>{
				CleanUp.purge(`./tmp/${this.trackSource}`);
				resolve();
			});
		});
	}
}

module.exports = YouTubeSplitRequest;