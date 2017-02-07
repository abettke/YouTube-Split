const fs = require('fs');
const youtubedl = require('youtube-dl');
const YouTubeSplit = require('../youtubeSplit.ctrl.js');
const uuidV4 = require('uuid/v4');

exports.getYouTubeVideo = function(url){
	return new Promise( (resolve,reject)=>{
		let videoSource = '';
		let readableVideo = youtubedl(url,
			 ['--format=18'],
			 {maxBuffer: 1000*1024}
		);

		readableVideo.on('info', (info)=>{
			console.log('YouTube-DL Started');
			video = `./tmp/${uuidV4()}.mp4`;
			readableVideo.pipe(fs.createWriteStream(video));
		});

		readableVideo.on('error', (error)=>{
			reject(error);
		});

		readableVideo.on('end', ()=>{
			console.log('YouTube-DL Complete');
			resolve(video);
		});
	});
	
};
