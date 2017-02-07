var YouTubeSplit = require('../controllers/youtubeSplit.ctrl.js');

module.exports = function(app){

	app.get('/tracks/:jobId', YouTubeSplit.getTracksByJobId);
	app.post('/split', YouTubeSplit.splitRequest);

	//All other routes point to index
	app.get('*',function(req,res){
		res.send('./public/index.html');
	});

}