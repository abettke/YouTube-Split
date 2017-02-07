const ffmpeg = require('ffmpeg');
const uuidV4 = require('uuid/v4');

exports.extractAudioFromVideo = function(fileDestination){
	return new Promise( (resolve,reject)=>{

		ffmpeg(fileDestination).then( (video)=>{

			video.fnExtractSoundToMP3(`./tmp/${uuidV4()}.mp3`).then( (audio,error)=>{
				resolve(audio);
			});

		});

	});
	
}