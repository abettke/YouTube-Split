const YouTubeSplitRequest = require('./YouTubeSplitRequest.cls.js');
const CleanUp = require('../helpers/clean-up.js');
const fs = require('fs');

exports.splitRequest = (req,res)=>{

	let splitRequest = new YouTubeSplitRequest(req.body.url,req.body.tracks);
	res.send({jobId: splitRequest.jobId});

	
	splitRequest.fetchVideo()
	.then(()=>{
		return splitRequest.extractAudio();
	})
	.then(()=>{
		return splitRequest.splitAudio();
	})
	.then(()=>{
		return splitRequest.compressTracks();
	})
	.then(()=>{
		console.log('Job Finished');
		//TODO
		//Send email job is done
	}).catch((err)=>{
		console.log('We Got An Error');
		console.log(err);
		//TODO
		//Send email job encouterred error
	});

};

exports.getTracksByJobId = (req,res)=>{
	res.download(`./tmp/${req.params.jobId}.zip`, `${req.params.jobId}`, err => {
		if(err){
			res.status(err.status).json({error: `No tracks found by jobId ${req.params.jobId}`});
		} else {
			CleanUp.purge(`./tmp/${req.params.jobId}.zip`);
		}
	});
}
