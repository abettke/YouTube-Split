var ffmpeg = require('ffmpeg');

exports.extractAudioFromVideo = function(fileDestination){
	return new Promise( (resolve,reject)=>{

		ffmpeg(fileDestination).then( (video)=>{

			video.fnExtractSoundToMP3('./tmp/'+Date.now().toString()+'.mp3').then( (audio,error)=>{
				console.log('audio extracted');
				resolve(audio);
			});

		});

	});
	
}