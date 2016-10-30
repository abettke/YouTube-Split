var fs = require('fs');
var youtubedl = require('youtube-dl');
var YouTubeSplit = require('../youtubeSplit.ctrl.js');

exports.getYouTubeVideo = function(url){
	return new Promise( (resolve,reject)=>{
		let videoSource = '';
		let readableVideo = youtubedl(url,
			 ['--format=18'],
			 {maxBuffer: 1000*1024}
		);

		readableVideo.on('info', (info)=>{
			console.log('YouTube-DL Started');
			video = './tmp/'+Date.now().toString()+'.mp4';
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
