var YouTubeSplit = require('./controllers/youtubeSplit.ctrl.js');

module.exports = function(app){
	app.get('/',function(req,res){
		console.log('GET /');
		res.send('Index Page. Hello!');
	});

	app.post('/split',YouTubeSplit.split);

}