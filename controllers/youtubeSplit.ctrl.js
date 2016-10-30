var YouTubeSplitRequest = require('./YouTubeSplitRequest.cls.js');
var archiver = require('archiver');
var CleanUp = require('../helpers/clean-up.js');

exports.splitRequest = (req,res)=>{

	let splitRequest = new YouTubeSplitRequest(req.body.url,req.body.tracks);
	splitRequest.fetchVideo()
	.then(()=>{
		return splitRequest.extractAudio();
	})
	.then(()=>{
		return splitRequest.splitAudio();
	}).then(()=>{
		res.send({jobId:splitRequest.trackSource});
	}).catch((err)=>{
		res.status(500).send({error:err});
	});

};

exports.getJobById = (req,res)=>{
	let tracksDotZip = archiver.create('zip');

	tracksDotZip.pipe(res);
	tracksDotZip.directory(`${__dirname}/../tmp/${req.params.jobId}`,'/');
	tracksDotZip.finalize();

	tracksDotZip.on('error',(error)=>{
		if(error.errno == -2){
			res.status(400).send({error:'JobId does not exist.'});
		} else{
			res.status(500).send({error:'Unknown error on the server.'});
		}	
	});

	tracksDotZip.on('end',()=>{
		CleanUp.purge(`${__dirname}/../tmp/${req.params.jobId}`);
	});
		

}
