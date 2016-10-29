let fs = require('fs');
let youtubedl = require('youtube-dl');

exports.getYouTubeVideo = function(url){
	return new Promise( (resolve,reject)=>{
		let video = '';
		let readableVideo = youtubedl(url,
			 ['--format=18'],
			 {maxBuffer: 1000*1024}
		);

		readableVideo.on('info', (info)=>{
			//readableVideo.pipe(fs.createWriteStream(info.title+'.mp4'));
			resolve({status:'YouTube-DL Started'});
			console.log('YouTube-DL Started');
		});

		readableVideo.on('error', (error)=>{
			reject(error);
		});

		readableVideo.on('data', (data)=>{
			video += data;
		});

		readableVideo.on('end', ()=>{
			console.log('YouTube-DL Finished.');
		});
	});
	
};
