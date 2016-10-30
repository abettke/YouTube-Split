var shellExec = require('child_process').exec;

exports.purge = function(source){
	shellExec(`rm -r ${source}`, (error,stdout,stderr)=>{
		if(error) console.log(error);
	});
}